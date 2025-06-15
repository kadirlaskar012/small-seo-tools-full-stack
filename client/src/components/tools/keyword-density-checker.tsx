import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Globe, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  status: "optimal" | "low" | "high" | "keyword-stuffing";
}

interface KeywordAnalysis {
  totalWords: number;
  uniqueWords: number;
  totalCharacters: number;
  readabilityScore: number;
  keywords: KeywordData[];
  phrases: KeywordData[];
  stopWords: number;
  recommendations: string[];
}

export default function KeywordDensityChecker() {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [error, setError] = useState("");

  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "up", "about", "into", "through", "during", "before", "after", "above", "below",
    "between", "among", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can",
    "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "me", "him",
    "her", "us", "them", "my", "your", "his", "its", "our", "their"
  ]);

  const analyzeContent = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) {
      setError("Please provide content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clean and process text
      const cleanText = textToAnalyze.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const words = cleanText.split(' ').filter(word => word.length > 0);
      const totalWords = words.length;
      
      // Count word frequencies
      const wordCounts = new Map<string, number>();
      const phraseCounts = new Map<string, number>();
      
      words.forEach(word => {
        if (!stopWords.has(word)) {
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
      });

      // Generate 2-word and 3-word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
        if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
          phraseCounts.set(twoWordPhrase, (phraseCounts.get(twoWordPhrase) || 0) + 1);
        }
        
        if (i < words.length - 2) {
          const threeWordPhrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
          phraseCounts.set(threeWordPhrase, (phraseCounts.get(threeWordPhrase) || 0) + 1);
        }
      }

      // Process keywords
      const keywords: KeywordData[] = Array.from(wordCounts.entries())
        .map(([keyword, count]) => {
          const density = (count / totalWords) * 100;
          let status: KeywordData["status"] = "optimal";
          
          if (density > 5) status = "keyword-stuffing";
          else if (density > 3) status = "high";
          else if (density < 0.5) status = "low";
          
          return { keyword, count, density, status };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      // Process phrases
      const phrases: KeywordData[] = Array.from(phraseCounts.entries())
        .filter(([_, count]) => count >= 2)
        .map(([phrase, count]) => {
          const density = (count / totalWords) * 100;
          let status: KeywordData["status"] = "optimal";
          
          if (density > 2) status = "high";
          else if (density < 0.2) status = "low";
          
          return { keyword: phrase, count, density, status };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      // Calculate readability score (simplified Flesch Reading Ease)
      const sentences = textToAnalyze.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const syllableCount = words.reduce((acc, word) => acc + estimateSyllables(word), 0);
      const readabilityScore = Math.max(0, Math.min(100, 
        206.835 - (1.015 * (totalWords / sentences)) - (84.6 * (syllableCount / totalWords))
      ));

      // Generate recommendations
      const recommendations: string[] = [];
      
      if (targetKeyword) {
        const targetDensity = keywords.find(k => k.keyword.toLowerCase() === targetKeyword.toLowerCase())?.density || 0;
        if (targetDensity < 1) {
          recommendations.push(`Increase usage of target keyword "${targetKeyword}" (current density: ${targetDensity.toFixed(2)}%)`);
        } else if (targetDensity > 3) {
          recommendations.push(`Reduce usage of target keyword "${targetKeyword}" to avoid keyword stuffing (current density: ${targetDensity.toFixed(2)}%)`);
        }
      }

      const highDensityKeywords = keywords.filter(k => k.status === "keyword-stuffing" || k.status === "high");
      if (highDensityKeywords.length > 0) {
        recommendations.push(`Consider reducing usage of: ${highDensityKeywords.slice(0, 3).map(k => k.keyword).join(", ")}`);
      }

      if (readabilityScore < 50) {
        recommendations.push("Consider using shorter sentences and simpler words to improve readability");
      }

      if (totalWords < 300) {
        recommendations.push("Content is quite short. Consider expanding to at least 300 words for better SEO");
      }

      const mockAnalysis: KeywordAnalysis = {
        totalWords,
        uniqueWords: wordCounts.size,
        totalCharacters: textToAnalyze.length,
        readabilityScore: Math.round(readabilityScore),
        keywords,
        phrases,
        stopWords: words.length - totalWords + words.filter(w => stopWords.has(w)).length,
        recommendations
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const estimateSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const handleAnalyze = () => {
    if (activeTab === "text") {
      analyzeContent(content);
    } else {
      if (!url) {
        setError("Please enter a valid URL");
        return;
      }
      // In a real application, this would fetch content from the URL
      setError("URL analysis requires a backend service. Please use the text input instead.");
    }
  };

  const getStatusColor = (status: KeywordData["status"]) => {
    switch (status) {
      case "optimal": return "text-green-600";
      case "low": return "text-yellow-600";
      case "high": return "text-orange-600";
      case "keyword-stuffing": return "text-red-600";
    }
  };

  const getStatusBadge = (status: KeywordData["status"]) => {
    switch (status) {
      case "optimal": return <Badge className="bg-green-500 text-white">Optimal</Badge>;
      case "low": return <Badge className="bg-yellow-500 text-white">Low</Badge>;
      case "high": return <Badge className="bg-orange-500 text-white">High</Badge>;
      case "keyword-stuffing": return <Badge className="bg-red-500 text-white">Too High</Badge>;
    }
  };

  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: "Very Easy", color: "text-green-600" };
    if (score >= 80) return { level: "Easy", color: "text-green-500" };
    if (score >= 70) return { level: "Fairly Easy", color: "text-yellow-500" };
    if (score >= 60) return { level: "Standard", color: "text-orange-500" };
    if (score >= 50) return { level: "Fairly Difficult", color: "text-orange-600" };
    if (score >= 30) return { level: "Difficult", color: "text-red-500" };
    return { level: "Very Difficult", color: "text-red-600" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-200 dark:border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100 flex items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Keyword Density Checker
          </CardTitle>
          <p className="text-green-700 dark:text-green-300 text-lg">
            Analyze keyword density and optimize your content for better SEO performance
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "url")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text Content
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                URL Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="target-keyword" className="text-sm font-medium">
                  Target Keyword (optional)
                </Label>
                <Input
                  id="target-keyword"
                  placeholder="Enter your target keyword"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="content" className="text-sm font-medium">Content to Analyze</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="target-keyword-url" className="text-sm font-medium">
                  Target Keyword (optional)
                </Label>
                <Input
                  id="target-keyword-url"
                  placeholder="Enter your target keyword"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg mt-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.totalWords}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.uniqueWords}</div>
                <div className="text-sm text-gray-600">Unique Words</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.totalCharacters}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className={`text-2xl font-bold ${getReadabilityLevel(analysis.readabilityScore).color}`}>
                  {analysis.readabilityScore}
                </div>
                <div className="text-sm text-gray-600">Readability Score</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getReadabilityLevel(analysis.readabilityScore).level}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="phrases">Key Phrases</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Density Analysis</CardTitle>
                  <p className="text-sm text-gray-600">
                    Optimal keyword density is typically between 1-3%. Higher densities may be considered keyword stuffing.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{keyword.keyword}</span>
                            {getStatusBadge(keyword.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Count: {keyword.count}
                            </span>
                            <span className="text-sm text-gray-600">
                              Density: {keyword.density.toFixed(2)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(keyword.density, 5) * 20} 
                            className="mt-2 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phrases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Phrase Analysis</CardTitle>
                  <p className="text-sm text-gray-600">
                    Multi-word phrases that appear frequently in your content
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.phrases.map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">"{phrase.keyword}"</span>
                            {getStatusBadge(phrase.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Count: {phrase.count}
                            </span>
                            <span className="text-sm text-gray-600">
                              Density: {phrase.density.toFixed(2)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(phrase.density, 2) * 50} 
                            className="mt-2 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations.length > 0 ? (
                      analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Your content has good keyword distribution!</span>
                      </div>
                    )}
                    
                    {/* General SEO Tips */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">General SEO Tips:</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                          <span>Aim for 1-3% keyword density for your primary keyword</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                          <span>Use variations and synonyms of your target keyword</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                          <span>Focus on natural, readable content over keyword density</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                          <span>Include keywords in headers, title, and meta description</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Readability Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Readability Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Readability Score:</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getReadabilityLevel(analysis.readabilityScore).color}`}>
                          {analysis.readabilityScore}
                        </span>
                        <Badge variant="outline">
                          {getReadabilityLevel(analysis.readabilityScore).level}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={analysis.readabilityScore} className="h-2" />
                    <div className="text-sm text-gray-600">
                      <p>A score of 60-70 is considered good for most web content. Higher scores indicate easier readability.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}