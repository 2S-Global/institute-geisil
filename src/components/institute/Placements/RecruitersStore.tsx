import { create } from "zustand";

export interface LatestRequirement {
  _id: string;
  userId: string;
  companyName: string;
  remarks: string;
  role: string;
  date: string;
  time: string;
  numberOfOpenings: number;
  numberOfHired: number | null;
  courses: string[];
  tenth: number;
  twelvth: number;
  isDel: boolean;
  year: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompanyItem {
  _id: string;
  userId: string;
  companyName: string;
  sector: string;
  status: string;
  primaryContact: string;
  email: string;
  phone: string;
  website: string;
  initialOpenPositions: number;
  notes: string;
  address: string;
  isDel: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestRequirement: LatestRequirement;
}

interface CompanyState {
  item: CompanyItem | null;
  setItem: (item: CompanyItem) => void;
  removeItem: () => void;
  getItem: () => CompanyItem | null;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  item: null,

  setItem: (item) => set({ item }),

  removeItem: () => set({ item: null }),

  getItem: () => get().item,
}));
