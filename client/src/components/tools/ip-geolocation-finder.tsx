import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, MapPin, Globe, Wifi, Building, Clock, Flag, Smartphone, Shield, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GeolocationResult {
  success: boolean;
  ip?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  as_name?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  error?: string;
}

export function IPGeolocationFinder() {
  const [ipInput, setIpInput] = useState("");
  const [result, setResult] = useState<GeolocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLookup = async () => {
    if (!ipInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an IP address or domain name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/tools/ip-geolocation-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ipInput.trim() }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Location Found",
          description: `IP geolocation lookup completed for ${data.ip}`,
        });
      }
    } catch (error) {
      console.error("IP geolocation error:", error);
      setResult({
        success: false,
        error: "Failed to lookup IP geolocation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMyIP = async () => {
    setIsLoading(true);
    try {
      // Use a public IP detection service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpInput(data.ip);
      toast({
        title: "IP Detected",
        description: `Your public IP address: ${data.ip}`,
      });
    } catch (error) {
      // Fallback to a demo IP
      setIpInput("8.8.8.8");
      toast({
        title: "Using Demo IP",
        description: "Using Google DNS IP for demonstration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const loadSampleIP = () => {
    setIpInput("8.8.8.8");
  };

  const formatResult = () => {
    if (!result) return "";
    
    const lines = [
      `IP Address: ${result.ip}`,
      `Location: ${result.city}, ${result.region}, ${result.country}`,
      `Country Code: ${result.country_code}`,
      `Zip Code: ${result.zip_code}`,
      `Coordinates: ${result.latitude}, ${result.longitude}`,
      `Timezone: ${result.timezone}`,
      `ISP: ${result.isp}`,
      `Organization: ${result.organization}`,
      `AS Name: ${result.as_name}`,
      `Mobile: ${result.mobile ? 'Yes' : 'No'}`,
      `Proxy: ${result.proxy ? 'Yes' : 'No'}`,
      `Hosting: ${result.hosting ? 'Yes' : 'No'}`
    ];
    
    return lines.join('\n');
  };

  const getMapUrl = () => {
    if (result?.latitude && result?.longitude) {
      return `https://www.openstreetmap.org/?mlat=${result.latitude}&mlon=${result.longitude}&zoom=10`;
    }
    return null;
  };

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode === 'UN') return '🌍';
    
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            IP Geolocation Finder
          </CardTitle>
          <CardDescription>
            Find geographic location, ISP details, and network information for any IP address or domain name.
            Get detailed location data with coordinates and timezone information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ip-input" className="text-sm font-medium">
              IP Address or Domain
            </Label>
            <Input
              id="ip-input"
              type="text"
              placeholder="Enter IP address or domain (e.g., 8.8.8.8 or google.com)"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleLookup}
                disabled={isLoading || !ipInput.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Location
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={getMyIP} disabled={isLoading}>
                <Globe className="h-4 w-4 mr-2" />
                My IP
              </Button>
              <Button variant="outline" onClick={loadSampleIP}>
                Sample
              </Button>
            </div>
          </div>

          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              This tool uses free geolocation services. Location accuracy may vary depending on the IP address type and provider.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Main Location Card */}
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Location Information
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFlagEmoji(result.country_code!)}</span>
                      <Badge variant="secondary">{result.country_code}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">IP Address</Label>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <code className="text-sm font-mono">{result.ip}</code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="text-sm">{result.city}, {result.region}</div>
                        <div className="text-lg font-semibold">{result.country}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Coordinates
                      </div>
                      <div className="text-purple-600 dark:text-purple-400 text-sm">
                        {result.latitude}, {result.longitude}
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Timezone
                      </div>
                      <div className="text-orange-600 dark:text-orange-400 text-sm">{result.timezone}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</div>
                      <div className="text-gray-600 dark:text-gray-400">{result.zip_code}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(formatResult(), "Location data")}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Data
                    </Button>
                    {getMapUrl() && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(getMapUrl()!, '_blank')}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Network Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Internet Service Provider
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">{result.isp}</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          Organization
                        </div>
                        <div className="text-green-600 dark:text-green-400">{result.organization}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">AS Name</div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm">{result.as_name}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Type & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Connection Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg border-2 ${
                      result.mobile 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className={`h-4 w-4 ${result.mobile ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Mobile</span>
                      </div>
                      <Badge variant={result.mobile ? "default" : "secondary"}>
                        {result.mobile ? "Yes" : "No"}
                      </Badge>
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 ${
                      result.proxy 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className={`h-4 w-4 ${result.proxy ? 'text-orange-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Proxy</span>
                      </div>
                      <Badge variant={result.proxy ? "destructive" : "secondary"}>
                        {result.proxy ? "Detected" : "None"}
                      </Badge>
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 ${
                      result.hosting 
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' 
                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Server className={`h-4 w-4 ${result.hosting ? 'text-purple-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Hosting</span>
                      </div>
                      <Badge variant={result.hosting ? "default" : "secondary"}>
                        {result.hosting ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geolocation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Geographic accuracy is typically within 25-50 miles for most IP addresses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Wifi className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Mobile and satellite connections may show less precise locations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>VPN and proxy services will show the server location, not user location</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert variant="destructive">
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                <strong>Lookup Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}