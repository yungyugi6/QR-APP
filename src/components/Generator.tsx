import React, { useState } from 'react';
import { QRCodePreview } from './QRCodePreview';
import { Sidebar } from './Sidebar';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Save } from 'lucide-react';

export function Generator() {
  const { user } = useAuth();
  const [url, setUrl] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (import.meta.env.VITE_FIREBASE_API_KEY === undefined) {
        // Demo mode
        setTimeout(() => {
          alert('QR Code saved successfully! (Demo Mode)');
        }, 500);
        return;
      }

      await addDoc(collection(db, 'qrcodes'), {
        userId: user.username,
        url,
        fgColor,
        bgColor,
        size,
        createdAt: serverTimestamp(),
      });
      
      alert('QR Code saved successfully!');
    } catch (error) {
      console.error('Error saving QR code:', error);
      setError('Failed to save QR code. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        url={url}
        setUrl={setUrl}
        fgColor={fgColor}
        setFgColor={setFgColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        size={size}
        setSize={setSize}
      />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <QRCodePreview
            value={url}
            bgColor={bgColor}
            fgColor={fgColor}
            size={size}
          />
          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving || !user}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save QR Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}