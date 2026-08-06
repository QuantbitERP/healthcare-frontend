export const securePrintPdf = async (printUrl: string, getAuthHeaders: () => any, showAlert: (variant: any, title: string, content: string) => void) => {
  try {
    const authHeaders = getAuthHeaders();
    const headers = typeof authHeaders === 'string' ? 
      JSON.parse(authHeaders) : 
      Array.isArray(authHeaders) ? 
        Object.fromEntries(authHeaders) : 
        {...authHeaders};

    // Remove forced API key as it conflicts with useSessionAuth

    showAlert('info', 'Printing', 'Generating secure print view. Please wait...');
    
    // Parse URL safely
    let urlObj;
    try {
      urlObj = new URL(printUrl);
    } catch {
      // If it's a relative URL, prepend window.location.origin
      urlObj = new URL(printUrl, window.location.origin);
    }

    // Attempt 1: Fetch HTML and Style natively via API
    try {
      const doctype = urlObj.searchParams.get('doctype');
      const name = urlObj.searchParams.get('name');
      const format = urlObj.searchParams.get('format');
      
      const htmlUrl = `/api/method/frappe.www.printview.get_html_and_style?doc=${encodeURIComponent(doctype || '')}&name=${encodeURIComponent(name || '')}&print_format=${encodeURIComponent(format || '')}&no_letterhead=0`;
      
      const htmlResponse = await fetch(urlObj.origin + htmlUrl, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      
      if (htmlResponse.ok) {
        const result = await htmlResponse.json();
        if (result && result.message && result.message.html) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print - ${name}</title>
                  <style>
                    ${result.message.style || ''}
                    body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
                    @media print {
                      body { padding: 0; }
                    }
                  </style>
                </head>
                <body>
                  ${result.message.html}
                  <script>
                    window.onload = function() { window.print(); }
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
            return;
          }
        }
      }
    } catch (error) {
      console.warn("HTML print API failed, falling back to PDF download...", error);
    }

    // Attempt 2: PDF download API
    const pdfUrl = urlObj.origin + '/api/method/frappe.utils.print_format.download_pdf' + urlObj.search;
    
    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText} (${response.status})`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

  } catch (error) {
    console.error("Secure print generation failed:", error);
    showAlert('warning', 'Print Warning', 'Secure print failed. Attempting direct browser print...');
    // Only as a final resort fallback
    window.open(printUrl, '_blank');
  }
};
