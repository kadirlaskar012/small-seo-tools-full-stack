import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RemoveDuplicateLines() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [stats, setStats] = useState({ removed: 0, remaining: 0, original: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const removeDuplicates = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const lines = inputText.split('\n');
      const originalCount = lines.length;
      
      const seen = new Set();
      const uniqueLines = [];

      for (const line of lines) {
        const processedLine = caseSensitive ? line : line.toLowerCase();
        
        if (!seen.has(processedLine)) {
          seen.add(processedLine);
          uniqueLines.push(line);
        }
      }

      const result = uniqueLines.join('\n');
      const removedCount = originalCount - uniqueLines.length;

      setOutputText(result);
      setStats({
        original: originalCount,
        removed: removedCount,
        remaining: uniqueLines.length
      });

      toast({
        title: "Duplicates Removed",
        description: `Removed ${removedCount} duplicate lines from ${originalCount} total lines.`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied",
        description: "Result copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadResult = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deduplicated-lines.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Remove Duplicate Lines</CardTitle>
          <CardDescription>
            Clean up your text by removing duplicate lines. Choose between case-sensitive or case-insensitive matching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div>
            <Label htmlFor="input-text" className="text-sm font-medium mb-2 block">
              Input Text
            </Label>
            <Textarea
              id="input-text"
              placeholder="Paste your text here with duplicate lines..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Switch
              id="case-sensitive"
              checked={caseSensitive}
              onCheckedChange={setCaseSensitive}
            />
            <Label htmlFor="case-sensitive" className="text-sm">
              Case-sensitive matching
            </Label>
          </div>

          {/* Process Button */}
          <Button 
            onClick={removeDuplicates}
            disabled={isProcessing || !inputText.trim()}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Remove Duplicates"}
          </Button>

          {/* Stats */}
          {stats.original > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Original Lines: {stats.original}
              </Badge>
              <Badge variant="destructive">
                Removed: {stats.removed}
              </Badge>
              <Badge variant="default">
                Remaining: {stats.remaining}
              </Badge>
            </div>
          )}

          {/* Output Section */}
          {outputText && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">
                  Cleaned Text
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadResult}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}