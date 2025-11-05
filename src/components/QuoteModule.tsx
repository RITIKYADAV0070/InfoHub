import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const QuoteModule = () => {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-quote');

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setQuote(data);
      toast.success("New quote generated!");
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      toast.error("Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg border-border bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Motivational Quote</CardTitle>
            <CardDescription>Get inspired with daily quotes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={fetchQuote} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Quote
            </>
          )}
        </Button>

        {quote && (
          <div className="animate-in fade-in duration-500">
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              <Sparkles className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              <blockquote className="relative z-10">
                <p className="text-lg font-medium text-foreground mb-4 leading-relaxed italic">
                  "{quote.text}"
                </p>
                <footer className="text-sm font-semibold text-primary">
                  — {quote.author}
                </footer>
              </blockquote>
            </div>
          </div>
        )}

        {!quote && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Click the button to get your daily inspiration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
