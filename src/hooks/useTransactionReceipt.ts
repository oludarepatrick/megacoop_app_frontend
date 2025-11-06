import type{ RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useDownloadReceipt = (ref: RefObject<HTMLElement>, filename = "receipt") => {

  /** Download element as PNG or JPEG */
  const downloadAsImage = async (format: "png" | "jpeg" = "png") => {
    if (!ref.current) {
      console.error("Element ref is not available");
      return;
    }
    
    try {
      const canvas = await html2canvas(ref.current, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Get the root element
          const root = clonedDoc.documentElement;
          
          // Override all CSS variables to use RGB values
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              --background: 0 0% 100% !important;
              --foreground: 0 0% 3.9% !important;
              --card: 0 0% 100% !important;
              --card-foreground: 0 0% 3.9% !important;
              --popover: 0 0% 100% !important;
              --popover-foreground: 0 0% 3.9% !important;
              --primary: 142 71% 45% !important;
              --primary-foreground: 0 0% 98% !important;
              --secondary: 0 0% 96.1% !important;
              --secondary-foreground: 0 0% 9% !important;
              --muted: 0 0% 96.1% !important;
              --muted-foreground: 0 0% 45.1% !important;
              --accent: 0 0% 96.1% !important;
              --accent-foreground: 0 0% 9% !important;
              --destructive: 0 84.2% 60.2% !important;
              --destructive-foreground: 0 0% 98% !important;
              --border: 0 0% 89.8% !important;
              --input: 0 0% 89.8% !important;
              --ring: 142 71% 45% !important;
              --radius: 0.5rem !important;
            }
          `;
          root.appendChild(style);
        }
      });
      
      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    } catch (error) {
      console.error("Error downloading as image:", error);
    }
  };

  /** Download element as PDF */
  const downloadAsPDF = async () => {
    if (!ref.current) {
      console.error("Element ref is not available");
      return;
    }

    try {
      const canvas = await html2canvas(ref.current, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const root = clonedDoc.documentElement;
          
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              --background: 0 0% 100% !important;
              --foreground: 0 0% 3.9% !important;
              --card: 0 0% 100% !important;
              --card-foreground: 0 0% 3.9% !important;
              --popover: 0 0% 100% !important;
              --popover-foreground: 0 0% 3.9% !important;
              --primary: 142 71% 45% !important;
              --primary-foreground: 0 0% 98% !important;
              --secondary: 0 0% 96.1% !important;
              --secondary-foreground: 0 0% 9% !important;
              --muted: 0 0% 96.1% !important;
              --muted-foreground: 0 0% 45.1% !important;
              --accent: 0 0% 96.1% !important;
              --accent-foreground: 0 0% 9% !important;
              --destructive: 0 84.2% 60.2% !important;
              --destructive-foreground: 0 0% 98% !important;
              --border: 0 0% 89.8% !important;
              --input: 0 0% 89.8% !important;
              --ring: 142 71% 45% !important;
              --radius: 0.5rem !important;
            }
          `;
          root.appendChild(style);
        }
      });
      
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error downloading as PDF:", error);
    }
  };

  return { downloadAsImage, downloadAsPDF };
};