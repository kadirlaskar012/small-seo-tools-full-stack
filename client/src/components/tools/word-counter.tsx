import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, FileText, Clock, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WordCountResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  averageWordsPerSentence: number;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<WordCountResult | null>(null);
  const { toast } = useToast();

  const countMutation = useMutation({
    mutationFn: async (data: { text: string }) => {
      const response = await apiRequest("/api/tools/word-counter", {
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
        description: "Failed to count words",
        variant: "destructive",
      });
    },
  });

  const handleCount = () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }
    countMutation.mutate({ text });
  };

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Statistics copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy statistics",
        variant: "destructive",
      });
    }
  };

  const formatStats = () => {
    if (!result) return "";
    return `Text Statistics:
Characters: ${result.characters}
Characters (no spaces): ${result.charactersNoSpaces}
Words: ${result.words}
Sentences: ${result.sentences}
Paragraphs: ${result.paragraphs}
Reading time: ${result.readingTime} minute(s)
Speaking time: ${result.speakingTime} minute(s)
Average words per sentence: ${result.averageWordsPerSentence}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Word Counter & Text Analyzer
          </CardTitle>
          <CardDescription>
            Count words, characters, sentences, and get detailed text statistics including reading time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-input">Text to Analyze</Label>
            <Textarea
              id="text-input"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value.trim()) {
                  countMutation.mutate({ text: e.target.value });
                } else {
                  setResult(null);
                }
              }}
              className="min-h-[200px]"
            />
          </div>

          <Button 
            onClick={handleCount} 
            disabled={countMutation.isPending || !text.trim()}
            className="w-full"
          >
            {countMutation.isPending ? "Analyzing..." : "Analyze Text"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Text Statistics
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(formatStats())}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Stats
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{result.characters}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{result.charactersNoSpaces}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">No Spaces</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{result.words}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{result.sentences}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Paragraphs</span>
                </div>
                <div className="text-xl font-bold">{result.paragraphs}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Reading Time</span>
                </div>
                <div className="text-xl font-bold">{result.readingTime} min</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Speaking Time</span>
                </div>
                <div className="text-xl font-bold">{result.speakingTime} min</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Avg Words/Sentence</span>
                </div>
                <div className="text-xl font-bold">{result.averageWordsPerSentence}</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Reading Statistics</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Average reading speed: 200 words per minute</p>
                <p>• Average speaking speed: 150 words per minute</p>
                <p>• Optimal sentence length: 15-20 words</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}