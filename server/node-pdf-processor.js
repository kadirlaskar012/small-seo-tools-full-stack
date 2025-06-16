#!/usr/bin/env node
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const qpdf = require('node-qpdf2');

class NodePDFProcessor {
  constructor() {
    this.commonPasswords = [
      "", "123456", "password", "admin", "user", "test", "demo",
      "123", "1234", "12345", "123456789", "qwerty", "abc123", "password123",
      "admin123", "root", "guest", "default", "pass", "pwd", "login",
      "secret", "welcome", "master", "owner", "unlock", "open", "free",
      "document", "file", "pdf", "secure", "protected", "private",
      "confidential", "restricted", "access", "enter", "key", "code",
      "temp", "temporary", "draft", "copy", "backup", "archive",
      // Common variations
      "Password", "PASSWORD", "Admin", "ADMIN", "Test", "TEST",
      "123456a", "123456A", "password1", "Password1", "admin1", "Admin1",
      "password!", "password@", "admin!", "admin@", "123!@#", "qwerty123",
      // Date-based passwords
      "2024", "2023", "2022", "2021", "2020", "01012024", "12345678",
      // Company/document related
      "company", "internal", "official", "report", "finance", "data"
    ];
  }

  async processWithQPDF(pdfBuffer) {
    try {
      const tempInputPath = `/tmp/input_${Date.now()}.pdf`;
      const tempOutputPath = `/tmp/output_${Date.now()}.pdf`;
      
      // Write buffer to temp file
      fs.writeFileSync(tempInputPath, pdfBuffer);
      
      // Try common passwords with qpdf
      for (const password of this.commonPasswords) {
        try {
          const options = {
            input: tempInputPath,
            output: tempOutputPath,
            password: password
          };
          
          await qpdf.decrypt(options);
          
          // Check if decryption was successful
          if (fs.existsSync(tempOutputPath)) {
            const decryptedBuffer = fs.readFileSync(tempOutputPath);
            
            // Cleanup
            if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
            if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
            
            return {
              success: true,
              message: `PDF successfully decrypted using password: "${password || '(empty)'}"`,
              buffer: decryptedBuffer,
              method: "qpdf"
            };
          }
        } catch (error) {
          // Continue to next password
          continue;
        }
      }
      
      // Cleanup on failure
      if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
      if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      
      return { success: false, message: "QPDF decryption failed" };
    } catch (error) {
      return { success: false, message: `QPDF error: ${error.message}` };
    }
  }

  async processWithPDFLib(pdfBuffer) {
    try {
      // Try each password with pdf-lib
      for (const password of this.commonPasswords) {
        try {
          const pdfDoc = await PDFDocument.load(pdfBuffer, { 
            password: password,
            ignoreEncryption: false 
          });
          
          // If we get here, password worked
          const pdfBytes = await pdfDoc.save();
          
          return {
            success: true,
            message: `PDF successfully decrypted using password: "${password || '(empty)'}"`,
            buffer: Buffer.from(pdfBytes),
            method: "pdf-lib"
          };
        } catch (error) {
          // Wrong password or other error, try next
          continue;
        }
      }
      
      return { success: false, message: "PDF-lib decryption failed" };
    } catch (error) {
      return { success: false, message: `PDF-lib error: ${error.message}` };
    }
  }

  async forceProcessWithPDFLib(pdfBuffer) {
    try {
      // Try to load with ignoreEncryption flag
      const pdfDoc = await PDFDocument.load(pdfBuffer, { 
        ignoreEncryption: true,
        parseSpeed: 'slow'
      });
      
      // Create a new document and copy pages
      const newDoc = await PDFDocument.create();
      const pageIndices = pdfDoc.getPageIndices();
      
      if (pageIndices.length > 0) {
        const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => newDoc.addPage(page));
        
        const pdfBytes = await newDoc.save();
        
        return {
          success: true,
          message: "PDF content extracted and reconstructed without password protection",
          buffer: Buffer.from(pdfBytes),
          method: "pdf-lib-force"
        };
      }
      
      return { success: false, message: "No pages found in PDF" };
    } catch (error) {
      return { success: false, message: `Force processing error: ${error.message}` };
    }
  }

  async processPDF(pdfBuffer) {
    try {
      // Method 1: Try QPDF (most reliable for password removal)
      console.log("Attempting QPDF decryption...");
      const qpdfResult = await this.processWithQPDF(pdfBuffer);
      if (qpdfResult.success) {
        return qpdfResult;
      }
      
      // Method 2: Try PDF-lib with passwords
      console.log("Attempting PDF-lib decryption...");
      const pdflibResult = await this.processWithPDFLib(pdfBuffer);
      if (pdflibResult.success) {
        return pdflibResult;
      }
      
      // Method 3: Force process with PDF-lib
      console.log("Attempting force processing...");
      const forceResult = await this.forceProcessWithPDFLib(pdfBuffer);
      if (forceResult.success) {
        return forceResult;
      }
      
      return {
        success: false,
        message: "Unable to process PDF with any available method. The encryption may be too strong or the file may be corrupted."
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Processing error: ${error.message}`
      };
    }
  }
}

// Main execution
async function main() {
  try {
    const input = process.stdin;
    let data = '';
    
    input.on('data', chunk => {
      data += chunk;
    });
    
    input.on('end', async () => {
      try {
        const inputData = JSON.parse(data);
        const pdfBuffer = Buffer.from(inputData.pdf_data, 'base64');
        
        const processor = new NodePDFProcessor();
        const result = await processor.processPDF(pdfBuffer);
        
        if (result.success && result.buffer) {
          // Convert buffer to base64 for output
          const outputData = {
            success: true,
            message: result.message,
            output_data: result.buffer.toString('base64'),
            method: result.method
          };
          
          console.log(JSON.stringify(outputData));
        } else {
          console.log(JSON.stringify({
            success: false,
            message: result.message
          }));
        }
      } catch (error) {
        console.log(JSON.stringify({
          success: false,
          message: `JSON parsing error: ${error.message}`
        }));
      }
    });
    
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      message: `Main error: ${error.message}`
    }));
  }
}

if (require.main === module) {
  main();
}

module.exports = NodePDFProcessor;