import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlightsCard } from './flight-card';


interface FlightResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  flights: any[];
}

export const FlightResultsDialog: React.FC<FlightResultsDialogProps> = ({ isOpen, onClose, flights }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-5xl'>
        <DialogHeader>
          <DialogTitle>Flight Search Results</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-[80vh]">
          {flights.map((flight, index) => (
            <FlightsCard key={index} data={flight} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};