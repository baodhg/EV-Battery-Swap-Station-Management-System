"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handlePay = () => {
    const params = new URLSearchParams({
      station: "EV Station Thủ Đức",
      package: "Gói 2h",
      price: "150000",
    });
    router.push(`/PaymentPage?${params.toString()}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Trang chọn gói thuê pin</h1>
      <button
        onClick={handlePay}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Thanh toán VNPAY_QR
      </button>
    </div>
  );
}
