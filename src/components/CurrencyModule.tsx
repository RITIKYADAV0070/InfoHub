import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2, ArrowRight, DollarSign, Euro, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CurrencyModule = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<any>(null);

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('convert-currency', {
        body: { amount: parseFloat(amount) }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setRates(data);
      toast.success("Currency converted!");
    } catch (error: any) {
      console.error('Error converting currency:', error);
      toast.error("Failed to convert currency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg border-border bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Currency Converter</CardTitle>
            <CardDescription>Convert INR to USD/EUR</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Amount in INR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && convertCurrency()}
              className="pl-9"
            />
          </div>
          <Button onClick={convertCurrency} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Convert"}
          </Button>
        </div>

        {rates && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">INR</span>
                </div>
                <span className="text-xl font-bold text-foreground">₹{parseFloat(amount).toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">USD</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${rates.usd.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Rate: {rates.usdRate.toFixed(4)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">EUR</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent">€{rates.eur.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Rate: {rates.eurRate.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
