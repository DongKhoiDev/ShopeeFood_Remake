export const FALLBACK_RESTAURANT_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
];

export const FALLBACK_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1484723091791-00d315ced1b6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1490818387583-1b5ba459738f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&q=80&w=800'
];

export function getRestaurantImage(image: string | undefined | null, id: string | number = '') {
  if (typeof image === 'string' && image.trim() !== '') return image;
  const safeId = String(id || '');
  const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_RESTAURANT_IMAGES[hash % FALLBACK_RESTAURANT_IMAGES.length];
}

export function getFoodImage(image: string | undefined | null, id: string | number = '') {
  if (typeof image === 'string' && image.trim() !== '') return image;
  const safeId = String(id || '');
  const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_FOOD_IMAGES[hash % FALLBACK_FOOD_IMAGES.length];
}
