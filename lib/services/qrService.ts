import QRCode from 'qrcode';

export class QRService {
  static async generateQRCode(url: string, options?: {
    size?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }): Promise<string> {
    try {
      const qrOptions = {
        width: options?.size || 300,
        margin: options?.margin || 2,
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#FFFFFF',
        },
      };

      const qrCodeDataUrl = await QRCode.toDataURL(url, qrOptions);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static getMenuUrl(menuId: string): string {
    // In production, this would be your actual domain
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return `${baseUrl}/menu/${menuId}`;
  }

  static async generateMenuQRCode(menuId: string, customization?: {
    primaryColor?: string;
  }): Promise<string> {
    const url = this.getMenuUrl(menuId);

    return this.generateQRCode(url, {
      size: 400,
      margin: 4,
      color: customization?.primaryColor
        ? { dark: customization.primaryColor }
        : undefined,
    });
  }

  static downloadQRCode(dataUrl: string, filename: string = 'menu-qr-code.png'): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
