import { networkPrinter } from './networkPrinter';

/**
 * Test script to verify network printer functionality
 * Run this in browser console to test the printer setup
 */
export const testNetworkPrinter = async () => {
  console.log('Testing Network Printer Setup...');
  
  // Check if printer settings are loaded
  const isAvailable = networkPrinter.isPrinterAvailable();
  console.log('Printer available:', isAvailable);
  
  if (isAvailable) {
    const printerInfo = networkPrinter.getPrinterInfo();
    console.log('Printer info:', printerInfo);
    
    // Test with a sample document (replace with actual invoice name)
    try {
      console.log('Attempting to print test document...');
      // await networkPrinter.printDocument('TEST-INV-00001', 'POS Invoice', 'Pos Invoice print Format');
      console.log('Test print command ready. Uncomment the line above to test with actual document.');
    } catch (error) {
      console.error('Test print failed:', error);
    }
  } else {
    console.log('Printer settings not loaded. Check Network Printer Settings document in Frappe.');
  }
};

// Auto-run test when this file is imported (for development)
if (typeof window !== 'undefined') {
  (window as any).testNetworkPrinter = testNetworkPrinter;
  console.log('Network printer test function available as: testNetworkPrinter()');
}
