import React, { useState } from 'react';

export type ImageWithFallbackProps = React.ComponentProps<'img'> & {
  fallbackType?: 'food' | 'restaurant' | 'avatar' | 'driver';
  fallbackId?: string | number;
};

const FALLBACK_RESTAURANT_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
];

const FALLBACK_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1484723091791-00d315ced1b6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1490818387583-1b5ba459738f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&q=80&w=800'
];

const FALLBACK_AVATARS = [
  'https://ui-avatars.com/api/?background=ee4d2d&color=fff&name=User',
  'https://ui-avatars.com/api/?background=f97316&color=fff&name=Anonymous',
  'https://ui-avatars.com/api/?background=f59e0b&color=fff&name=Guest'
];

export function ImageWithFallback({ src, fallbackType = 'food', fallbackId = '', ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const getFallback = () => {
    const safeId = String(fallbackId || '');
    const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (fallbackType === 'restaurant') {
      return FALLBACK_RESTAURANT_IMAGES[hash % FALLBACK_RESTAURANT_IMAGES.length];
    }
    if (fallbackType === 'avatar' || fallbackType === 'driver') {
       return FALLBACK_AVATARS[hash % FALLBACK_AVATARS.length];
    }
    return FALLBACK_FOOD_IMAGES[hash % FALLBACK_FOOD_IMAGES.length];
  };

  const currentSrc = error ? getFallback() : (src || getFallback());

  return (
    <img
      src={currentSrc}
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
