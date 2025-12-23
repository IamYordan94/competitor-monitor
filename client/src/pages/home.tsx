import { Layout } from "@/components/layout";
import { MonitorForm } from "@/components/monitor-form";
import { Check, Eye, Zap, Shield, Bell, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 bg-background border-b-2 border-black overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase font-mono">
                Simple.<br />
                Ruthless.<br />
                <span className="text-primary">Useful.</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-600 mb-10 max-w-lg leading-relaxed">
                The web app that monitors competitor webpages and emails You, what changed, when, and why it matters.
                <br /><span className="font-bold text-black block mt-2">No fluff. Just alerts.</span>
              </p>

              <div className="flex flex-wrap gap-4 font-mono text-sm md:text-base font-bold">
                <div className="flex items-center gap-2 border-2 border-black px-3 py-1 bg-white">
                  <Check className="w-4 h-4 text-primary" /> Daily Checks
                </div>
                <div className="flex items-center gap-2 border-2 border-black px-3 py-1 bg-white">
                  <Check className="w-4 h-4 text-primary" /> Email Alerts
                </div>
                <div className="flex items-center gap-2 border-2 border-black px-3 py-1 bg-white">
                  <Check className="w-4 h-4 text-primary" /> Cancel Anytime
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <MonitorForm />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUE */}
      <section className="py-20 bg-muted/30 border-b-2 border-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-black font-mono uppercase mb-8 leading-none">
                Who it's for
              </h2>
              <ul className="space-y-4 font-mono text-lg md:text-xl font-medium">
                {["Solo founders", "Indie hackers", "Small SaaS owners", "Agencies watching competitors", "Marketers"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xl font-bold border-l-4 border-primary pl-4 py-2 bg-white inline-block">
                People who hate surprises more than they hate paying €10/month.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-5xl font-black font-mono uppercase mb-8 leading-none">
                The Problem
              </h2>
              <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="font-bold text-lg mb-4 uppercase text-gray-500">You don't want to:</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-600 line-through decoration-2 decoration-red-500/50">
                    <XCircle className="w-5 h-5 text-gray-400" /> Manually check sites
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 line-through decoration-2 decoration-red-500/50">
                    <XCircle className="w-5 h-5 text-gray-400" /> Miss pricing changes
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 line-through decoration-2 decoration-red-500/50">
                    <XCircle className="w-5 h-5 text-gray-400" /> Miss new features
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 line-through decoration-2 decoration-red-500/50">
                    <XCircle className="w-5 h-5 text-gray-400" /> Miss repositioning
                  </li>
                </ul>
                <div className="bg-black text-white p-4 font-mono text-center font-bold border-2 border-primary">
                  "Knowledge is power. <br />We deliver it. <br /><span className="text-primary">You use it.</span>"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-b-2 border-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black font-mono uppercase mb-16 text-center">
            How it Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Input", desc: "Enter your email & target URLs", icon: <Eye className="w-8 h-8" /> },
              { title: "Verify", desc: "Access via secure Magic Link in email", icon: <Shield className="w-8 h-8" /> },
              { title: "Watch", desc: "Our robots fetch and compare daily", icon: <Zap className="w-8 h-8" /> },
              { title: "Report", desc: "Detailed change summary in your inbox", icon: <Bell className="w-8 h-8" /> },
            ].map((step, i) => (
              <div key={i} className="border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
                <div className="mb-4 text-primary group-hover:text-white transition-colors">{step.icon}</div>
                <h3 className="font-mono text-xl font-bold uppercase mb-2">0{i + 1}. {step.title}</h3>
                <p className="font-medium opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-black text-white border-b-2 border-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black font-mono uppercase mb-4 text-center">
            Pricing
          </h2>
          <p className="text-center font-mono text-gray-400 mb-16">Don't overthink it.</p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Tier 1 */}
            <div className="bg-white text-black p-8 border-4 border-white h-full flex flex-col relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 uppercase font-mono transform translate-x-2 -translate-y-2">
                Most Popular
              </div>
              <h3 className="font-mono text-2xl font-bold uppercase mb-2">Starter</h3>
              <div className="text-5xl font-black mb-6 tracking-tighter">€9<span className="text-lg font-medium text-gray-500">/mo</span></div>
              <ul className="space-y-4 font-mono text-sm font-bold mb-8 flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Up to 5 URLs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Daily Checks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Email Alerts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Cancel Anytime</li>
              </ul>
              <button className="w-full bg-black text-white py-3 font-mono font-bold uppercase hover:bg-primary transition-colors">
                Start Monitoring
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-transparent border-2 border-gray-700 p-8 h-full flex flex-col hover:border-black transition-colors">
              <h3 className="font-mono text-2xl font-bold uppercase mb-2">Pro</h3>
              <div className="text-5xl font-black mb-6 tracking-tighter">€19<span className="text-lg font-medium text-gray-500">/mo</span></div>
              <ul className="space-y-4 font-mono text-sm font-bold mb-8 flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Up to 15 URLs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Daily Checks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Priority Processing</li>
              </ul>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-white text-black py-3 font-mono font-bold uppercase border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                Start Monitoring
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase mb-8 text-white max-w-3xl mx-auto leading-tight">
            You are selling peace of mind, not data.
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-black text-white px-8 py-4 font-mono text-xl font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
          >
            Get Peace of Mind Now
          </button>
        </div>
      </section>
    </Layout>
  );
}
