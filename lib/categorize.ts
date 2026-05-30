import type { Category } from '@/types/models';

import { guessFrom, parseQuickEntry } from './quick-parse';

const KEYWORDS: Record<Category, string[]> = {
  Food: [
    'food', 'grocery', 'groceries', 'market', 'supermarket', 'restaurant',
    'meal', 'lunch', 'dinner', 'breakfast', 'brunch', 'coffee', 'cafe',
    'pizza', 'sushi', 'burger', 'bakery', 'bar', 'pub', 'beer', 'wine',
    'ubereats', 'doordash', 'deliveroo', 'glovo', 'ifood',
    'comida', 'mercado', 'supermercado', 'feira', 'restaurante', 'almoço',
    'jantar', 'café', 'lanche', 'padaria', 'cerveja', 'vinho',
  ],
  Transport: [
    'uber', 'lyft', 'taxi', 'cab', 'bolt', 'cabify', 'gas', 'fuel',
    'petrol', 'parking', 'bus', 'metro', 'subway', 'train', 'flight',
    'airline', 'bike', 'scooter', 'toll',
    'gasolina', 'combustível', 'ônibus', 'metrô', 'trem', 'estacionamento',
    'pedágio', 'passagem', 'avião', 'corrida',
  ],
  Housing: [
    'rent', 'mortgage', 'electricity', 'water', 'power', 'internet',
    'wifi', 'condo', 'hoa', 'cleaning', 'furniture', 'ikea', 'light',
    'aluguel', 'condomínio', 'luz', 'água', 'energia', 'faxina', 'móveis',
  ],
  Entertainment: [
    'cinema', 'movie', 'netflix', 'spotify', 'disney', 'hbo', 'primevideo',
    'game', 'steam', 'concert', 'show', 'theater', 'theatre', 'museum',
    'event', 'ticket',
    'filme', 'jogo', 'ingresso', 'teatro', 'museu', 'festa',
  ],
  Health: [
    'pharmacy', 'drugstore', 'doctor', 'dentist', 'hospital', 'clinic',
    'medicine', 'med', 'gym', 'yoga', 'pilates', 'therapy', 'therapist',
    'dermatologist',
    'farmácia', 'remédio', 'médico', 'dentista', 'academia', 'consulta', 'clínica',
  ],
  Education: [
    'course', 'book', 'books', 'school', 'college', 'university', 'tuition',
    'udemy', 'coursera', 'class', 'workshop',
    'curso', 'livro', 'escola', 'faculdade', 'mensalidade', 'aula',
  ],
  Shopping: [
    'amazon', 'ebay', 'clothes', 'shirt', 'shoes', 'store', 'mall',
    'electronics', 'phone', 'laptop', 'apple', 'zara', 'hm',
    'roupa', 'sapato', 'loja', 'shopping', 'celular', 'eletrônicos', 'presente',
  ],
  Subscriptions: [
    'subscription', 'icloud', 'dropbox', 'onedrive', 'adobe', 'notion',
    'chatgpt', 'claude',
    'assinatura',
  ],
  Other: [],
};

export const guessCategory = (description: string): Category =>
  guessFrom(KEYWORDS, description, 'Other');

export interface ParsedQuick {
  amount: number;
  description: string;
  category: Category;
}

export const parseQuickExpense = (raw: string): ParsedQuick | null => {
  const parsed = parseQuickEntry(raw);
  if (!parsed) return null;
  return {
    amount: parsed.amount,
    description: parsed.label,
    category: guessCategory(parsed.label),
  };
};
