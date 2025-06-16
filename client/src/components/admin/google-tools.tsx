import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Globe, BarChart3, DollarSign } from "lucide-react";

export default function GoogleTools() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [analyticsId, setAnalyticsId] = useState("");
  const [adsenseId, setAdsenseId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const { data: settings = [] } = useQuery({
    queryKey: ["/api/site-settings"],
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      await apiRequest("/api/site-settings", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Settings Updated",
        description: "Google tools configuration has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveAnalytics = () => {
    if (!analyticsId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid Google Analytics ID",
        variant: "destructive",
      });
      return;
    }
    updateSettingMutation.mutate({ key: "google_analytics_id", value: analyticsId.trim() });
  };

  const handleSaveAdsense = () => {
    if (!adsenseId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid Google AdSense ID",
        variant: "destructive",
      });
      return;
    }
    updateSettingMutation.mutate({ key: "google_adsense_id", value: adsenseId.trim() });
  };

  const handleSaveVerification = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }
    updateSettingMutation.mutate({ key: "google_verification", value: verificationCode.trim() });
  };

  // Load existing values
  const currentAnalytics = settings.find(s => s.key === "google_analytics_id")?.value || "";
  const currentAdsense = settings.find(s => s.key === "google_adsense_id")?.value || "";
  const currentVerification = settings.find(s => s.key === "google_verification")?.value || "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Google Tools Integration</h2>
        <p className="text-muted-foreground">
          Configure Google Analytics, AdSense, and domain verification for your website.
        </p>
      </div>

      {/* Google Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Google Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="analytics-id">Google Analytics ID</Label>
            <Input
              id="analytics-id"
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              value={analyticsId || currentAnalytics}
              onChange={(e) => setAnalyticsId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your Google Analytics measurement ID (e.g., G-XXXXXXXXXX)
            </p>
          </div>
          <Button 
            onClick={handleSaveAnalytics}
            disabled={updateSettingMutation.isPending}
          >
            {updateSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Analytics ID
          </Button>
          {currentAnalytics && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Current Analytics ID: <code className="font-mono">{currentAnalytics}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Google AdSense */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Google AdSense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adsense-id">Google AdSense ID</Label>
            <Input
              id="adsense-id"
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              value={adsenseId || currentAdsense}
              onChange={(e) => setAdsenseId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your Google AdSense publisher ID (e.g., ca-pub-XXXXXXXXXXXXXXXX)
            </p>
          </div>
          <Button 
            onClick={handleSaveAdsense}
            disabled={updateSettingMutation.isPending}
          >
            {updateSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save AdSense ID
          </Button>
          {currentAdsense && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Current AdSense ID: <code className="font-mono">{currentAdsense}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Google Domain Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Verification Meta Tag</Label>
            <Textarea
              id="verification-code"
              placeholder='<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />'
              value={verificationCode || currentVerification}
              onChange={(e) => setVerificationCode(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Paste the entire meta tag provided by Google Search Console
            </p>
          </div>
          <Button 
            onClick={handleSaveVerification}
            disabled={updateSettingMutation.isPending}
          >
            {updateSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Verification Code
          </Button>
          {currentVerification && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Domain verification is configured and active
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Important Notes:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• All changes take effect immediately on your live website</li>
          <li>• Google Analytics tracking will start collecting data once configured</li>
          <li>• AdSense ads will appear based on your AdSense account settings</li>
          <li>• Domain verification helps with Search Console integration</li>
        </ul>
      </div>
    </div>
  );
}