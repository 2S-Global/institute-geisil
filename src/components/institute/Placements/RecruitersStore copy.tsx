import { create } from "zustand";

export interface Item {
  id: string;
  name: string;
  value: number;
}

interface ItemState {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  clearItems: () => void;
}

export const RecruitersStore = create<ItemState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  getItem: (id) => {
    return get().items.find((item) => item.id === id);
  },

  clearItems: () => set({ items: [] }),
}));
