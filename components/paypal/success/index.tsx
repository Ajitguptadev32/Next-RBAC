"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // You can send analytics here
    console.log("Payment successful for order:", orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order #{orderId} has been processed
          successfully.
        </p>
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            View Your Orders
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
