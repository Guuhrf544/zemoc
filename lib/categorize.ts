import type { Category } from '@/types/models';

const KEYWORDS: Record<Category, string[]> = {
  Food: [
    'food', 'grocery', 'groceries', 'market', 'supermarket', 'restaurant',
    'meal', 'lunch', 'dinner', 'breakfast', 'brunch', 'coffee', 'cafe',
    'pizza', 'sushi', 'burger', 'bakery', 'bar', 'pub', 'beer', 'wine',
    'ubereats', 'doordash', 'deliveroo', 'glovo', 'ifood',
  ],
  Transport: [
    'uber', 'lyft', 'taxi', 'cab', 'bolt', 'cabify', 'gas', 'fuel',
    'petrol', 'parking', 'bus', 'metro', 'subway', 'train', 'flight',
    'airline', 'bike', 'scooter', 'toll',
  ],
  Housing: [
    'rent', 'mortgage', 'electricity', 'water', 'power', 'internet',
    'wifi', 'condo', 'hoa', 'cleaning', 'furniture', 'ikea', 'light',
  ],
  Entertainment: [
    'cinema', 'movie', 'netflix', 'spotify', 'disney', 'hbo', 'primevideo',
    'game', 'steam', 'concert', 'show', 'theater', 'theatre', 'museum',
    'event', 'ticket',
  ],
  Health: [
    'pharmacy', 'drugstore', 'doctor', 'dentist', 'hospital', 'clinic',
    'medicine', 'med', 'gym', 'yoga', 'pilates', 'therapy', 'therapist',
    'dermatologist',
  ],
  Education: [
    'course', 'book', 'books', 'school', 'college', 'university', 'tuition',
    'udemy', 'coursera', 'class', 'workshop',
  ],
  Shopping: [
    'amazon', 'ebay', 'clothes', 'shirt', 'shoes', 'store', 'mall',
    'electronics', 'phone', 'laptop', 'apple', 'zara', 'hm',
  ],
  Subscriptions: [
    'subscription', 'icloud', 'dropbox', 'onedrive', 'adobe', 'notion',
    'chatgpt', 'claude',
  ],
  Other: [],
};

export const guessCategory = (description: string): Category => {
  const lower = description.toLowerCase();
  for (const category of Object.keys(KEYWORDS) as Category[]) {
    if (KEYWORDS[category].some((k) => lower.includes(k))) return category;
  }
  return 'Other';
};

export interface ParsedQuick {
  amount: number;
  description: string;
  category: Category;
}

export const parseQuickExpense = (raw: string): ParsedQuick | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const leading = trimmed.match(/^([\d][\d.,]*)\s+(.+)$/);
  const trailing = trimmed.match(/^(.+?)\s+([\d][\d.,]*)$/);

  const match = leading ?? trailing;
  if (!match) return null;

  const amountStr = leading ? match[1] : match[2];
  const description = (leading ? match[2] : match[1]).trim();

  const amount = parseFloat(
    amountStr.replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')
  );

  if (!Number.isFinite(amount) || amount <= 0 || !description) return null;

  return { amount, description, category: guessCategory(description) };
};
