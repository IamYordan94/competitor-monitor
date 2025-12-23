import { Layout } from "@/components/layout";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { EmailPreview } from "@/components/email-preview";
import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    // Trigger verification when page loads
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Subscription verification result:", data);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <Layout>
      <div className="flex-1 bg-muted/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>

            <h1 className="font-mono text-3xl md:text-4xl font-black uppercase mb-4">
              Monitoring Active
            </h1>

            <p className="text-xl text-gray-600 mb-8 font-medium max-w-xl mx-auto">
              We've processed your payment. <br />
              <span className="font-bold bg-yellow-100 p-1">Check your email</span> for the secure link to access your dashboard.
            </p>

            <div className="grid md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto mb-8">
              <div className="bg-black text-white p-4 font-mono text-sm border-2 border-black">
                <div className="text-xs opacity-60 mb-1">STATUS</div>
                <div className="font-bold text-primary">ACTIVE</div>
              </div>
              <div className="bg-white text-black p-4 font-mono text-sm border-2 border-black">
                <div className="text-xs opacity-60 mb-1">NEXT CHECK</div>
                <div className="font-bold">24 HOURS</div>
              </div>
              <div className="bg-white text-black p-4 font-mono text-sm border-2 border-black">
                <div className="text-xs opacity-60 mb-1">ALERT METHOD</div>
                <div className="font-bold">EMAIL</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <a className="inline-flex items-center gap-2 font-mono font-bold uppercase hover:underline decoration-2 underline-offset-4">
                  <ArrowLeft className="w-4 h-4" /> Return Home
                </a>
              </Link>
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <h2 className="font-mono text-2xl font-bold uppercase mb-2">What happens next?</h2>
            <p className="text-gray-600">Here is a preview of what you'll see when a competitor changes something.</p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <EmailPreview />
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
