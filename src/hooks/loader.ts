import { create } from "zustand";

interface LoaderState {
  loading: boolean;
  setLoading: (loading: boolean, setTimeOut?: number) => void;
}

export const useTableLoader = create<LoaderState>((set) => ({
  loading: false,
  setLoading: (loading, setTimeOut) => {
    if (setTimeOut) {
      setTimeout(() => set({ loading }), setTimeOut);
    } else {
      set({ loading });
    }
  },
}));
