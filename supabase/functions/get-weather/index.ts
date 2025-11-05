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
    const { city } = await req.json();

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using OpenWeatherMap API (Free tier)
    const API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!API_KEY) {
      // Fallback to mock data if API key is not set
      console.log('OpenWeather API key not found, using mock data');
      
      const mockData = {
        name: city,
        main: {
          temp: 25 + Math.random() * 10,
          feels_like: 24 + Math.random() * 10,
          humidity: 60 + Math.random() * 20,
          pressure: 1010 + Math.random() * 20,
        },
        weather: [
          {
            description: ['clear sky', 'few clouds', 'scattered clouds', 'partly cloudy'][Math.floor(Math.random() * 4)],
          }
        ],
        wind: {
          speed: 2 + Math.random() * 5,
        }
      };

      return new Response(
        JSON.stringify(mockData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('OpenWeather API error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch weather data' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Weather data fetched successfully for:', city);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-weather function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
