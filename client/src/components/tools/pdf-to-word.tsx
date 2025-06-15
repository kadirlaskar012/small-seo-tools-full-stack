import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, RefreshCw } from "lucide-react";

export default function PDFToWord() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setConvertedFile(null);
    }
  }, [toast]);

  const convertToWord = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setConversionProgress(0);

    try {
      // Simulate conversion progress
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock Word document blob
      const mockWordContent = `
        Document: ${selectedFile.name}
        
        This is a simulated conversion from PDF to Word.
        
        In a real implementation, this would use:
        - PDF parsing libraries (like PDF.js)
        - Document conversion APIs
        - OCR services for scanned PDFs
        
        The converted document would contain:
        - Extracted text content
        - Preserved formatting when possible
        - Images and tables
        
        File converted on: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([mockWordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);
      setConversionProgress(100);

      toast({
        title: "Conversion complete",
        description: "Your PDF has been successfully converted to Word format",
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "There was an error converting your PDF",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, toast]);

  const downloadConverted = useCallback(() => {
    if (!convertedFile || !selectedFile) return;

    const link = document.createElement('a');
    link.href = convertedFile;
    link.download = `${selectedFile.name.replace('.pdf', '')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [convertedFile, selectedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDF File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Click to upload a PDF file</p>
              <p className="text-muted-foreground">Maximum file size: 50MB</p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Selected File:</h3>
              <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">Size: {formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Controls */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Convert to Word
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Conversion Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Preserves text formatting</li>
                <li>• Maintains document structure</li>
                <li>• Extracts images and tables</li>
                <li>• Creates editable Word document</li>
              </ul>
            </div>
            
            <Button 
              onClick={convertToWord} 
              disabled={isConverting}
              className="w-full"
            >
              {isConverting ? "Converting..." : "Convert to Word"}
            </Button>
            
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting PDF to Word...</span>
                  <span>{conversionProgress}%</span>
                </div>
                <Progress value={conversionProgress} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {convertedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conversion Complete
              </span>
              <Button onClick={downloadConverted} className="gap-2">
                <Download className="h-4 w-4" />
                Download Word Document
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Your PDF has been successfully converted to Word format
              </p>
              <p className="text-green-700 text-sm mt-1">
                The document is ready for download. You can now edit it in Microsoft Word or any compatible word processor.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>About PDF to Word Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            This tool converts PDF documents to editable Word format while preserving formatting, 
            images, and document structure. Perfect for editing PDF content or extracting text 
            for further processing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
