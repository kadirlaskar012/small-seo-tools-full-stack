import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Search, Shield, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdSenseBanResult {
  success: boolean;
  domain?: string;
  ban_status?: string;
  explanation?: string;
  http_status?: number;
  adsense_code_detected?: boolean;
  robots_txt_status?: string;
  google_indexed?: boolean;
  ad_related_scripts?: string[];
  publisher_id_found?: string | null;
  dns_resolution?: boolean;
  response_time?: number;
  detailed_analysis?: {
    html_content_size?: number;
    meta_tags_count?: number;
    external_scripts?: number;
    adsense_patterns?: string[];
  };
  recommendations?: string[];
  error?: string;
}

export function AdSenseBanChecker() {
  const [domain, setDomain] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [result, setResult] = useState<AdSenseBanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to check",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/adsense-ban-checker", {
        domain: domain.trim(),
        publisher_id: publisherId.trim() || null
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Analysis Complete",
          description: `AdSense ban check completed for ${data.domain}`,
        });
      }
    } catch (error) {
      console.error("AdSense ban check error:", error);
      setResult({
        success: false,
        error: "Failed to check AdSense ban status. Please try again.",
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

  const openGoogleSearch = () => {
    if (result?.domain) {
      const searchQuery = `site:${result.domain} adsense`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const loadSampleData = () => {
    setDomain("example.com");
    setPublisherId("ca-pub-1234567890123456");
  };

  const getBanStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'not banned':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Not Banned
        </Badge>;
      case 'banned':
      case 'likely banned':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Banned
        </Badge>;
      case 'inconclusive':
      case 'not detectable':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          Inconclusive
        </Badge>;
      default:
        return <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Unknown
        </Badge>;
    }
  };

  const exportResults = () => {
    if (!result) return;
    
    const exportData = {
      domain: result.domain,
      ban_status: result.ban_status,
      explanation: result.explanation,
      check_date: new Date().toISOString(),
      analysis: result.detailed_analysis,
      recommendations: result.recommendations
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adsense-ban-check-${result.domain}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Website Domain</Label>
              <Input
                id="domain"
                placeholder="example.com or https://example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher-id">AdSense Publisher ID (Optional)</Label>
              <Input
                id="publisher-id"
                placeholder="ca-pub-1234567890123456"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCheck}
              disabled={isLoading || !domain.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Checking AdSense Status...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check AdSense Ban Status
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadSampleData}>
              Try Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AdSense Ban Analysis: {result.domain}</span>
                    {getBanStatusBadge(result.ban_status || 'unknown')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">HTTP Status:</span>
                        <Badge variant={result.http_status === 200 ? "default" : "destructive"}>
                          {result.http_status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">AdSense Code:</span>
                        <Badge variant={result.adsense_code_detected ? "default" : "secondary"}>
                          {result.adsense_code_detected ? "Detected" : "Not Found"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Robots.txt:</span>
                        <Badge variant="outline">
                          {result.robots_txt_status || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Google Indexed:</span>
                        <Badge variant={result.google_indexed ? "default" : "secondary"}>
                          {result.google_indexed ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">DNS Resolution:</span>
                        <Badge variant={result.dns_resolution ? "default" : "destructive"}>
                          {result.dns_resolution ? "Success" : "Failed"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Response Time:</span>
                        <Badge variant="outline">
                          {result.response_time ? `${result.response_time}ms` : "N/A"}
                        </Badge>
                      </div>
                      {result.publisher_id_found && (
                        <div className="flex justify-between">
                          <span className="font-medium">Publisher ID:</span>
                          <Badge variant="default">
                            Found
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {result.explanation && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Analysis:</strong> {result.explanation}
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.ad_related_scripts && result.ad_related_scripts.length > 0 && (
                    <div>
                      <Label className="font-medium mb-2 block">Ad-Related Scripts Found:</Label>
                      <div className="flex flex-wrap gap-2">
                        {result.ad_related_scripts.map((script, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {script}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div>
                      <Label className="font-medium mb-2 block">Recommendations:</Label>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {result.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "Analysis results")}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Results
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={openGoogleSearch}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Google Search
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={exportResults}
                      className="flex-1"
                    >
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result.detailed_analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Technical Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">HTML Size:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {result.detailed_analysis.html_content_size ? 
                            `${(result.detailed_analysis.html_content_size / 1024).toFixed(1)} KB` : 
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Meta Tags:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {result.detailed_analysis.meta_tags_count || "0"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">External Scripts:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {result.detailed_analysis.external_scripts || "0"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">AdSense Patterns:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {result.detailed_analysis.adsense_patterns?.length || "0"} found
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
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