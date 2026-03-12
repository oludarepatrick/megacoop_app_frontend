import type { RefObject } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Strips oklch from cloned DOM before html2canvas paints it
const sanitizeOklch = (clonedDoc: Document) => {
    // Walk every element and remove any inline oklch values
    clonedDoc.querySelectorAll("*").forEach((el) => {
        const htmlEl = el as HTMLElement
        const inline = htmlEl.getAttribute("style") || ""
        if (inline.includes("oklch")) {
            htmlEl.setAttribute(
                "style",
                inline.replace(/oklch\([^)]*\)/g, "transparent")
            )
        }
    })

    // Inject a stylesheet that replaces ALL Tailwind/shadcn CSS variables
    // with plain hex values so oklch is never derived at paint time
    const style = clonedDoc.createElement("style")
    style.textContent = `
        *, *::before, *::after {
            --background:            #ffffff !important;
            --foreground:            #0a0a0a !important;
            --card:                  #ffffff !important;
            --card-foreground:       #0a0a0a !important;
            --popover:               #ffffff !important;
            --popover-foreground:    #0a0a0a !important;
            --primary:               #16a34a !important;
            --primary-foreground:    #ffffff !important;
            --secondary:             #f5f5f5 !important;
            --secondary-foreground:  #171717 !important;
            --muted:                 #f5f5f5 !important;
            --muted-foreground:      #737373 !important;
            --accent:                #f5f5f5 !important;
            --accent-foreground:     #171717 !important;
            --destructive:           #ef4444 !important;
            --destructive-foreground:#ffffff !important;
            --border:                #e5e5e5 !important;
            --input:                 #e5e5e5 !important;
            --ring:                  #16a34a !important;

            /* Force all color properties to safe values */
            border-color:            #e5e5e5 !important;
        }

        /* Tailwind color classes that compile to oklch in v4 */
        .text-white            { color: #ffffff !important; }
        .text-green-800        { color: #166534 !important; }
        .text-gray-500         { color: #6b7280 !important; }
        .text-gray-600         { color: #4b5563 !important; }
        .text-gray-700         { color: #374151 !important; }
        .text-gray-800         { color: #1f2937 !important; }
        .bg-white              { background-color: #ffffff !important; }
        .bg-gradient-to-b      { background-image: linear-gradient(to bottom, #E6FFE3, #ffffff) !important; }
        .from-\\[\\#E6FFE3\\]  { --tw-gradient-from: #E6FFE3 !important; }
        .to-white              { --tw-gradient-to: #ffffff !important; }
        .border-dashed         { border-color: rgba(255,255,255,0.4) !important; }
        .text-muted-foreground { color: #737373 !important; }
    `
    clonedDoc.head.appendChild(style)
}

const canvasOptions = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (_clonedDoc: Document) => sanitizeOklch(_clonedDoc),
}

export const useDownloadReceipt = (
    ref: RefObject<HTMLElement>,
    filename = "receipt"
) => {
    const downloadAsImage = async (format: "png" | "jpeg" = "png") => {
        if (!ref.current) {
            console.error("Element ref is not available")
            return
        }
        try {
            const canvas = await html2canvas(ref.current, canvasOptions)
            const link = document.createElement("a")
            link.download = `${filename}.${format}`
            link.href = canvas.toDataURL(`image/${format}`)
            link.click()
        } catch (error) {
            console.error("Error downloading as image:", error)
        }
    }

    const downloadAsPDF = async () => {
        if (!ref.current) {
            console.error("Element ref is not available")
            return
        }
        try {
            const canvas = await html2canvas(ref.current, canvasOptions)
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF("p", "mm", "a4")
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save(`${filename}.pdf`)
        } catch (error) {
            console.error("Error downloading as PDF:", error)
        }
    }

    return { downloadAsImage, downloadAsPDF }
}


// import type{ RefObject } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export const useDownloadReceipt = (ref: RefObject<HTMLElement>, filename = "receipt") => {

//   /** Download element as PNG or JPEG */
//   const downloadAsImage = async (format: "png" | "jpeg" = "png") => {
//     if (!ref.current) {
//       console.error("Element ref is not available");
//       return;
//     }
    
//     try {
//       const canvas = await html2canvas(ref.current, { 
//         scale: 2, 
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         onclone: (clonedDoc) => {
//           // Get the root element
//           const root = clonedDoc.documentElement;
          
//           // Override all CSS variables to use RGB values
//           const style = clonedDoc.createElement('style');
//           style.textContent = `
//             * {
//               --background: 0 0% 100% !important;
//               --foreground: 0 0% 3.9% !important;
//               --card: 0 0% 100% !important;
//               --card-foreground: 0 0% 3.9% !important;
//               --popover: 0 0% 100% !important;
//               --popover-foreground: 0 0% 3.9% !important;
//               --primary: 142 71% 45% !important;
//               --primary-foreground: 0 0% 98% !important;
//               --secondary: 0 0% 96.1% !important;
//               --secondary-foreground: 0 0% 9% !important;
//               --muted: 0 0% 96.1% !important;
//               --muted-foreground: 0 0% 45.1% !important;
//               --accent: 0 0% 96.1% !important;
//               --accent-foreground: 0 0% 9% !important;
//               --destructive: 0 84.2% 60.2% !important;
//               --destructive-foreground: 0 0% 98% !important;
//               --border: 0 0% 89.8% !important;
//               --input: 0 0% 89.8% !important;
//               --ring: 142 71% 45% !important;
//               --radius: 0.5rem !important;
//             }
//           `;
//           root.appendChild(style);
//         }
//       });
      
//       const link = document.createElement("a");
//       link.download = `${filename}.${format}`;
//       link.href = canvas.toDataURL(`image/${format}`);
//       link.click();
//     } catch (error) {
//       console.error("Error downloading as image:", error);
//     }
//   };

//   /** Download element as PDF */
//   const downloadAsPDF = async () => {
//     if (!ref.current) {
//       console.error("Element ref is not available");
//       return;
//     }

//     try {
//       const canvas = await html2canvas(ref.current, { 
//         scale: 2, 
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         onclone: (clonedDoc) => {
//           const root = clonedDoc.documentElement;
          
//           const style = clonedDoc.createElement('style');
//           style.textContent = `
//             * {
//               --background: 0 0% 100% !important;
//               --foreground: 0 0% 3.9% !important;
//               --card: 0 0% 100% !important;
//               --card-foreground: 0 0% 3.9% !important;
//               --popover: 0 0% 100% !important;
//               --popover-foreground: 0 0% 3.9% !important;
//               --primary: 142 71% 45% !important;
//               --primary-foreground: 0 0% 98% !important;
//               --secondary: 0 0% 96.1% !important;
//               --secondary-foreground: 0 0% 9% !important;
//               --muted: 0 0% 96.1% !important;
//               --muted-foreground: 0 0% 45.1% !important;
//               --accent: 0 0% 96.1% !important;
//               --accent-foreground: 0 0% 9% !important;
//               --destructive: 0 84.2% 60.2% !important;
//               --destructive-foreground: 0 0% 98% !important;
//               --border: 0 0% 89.8% !important;
//               --input: 0 0% 89.8% !important;
//               --ring: 142 71% 45% !important;
//               --radius: 0.5rem !important;
//             }
//           `;
//           root.appendChild(style);
//         }
//       });
      
//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`${filename}.pdf`);
//     } catch (error) {
//       console.error("Error downloading as PDF:", error);
//     }
//   };

//   return { downloadAsImage, downloadAsPDF };
// };