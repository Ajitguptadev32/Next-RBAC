"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  loadRazorpayScript,
  RazorpayOptions,
  RazorpayResponse
} from "../common/lib/razorpay";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Define the structure of a plan
interface Plan {
  name: string;
  amount: number; // Amount in INR
  interval: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  totalCycles: number;
  discount?: string; // e.g., "50% OFF"
  trial?: boolean; // For trial plans
}

const Payment: React.FC = () => {
  // State for plans (fetched dynamically or predefined)
  const [plans, setPlans] = useState<Plan[]>([
    {
      name: "Netflix Trial",
      amount: 50,
      interval: 2,
      period: "daily",
      totalCycles: 1,
      trial: true
    },
    {
      name: "Netflix Annual",
      amount: 100,
      interval: 1,
      period: "monthly",
      totalCycles: 12,
      discount: "50% OFF"
    },
    {
      name: "Netflix Quarterly",
      amount: 150,
      interval: 1,
      period: "monthly",
      totalCycles: 3,
      discount: "40% OFF"
    },
    {
      name: "Netflix Monthly",
      amount: 200,
      interval: 1,
      period: "monthly",
      totalCycles: 1,
      discount: "30% OFF"
    }
  ]);

  // State for the cart (stores the selected plan)
  const [cart, setCart] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Optionally fetch plans dynamically from an API
  useEffect(() => {
    // Example: Fetch plans from an API (uncomment to use)
    /*
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
    */
  }, []);

  // Add a plan to the cart
  const addToCart = (plan: Plan) => {
    setCart(plan);
  };

  // Clear the cart
  const clearCart = () => {
    setCart(null);
  };

  const handleSubscriptionPayment = async () => {
    if (!cart) {
      alert("Please select a plan to subscribe!");
      return;
    }

    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK is not available");
      setLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Razorpay Key ID is missing!");
      setLoading(false);
      return;
    }

    const amount = cart.amount;
    const interval = cart.interval;
    const period = cart.period;
    const totalCycles = cart.totalCycles;

    if (amount < 1) {
      alert("Amount must be at least ₹1");
      setLoading(false);
      return;
    }

    const razorpayKeyId: string = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    console.log(razorpayKeyId);

    try {
      // Step 1: Create a Plan
      const planResponse = await axios.post(
        `${API_BASE_URL}/payment/create-plan`,
        {
          amount,
          interval,
          period
        }
      );
      console.log("planResponse", planResponse);

      if (!planResponse.data?.planId) {
        throw new Error("Plan creation failed: No plan ID returned");
      }

      const planId = planResponse.data.planId;
      console.log("Plan Created:", planId);

      // Step 2: Create a Subscription
      const subscriptionResponse = await axios.post(
        `${API_BASE_URL}/payment/create-subscription`,
        {
          planId,
          totalCycles
        }
      );
      console.log("subscriptionResponse", subscriptionResponse);

      if (!subscriptionResponse.data?.subscriptionId) {
        throw new Error(
          "Subscription creation failed: No subscription ID returned"
        );
      }

      const {
        subscriptionId,
        amount: subAmount,
        currency
      } = subscriptionResponse.data;
      console.log("Subscription Created:", subscriptionId);

      // Step 3: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        amount: subAmount.toString(),
        currency: currency || "INR",
        name: "Your Company",
        description: `Recurring ${period} Subscription`,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId,
                planId,
                amount: subAmount,
                currency: currency || "INR"
              }
            );
            console.log("Verify Response:", verifyResponse.data);

            if (verifyResponse.data.success) {
              alert("Subscription authorized successfully!");
              setApiResponse(verifyResponse.data);
              setCart(null); // Clear the cart after successful subscription
            } else {
              alert("Subscription authorization failed!");
              setApiResponse(verifyResponse.data);
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Failed to verify subscription payment!");
            setApiResponse({ error: "Verification failed" });
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999"
        },
        theme: { color: "#3399cc" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response);
        alert(`Payment failed: ${response.error.description}`);
        setApiResponse(response);
      });
      razorpay.open();
    } catch (error: unknown) {
      let errorMessage = "Subscription failed";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Subscription Error:", error);
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
        console.error("Axios Error:", {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(errorMessage);
      setApiResponse({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-white mb-6">Choose a plan</h2>

      {/* Plan Selection */}
      <div className="w-full max-w-md">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            onClick={() => addToCart(plan)}
            className={`flex justify-between items-center p-4 mb-2 rounded-lg cursor-pointer transition-all ${
              cart?.name === plan.name
                ? "border-2 border-orange-500 bg-gray-800"
                : "border border-gray-600 bg-gray-800"
            }`}
          >
            <div className="flex items-center">
              <span className="text-white text-lg">{plan.name}</span>
              {plan.trial && (
                <span className="ml-2 text-red-500 text-sm font-semibold">
                  TRY IT
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-white text-lg">
                ₹{plan.amount}/{plan.period === "daily" ? "2 days" : "month"}
              </span>
              {plan.discount && (
                <span className="ml-2 text-orange-500 text-sm font-semibold">
                  {plan.discount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      {cart && (
        <div className="w-full max-w-md mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-white">
              Cart: {cart.name} - ₹{cart.amount}/
              {cart.period === "daily" ? "2 days" : "month"}
            </span>
            <button
              onClick={clearCart}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Subscribe Button */}
      <button
        onClick={handleSubscriptionPayment}
        disabled={loading || !cart}
        className={`w-full max-w-md mt-6 px-4 py-2 text-white font-medium rounded-lg transition duration-300 ${
          loading || !cart
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>

      {/* Select Payment Method Link */}
      <a href="#" className="mt-4 text-gray-400 text-sm hover:underline">
        Select Payment Method
      </a>

      {/* API Response */}
      {apiResponse && (
        <pre className="mt-4 text-sm text-gray-400 overflow-auto max-h-40">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Payment;

// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import {
//   loadRazorpayScript,
//   RazorpayOptions,
//   RazorpayResponse
// } from "../common/lib/razorpay";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// const Payment: React.FC = () => {
//   const [amount, setAmount] = useState<number>(0);
//   const [interval, setInterval] = useState<number>(1);
//   const [period, setPeriod] = useState<
//     "daily" | "weekly" | "monthly" | "yearly"
//   >("monthly");
//   const [totalCycles, setTotalCycles] = useState<number>(12);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiResponse, setApiResponse] = useState<any>(null);
//   console.log(amount, interval, period, totalCycles, apiResponse);

//   const handleOneTimePayment = async () => {
//     console.log("handleOneTimePayment", apiResponse);
//     setLoading(true);

//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) {
//       alert("Failed to load Razorpay SDK");
//       setLoading(false);
//       return;
//     }

//     if (!window.Razorpay) {
//       alert("Razorpay SDK is not available");
//       setLoading(false);
//       return;
//     }

//     if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
//       alert("Razorpay Key ID is missing!");
//       setLoading(false);
//       return;
//     }

//     // After the check, TypeScript knows process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID is a string
//     const razorpayKeyId: string = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

//     try {
//       const { data } = await axios.post(
//         `${API_BASE_URL}/payment/create-order`,
//         { amount }
//       );
//       console.log("Create Order Response:", data);

//       const options: RazorpayOptions = {
//         key: razorpayKeyId, // Now guaranteed to be a string
//         amount: data.amount.toString(),
//         currency: data.currency,
//         name: "Your Company",
//         description: "One-Time Payment",
//         order_id: data.orderId,
//         handler: async (response: RazorpayResponse) => {
//           const verifyResponse = await axios.post(
//             `${API_BASE_URL}/payment/verify`,
//             {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               amount: data.amount,
//               currency: data.currency
//             }
//           );
//           console.log("Verify Response:", verifyResponse.data);

//           if (verifyResponse.data.success) {
//             alert("One-Time Payment successful and saved!");
//             setApiResponse(verifyResponse.data);
//           } else {
//             alert("Payment verification failed!");
//             setApiResponse(verifyResponse.data);
//           }
//         },
//         prefill: {
//           name: "John Doe",
//           email: "john.doe@example.com",
//           contact: "9999999999"
//         },
//         theme: { color: "#3399cc" }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", (response: any) => {
//         console.error("Payment failed:", response);
//         alert(`Payment failed: ${response.error.description}`);
//         setApiResponse(response);
//       });
//       razorpay.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       const errorMessage = axios.isAxiosError(error)
//         ? error.response?.data?.message || "Something went wrong!"
//         : "Something went wrong!";
//       alert(errorMessage);
//       setApiResponse({ error: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubscriptionPayment = async () => {
//     setLoading(true);

//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) {
//       alert("Failed to load Razorpay SDK");
//       setLoading(false);
//       return;
//     }

//     if (!window.Razorpay) {
//       alert("Razorpay SDK is not available");
//       setLoading(false);
//       return;
//     }

//     if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
//       alert("Razorpay Key ID is missing!");
//       setLoading(false);
//       return;
//     }

//     if (amount < 1) {
//       alert("Amount must be at least ₹1");
//       setLoading(false);
//       return;
//     }

//     // After the check, TypeScript knows process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID is a string
//     const razorpayKeyId: string = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
//     console.log(razorpayKeyId);

//     try {
//       // Step 1: Create a Plan
//       const planResponse = await axios.post(
//         `${API_BASE_URL}/payment/create-plan`,
//         {
//           amount,
//           interval,
//           period
//         }
//       );
//       console.log("planResponse", planResponse);

//       if (!planResponse.data?.planId) {
//         throw new Error("Plan creation failed: No plan ID returned");
//       }

//       const planId = planResponse.data.planId;
//       console.log("Plan Created:", planId);

//       // Step 2: Create a Subscription
//       const subscriptionResponse = await axios.post(
//         `${API_BASE_URL}/payment/create-subscription`,
//         {
//           planId,
//           totalCycles
//         }
//       );
//       console.log("subscriptionResponse", subscriptionResponse);

//       if (!subscriptionResponse.data?.subscriptionId) {
//         throw new Error(
//           "Subscription creation failed: No subscription ID returned"
//         );
//       }

//       const {
//         subscriptionId,
//         amount: subAmount,
//         currency
//       } = subscriptionResponse.data;
//       console.log("Subscription Created:", subscriptionId);

//       // Step 3: Open Razorpay checkout
//       const options: RazorpayOptions = {
//         key: razorpayKeyId, // Now guaranteed to be a string
//         subscription_id: subscriptionId,
//         amount: subAmount.toString(),
//         currency: currency || "INR",
//         name: "Your Company",
//         description: `Recurring ${period} Subscription`,
//         handler: async (response: RazorpayResponse) => {
//           try {
//             const verifyResponse = await axios.post(
//               `${API_BASE_URL}/payment/verify`,
//               {
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 subscriptionId,
//                 planId,
//                 amount: subAmount,
//                 currency: currency || "INR"
//               }
//             );
//             console.log("Verify Response:", verifyResponse.data);

//             if (verifyResponse.data.success) {
//               alert("Subscription authorized successfully!");
//               setApiResponse(verifyResponse.data);
//             } else {
//               alert("Subscription authorization failed!");
//               setApiResponse(verifyResponse.data);
//             }
//           } catch (error) {
//             console.error("Verification error:", error);
//             alert("Failed to verify subscription payment!");
//             setApiResponse({ error: "Verification failed" });
//           }
//         },
//         prefill: {
//           name: "John Doe",
//           email: "john.doe@example.com",
//           contact: "9999999999"
//         },
//         theme: { color: "#3399cc" }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", (response: any) => {
//         console.error("Payment failed:", response);
//         alert(`Payment failed: ${response.error.description}`);
//         setApiResponse(response);
//       });
//       razorpay.open();
//     } catch (error: unknown) {
//       let errorMessage = "Subscription failed";

//       if (error instanceof Error) {
//         errorMessage = error.message;
//         console.error("Subscription Error:", error);
//       } else if (axios.isAxiosError(error)) {
//         errorMessage = error.response?.data?.message || error.message;
//         console.error("Axios Error:", {
//           status: error.response?.status,
//           data: error.response?.data,
//           config: error.config
//         });
//       } else if (typeof error === "string") {
//         errorMessage = error;
//       }

//       alert(errorMessage);
//       setApiResponse({ error: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testApi = async () => {
//     try {
//       const testData = {
//         testData: {
//           orderId: `order_${Date.now()}`,
//           amount,
//           currency: "INR"
//         },
//         timestamp: new Date().toISOString()
//       };

//       const { data: testResponse } = await axios.post(
//         `${API_BASE_URL}/payment/test-response`,
//         testData
//       );
//       setApiResponse(testResponse);
//       alert("Test API response saved to database! Check console.");
//     } catch (error) {
//       console.error("Test API Error:", error);
//       setApiResponse({ error: "Error occurred" });
//       alert("API call failed! Check console.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-xl w-96 mx-auto mt-10">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         Payment Options
//       </h2>

//       {/* Amount Input */}
//       <div className="w-full mb-4">
//         <label className="block text-gray-700 mb-1">Amount (INR)</label>
//         <input
//           type="number"
//           value={amount || ""}
//           onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
//           placeholder="Enter amount in INR"
//           disabled={loading}
//           className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//         />
//       </div>

//       {/* Subscription Options */}
//       <div className="w-full mb-4">
//         <label className="block text-gray-700 mb-1">Interval</label>
//         <input
//           type="number"
//           value={interval}
//           onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
//           min="1"
//           disabled={loading}
//           className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//         />
//       </div>

//       <div className="w-full mb-4">
//         <label className="block text-gray-700 mb-1">Period</label>
//         <select
//           value={period}
//           onChange={(e) =>
//             setPeriod(
//               e.target.value as "daily" | "weekly" | "monthly" | "yearly"
//             )
//           }
//           disabled={loading}
//           className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//         >
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>
//       </div>

//       <div className="w-full mb-4">
//         <label className="block text-gray-700 mb-1">Total Cycles</label>
//         <input
//           type="number"
//           value={totalCycles}
//           onChange={(e) => setTotalCycles(parseInt(e.target.value) || 1)}
//           min="1"
//           disabled={loading}
//           className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//         />
//       </div>

//       {/* Buttons */}
//       <button
//         onClick={handleOneTimePayment}
//         disabled={loading || amount <= 0}
//         className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-300 mb-2 ${
//           loading || amount <= 0
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {loading ? "Processing..." : "Pay Now (One-Time)"}
//       </button>

//       <button
//         onClick={handleSubscriptionPayment}
//         disabled={loading || amount <= 0 || interval <= 0 || totalCycles <= 0}
//         className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-300 mb-2 ${
//           loading || amount <= 0 || interval <= 0 || totalCycles <= 0
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-purple-500 hover:bg-purple-600"
//         }`}
//       >
//         {loading ? "Processing..." : "Subscribe"}
//       </button>

//       <button
//         onClick={testApi}
//         disabled={amount <= 0}
//         className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-300 ${
//           amount <= 0
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-green-500 hover:bg-green-600"
//         }`}
//       >
//         Test API
//       </button>

//       {/* API Response */}
//       {apiResponse && (
//         <pre className="mt-4 text-sm text-gray-700 overflow-auto max-h-40">
//           {JSON.stringify(apiResponse, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// };

// export default Payment;
