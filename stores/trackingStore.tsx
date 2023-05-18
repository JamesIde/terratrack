import { create } from "zustand";

export const trackingStore = create<{
  followUser: boolean;
  setFollowUser: (follow: boolean) => void;
}>((set) => ({
  followUser: true,
  setFollowUser: (follow) => {
    set((state) => ({
      followUser: follow,
    }));
  },
}));
