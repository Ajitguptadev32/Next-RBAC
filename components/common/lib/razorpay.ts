// lib/razorpay.ts
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Define Razorpay type (since Razorpay doesn't provide official TS types)
export interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  subscription_id?: string;
  order_id?: string; // Optional for one-time payments  subscription_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Define Razorpay constructor type
export interface RazorpayConstructor {
  new (options: RazorpayOptions): {
    open: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}
