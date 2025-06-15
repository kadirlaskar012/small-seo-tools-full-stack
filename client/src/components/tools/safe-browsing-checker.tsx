import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Shield, Globe, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SafeBrowsingResult {
  success: boolean;
  url?: string;
  status?: string;
  accessible?: boolean;
  status_code?: number;
  threat_indicators?: string[];
  domain?: string;
  scan_time?: string;
  error?: string;
}

export function SafeBrowsingChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SafeBrowsingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to check",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/tools/safe-browsing-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Scan Complete",
          description: `Website scan completed - Status: ${data.status}`,
        });
      }
    } catch (error) {
      console.error("Safe browsing check error:", error);
      setResult({
        success: false,
        error: "Failed to check website safety. Please try again.",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "suspicious":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "unsafe":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "suspicious":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      case "unsafe":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const loadSampleUrl = () => {
    setUrl("https://google.com");
  };

  const formatResult = () => {
    if (!result) return "";
    
    const lines = [
      `URL: ${result.url}`,
      `Status: ${result.status?.toUpperCase()}`,
      `Domain: ${result.domain}`,
      `Accessible: ${result.accessible ? 'Yes' : 'No'}`,
      result.status_code ? `HTTP Status: ${result.status_code}` : '',
      `Scan Time: ${result.scan_time}`,
      result.threat_indicators?.length ? `\nThreats Detected:\n${result.threat_indicators.map(t => `• ${t}`).join('\n')}` : '\nNo threats detected'
    ].filter(Boolean);
    
    return lines.join('\n');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safe Browsing Checker
          </CardTitle>
          <CardDescription>
            Check websites for potential security threats, malware, phishing attempts, and other risks.
            Get instant safety reports with detailed threat analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-sm font-medium">
              Website URL
            </Label>
            <Input
              id="url-input"
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCheck}
                disabled={isLoading || !url.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Check Safety
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadSampleUrl}>
                Try Sample
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This tool performs basic heuristic analysis and connectivity checks. 
              For comprehensive security scanning, consider using dedicated security services.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Safety Status Card */}
              <Card className={`border-2 ${result.status === 'safe' ? 'border-green-200 dark:border-green-800' : 
                result.status === 'suspicious' ? 'border-orange-200 dark:border-orange-800' : 
                'border-red-200 dark:border-red-800'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.status!)}
                      Safety Report
                    </CardTitle>
                    <Badge className={getStatusColor(result.status!)}>
                      {result.status?.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Checked URL</Label>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <code className="text-sm break-all">{result.url}</code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Domain</Label>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <code className="text-sm">{result.domain}</code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Accessibility</div>
                      <div className="text-blue-600 dark:text-blue-400">
                        {result.accessible ? 'Accessible' : 'Not Accessible'}
                      </div>
                    </div>
                    {result.status_code && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">HTTP Status</div>
                        <div className="text-purple-600 dark:text-purple-400">{result.status_code}</div>
                      </div>
                    )}
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Scan Time</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">{result.scan_time}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(formatResult(), "Safety report")}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Threat Analysis */}
              {result.threat_indicators && result.threat_indicators.length > 0 ? (
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Threat Indicators Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.threat_indicators.map((threat, index) => (
                        <div
                          key={index}
                          className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{threat}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      No Threats Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The website passed basic safety checks with no obvious threat indicators detected.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Security Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Always verify the URL spelling and look for HTTPS encryption</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Be cautious of sites asking for personal information or passwords</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Keep your browser and security software updated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Scan Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}