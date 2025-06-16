import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, Download, Database, FileText, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSVConversionResult {
  success: boolean;
  json?: any;
  json_formatted?: string;
  row_count?: number;
  column_count?: number;
  columns?: string[];
  file_size_csv?: number;
  file_size_json?: number;
  processing_time?: number;
  error?: string;
}

export function CSVToJSONConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState("");
  const [result, setResult] = useState<CSVConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRawView, setShowRawView] = useState(false);
  const [prettifyJson, setPrettifyJson] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sampleCSV = `name,age,city,email
John Doe,28,New York,john@example.com
Jane Smith,32,Los Angeles,jane@example.com
Bob Johnson,25,Chicago,bob@example.com
Alice Brown,30,Houston,alice@example.com`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
      };
      reader.readAsText(file);
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('csv') || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
      };
      reader.readAsText(file);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const convertToJSON = async () => {
    const contentToConvert = csvContent || (selectedFile ? await selectedFile.text() : "");
    
    if (!contentToConvert.trim()) {
      toast({
        title: "No CSV Data",
        description: "Please upload a CSV file or paste CSV content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/csv-to-json-converter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_content: contentToConvert,
          prettify: prettifyJson
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Conversion Complete",
          description: `Converted ${data.row_count || 0} rows with ${data.column_count || 0} columns`,
        });
      }
    } catch (error) {
      console.error("CSV conversion error:", error);
      setResult({
        success: false,
        error: "Failed to convert CSV to JSON. Please try again.",
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
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadJSON = () => {
    if (!result?.json_formatted) return;

    const blob = new Blob([result.json_formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setCsvContent("");
    setResult(null);
    setShowRawView(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    setCsvContent(sampleCSV);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">CSV Input</Label>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm">Drop CSV file here or click to upload</p>
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div className="text-center text-gray-500">or</div>

              <div className="space-y-2">
                <Label htmlFor="csv-content">Paste CSV Content</Label>
                <Textarea
                  id="csv-content"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {/* Settings */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label htmlFor="prettify-json" className="text-sm font-medium">
                  Prettify JSON Output
                </Label>
                <Switch
                  id="prettify-json"
                  checked={prettifyJson}
                  onCheckedChange={setPrettifyJson}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={convertToJSON} 
                  disabled={(!csvContent && !selectedFile) || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Database className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Convert to JSON
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={loadSample}>
                  Sample CSV
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">JSON Output</Label>
                {result?.success && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRawView(!showRawView)}
                    >
                      {showRawView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showRawView ? "Pretty" : "Raw"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.json_formatted || "", "JSON")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadJSON}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {result ? (
                <>
                  {result.success ? (
                    <div className="space-y-4">
                      <Textarea
                        value={showRawView ? JSON.stringify(result.json) : result.json_formatted}
                        readOnly
                        className="min-h-[300px] font-mono text-xs"
                      />

                      {/* Statistics */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default">
                            Rows: {result.row_count || 0}
                          </Badge>
                          <Badge variant="outline">
                            Columns: {result.column_count || 0}
                          </Badge>
                          {result.processing_time && (
                            <Badge variant="outline">
                              {result.processing_time}ms
                            </Badge>
                          )}
                        </div>

                        {result.columns && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Columns:</Label>
                            <div className="flex flex-wrap gap-1">
                              {result.columns.map((column, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {column}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.file_size_csv && result.file_size_json && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">CSV Size:</span>
                              <p className="text-gray-600">{formatFileSize(result.file_size_csv)}</p>
                            </div>
                            <div>
                              <span className="font-medium">JSON Size:</span>
                              <p className="text-gray-600">{formatFileSize(result.file_size_json)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <strong>Conversion Failed:</strong> {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Converted JSON will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}