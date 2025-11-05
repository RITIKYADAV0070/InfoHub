import { useState } from "react";
import { WeatherModule } from "@/components/WeatherModule";
import { CurrencyModule } from "@/components/CurrencyModule";
import { QuoteModule } from "@/components/QuoteModule";
import { Cloud, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">InfoHub</h1>
              <p className="text-sm text-muted-foreground">Your daily utilities in one place</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Weather Module */}
          <div className="group">
            <WeatherModule />
          </div>

          {/* Currency Converter Module */}
          <div className="group">
            <CurrencyModule />
          </div>

          {/* Quote Generator Module */}
          <div className="group">
            <QuoteModule />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
