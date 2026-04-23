export type Category =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Shopping'
  | 'Subscriptions'
  | 'Other';

export const ALL_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Subscriptions',
  'Other',
];

export const CATEGORY_COLOR: Record<Category, string> = {
  Food: '#F59E0B',
  Transport: '#3B82F6',
  Housing: '#8B5CF6',
  Entertainment: '#EC4899',
  Health: '#EF4444',
  Education: '#06B6D4',
  Shopping: '#F97316',
  Subscriptions: '#10B981',
  Other: '#6B7280',
};

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Bonus'
  | 'Investment'
  | 'Gift'
  | 'Refund'
  | 'Other';

export const ALL_INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Bonus',
  'Investment',
  'Gift',
  'Refund',
  'Other',
];

export const INCOME_CATEGORY_COLOR: Record<IncomeCategory, string> = {
  Salary: '#10B981',
  Freelance: '#3B82F6',
  Bonus: '#F59E0B',
  Investment: '#8B5CF6',
  Gift: '#EC4899',
  Refund: '#06B6D4',
  Other: '#6B7280',
};

export type BillingPeriod = 'monthly' | 'yearly';

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingPeriod: BillingPeriod;
  billingDay: number;
  billingMonth?: number;
  category?: Category;
  notes?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  createdAt: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  category: IncomeCategory;
  date: string;
  createdAt: string;
}
