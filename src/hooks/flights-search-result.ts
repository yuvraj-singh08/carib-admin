import { create } from "zustand";

interface FlightsDataState {
  flights: string[];
  loading: boolean;
  setFlights: (flights: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useFlightsData = create<FlightsDataState>((set) => ({
  flights: [],
  loading: false,
  setFlights: (flights) => set({ flights, loading: false }), 
  setLoading: (loading) => set({ loading }),
}));
