import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, ArrowRight, Plus, Trash2, Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  urls: z.array(z.object({
    value: z.string().url("Must be a valid URL")
  })).min(1, "Add at least one URL").max(15, "Max 15 URLs"),
});

type FormData = z.infer<typeof schema>;

export function MonitorForm() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMagicLinkPrompt, setShowMagicLinkPrompt] = useState(false);
  const [existingEmail, setExistingEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      urls: [{ value: "" }]
    }
  });

  const urls = watch("urls");

  const addUrl = () => {
    if (urls.length < 15) {
      setValue("urls", [...urls, { value: "" }]);
    }
  };

  const removeUrl = (index: number) => {
    setValue("urls", urls.filter((_, i) => i !== index));
  };

  const sendMagicLink = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: existingEmail }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link');
      }

      setMagicLinkSent(true);
      
      // In dev mode, show the link directly
      if (data.devLink) {
        setDevLink(data.devLink);
      }
    } catch (error) {
      console.error('Magic link error:', error);
      alert(error instanceof Error ? error.message : 'Failed to send magic link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Call backend API to create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          urls: data.urls.map(u => u.value),
        }),
      });

      const result = await response.json();

      // Check if user already has active subscription
      if (response.status === 409 && result.hasActiveSubscription) {
        setExistingEmail(data.email);
        setShowMagicLinkPrompt(true);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Magic link prompt for existing subscribers
  if (showMagicLinkPrompt) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
        <h3 className="font-mono text-xl font-bold mb-6 uppercase border-b-2 border-black pb-2">
          Already Subscribed
        </h3>

        {magicLinkSent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="font-mono text-lg font-bold mb-2">Check Your Inbox!</p>
            <p className="text-gray-600 text-sm mb-4">
              We sent a magic link to <strong>{existingEmail}</strong>
            </p>
            <p className="text-gray-500 text-xs">
              Click the link in your email to manage your subscription.
            </p>
            
            {devLink && (
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400">
                <p className="text-xs font-mono text-yellow-800 mb-2">Dev Mode - Click to test:</p>
                <a 
                  href={devLink} 
                  className="text-xs font-mono text-blue-600 underline break-all"
                  data-testid="link-dev-magic"
                >
                  {devLink}
                </a>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 border-2 border-primary">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm">This email is active</p>
                  <p className="text-gray-500 text-xs">{existingEmail}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                This email already has an active subscription. To manage your URLs or subscription, we'll send you a secure link.
              </p>
            </div>

            <button
              onClick={sendMagicLink}
              disabled={isSubmitting}
              className="w-full bg-black text-white font-mono font-bold text-lg uppercase py-4 border-2 border-transparent hover:bg-primary transition-all active:translate-y-1 disabled:opacity-50 flex justify-center items-center gap-2"
              data-testid="button-send-magic-link"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" /> Send Management Link
                </>
              )}
            </button>

            <button
              onClick={() => {
                setShowMagicLinkPrompt(false);
                setExistingEmail('');
              }}
              className="w-full mt-3 text-gray-500 font-mono text-xs uppercase hover:text-black transition-colors"
              data-testid="button-use-different-email"
            >
              Use a different email
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
      <h3 className="font-mono text-xl font-bold mb-6 uppercase border-b-2 border-black pb-2">
        Start Monitoring
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="font-mono text-sm font-bold uppercase block">
            Your Email
          </label>
          <input
            {...register("email")}
            placeholder="you@company.com"
            className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
            data-testid="input-email"
          />
          {errors.email && (
            <p className="text-red-600 text-xs font-mono font-bold mt-1">
              ⚠️ {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-mono text-sm font-bold uppercase block">
              Competitor URLs ({urls.length}/15)
            </label>
            {urls.length > 5 && (
              <span className="bg-black text-white text-xs font-mono font-bold px-2 py-1">
                PRO PLAN DETECTED
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {urls.map((_, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <div className="flex-1">
                    <input
                      {...register(`urls.${index}.value` as const)}
                      placeholder={`https://competitor-${index + 1}.com`}
                      className="w-full bg-white border-2 border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                      data-testid={`input-url-${index}`}
                    />
                     {errors.urls?.[index]?.value && (
                      <p className="text-red-600 text-xs font-mono font-bold mt-1">
                        ⚠️ Invalid URL
                      </p>
                    )}
                  </div>
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="border-2 border-black p-3 hover:bg-red-100 transition-colors"
                      title="Remove URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {urls.length < 15 && (
            <button
              type="button"
              onClick={addUrl}
              className="text-xs font-mono font-bold uppercase flex items-center gap-1 hover:text-primary transition-colors mt-2"
            >
              <Plus className="w-3 h-3" /> Add another URL
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-mono font-bold text-lg uppercase py-4 border-2 border-transparent hover:bg-primary hover:text-white hover:border-black transition-all active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          data-testid="button-submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing
            </>
          ) : (
            <>
              Start Monitoring <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-xs font-mono text-center text-gray-500 mt-4">
          {urls.length > 5 ? "Pro Plan: €19/month" : "Starter Plan: €9/month"}. Cancel anytime.
        </p>
      </form>
    </div>
  );
}
