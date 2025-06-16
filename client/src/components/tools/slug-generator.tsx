import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SlugGenerator() {
  const [inputText, setInputText] = useState("");
  const [slug, setSlug] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generateSlug = (text: string) => {
    if (!text.trim()) {
      setSlug("");
      return "";
    }

    // Convert to lowercase and handle special cases
    const processedSlug = text
      .toLowerCase()
      .trim()
      // Replace accented characters with ASCII equivalents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace special characters and punctuation with spaces
      .replace(/[^\w\s-]/g, ' ')
      // Replace multiple spaces/hyphens with single space
      .replace(/[\s-]+/g, ' ')
      // Trim and replace spaces with hyphens
      .trim()
      .replace(/\s+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');

    return processedSlug;
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    const newSlug = generateSlug(value);
    setSlug(newSlug);
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to convert to a slug.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const newSlug = generateSlug(inputText);
      setSlug(newSlug);

      if (newSlug) {
        toast({
          title: "Slug Generated",
          description: "SEO-friendly slug created successfully.",
        });
      } else {
        toast({
          title: "No Valid Characters",
          description: "The input contains no characters that can be converted to a slug.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate slug. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!slug) {
      toast({
        title: "Nothing to Copy",
        description: "Generate a slug first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(slug);
      toast({
        title: "Copied",
        description: "Slug copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputText("");
    setSlug("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slug Generator</CardTitle>
          <CardDescription>
            Convert any text into a clean, SEO-friendly slug. Perfect for URLs, file names, and identifiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div>
            <label htmlFor="input-text" className="text-sm font-medium mb-2 block">
              Text to Convert
            </label>
            <Input
              id="input-text"
              placeholder="Enter your text here... e.g., 'Hello World! This is Replit.'"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1"
            >
              {isProcessing ? "Generating..." : "Generate Slug"}
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={!inputText && !slug}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Real-time Preview */}
          {inputText && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Live Preview:</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border">
                <div className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {slug || <span className="text-gray-400">Enter text to see slug preview</span>}
                </div>
              </div>
            </div>
          )}

          {/* Output Section */}
          {slug && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Generated Slug
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <div className="font-mono text-lg text-green-700 dark:text-green-300 break-all">
                  {slug}
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">
                  Length: {slug.length} characters
                </Badge>
                <Badge variant="outline">
                  Hyphens: {(slug.match(/-/g) || []).length}
                </Badge>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="font-medium">Examples:</div>
            <div>"Hello World!" → hello-world</div>
            <div>"This is a Test Article" → this-is-a-test-article</div>
            <div>"SEO & Marketing Tips" → seo-marketing-tips</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}