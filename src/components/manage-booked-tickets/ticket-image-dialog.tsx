import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { X } from 'lucide-react';

const ImageGalleryDialog = ({
  isOpen,
  onClose,
  ticket,
}: {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-blue">Ticket Images</DialogTitle>
        </DialogHeader>
        <ScrollArea style={{ maxHeight: '60vh' }} className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {ticket.images.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`Ticket image ${index + 1}`}
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </ScrollArea>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected ticket image"
                className="max-w-3xl max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;
