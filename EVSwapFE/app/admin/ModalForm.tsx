"use client";
import { Modal, Input, Select } from "antd";
import React, { useState } from "react";

type FieldType = "text" | "number" | "select";

interface FieldDef<T> {
  name: keyof T;
  label: string;
  type?: FieldType;
  options?: Array<string | number>; // cho select
}

interface ModalFormProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: Partial<T>) => void;
  initialData?: Partial<T>;
  fields: FieldDef<T>[];
}

export function ModalForm<T>({
  visible,
  onCancel,
  onSave,
  initialData = {},
  fields,
}: ModalFormProps<T>) {
  const [form, setForm] = useState<Partial<T>>({ ...initialData });

  const handleChange = (name: keyof T, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value } as Partial<T>));
  };

  // Chuẩn hóa value cho Input (string | number | undefined)
  const getInputValue = (name: keyof T): string | number | undefined => {
    const v = (form as Record<string, unknown>)[name as string];
    if (typeof v === "number" || typeof v === "string") return v;
    return v == null ? undefined : String(v);
  };

  // Chuẩn hóa value cho Select (string | number | undefined)
  const getSelectValue = (name: keyof T): string | number | undefined => {
    const v = (form as Record<string, unknown>)[name as string];
    return typeof v === "string" || typeof v === "number" ? v : undefined;
  };

  const handleOk = () => onSave(form);

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Huỷ"
    >
      {fields.map((f) => {
        const isNumber = f.type === "number";
        const isSelect = f.type === "select" && f.options;

        return (
          <div key={String(f.name)} className="mb-3">
            <label className="block mb-1">{f.label}</label>

            {isSelect ? (
              <Select
                style={{ width: "100%" }}
                value={getSelectValue(f.name)}
                onChange={(v) => handleChange(f.name, v as string | number)}
                options={(f.options || []).map((opt) => ({
                  label: String(opt),
                  value: opt,
                }))}
              />
            ) : (
              <Input
                type={isNumber ? "number" : "text"}
                value={getInputValue(f.name)}
                onChange={(e) =>
                  handleChange(
                    f.name,
                    isNumber
                      ? e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                      : e.target.value
                  )
                }
              />
            )}
          </div>
        );
      })}
    </Modal>
  );
}
