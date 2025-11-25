    import React, { useEffect, useState } from "react";
    import { useSearchParams, useNavigate } from "react-router-dom";
    import { CheckCircle, XCircle, Loader } from "lucide-react";

    export default function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const resultCode = searchParams.get("resultCode");
        const orderId = searchParams.get("orderId");
        const message = searchParams.get("message");
        const appointmentId = localStorage.getItem("appointmentId");
        if (!orderId || !resultCode) {
        setIsSuccess(false);
        setMessage("Không nhận được thông tin từ MoMo.");
        return;
        }

        if (resultCode === "0") {
        setIsSuccess(true);
        setMessage("Thanh toán thành công! Đang xác nhận lịch hẹn...");
        if (appointmentId) {
            const token = localStorage.getItem("token") || "";
            console.log("appointmentId:", appointmentId, "token:", token);
            fetch(
            `http://localhost:8080/api/appointments/confirm-payment/${appointmentId}`,
            {
                method: "PUT",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            )
            .then(async (res) => {
                const data = await res.json();
                console.log("Confirm-payment response:", res.status, data);
                if (!res.ok) {
                if (data && data.message) {
                    setMessage(
                    `Thanh toán thành công, nhưng xác nhận thất bại: ${data.message}`
                    );
                } else {
                    setMessage("Thanh toán thành công, nhưng xác nhận thất bại.");
                }
                return;
                }
                setMessage("Thanh toán & xác nhận lịch hẹn thành công!");
            })
            .catch((err) => {
                console.error("Lỗi xác nhận:", err);
                setMessage(
                "Thanh toán thành công, nhưng xác nhận thất bại (lỗi hệ thống)."
                );
            });
        }
        } else {
        setIsSuccess(false);
        setMessage(`Thanh toán thất bại: ${message || "Vui lòng thử lại."}`);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border-t-4">
            <div className="flex justify-center mb-6">
            {isSuccess === null ? (
                <Loader className="w-12 h-12 text-gray-500 animate-spin" />
            ) : isSuccess ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
                <XCircle className="w-12 h-12 text-red-600" />
            )}
            </div>

            <h1 className="text-xl font-bold text-center mb-4">
            {isSuccess === null
                ? "Đang xác minh kết quả..."
                : isSuccess
                ? "Thanh toán thành công"
                : "Thanh toán thất bại"}
            </h1>
            <p className="text-center text-gray-600 mb-6">{message}</p>

            <div className="text-center">
            <button
                onClick={() => navigate("/")}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
                Quay về trang chủ
            </button>
            </div>
        </div>
        </div>
    );
    }
