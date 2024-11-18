import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';
import { Trash2, ExternalLink, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';

interface QRCode {
  id: string;
  url: string;
  createdAt: Date;
  fgColor: string;
  bgColor: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchQRCodes = async () => {
      if (!user) return;
      
      try {
        // Simulate network delay in demo mode
        if (import.meta.env.VITE_FIREBASE_API_KEY === undefined) {
          await new Promise(resolve => setTimeout(resolve, 500));
          if (!mounted) return;
          
          setQrCodes([
            {
              id: '1',
              url: 'https://example.com',
              createdAt: new Date(),
              fgColor: '#000000',
              bgColor: '#ffffff'
            }
          ]);
          return;
        }

        const q = query(
          collection(db, 'qrcodes'),
          where('userId', '==', user.username),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        if (!mounted) return;

        const codes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as QRCode[];

        setQrCodes(codes);
      } catch (err) {
        console.error('Error fetching QR codes:', err);
        if (mounted) {
          setError('Unable to load QR codes. Running in demo mode.');
          setQrCodes([
            {
              id: '1',
              url: 'https://example.com',
              createdAt: new Date(),
              fgColor: '#000000',
              bgColor: '#ffffff'
            }
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchQRCodes();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    try {
      if (import.meta.env.VITE_FIREBASE_API_KEY !== undefined) {
        await deleteDoc(doc(db, 'qrcodes', id));
      }
      setQrCodes(codes => codes.filter(code => code.id !== id));
    } catch (err) {
      console.error('Error deleting QR code:', err);
      setError('Failed to delete QR code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Your QR Codes</h2>
      
      {error && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {qrCodes.length === 0 ? (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first QR code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1 truncate">{qr.url}</h3>
                  <p className="text-sm text-gray-500">
                    {format(qr.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    onClick={() => window.open(qr.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="w-full aspect-square rounded-lg mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: qr.bgColor,
                }}
              >
                <QRCode
                  value={qr.url}
                  size={200}
                  fgColor={qr.fgColor}
                  bgColor={qr.bgColor}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};