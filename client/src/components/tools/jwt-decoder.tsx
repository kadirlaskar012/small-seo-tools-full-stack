import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface JWTDecodeResult {
  success: boolean;
  header?: any;
  payload?: any;
  error?: string;
}

export function JWTDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JWTDecodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const { toast } = useToast();

  const handleDecode = async () => {
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter a JWT token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/jwt-decoder", {
        token: token.trim()
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Success",
          description: "JWT token decoded successfully",
        });
      }
    } catch (error) {
      console.error("JWT decode error:", error);
      setResult({
        success: false,
        error: "Failed to decode JWT token. Please check your input.",
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

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            JWT Token Decoder
          </CardTitle>
          <CardDescription>
            Decode and inspect JWT (JSON Web Token) header and payload without verification. 
            Perfect for debugging and understanding token structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jwt-input" className="text-sm font-medium">
              JWT Token
            </Label>
            <div className="relative">
              <Input
                id="jwt-input"
                type={showToken ? "text" : "password"}
                placeholder="Paste your JWT token here..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pr-10 font-mono text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDecode}
                disabled={isLoading || !token.trim()}
                className="flex-1"
              >
                {isLoading ? "Decoding..." : "Decode JWT"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setToken(sampleJWT)}
                className="whitespace-nowrap"
              >
                Try Sample
              </Button>
            </div>
          </div>

          {/* JWT Structure Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              JWT tokens consist of three parts separated by dots: <Badge variant="outline">Header</Badge>{" "}
              <Badge variant="outline">Payload</Badge> <Badge variant="outline">Signature</Badge>
              <br />
              This tool decodes the header and payload without signature verification.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Header Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Header
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formatJSON(result.header), "Header")}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                    <code className="language-json">{formatJSON(result.header)}</code>
                  </pre>
                </CardContent>
              </Card>

              {/* Payload Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Payload
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formatJSON(result.payload), "Payload")}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                    <code className="language-json">{formatJSON(result.payload)}</code>
                  </pre>
                </CardContent>
              </Card>

              {/* Claims Info */}
              {result.payload && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Common Claims Detected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.payload.iss && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">iss</Badge>
                          <span className="text-sm">Issuer: {result.payload.iss}</span>
                        </div>
                      )}
                      {result.payload.sub && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">sub</Badge>
                          <span className="text-sm">Subject: {result.payload.sub}</span>
                        </div>
                      )}
                      {result.payload.exp && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">exp</Badge>
                          <span className="text-sm">
                            Expires: {new Date(result.payload.exp * 1000).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {result.payload.iat && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">iat</Badge>
                          <span className="text-sm">
                            Issued: {new Date(result.payload.iat * 1000).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Decode Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}