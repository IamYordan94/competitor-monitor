import { Layout } from "@/components/layout";
import { ArrowLeft, Lock, CreditCard, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get plan from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const plan = searchParams.get("plan") === "pro" ? "pro" : "starter";
  
  const isPro = plan === "pro";
  const price = isPro ? "€19.00" : "€9.00";
  const planName = isPro ? "Pro Plan" : "Starter Plan";
  const urlLimit = isPro ? "Up to 15 URLs" : "Up to 5 URLs";
  const priority = isPro ? "Priority Processing" : "Standard Processing";

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setLocation("/success");
    }, 2000);
  };

  return (
    <Layout>
      <div className="flex-1 bg-muted/20 py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16">
          
          {/* Order Summary */}
          <div>
            <Link href="/">
              <a className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase mb-8 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </a>
            </Link>
            
            <h1 className="font-mono text-3xl md:text-4xl font-black uppercase mb-6">
              Complete Order
            </h1>
            
            <div className="bg-white border-2 border-black p-6 mb-8">
              <div className="flex justify-between items-start mb-4 border-b-2 border-gray-100 pb-4">
                <div>
                  <h3 className="font-mono font-bold text-lg uppercase">{planName}</h3>
                  <p className="text-gray-500 text-sm">Monthly subscription</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-xl">{price}</div>
                  <div className="text-gray-500 text-xs uppercase">per month</div>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex justify-between">
                  <span>Monitoring</span>
                  <span>{urlLimit}</span>
                </li>
                <li className="flex justify-between">
                  <span>Frequency</span>
                  <span>Daily checks</span>
                </li>
                 {isPro && (
                  <li className="flex justify-between font-bold text-primary">
                    <span>Priority</span>
                    <span>Active</span>
                  </li>
                )}
              </ul>
              
              <div className="flex justify-between items-center font-mono font-bold text-lg pt-4 border-t-2 border-black">
                <span>Total due today</span>
                <span>{price}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
               <div className="bg-green-100 text-green-700 p-1 rounded">
                 <Lock className="w-4 h-4" />
               </div>
               <span>Secure payment processing via Stripe</span>
            </div>
          </div>

          {/* Payment Form (Mock) */}
          <div className="bg-white border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit">
            <h3 className="font-mono text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Payment Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold uppercase block">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="JOHN DOE" 
                  className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs font-bold uppercase block">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold uppercase block">Expiration</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold uppercase block">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-black text-white font-mono font-bold text-lg uppercase py-4 border-2 border-transparent hover:bg-primary hover:text-white hover:border-black transition-all active:translate-y-1 mt-6 flex justify-center items-center"
              >
                {isProcessing ? "Processing..." : `Pay ${price} & Start`}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By clicking pay, you agree to our Ruthless Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
