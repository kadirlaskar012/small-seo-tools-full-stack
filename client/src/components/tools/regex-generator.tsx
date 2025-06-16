import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Wand2, TestTube, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RegexResult {
  success: boolean;
  regex?: string;
  matches?: string[];
  test_string?: string;
  error?: string;
}

const PATTERN_TYPES = [
  { value: "email", label: "Email Address", example: "john@example.com" },
  { value: "phone", label: "Phone Number", example: "+1-234-567-8900" },
  { value: "url", label: "URL", example: "https://example.com" },
  { value: "ipv4", label: "IPv4 Address", example: "192.168.1.1" },
  { value: "date", label: "Date (YYYY-MM-DD)", example: "2024-01-15" },
  { value: "time", label: "Time (HH:MM)", example: "14:30" },
  { value: "number", label: "Numbers", example: "123" },
  { value: "word", label: "Words", example: "hello" },
  { value: "custom", label: "Custom Pattern", example: "" },
];

export function RegexGenerator() {
  const [selectedPattern, setSelectedPattern] = useState("");
  const [customPattern, setCustomPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [options, setOptions] = useState({
    case_insensitive: false,
    multiline: false,
  });
  const [result, setResult] = useState<RegexResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const pattern = selectedPattern === "custom" ? customPattern : selectedPattern;
    
    if (!pattern) {
      toast({
        title: "Error",
        description: "Please select a pattern type or enter a custom pattern",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/regex-generator", {
        pattern, 
        options, 
        testString: testString.trim() 
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Success",
          description: "Regex pattern generated successfully",
        });
      }
    } catch (error) {
      console.error("Regex generation error:", error);
      setResult({
        success: false,
        error: "Failed to generate regex pattern. Please try again.",
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

  const loadSampleData = () => {
    setSelectedPattern("email");
    setTestString("Contact us at john@example.com or support@company.org for help");
    setOptions({ case_insensitive: false, multiline: false });
  };

  const selectedPatternInfo = PATTERN_TYPES.find(p => p.value === selectedPattern);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pattern-type">Pattern Type</Label>
              <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pattern type" />
                </SelectTrigger>
                <SelectContent>
                  {PATTERN_TYPES.map((pattern) => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPatternInfo && selectedPatternInfo.example && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Example: {selectedPatternInfo.example}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="case-insensitive"
                    checked={options.case_insensitive}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, case_insensitive: !!checked })
                    }
                  />
                  <Label htmlFor="case-insensitive" className="text-sm">
                    Case insensitive
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiline"
                    checked={options.multiline}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, multiline: !!checked })
                    }
                  />
                  <Label htmlFor="multiline" className="text-sm">
                    Multiline mode
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {selectedPattern === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-pattern">Custom Pattern</Label>
              <Input
                id="custom-pattern"
                placeholder="Enter your custom regex pattern..."
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                className="font-mono"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="test-string">Test String (Optional)</Label>
            <Textarea
              id="test-string"
              placeholder="Enter text to test your regex pattern against..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (!selectedPattern && !customPattern)}
              className="flex-1"
            >
              {isLoading ? "Generating..." : "Generate Regex"}
            </Button>
            <Button variant="outline" onClick={loadSampleData}>
              Try Sample
            </Button>
          </div>

          <Alert>
            <TestTube className="h-4 w-4" />
            <AlertDescription>
              Enter a test string to see real-time matches. The generator will show you exactly 
              what your regex pattern captures from the input text.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <>
              {/* Generated Regex */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Generated Regex Pattern
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.regex!, "Regex pattern")}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <code className="text-lg font-mono text-blue-600 dark:text-blue-400 break-all">
                      {result.regex}
                    </code>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {options.case_insensitive && (
                      <Badge variant="secondary">Case Insensitive</Badge>
                    )}
                    {options.multiline && (
                      <Badge variant="secondary">Multiline</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Test Results */}
              {result.test_string && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-blue-500" />
                      Test Results
                      <Badge variant="outline">
                        {result.matches?.length || 0} matches
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Test String:</Label>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mt-1">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {result.test_string}
                        </pre>
                      </div>
                    </div>

                    {result.matches && result.matches.length > 0 ? (
                      <div>
                        <Label className="text-sm font-medium">Matches Found:</Label>
                        <div className="space-y-2 mt-1">
                          {result.matches.map((match, index) => (
                            <div
                              key={index}
                              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-green-700 dark:text-green-300">
                                  Match {index + 1}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(match, `Match ${index + 1}`)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <code className="block mt-2 font-mono text-sm">{match}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No matches found in the test string. Try adjusting your pattern or test data.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Usage Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">JavaScript:</Label>
                      <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1 text-xs">
{`const regex = /${result.regex}/${options.case_insensitive ? 'i' : ''}${options.multiline ? 'm' : ''};
const matches = text.match(regex);`}
                      </pre>
                    </div>
                    <div>
                      <Label className="font-medium">Python:</Label>
                      <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1 text-xs">
{`import re
pattern = r"${result.regex}"
matches = re.findall(pattern, text${options.case_insensitive || options.multiline ? `, flags=re.${options.case_insensitive ? 'IGNORECASE' : ''}${options.case_insensitive && options.multiline ? '|re.' : ''}${options.multiline ? 'MULTILINE' : ''}` : ''})`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Generation Failed:</strong> {result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}