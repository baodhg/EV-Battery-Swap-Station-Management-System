"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";

type PendingBooking = {
  orderId: string;
  stationId: number;
  stationName: string;
  packageId: number;
  packageName: string;
  price: number;
  startAt: string;
  durationHours: number;
};

export default function PaymentResultPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [message, setMessage] = useState("Đang xác nhận giao dịch…");

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

    const run = async () => {
      try {
        // ✅ 1) Lấy dữ liệu từ query MOMO callback
        const momoResultCode = sp.get("resultCode");
        const momoOrderId = sp.get("orderId") || "";
        const momoTransId = sp.get("transId") || "";

        if (!momoOrderId) {
          setStatus("fail");
          setMessage("Thiếu tham số từ MOMO.");
          return;
        }

        if (momoResultCode !== "0") {
          setStatus("fail");
          setMessage("Thanh toán thất bại hoặc bị hủy.");
          localStorage.removeItem("pendingBooking");
          return;
        }

        // ✅ 2) Xác nhận với backend
        const confirmRes = await fetch(`${API_BASE}/api/bookings/momo-qr/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: Object.fromEntries(Array.from(sp.entries())),
          }),
        });

        const confirmData = await confirmRes.json().catch(() => ({}));
        if (!confirmRes.ok || !confirmData?.confirmed) {
          throw new Error(confirmData?.error || "Xác nhận thanh toán MOMO thất bại.");
        }

        // ✅ 3) Lấy draft booking lưu trước khi redirect sang MOMO
        const draftStr = localStorage.getItem("pendingBooking");
        const draft: PendingBooking | null = draftStr ? JSON.parse(draftStr) : null;

        // ✅ 4) Nếu backend đã tạo booking → dùng luôn
        if (confirmData?.booking?.id || confirmData?.bookingId) {
          const booking =
            confirmData.booking ??
            {
              id: confirmData.bookingId,
              orderId: draft?.orderId ?? momoOrderId,
              stationId: draft?.stationId,
              packageId: draft?.packageId,
              startAt: draft?.startAt,
              durationHours: draft?.durationHours,
              amount: draft?.price,
              paymentProvider: "MOMO",
              gatewayTransactionNo: momoTransId,
            };

          localStorage.setItem("booking", JSON.stringify(booking));
          localStorage.removeItem("pendingBooking");
          setStatus("success");
          setMessage("Thanh toán MOMO thành công! Đã tạo booking.");
          setTimeout(() => {
            router.push(`/booking/swap?bookingId=${booking.id}`);
          }, 800);
          return;
        }

        // ✅ 5) Nếu backend chưa tạo booking → FE gửi POST tạo booking
        if (draft) {
          const token = localStorage.getItem("token") || "";
          const bookingRes = await fetch(`${API_BASE}/api/bookings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              orderId: draft.orderId,
              stationId: draft.stationId,
              packageId: draft.packageId,
              startAt: draft.startAt,
              durationHours: draft.durationHours,
              amount: draft.price,
              paymentProvider: "MOMO",
              gatewayTransactionNo: momoTransId,
            }),
          });

          const bookingData = await bookingRes.json().catch(() => ({}));
          if (!bookingRes.ok || !bookingData?.id) {
            throw new Error(bookingData?.error || "Tạo booking thất bại.");
          }

          localStorage.setItem("booking", JSON.stringify(bookingData));
          localStorage.removeItem("pendingBooking");
          setStatus("success");
          setMessage("Thanh toán MOMO thành công! Đã tạo booking.");
          setTimeout(() => {
            router.push(`/booking/swap?bookingId=${bookingData.id}`);
          }, 800);
        } else {
          setStatus("success");
          setMessage("Thanh toán MOMO thành công.");
        }
      } catch (e: any) {
        setStatus("fail");
        setMessage(e?.message || "Có lỗi trong quá trình xử lý.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <h2 className="text-lg font-semibold">Đang xác nhận giao dịch…</h2>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-lg font-semibold text-green-700">{message}</h2>
          </>
        )}
        {status === "fail" && (
          <>
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-lg font-semibold text-red-700">{message}</h2>
          </>
        )}
      </div>
    </div>
  );
}
