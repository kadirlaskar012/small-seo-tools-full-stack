import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Upload, FileImage, Eye, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  word_count?: number;
  char_count?: number;
  language?: string;
  processing_time?: number;
  image_info?: {
    format: string;
    size: [number, number];
    mode: string;
  };
  error?: string;
}

export function ImageToTextOCR() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setExtractedText("");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setExtractedText("");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processOCR = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/tools/image-to-text-ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.text) {
        setExtractedText(data.text);
        toast({
          title: "OCR Complete",
          description: `Extracted ${data.word_count || 0} words with ${data.confidence || 0}% confidence`,
        });
      }
    } catch (error) {
      console.error("OCR processing error:", error);
      setResult({
        success: false,
        error: "Failed to process image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    // In a real app, you'd load a sample image
    toast({
      title: "Sample Image",
      description: "Please upload your own image for OCR processing",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="image-upload" className="text-base font-medium">Upload Image</Label>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg">Drop an image here or click to upload</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG, JPEG files</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={processOCR} 
                  disabled={!selectedFile || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Eye className="h-4 w-4 mr-2 animate-spin" />
                      Processing OCR...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Extract Text
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={loadSample}>
                  Sample
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Extracted Text</Label>
              
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                className="min-h-[200px] font-mono text-sm"
                readOnly={!result?.success}
              />

              {result && (
                <>
                  {result.success ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">
                          Confidence: {result.confidence || 0}%
                        </Badge>
                        <Badge variant="outline">
                          Words: {result.word_count || 0}
                        </Badge>
                        <Badge variant="outline">
                          Characters: {result.char_count || 0}
                        </Badge>
                        {result.language && (
                          <Badge variant="outline">
                            Language: {result.language}
                          </Badge>
                        )}
                      </div>

                      {result.image_info && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Image: {result.image_info.format} • 
                          {result.image_info.size[0]} × {result.image_info.size[1]} • 
                          {result.image_info.mode}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={copyToClipboard}
                          disabled={!extractedText}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Text
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={downloadText}
                          disabled={!extractedText}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <strong>OCR Failed:</strong> {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}