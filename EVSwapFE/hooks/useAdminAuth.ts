"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";

export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u || u.role !== "Admin") {
      message.error("Bạn không có quyền truy cập trang này.");
      router.push("/signin");
    } else {
      setUser(u);
    }
    setLoading(false);
  }, [router]);

  const token = user?.token || localStorage.getItem("token") || "";
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return { user, loading, headers };
}
