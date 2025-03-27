"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  loadRazorpayScript,
  RazorpayOptions,
  RazorpayResponse
} from "../common/lib/razorpay";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const Payment: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Razorpay Key ID is missing!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/payment/create-order`,
        { amount }
      );

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount.toString(),
        currency: data.currency,
        name: "Your Company",
        description: "Test Payment",
        order_id: data.orderId,
        handler: async (response: RazorpayResponse) => {
          const verifyResponse = await axios.post(
            `${API_BASE_URL}/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          );

          if (verifyResponse.data.success) {
            alert("Payment successful!");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
    try {
      const testData = {
        testData: {
          orderId: `order_${Date.now()}`, // Generate a random order ID
          amount,
          currency: "INR"
        },
        timestamp: new Date().toISOString()
      };

      // Send test data to the backend
      const { data: testResponse } = await axios.post(
        `${API_BASE_URL}/payment/test-response`,
        testData
      );

      setApiResponse(testResponse);
      alert("Test API response saved to database! Check console.");
    } catch (error) {
      console.error("Test API Error:", error);
      setApiResponse("Error occurred");
      alert("API call failed! Check console.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-xl w-80 mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Make a Payment
      </h2>
      <input
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
        placeholder="Enter amount"
        disabled={loading}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 disabled:bg-gray-100"
      />
      <button
        onClick={handlePayment}
        disabled={loading || amount <= 0}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-300 mb-2 ${
          loading || amount <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      <button
        onClick={testApi}
        disabled={amount <= 0}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-300 ${
          amount <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Test API
      </button>
      {apiResponse && (
        <pre className="mt-4 text-sm text-gray-700">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Payment;
