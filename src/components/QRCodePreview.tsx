import React from 'react';
import QRCode from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodePreviewProps {
  value: string;
  bgColor: string;
  fgColor: string;
  size: number;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  value,
  bgColor,
  fgColor,
  size,
}) => {
  const handleDownload = (format: 'svg' | 'png') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const url = format === 'png' 
      ? canvas.toDataURL('image/png')
      : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(document.querySelector('.qr-container')?.innerHTML || '');
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="qr-container bg-white p-8 rounded-2xl shadow-lg">
        <QRCode
          value={value || 'https://example.com'}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => handleDownload('png')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          PNG
        </button>
        <button
          onClick={() => handleDownload('svg')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          SVG
        </button>
      </div>
    </div>
  );
};