import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

import { isValidAmount, sanitizePatch } from './validate';

/** Minimum shape shared by every CRUD item (expenses, incomes, subscriptions). */
export interface CrudItem {
  id: string;
  createdAt: string;
  amount: number;
}

export interface CrudState<T> {
  items: T[];
  add: (item: Omit<T, 'id' | 'createdAt'>) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
}

interface CreateCrudStoreOptions<T extends CrudItem> {
  /** AsyncStorage key. */
  name: string;
  version?: number;
  migrate?: PersistOptions<CrudState<T>>['migrate'];
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Builds an offline-first Zustand store (persisted to AsyncStorage) with the
// add/update/remove CRUD shared by expenses, incomes and subscriptions. add
// rejects invalid amounts and update protects id/createdAt — see ./validate.
export function createCrudStore<T extends CrudItem>({
  name,
  version,
  migrate,
}: CreateCrudStoreOptions<T>) {
  return create<CrudState<T>>()(
    persist(
      (set) => ({
        items: [],
        add: (item) =>
          set((state) =>
            isValidAmount((item as { amount: number }).amount)
              ? {
                  items: [
                    ...state.items,
                    { ...item, id: newId(), createdAt: new Date().toISOString() } as T,
                  ],
                }
              : state
          ),
        update: (id, patch) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, ...sanitizePatch<T>(patch) } : i
            ),
          })),
        remove: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      }),
      {
        name,
        storage: createJSONStorage(() => AsyncStorage),
        version,
        migrate,
      }
    )
  );
}
