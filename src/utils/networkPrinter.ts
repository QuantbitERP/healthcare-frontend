interface NetworkPrinterSettings {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  server_ip: string;
  port: number;
  printer_name: string;
  doctype: string;
}

// interface PrintJob {
//   document_name: string;
//   doctype: string;
//   format: string;
//   printer_settings: NetworkPrinterSettings;
// }

export class NetworkPrinter {
  private settings: NetworkPrinterSettings | null = null;
  private apiKey: string | null = null;
  private apiSecret: string | null = null;

  constructor(apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey || null;
    this.apiSecret = apiSecret || null;
    this.loadPrinterSettings();
  }

  updateAuth(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private async loadPrinterSettings(): Promise<void> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.warn('API credentials not available for network printer');
        return;
      }

      // Fetch network printer settings from Frappe
      const response = await fetch('https://192.168.7.221:4422/api/resource/Network%20Printer%20Settings/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.settings = data.data;
        console.log('Network printer settings loaded successfully');
      } else {
        console.error('Failed to load printer settings:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load network printer settings:', error);
    }
  }

  private async sendToPrinter(documentName: string, doctype: string, format: string): Promise<void> {
    if (!this.settings) {
      throw new Error('Network printer settings not available');
    }

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not available for network printer');
    }

    try {
      // Generate PDF content from Frappe print view
      const printUrl = `https://192.168.7.221:4422/printview?` +
        `doctype=${encodeURIComponent(doctype)}&` +
        `name=${encodeURIComponent(documentName)}&` +
        `format=${encodeURIComponent(format)}&` +
        `trigger_print=0&` + // Don't trigger print dialog
        `no_letterhead=0&` +
        `_lang=en&` +
        `output=PDF`; // Request PDF output

      const response = await fetch(printUrl, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF for printing');
      }

      const blob = await response.blob();

      // Send PDF directly to CUPS printer
      const cupsUrl = `http://${this.settings.server_ip}:${this.settings.port}/print`;

      const formData = new FormData();
      formData.append('file', blob, `${documentName}.pdf`);
      formData.append('printer', this.settings.printer_name);
      formData.append('title', `${doctype} - ${documentName}`);
      formData.append('copies', '1');
      formData.append('media', 'A4');
      formData.append('orientation', 'portrait');
      formData.append('fit-to-page', 'true');

      const printResponse = await fetch(cupsUrl, {
        method: 'POST',
        body: formData,
      });

      if (!printResponse.ok) {
        throw new Error(`Printer responded with status ${printResponse.status}: ${printResponse.statusText}`);
      }

      console.log('Print job submitted successfully to', this.settings.printer_name);
    } catch (error) {
      console.error('Failed to send to printer:', error);
      throw error;
    }
  }

  async printDocument(documentName: string, doctype: string = 'POS Invoice', format: string = 'Pos Invoice print Format'): Promise<void> {
    try {
      // Send directly to network printer
      await this.sendToPrinter(documentName, doctype, format);

      console.log(`Document ${documentName} sent to network printer successfully`);
    } catch (error) {
      console.error('Network printing failed:', error);
      // Fallback to browser print if network printing fails
      this.fallbackToBrowserPrint(documentName, doctype, format);
      throw error; // Re-throw to let caller handle the fallback
    }
  }

  private fallbackToBrowserPrint(documentName: string, doctype: string, format: string): void {
    console.log('Falling back to browser print');
    const printUrl = `https://192.168.7.221:4422/printview?` +
      `doctype=${encodeURIComponent(doctype)}&` +
      `name=${encodeURIComponent(documentName)}&` +
      `format=${encodeURIComponent(format)}&` +
      `trigger_print=1&` +
      `no_letterhead=0&` +
      `_lang=en`;

    window.open(printUrl, '_blank');
  }

  isPrinterAvailable(): boolean {
    return this.settings !== null;
  }

  getPrinterInfo(): NetworkPrinterSettings | null {
    return this.settings;
  }
}

// Factory function to create network printer instance with credentials
export const createNetworkPrinter = (apiKey: string, apiSecret: string) => {
  return new NetworkPrinter(apiKey, apiSecret);
};

// Default instance (will need credentials set via updateAuth)
export const networkPrinter = new NetworkPrinter();
