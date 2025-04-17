"use client";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const Paypal = () => {
  const [amount, setAmount] = useState<number>(0); // Ensure state is a number

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value); // Convert string to number
    setAmount(isNaN(value) ? 0 : value); // Ensure it's a valid number
  };

  const initialOptions = {
    clientId:
      "Abp5m8xHsfg3bDAzJn2AbmNQfXBGwSjvvU5VjMW8hVHlyP7z2rLOdfhOA8wt-XD5E-qsoofC3fiD6ze5", // Replace with your actual client ID
    currency: "USD"
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-[100px]">
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 w-full mb-4"
      />

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={async () => {
            const res = await axios.post(
              "http://localhost:4552/paypal/create",
              {
                amount
              }
            );
            return res.data.orderId;
          }}
          onApprove={async (data) => {
            const res = await axios.post(
              "http://localhost:4552/paypal/capture",
              {
                orderId: data.orderID
              }
            );

            if (res.data.status === "COMPLETED") {
              window.location.href = "/paypal/success";
            } else {
              // This handles other cases like "PENDING"
              window.location.href = `/paypal/failed?orderId=${data.orderID}&error=payment_pending`;
            }
          }}
          onCancel={(data) => {
            // Handle user-initiated cancellation
            console.warn("Payment cancelled:", data);
            window.location.href = `/paypal/failed?orderId=${data.orderID}&error=payment_cancelled`;
          }}
          // onError={(err) => {
          //   console.error("Payment error:", err);
          //   window.location.href = `/paypal/failed?error=payment_error`;
          // }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
