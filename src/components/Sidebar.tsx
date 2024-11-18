import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Link2, Palette } from 'lucide-react';

interface SidebarProps {
  url: string;
  setUrl: (url: string) => void;
  fgColor: string;
  setFgColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  url,
  setUrl,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  size,
  setSize,
}) => {
  return (
    <div className="w-80 bg-white h-screen p-6 border-r border-gray-200 overflow-y-auto">
      <div className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Link2 className="w-4 h-4 mr-2" />
            URL or Text
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Size Slider */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Palette className="w-4 h-4 mr-2" />
            QR Code Size
          </label>
          <input
            type="range"
            min="128"
            max="512"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">{size}px</div>
        </div>

        {/* Color Pickers */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Foreground Color
            </label>
            <HexColorPicker color={fgColor} onChange={setFgColor} />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <HexColorPicker color={bgColor} onChange={setBgColor} />
          </div>
        </div>
      </div>
    </div>
  );
};