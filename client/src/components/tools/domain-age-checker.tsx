import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Calendar, Clock, Globe, Server, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DomainAgeResult {
  success: boolean;
  domain?: string;
  creation_date?: string;
  updated_date?: string;
  expiration_date?: string;
  registrar?: string;
  status?: string;
  age_years?: number;
  age_months?: number;
  age_days?: number;
  days_until_expiry?: number;
  name_servers?: string[];
  whois_server?: string;
  note?: string;
  error?: string;
}

export function DomainAgeChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainAgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name to check",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/tools/domain-age-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Domain Analysis Complete",
          description: `Domain age checked for ${data.domain}`,
        });
      }
    } catch (error) {
      console.error("Domain age check error:", error);
      setResult({
        success: false,
        error: "Failed to check domain age. Please try again.",
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

  const loadSampleDomain = () => {
    setDomain("google.com");
  };

  const formatResult = () => {
    if (!result) return "";
    
    const lines = [
      `Domain: ${result.domain}`,
      `Age: ${result.age_years} years, ${result.age_months} months (${result.age_days} days)`,
      `Created: ${result.creation_date ? new Date(result.creation_date).toLocaleDateString() : 'Unknown'}`,
      `Updated: ${result.updated_date ? new Date(result.updated_date).toLocaleDateString() : 'Unknown'}`,
      `Expires: ${result.expiration_date ? new Date(result.expiration_date).toLocaleDateString() : 'Unknown'}`,
      `Registrar: ${result.registrar}`,
      `Status: ${result.status}`,
      `Days until expiry: ${result.days_until_expiry}`,
      `WHOIS Server: ${result.whois_server}`,
      result.name_servers?.length ? `Name Servers:\n${result.name_servers.map(ns => `• ${ns}`).join('\n')}` : ''
    ].filter(Boolean);
    
    return lines.join('\n');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "expiring_soon":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "expiring_soon":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeDisplay = () => {
    if (!result?.age_years && !result?.age_months) return "Unknown";
    
    const parts = [];
    if (result.age_years) parts.push(`${result.age_years} year${result.age_years === 1 ? '' : 's'}`);
    if (result.age_months) parts.push(`${result.age_months} month${result.age_months === 1 ? '' : 's'}`);
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Domain Age Checker
          </CardTitle>
          <CardDescription>
            Check domain registration age, expiration dates, and WHOIS information. 
            Get detailed timeline analysis with registrar and nameserver details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain-input" className="text-sm font-medium">
              Domain Name
            </Label>
            <Input
              id="domain-input"
              type="text"
              placeholder="Enter domain name (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCheck}
                disabled={isLoading || !domain.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Check Domain Age
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadSampleDomain}>
                Try Sample
              </Button>
            </div>
          </div>

          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              This tool retrieves domain registration information from WHOIS databases. 
              Some domains may have privacy protection enabled.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Domain Age Overview */}
              <Card className={`border-2 ${result.status === 'active' ? 'border-green-200 dark:border-green-800' : 
                result.status === 'expiring_soon' ? 'border-orange-200 dark:border-orange-800' : 
                'border-red-200 dark:border-red-800'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.status!)}
                      Domain Age Analysis
                    </CardTitle>
                    <Badge className={getStatusColor(result.status!)}>
                      {result.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      🕒 {getAgeDisplay()}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {result.domain}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {result.age_days} days old
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(formatResult(), "Domain information")}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Domain Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-red-400"></div>
                      
                      <div className="space-y-6">
                        {/* Creation Date */}
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 border-2 border-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-green-700 dark:text-green-300">Domain Created</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {result.creation_date ? formatDate(result.creation_date) : 'Unknown'}
                            </div>
                          </div>
                        </div>

                        {/* Last Updated */}
                        {result.updated_date && (
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-blue-700 dark:text-blue-300">Last Updated</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(result.updated_date)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expiration Date */}
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                            result.status === 'expired' 
                              ? 'bg-red-100 dark:bg-red-900/20 border-red-400'
                              : result.status === 'expiring_soon'
                              ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-400'
                              : 'bg-gray-100 dark:bg-gray-900/20 border-gray-400'
                          }`}>
                            <Calendar className={`h-4 w-4 ${
                              result.status === 'expired' ? 'text-red-600' :
                              result.status === 'expiring_soon' ? 'text-orange-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              result.status === 'expired' ? 'text-red-700 dark:text-red-300' :
                              result.status === 'expiring_soon' ? 'text-orange-700 dark:text-orange-300' :
                              'text-gray-700 dark:text-gray-300'
                            }`}>
                              Domain Expires
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {result.expiration_date ? formatDate(result.expiration_date) : 'Unknown'}
                              {result.days_until_expiry !== null && result.days_until_expiry >= 0 && (
                                <span className="ml-2 text-xs">
                                  ({result.days_until_expiry} days remaining)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Registration Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Registrar</div>
                        <div className="text-blue-600 dark:text-blue-400">{result.registrar}</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">WHOIS Server</div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm">{result.whois_server}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result.days_until_expiry !== null && (
                        <div className={`p-3 rounded-lg ${
                          result.days_until_expiry < 30 
                            ? 'bg-red-50 dark:bg-red-900/20' 
                            : result.days_until_expiry < 90
                            ? 'bg-orange-50 dark:bg-orange-900/20'
                            : 'bg-green-50 dark:bg-green-900/20'
                        }`}>
                          <div className={`text-sm font-medium ${
                            result.days_until_expiry < 30 
                              ? 'text-red-700 dark:text-red-300' 
                              : result.days_until_expiry < 90
                              ? 'text-orange-700 dark:text-orange-300'
                              : 'text-green-700 dark:text-green-300'
                          }`}>
                            Expiry Status
                          </div>
                          <div className={`${
                            result.days_until_expiry < 30 
                              ? 'text-red-600 dark:text-red-400' 
                              : result.days_until_expiry < 90
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {result.days_until_expiry} days remaining
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Name Servers */}
              {result.name_servers && result.name_servers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Name Servers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.name_servers.map((ns, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <code className="text-sm">{ns}</code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Demo Note */}
              {result.note && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> {result.note}
                  </AlertDescription>
                </Alert>
              )}

              {/* Domain Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Domain Management Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Set up auto-renewal to prevent accidental domain expiration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Renew domains at least 30 days before expiration to avoid service interruption</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Older domains often have better SEO authority and trust metrics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Check Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}