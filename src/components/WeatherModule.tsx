import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2, Search, CloudRain, Sun, Wind, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const WeatherModule = () => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setWeatherData(data);
      toast.success("Weather data loaded!");
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg border-border bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Weather</CardTitle>
            <CardDescription>Get current weather information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            className="flex-1"
          />
          <Button onClick={fetchWeather} disabled={loading} size="icon">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {weatherData && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{weatherData.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{weatherData.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{Math.round(weatherData.main.temp)}°C</div>
                  <p className="text-xs text-muted-foreground">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 p-2 rounded bg-card/50">
                  <Droplets className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="text-sm font-semibold">{weatherData.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-card/50">
                  <Wind className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wind</p>
                    <p className="text-sm font-semibold">{weatherData.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-card/50">
                  <Sun className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pressure</p>
                    <p className="text-sm font-semibold">{weatherData.main.pressure} hPa</p>
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
