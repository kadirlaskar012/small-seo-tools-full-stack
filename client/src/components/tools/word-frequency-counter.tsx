import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WordFrequencyCounter() {
  const [inputText, setInputText] = useState("");
  const [wordFrequency, setWordFrequency] = useState<Array<{word: string, count: number}>>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const analyzeWordFrequency = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Clean and normalize text
      const cleanText = inputText
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove punctuation
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();

      if (!cleanText) {
        toast({
          title: "No Words Found",
          description: "The text contains no analyzable words.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Split into words and count frequency
      const words = cleanText.split(' ').filter(word => word.length > 0);
      const frequency: Record<string, number> = {};

      words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
      });

      // Convert to sorted array
      const sortedFrequency = Object.entries(frequency)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);

      setWordFrequency(sortedFrequency);
      setTotalWords(words.length);
      setUniqueWords(sortedFrequency.length);

      toast({
        title: "Analysis Complete",
        description: `Found ${sortedFrequency.length} unique words from ${words.length} total words.`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to analyze the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResults = async () => {
    const resultText = wordFrequency
      .map(item => `${item.word}: ${item.count}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: "Copied",
        description: "Word frequency results copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      'Word,Frequency',
      ...wordFrequency.map(item => `"${item.word}",${item.count}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-frequency.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Word frequency data saved as CSV file.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Word Frequency Counter</CardTitle>
          <CardDescription>
            Analyze text to count how many times each unique word appears. Results are sorted by frequency in descending order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div>
            <label htmlFor="input-text" className="text-sm font-medium mb-2 block">
              Text to Analyze
            </label>
            <Textarea
              id="input-text"
              placeholder="Paste your text, paragraph, or document here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] text-sm"
            />
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeWordFrequency}
            disabled={isProcessing || !inputText.trim()}
            className="w-full"
          >
            {isProcessing ? "Analyzing..." : "Analyze Word Frequency"}
          </Button>

          {/* Stats */}
          {totalWords > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">
                Total Words: {totalWords}
              </Badge>
              <Badge variant="secondary">
                Unique Words: {uniqueWords}
              </Badge>
            </div>
          )}

          {/* Results Section */}
          {wordFrequency.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Word Frequency Results</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyResults}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadCSV}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download CSV
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Word</TableHead>
                      <TableHead className="w-24">Frequency</TableHead>
                      <TableHead className="w-24">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wordFrequency.map((item, index) => (
                      <TableRow key={item.word}>
                        <TableCell className="font-mono text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-mono">
                          {item.word}
                        </TableCell>
                        <TableCell className="font-mono text-center">
                          {item.count}
                        </TableCell>
                        <TableCell className="font-mono text-center">
                          {((item.count / totalWords) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}