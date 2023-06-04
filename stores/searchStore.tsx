import { create } from "zustand";

export const searchStore = create<{
  search: string;
  setSearch: (search: string) => void;
}>((set) => ({
  search: "",
  setSearch: (search: string) => set({ search }),
}));
