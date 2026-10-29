// Utility functions for Paperlisens

// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Generate unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PL${timestamp}${random}`;
}

// Validate payment method
export function validatePaymentMethod(method: string): boolean {
  const validMethods = ['cod', 'transfer', 'ewallet'];
  return validMethods.includes(method);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}