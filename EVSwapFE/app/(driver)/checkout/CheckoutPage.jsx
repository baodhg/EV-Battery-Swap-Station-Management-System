import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage({ user, selectedStation, selectedPackage, startAt, durationHours }) {
  const navigate = useNavigate();

  const handlePay = () => {
    if (!selectedStation || !selectedPackage) return;

    navigate("/payment", {
      state: {
        appointmentData: {
          userId: user?.id,                   // lấy từ auth
          stationId: selectedStation.id,
          stationName: selectedStation.name,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          price: selectedPackage.price,       // số nguyên VND
          startAt: startAt || new Date().toISOString(),
          durationHours: durationHours || 2,
          // có thể thêm anonymous hoặc ghi chú nếu cần
        },
      },
    });
  };

  return (
    <button onClick={handlePay} className="px-4 py-2 rounded bg-red-600 text-white">
      Thanh toán MoMo
    </button>
  );
}
