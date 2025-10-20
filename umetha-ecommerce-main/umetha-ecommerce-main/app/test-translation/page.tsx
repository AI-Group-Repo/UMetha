"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function TestTranslationPage() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Translation Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Current Language:</strong> {i18n.language}
        </div>
        
        <div>
          <strong>Available Languages:</strong> {i18n.languages.join(', ')}
        </div>
        
        <div>
          <strong>Is Ready:</strong> {i18n.isInitialized ? 'Yes' : 'No'}
        </div>
        
        <div className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">Translation Tests:</h2>
          
          <div>
            <strong>search.placeholder:</strong> {t('search.placeholder')}
          </div>
          
          <div>
            <strong>search.image:</strong> {t('search.image')}
          </div>
          
          <div>
            <strong>virtual_tryon.title:</strong> {t('virtual_tryon.title')}
          </div>
          
          <div>
            <strong>virtual_tryon.subtitle:</strong> {t('virtual_tryon.subtitle')}
          </div>
          
          <div>
            <strong>common.welcome:</strong> {t('common.welcome')}
          </div>
          
          <div>
            <strong>common.menu:</strong> {t('common.menu')}
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Change Language:</h2>
          <div className="space-x-2">
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              English
            </button>
            <button 
              onClick={() => i18n.changeLanguage('fr')}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Français
            </button>
            <button 
              onClick={() => i18n.changeLanguage('el')}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Ελληνικά
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
