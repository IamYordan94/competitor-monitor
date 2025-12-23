import { Layout } from "@/components/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, Trash2, Plus, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const [newUrl, setNewUrl] = useState("");

    // Simple auth check: we need a token or userId. 
    // For this dev flow, we'll assume the URL has ?userId=X or we check localStorage
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Try to get from URL (magic link redirect) or storage
        const params = new URLSearchParams(window.location.search);
        const uid = params.get("userId") || localStorage.getItem("competitor_monitor_userid");
        if (uid) {
            setUserId(uid);
            localStorage.setItem("competitor_monitor_userid", uid);
        } else {
            // Redirect to home if no user
            setLocation("/");
        }
    }, []);

    const { data: monitors, isLoading } = useQuery({
        queryKey: ["monitors", userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await fetch(`/api/monitors?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: !!userId
    });

    const addMutation = useMutation({
        mutationFn: async (url: string) => {
            const res = await fetch("/api/monitors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: parseInt(userId!), url, name: url, frequency: 24 })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to add monitor");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["monitors"] });
            setNewUrl("");
            toast({ title: "Success", description: "Monitor added successfully." });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            // We need a delete endpoint, assuming we'll create it
            const res = await fetch(`/api/monitors/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["monitors"] });
            toast({ title: "Removed", description: "Monitor deleted successfully." });
        }
    });

    if (!userId) return null;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-black font-mono uppercase mb-8">My Monitors</h1>

                {/* ADD NEW */}
                <div className="bg-white border-2 border-black p-6 mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="font-mono font-bold uppercase mb-4">Add Target</h2>
                    <div className="flex gap-4">
                        <input
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://competitor.com"
                            className="flex-1 bg-gray-50 border-2 border-black p-3 font-mono text-sm"
                        />
                        <button
                            onClick={() => newUrl && addMutation.mutate(newUrl)}
                            disabled={addMutation.isPending}
                            className="bg-black text-white px-6 font-mono font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50"
                        >
                            {addMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
                        </button>
                    </div>
                </div>

                {/* LIST */}
                {isLoading ? (
                    <div className="text-center py-12"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>
                ) : (
                    <div className="grid gap-4">
                        {monitors?.map((monitor: any) => (
                            <div key={monitor.id} className="bg-white border-2 border-black p-6 flex justify-between items-center group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                <div className="min-w-0 flex-1 mr-4">
                                    <div className="font-mono font-bold text-lg mb-1 truncate" title={monitor.url}>{monitor.url}</div>
                                    <div className="text-xs font-mono text-gray-500 uppercase flex gap-4">
                                        <span>Status: {monitor.status}</span>
                                        <span>Last Checked: {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleDateString() : "Never"}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-primary"><ExternalLink className="w-5 h-5" /></a>
                                    <button
                                        onClick={() => deleteMutation.mutate(monitor.id)}
                                        className="p-2 hover:text-red-500"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {monitors?.length === 0 && (
                            <p className="text-center font-mono text-gray-500 py-12">No monitors active. Add one above.</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
