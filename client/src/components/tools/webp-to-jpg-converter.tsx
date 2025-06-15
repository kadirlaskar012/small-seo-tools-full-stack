import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Image as ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebPConversionResult {
  success: boolean;
  output_url?: string;
  original_format?: string;
  output_format?: string;
  original_size?: [number, number];
  output_size?: [number, number];
  file_size_original?: number;
  file_size_output?: number;
  compression_quality?: number;
  processing_time?: number;
  error?: string;
}

export function WebPToJPGConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WebPConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressionOptions = [
    { value: "low", label: "Low (95% quality)", quality: 95 },
    { value: "medium", label: "Medium (85% quality)", quality: 85 },
    { value: "high", label: "High (70% quality)", quality: 70 },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('webp') && !file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select a WebP image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('webp') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const convertToJPG = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a WebP image file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('compression_level', compressionLevel);
      
      const qualityOption = compressionOptions.find(opt => opt.value === compressionLevel);
      formData.append('quality', qualityOption?.quality.toString() || '85');

      const response = await fetch('/api/tools/webp-to-jpg-converter', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Conversion Complete",
          description: `WebP converted to JPG with ${data.compression_quality}% quality`,
        });
      }
    } catch (error) {
      console.error("WebP conversion error:", error);
      setResult({
        success: false,
        error: "Failed to convert WebP to JPG. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!result?.output_url) return;

    try {
      const response = await fetch(result.output_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the converted image",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setCompressionLevel("medium");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    toast({
      title: "Sample Image",
      description: "Please upload your own WebP image for conversion",
    });
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            WebP to JPG Converter
          </CardTitle>
          <CardDescription>
            Convert WebP images to JPG format with customizable compression settings. 
            Perfect for compatibility with older browsers and systems.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload and Settings Section */}
            <div className="space-y-4">
              <Label htmlFor="image-upload" className="text-base font-medium">Upload WebP Image</Label>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".webp,image/webp,image/*"
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
                      {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg">Drop a WebP image here or click to upload</p>
                      <p className="text-sm text-gray-500">Supports WebP files</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Compression Settings */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label className="text-sm font-medium">Compression Settings</Label>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="compression-level" className="text-sm">Compression Level</Label>
                    <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select compression" />
                      </SelectTrigger>
                      <SelectContent>
                        {compressionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xs text-gray-500">
                    {compressionLevel === "low" && "Best quality, larger file size"}
                    {compressionLevel === "medium" && "Good balance of quality and size"}
                    {compressionLevel === "high" && "Smaller file size, lower quality"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={convertToJPG} 
                  disabled={!selectedFile || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Convert to JPG
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
              <Label className="text-base font-medium">Conversion Result</Label>
              
              {result ? (
                <>
                  {result.success ? (
                    <div className="space-y-4">
                      {result.output_url && (
                        <div className="border rounded-lg p-4">
                          <img 
                            src={result.output_url} 
                            alt="Converted" 
                            className="w-full max-h-64 object-contain rounded-lg"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Original</Label>
                          <div className="space-y-1">
                            <Badge variant="outline">
                              {result.original_format?.toUpperCase() || 'WebP'}
                            </Badge>
                            {result.original_size && (
                              <Badge variant="outline">
                                {result.original_size[0]} × {result.original_size[1]}
                              </Badge>
                            )}
                            {result.file_size_original && (
                              <Badge variant="outline">
                                {formatFileSize(result.file_size_original)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Converted</Label>
                          <div className="space-y-1">
                            <Badge variant="default">
                              {result.output_format?.toUpperCase() || 'JPG'}
                            </Badge>
                            {result.output_size && (
                              <Badge variant="outline">
                                {result.output_size[0]} × {result.output_size[1]}
                              </Badge>
                            )}
                            {result.file_size_output && (
                              <Badge variant="outline">
                                {formatFileSize(result.file_size_output)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {result.compression_quality && (
                          <Badge variant="secondary">
                            Quality: {result.compression_quality}%
                          </Badge>
                        )}
                        {result.processing_time && (
                          <Badge variant="outline">
                            Processing: {result.processing_time}ms
                          </Badge>
                        )}
                        {result.file_size_original && result.file_size_output && (
                          <Badge variant="outline">
                            Size Change: {(((result.file_size_output - result.file_size_original) / result.file_size_original) * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>

                      <Button 
                        onClick={downloadImage}
                        className="w-full"
                        disabled={!result.output_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download JPG Image
                      </Button>
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
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Converted JPG will appear here</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}