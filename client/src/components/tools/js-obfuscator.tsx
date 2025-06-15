import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Shield, Code, AlertCircle, CheckCircle, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ObfuscateResult {
  success: boolean;
  obfuscated?: string;
  error?: string;
}

const OBFUSCATION_LEVELS = [
  {
    value: "basic",
    label: "Basic",
    description: "Simple variable and function name obfuscation",
    icon: "🔒",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Variable obfuscation + string encoding",
    icon: "🔐",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Full obfuscation with base64 encoding",
    icon: "🛡️",
  },
];

export function JSObfuscator() {
  const [code, setCode] = useState("");
  const [level, setLevel] = useState("basic");
  const [result, setResult] = useState<ObfuscateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleObfuscate = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter JavaScript code to obfuscate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/js-obfuscator", {
        code: code.trim(), 
        level
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Success",
          description: "JavaScript code obfuscated successfully",
        });
      }
    } catch (error) {
      console.error("JS obfuscation error:", error);
      setResult({
        success: false,
        error: "Failed to obfuscate JavaScript code. Please check your input.",
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

  const loadSampleCode = () => {
    setCode(`function calculateTotal(price, tax) {
  const discount = 0.1;
  const discountedPrice = price * (1 - discount);
  const totalWithTax = discountedPrice * (1 + tax);
  
  console.log("Calculating total for price:", price);
  
  return {
    originalPrice: price,
    discountedPrice: discountedPrice,
    finalTotal: totalWithTax
  };
}

const result = calculateTotal(100, 0.08);
document.getElementById("output").textContent = "Total: $" + result.finalTotal.toFixed(2);`);
    setLevel("medium");
  };

  const selectedLevel = OBFUSCATION_LEVELS.find(l => l.value === level);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            JavaScript Code Obfuscator
          </CardTitle>
          <CardDescription>
            Protect your JavaScript code by obfuscating variable names, function names, and strings. 
            Choose from multiple obfuscation levels for different security needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="obfuscation-level">Obfuscation Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBFUSCATION_LEVELS.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value}>
                      <div className="flex items-center gap-2">
                        <span>{lvl.icon}</span>
                        <div>
                          <div>{lvl.label}</div>
                          <div className="text-xs text-gray-500">{lvl.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Security Level</Label>
              <div className="flex items-center gap-2">
                {selectedLevel && (
                  <>
                    <Badge 
                      variant={level === "basic" ? "secondary" : level === "medium" ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      <span>{selectedLevel.icon}</span>
                      {selectedLevel.label}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedLevel.description}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="js-code">JavaScript Code</Label>
            <Textarea
              id="js-code"
              placeholder="Enter your JavaScript code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleObfuscate}
              disabled={isLoading || !code.trim()}
              className="flex-1"
            >
              {isLoading ? "Obfuscating..." : (
                <>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Obfuscate Code
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadSampleCode}>
              Try Sample
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Obfuscation provides security through obscurity and may affect performance. 
              Test thoroughly before using in production environments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Obfuscated Code */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Obfuscated Code
                      <Badge variant="outline" className="ml-2">
                        {selectedLevel?.label} Level
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.obfuscated!, "Obfuscated code")}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                      <code>{result.obfuscated}</code>
                    </pre>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="font-medium text-blue-700 dark:text-blue-300">Original Size</div>
                      <div className="text-blue-600 dark:text-blue-400">
                        {code.length.toLocaleString()} characters
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-medium text-green-700 dark:text-green-300">Obfuscated Size</div>
                      <div className="text-green-600 dark:text-green-400">
                        {result.obfuscated!.length.toLocaleString()} characters
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="font-medium text-purple-700 dark:text-purple-300">Size Change</div>
                      <div className="text-purple-600 dark:text-purple-400">
                        {((result.obfuscated!.length / code.length - 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Usage Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="font-medium">HTML Implementation:</Label>
                      <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mt-1 text-xs">
{`<script>
${result.obfuscated}
</script>`}
                      </pre>
                    </div>

                    <div>
                      <Label className="font-medium">External File:</Label>
                      <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mt-1 text-xs">
{`<!-- Save obfuscated code to script.js -->
<script src="script.js"></script>`}
                      </pre>
                    </div>

                    {level === "advanced" && (
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Advanced obfuscation</strong> uses eval() and base64 encoding. 
                          Some security policies may block this. Test in your target environment.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Security Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">Basic</Badge>
                      <div>
                        <div className="font-medium">Variable & Function Obfuscation</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Renames variables and functions to short, meaningless names. Good for basic protection.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">Medium</Badge>
                      <div>
                        <div className="font-medium">String Encoding</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Adds base64 encoding for strings. Makes reverse engineering more difficult.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">Advanced</Badge>
                      <div>
                        <div className="font-medium">Full Code Encoding</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Entire code is base64 encoded and executed via eval(). Highest obfuscation level.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Obfuscation Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}