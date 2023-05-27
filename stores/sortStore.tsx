import { create } from "zustand";

export const sortStore = create<{
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}>((set) => ({
  selectedSort: "date",
  setSelectedSort: (sort: string) => set({ selectedSort: sort }),
}));
