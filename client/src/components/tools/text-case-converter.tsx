import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Type } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CaseConversionResult {
  original: string;
  converted: string;
  conversion: string;
  length: number;
  wordCount: number;
}

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [conversion, setConversion] = useState("uppercase");
  const [result, setResult] = useState<CaseConversionResult | null>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (data: { text: string; conversion: string }) => {
      const response = await apiRequest("/api/tools/text-case-converter", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to convert text case",
        variant: "destructive",
      });
    },
  });

  const handleConvert = () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }
    convertMutation.mutate({ text, conversion });
  };

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Text Case Converter
          </CardTitle>
          <CardDescription>
            Convert text between different case formats - uppercase, lowercase, title case, camelCase, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-input">Text to Convert</Label>
            <Textarea
              id="text-input"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="conversion-type">Conversion Type</Label>
            <Select value={conversion} onValueChange={setConversion}>
              <SelectTrigger>
                <SelectValue placeholder="Select conversion type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                <SelectItem value="lowercase">lowercase</SelectItem>
                <SelectItem value="title">Title Case</SelectItem>
                <SelectItem value="sentence">Sentence case</SelectItem>
                <SelectItem value="camel">camelCase</SelectItem>
                <SelectItem value="pascal">PascalCase</SelectItem>
                <SelectItem value="snake">snake_case</SelectItem>
                <SelectItem value="kebab">kebab-case</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleConvert} 
            disabled={convertMutation.isPending || !text.trim()}
            className="w-full"
          >
            {convertMutation.isPending ? "Converting..." : "Convert Text"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>
              Converted from {result.conversion} format • {result.length} characters • {result.wordCount} words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Original Text</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-mono break-all">{result.original}</p>
              </div>
            </div>

            <div>
              <Label>Converted Text</Label>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md relative">
                <p className="text-sm font-mono break-all">{result.converted}</p>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(result.converted)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadAsFile(result.converted, `converted-text-${result.conversion}.txt`)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-2xl font-bold text-blue-600">{result.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Characters</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-2xl font-bold text-green-600">{result.wordCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Words</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-2xl font-bold text-purple-600">{result.conversion}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Format</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}