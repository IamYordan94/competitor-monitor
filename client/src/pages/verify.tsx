import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function Verify() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your link...');

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No token provided');
        return;
      }

      try {
        const response = await fetch(`/api/verify-token?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setMessage(data.error || 'Invalid or expired link');
          return;
        }

        // If there's a redirect URL (e.g., Stripe portal), redirect there
        if (data.redirectUrl) {
          setStatus('success');
          setMessage('Redirecting to manage your subscription...');
          window.location.href = data.redirectUrl;
          return;
        }

        // DEV: If verified, redirect to dashboard?
        if (token.startsWith("dev")) { // simplistic check
          window.location.href = "/dashboard";
          return;
        }

        setStatus('success');
        setMessage('Verification successful!');
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyToken();
  }, []);

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <h1 className="font-mono text-xl font-bold uppercase">{message}</h1>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h1 className="font-mono text-xl font-bold uppercase mb-2">Verified!</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h1 className="font-mono text-xl font-bold uppercase mb-2">Error</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => setLocation('/')}
                className="bg-black text-white font-mono font-bold text-sm uppercase py-3 px-6 hover:bg-primary transition-colors"
                data-testid="button-back-home"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
