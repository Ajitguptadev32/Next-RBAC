"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  useEffect(() => {
    // You can send analytics here
    console.log("Payment failed for order:", orderId, "Error:", error);
  }, [orderId, error]);

  const getErrorMessage = () => {
    switch (error) {
      case "payment_cancelled":
        return "You cancelled the payment process.";
      case "payment_error":
        return "An error occurred during payment processing.";
      default:
        return "Your payment could not be processed.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">{getErrorMessage()}</p>
        {orderId && (
          <p className="text-gray-500 text-sm mb-6">
            Order reference: #{orderId}
          </p>
        )}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
