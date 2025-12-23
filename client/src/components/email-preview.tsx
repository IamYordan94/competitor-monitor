import { Mail, ArrowRight, AlertTriangle } from "lucide-react";

export function EmailPreview() {
  return (
    <div className="bg-white border-2 border-black max-w-2xl mx-auto shadow-sm overflow-hidden">
      {/* Email Header */}
      <div className="bg-gray-100 border-b-2 border-black p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shrink-0">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">Competitor Change Monitor</div>
          <div className="text-xs text-gray-500 truncate">&lt;alerts@competitormonitor.com&gt;</div>
          <div className="text-xs text-gray-400 mt-1 truncate">To: you@company.com</div>
        </div>
        <div className="ml-auto text-xs font-mono text-gray-500 whitespace-nowrap">10:42 AM</div>
      </div>

      {/* Email Body */}
      <div className="p-6 md:p-8 font-mono text-sm">
        <div className="mb-6">
          <span className="bg-primary text-white px-2 py-1 text-xs font-bold uppercase">Change Detected</span>
        </div>

        <h3 className="text-xl font-bold mb-4">Pricing Page Update: competitor.com</h3>

        <div className="space-y-4 text-gray-700">
          <p>We detected a text change on <strong>https://competitor.com/pricing</strong>.</p>
          
          <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 my-4">
            <div className="text-xs font-bold text-red-500 uppercase mb-1">Was:</div>
            <p className="line-through opacity-60">"Enterprise plans start at $499/month"</p>
          </div>

          <div className="flex justify-center my-2">
            <ArrowRight className="w-4 h-4 text-gray-400 transform rotate-90 md:rotate-0" />
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 my-4">
            <div className="text-xs font-bold text-green-500 uppercase mb-1">Now:</div>
            <p className="font-bold">"Enterprise plans start at $999/month"</p>
          </div>

          <p className="mt-6 text-gray-500 text-xs">
            Why this matters: They just doubled their enterprise floor. Check if your sales team can undercut them.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-800">
            View Live Page
          </button>
        </div>
      </div>
    </div>
  );
}
