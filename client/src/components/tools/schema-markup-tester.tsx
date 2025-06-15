import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Globe, 
  Code, 
  Download, 
  Copy, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Eye,
  X,
  Database,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchemaItem {
  type: string;
  schema_type: string;
  content: Record<string, any>;
  errors: string[];
  warnings: string[];
}

interface ValidationResult {
  success: boolean;
  url?: string;
  page_title?: string;
  total_schemas: number;
  total_errors: number;
  total_warnings: number;
  processing_time: number;
  schemas: SchemaItem[];
  error?: string;
}

export function SchemaMarkupTester() {
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [expandedSchemas, setExpandedSchemas] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const validateFromUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to validate",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setResult(null);

    try {
      const response = await fetch("/api/tools/schema-tester/validate-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast({
          title: "Validation Complete",
          description: `Found ${data.total_schemas} schema(s) with ${data.total_errors} error(s)`
        });
      } else {
        throw new Error(data.error || "Validation failed");
      }
    } catch (error) {
      console.error("Schema validation error:", error);
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "Failed to validate schema markup",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateFromHtml = async () => {
    if (!htmlContent.trim()) {
      toast({
        title: "HTML Required",
        description: "Please enter HTML content to validate",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setResult(null);

    try {
      const response = await fetch("/api/tools/schema-tester/validate-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ html: htmlContent })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast({
          title: "Validation Complete",
          description: `Found ${data.total_schemas} schema(s) with ${data.total_errors} error(s)`
        });
      } else {
        throw new Error(data.error || "Validation failed");
      }
    } catch (error) {
      console.error("Schema validation error:", error);
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "Failed to validate schema markup",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const downloadReport = async (format: 'text' | 'json' = 'text') => {
    if (!result) return;

    try {
      const response = await fetch("/api/tools/schema-tester/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ result, format })
      });

      const data = await response.json();
      
      if (data.report) {
        const blob = new Blob([data.report], { 
          type: format === 'json' ? 'application/json' : 'text/plain' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schema-validation-${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Report Downloaded",
          description: `Schema validation report downloaded as ${format.toUpperCase()}`
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  };

  const copySchema = async (schema: SchemaItem) => {
    try {
      const schemaJson = JSON.stringify(schema.content, null, 2);
      await navigator.clipboard.writeText(schemaJson);
      toast({
        title: "Schema Copied",
        description: "Schema markup copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy schema",
        variant: "destructive"
      });
    }
  };

  const copyAllSchemas = async () => {
    if (!result) return;

    try {
      const allSchemas = result.schemas.map(schema => schema.content);
      const schemasJson = JSON.stringify(allSchemas, null, 2);
      await navigator.clipboard.writeText(schemasJson);
      toast({
        title: "All Schemas Copied",
        description: "All schema markup copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy schemas",
        variant: "destructive"
      });
    }
  };

  const toggleSchemaExpansion = (index: number) => {
    const newExpanded = new Set(expandedSchemas);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSchemas(newExpanded);
  };

  const getSchemaTypeIcon = (schemaType: string) => {
    switch (schemaType.toLowerCase()) {
      case 'json-ld': return <Database className="h-4 w-4 text-blue-500" />;
      case 'microdata': return <Code className="h-4 w-4 text-green-500" />;
      case 'rdfa': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return <Code className="h-4 w-4 text-gray-500" />;
    }
  };

  const getValidationBadge = (schema: SchemaItem) => {
    if (schema.errors.length > 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        {schema.errors.length} Error{schema.errors.length !== 1 ? 's' : ''}
      </Badge>;
    }
    if (schema.warnings.length > 0) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {schema.warnings.length} Warning{schema.warnings.length !== 1 ? 's' : ''}
      </Badge>;
    }
    return <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Valid
    </Badge>;
  };

  const getOverallStatus = () => {
    if (!result) return { status: "unknown", text: "Not validated", color: "gray" };
    
    if (result.total_errors > 0) {
      return { status: "error", text: "Validation Failed", color: "red" };
    }
    if (result.total_warnings > 0) {
      return { status: "warning", text: "Passed with Warnings", color: "yellow" };
    }
    if (result.total_schemas > 0) {
      return { status: "success", text: "All Valid", color: "green" };
    }
    return { status: "none", text: "No Schema Found", color: "orange" };
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const clearResults = () => {
    setResult(null);
    setExpandedSchemas(new Set());
  };

  const status = getOverallStatus();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Schema Markup Tester
        </h2>
        <p className="text-muted-foreground">
          Validate and analyze structured data from web pages or HTML content
        </p>
      </div>

      {/* Input Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Schema Validation Input
          </CardTitle>
          <CardDescription>
            Enter a URL or paste HTML content to extract and validate schema markup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                URL Analysis
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                HTML Content
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="url" className="sr-only">URL to validate</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isValidating && validateFromUrl()}
                    className="text-lg"
                  />
                </div>
                <Button 
                  onClick={validateFromUrl} 
                  disabled={isValidating || !url.trim()}
                  className="px-8"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Validate Schema
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="html" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="html">HTML Content or JSON-LD</Label>
                <Textarea
                  id="html"
                  placeholder="Paste HTML content or JSON-LD schema markup here..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <Button 
                onClick={validateFromHtml} 
                disabled={isValidating || !htmlContent.trim()}
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating Schema...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Validate Schema Markup
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {isValidating && (
            <div className="space-y-2 mt-4">
              <Progress value={undefined} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Extracting and validating schema markup... This may take a few seconds
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Validation Summary
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAllSchemas}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('text')}>
                    <FileText className="h-4 w-4 mr-2" />
                    TXT Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    JSON Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearResults}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className={`bg-gradient-to-r from-${status.color}-50 to-${status.color}-100 border-${status.color}-200`}>
                  <CardContent className="pt-4 text-center">
                    <div className={`text-2xl font-bold text-${status.color}-600`}>{status.text}</div>
                    <div className={`text-sm text-${status.color}-700`}>Overall Status</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.total_schemas}</div>
                    <div className="text-sm text-blue-700">Schemas Found</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{result.total_errors}</div>
                    <div className="text-sm text-red-700">Errors</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{result.total_warnings}</div>
                    <div className="text-sm text-yellow-700">Warnings</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {result.url && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Page URL:</strong> 
                      <div className="break-all text-muted-foreground">{result.url}</div>
                    </div>
                    <div>
                      <strong>Page Title:</strong> 
                      <div className="break-all text-muted-foreground">{result.page_title || "N/A"}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Processing Time: {formatTime(result.processing_time * 1000)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schemas Section */}
          {result.schemas && result.schemas.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Detected Schema Markup ({result.schemas.length})
                </CardTitle>
                <CardDescription>
                  Structured data found on the page with validation results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.schemas.map((schema, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getSchemaTypeIcon(schema.schema_type)}
                            <div>
                              <h4 className="font-semibold text-lg">{schema.type}</h4>
                              <p className="text-sm text-muted-foreground">{schema.schema_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getValidationBadge(schema)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copySchema(schema)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSchemaExpansion(index)}
                                >
                                  {expandedSchemas.has(index) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          </div>
                        </div>

                        {/* Errors and Warnings */}
                        {(schema.errors.length > 0 || schema.warnings.length > 0) && (
                          <div className="space-y-2 mt-3">
                            {schema.errors.map((error, errorIndex) => (
                              <Alert key={errorIndex} variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            ))}
                            {schema.warnings.map((warning, warningIndex) => (
                              <Alert key={warningIndex}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{warning}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}
                      </CardHeader>

                      <Collapsible open={expandedSchemas.has(index)}>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                              <h5 className="font-medium mb-2">Schema Content:</h5>
                              <pre className="text-sm overflow-auto max-h-96 bg-white dark:bg-gray-800 p-3 rounded border">
                                {JSON.stringify(schema.content, null, 2)}
                              </pre>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Schemas Found */}
          {result.schemas && result.schemas.length === 0 && (
            <Card className="shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Schema Markup Found</h3>
                    <p className="text-muted-foreground mt-2">
                      The page or content doesn't contain any detectable structured data markup.
                      Consider adding JSON-LD, Microdata, or RDFa markup to improve SEO.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}