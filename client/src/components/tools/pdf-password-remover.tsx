import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  Unlock, 
  Lock, 
  FileText, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFRemovalResult {
  success: boolean;
  output_url?: string;
  file_size_original?: number;
  file_size_output?: number;
  pages_count?: number;
  processing_time?: number;
  security_info?: {
    was_password_protected: boolean;
    had_user_password: boolean;
    had_owner_password: boolean;
    permissions_removed: string[];
  };
  error?: string;
  message?: string;
}

export function PDFPasswordRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PDFRemovalResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a PDF file smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setResult(null);
      setPassword("");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setResult(null);
      setPassword("");
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removePassword = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingStage("Starting PDF analysis...");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      if (password.trim()) {
        formData.append('password', password.trim());
      }

      // Enhanced progress tracking with stages
      const stages = [
        "Uploading PDF file...",
        "Analyzing PDF security...", 
        "Attempting provided password...",
        "Trying common passwords...",
        "Testing numerical patterns...",
        "Finalizing unlocked PDF..."
      ];

      let currentStage = 0;
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          const newProgress = prev + 15;
          if (newProgress > currentStage * 15 && currentStage < stages.length - 1) {
            currentStage++;
            setProcessingStage(stages[currentStage]);
          }
          return newProgress;
        });
      }, 400);

      const response = await fetch('/api/tools/pdf-password-remover', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Password Removed Successfully",
          description: `PDF unlocked! ${data.pages_count} pages processed in ${data.processing_time}s`,
        });
      } else {
        toast({
          title: "Password Removal Failed",
          description: data.error || "Failed to remove password protection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("PDF password removal error:", error);
      setResult({
        success: false,
        error: "Network error occurred. Please try again.",
      });
      toast({
        title: "Processing Error",
        description: "Failed to process PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const downloadUnlockedPDF = () => {
    if (result?.output_url) {
      const link = document.createElement('a');
      link.href = result.output_url;
      link.download = `unlocked_${selectedFile?.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your unlocked PDF is being downloaded.",
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setResult(null);
    setPassword("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
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
            {/* Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="pdf-upload" className="text-base font-medium">Upload PDF File</Label>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-red-500" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-lg font-medium">Drop PDF file here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (Max 50MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Password Input */}
              {selectedFile && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    PDF Password (if known)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter PDF password (optional)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty if you don't know the password. We'll attempt automatic removal.
                  </p>
                </div>
              )}

              {/* Process Button */}
              {selectedFile && (
                <Button
                  onClick={removePassword}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing PDF...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Remove Password Protection
                    </>
                  )}
                </Button>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {uploadProgress < 100 ? "Uploading..." : "Processing PDF..."}
                  </p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Processing Results</Label>
              
              {!result && !isProcessing && (
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                  <Shield className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Results will appear here</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  {result.success ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <strong>Password Removed Successfully!</strong>
                        <br />
                        {result.message || "PDF is now unlocked and ready for download."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        <strong>Password Removal Failed</strong>
                        <br />
                        {result.error || "Unable to remove password protection."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.success && (
                    <div className="space-y-3">
                      {/* File Info */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          PDF Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Pages:</span>
                            <p className="font-medium">{result.pages_count || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Processing Time:</span>
                            <p className="font-medium">{result.processing_time || 0}s</p>
                          </div>
                          {result.file_size_original && (
                            <div>
                              <span className="text-muted-foreground">Original Size:</span>
                              <p className="font-medium">{formatFileSize(result.file_size_original)}</p>
                            </div>
                          )}
                          {result.file_size_output && (
                            <div>
                              <span className="text-muted-foreground">Output Size:</span>
                              <p className="font-medium">{formatFileSize(result.file_size_output)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Security Info */}
                      {result.security_info && (
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              {result.security_info.was_password_protected ? (
                                <Lock className="h-3 w-3 text-red-500" />
                              ) : (
                                <Unlock className="h-3 w-3 text-green-500" />
                              )}
                              <span>
                                {result.security_info.was_password_protected 
                                  ? "Was password protected" 
                                  : "No password protection found"}
                              </span>
                            </div>
                            {result.security_info.permissions_removed && result.security_info.permissions_removed.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">Restrictions removed:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {result.security_info.permissions_removed.map((permission, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Download Button */}
                      <Button onClick={downloadUnlockedPDF} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Unlocked PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">How PDF Password Removal Works</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p>• <strong>Owner passwords:</strong> Removed automatically to unlock editing restrictions</p>
                  <p>• <strong>User passwords:</strong> Require the correct password for removal</p>
                  <p>• <strong>Security:</strong> Processing happens server-side, files are automatically deleted</p>
                  <p>• <strong>Supported:</strong> All PDF versions with standard encryption methods</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}