import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valid amount is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const EXCHANGE_API_KEY = Deno.env.get('EXCHANGE_RATE_API_KEY');
    
    if (!EXCHANGE_API_KEY) {
      // Fallback to mock exchange rates if API key is not set
      console.log('Exchange Rate API key not found, using mock rates');
      
      const mockRates = {
        usdRate: 0.012, // Approximate INR to USD
        eurRate: 0.011, // Approximate INR to EUR
        usd: amount * 0.012,
        eur: amount * 0.011,
      };

      return new Response(
        JSON.stringify(mockRates),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using ExchangeRate-API (Free tier)
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/INR`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.result === 'error') {
      console.error('Exchange Rate API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch exchange rates' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const usdRate = data.conversion_rates.USD;
    const eurRate = data.conversion_rates.EUR;

    const result = {
      usdRate,
      eurRate,
      usd: amount * usdRate,
      eur: amount * eurRate,
    };

    console.log('Currency conversion successful:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in convert-currency function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
