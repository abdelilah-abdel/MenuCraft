'use client';

import React, { useEffect, useState } from 'react';
import { QRService } from '@/lib/services/qrService';
import { Button } from '../ui/Button';

interface QRCodeDisplayProps {
  menuId: string;
  primaryColor?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  menuId,
  primaryColor,
}) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [menuUrl, setMenuUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        const url = QRService.getMenuUrl(menuId);
        setMenuUrl(url);
        const qr = await QRService.generateMenuQRCode(menuId, { primaryColor });
        setQrCode(qr);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [menuId, primaryColor]);

  const handleDownload = () => {
    if (qrCode) {
      QRService.downloadQRCode(qrCode, `menu-${menuId}-qr.png`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Generating your QR code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-8 py-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <div>
            <h3 className="text-2xl font-bold">Your QR Code is Ready</h3>
            <p className="text-gray-300 text-sm">Download and share with your customers</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {qrCode && (
          <div className="space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 inline-block shadow-sm">
                <img src={qrCode} alt="Menu QR Code" className="w-72 h-72 rounded-lg" />
              </div>
            </div>

            {/* Shareable Link */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                📱 Shareable Link
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={menuUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 text-sm font-mono"
                />
                <Button
                  variant={copied ? 'secondary' : 'outline'}
                  onClick={handleCopyLink}
                  className="!px-6"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1 !py-4 text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </Button>
            </div>

            {/* Usage Tips */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  ),
                  title: 'Print It',
                  desc: 'Add to table tents, menus, or posters'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  ),
                  title: 'Share Link',
                  desc: 'Send directly via social media or email'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                  title: 'Update Anytime',
                  desc: 'Menu changes reflect instantly via QR'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: 'Mobile Friendly',
                  desc: 'Perfect viewing on any smartphone'
                }
              ].map((tip, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-0.5">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
