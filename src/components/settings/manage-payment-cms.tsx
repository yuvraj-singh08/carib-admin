import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "../ui/textarea";

interface PaymentOptionProps {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  name,
  isSelected,
  onSelect,
  children,
}) => (
  <div
    className={`p-4 border-b cursor-pointer flex items-center justify-between ${
      isSelected ? "bg-gray-50" : ""
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
        {children}
      </div>
      <span className="font-medium">{name}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </div>
);

const ManagePaymentCms = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const paymentOptions = [
    { id: "sepa", name: "SEPA", img: "/payment-cms/sepa.svg" },
    { id: "pago", name: "Pago Movil", img: "/payment-cms/pago.svg" },
    { id: "zelle", name: "Zelle", img: "/payment-cms/zelle.svg" },
    { id: "bitcoin", name: "Bitcoin", img: "/payment-cms/bitcoin.svg" },
  ];

  const handleSubmit = () => {
    console.log({
      selectedPayment: selectedOption,
      value: inputValue,
    });
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setIsOpen(true);
  };

  return (
    <Card className="w-full mx-auto rounded-lg">
      <CardContent className="p-0">
        {paymentOptions.map((option) => (
          <Collapsible
            key={option.id}
            open={isOpen && selectedOption === option.id}
            onOpenChange={() => {
              setIsOpen(!isOpen);
              setSelectedOption(option.id);
            }}
          >
            <CollapsibleTrigger className="w-full">
              <PaymentOption
                name={option.name}
                isSelected={selectedOption === option.id}
                onSelect={() => handleOptionSelect(option.id)}
              >
                <img
                  src={option.img}
                  alt={option.name}
                  className="w-12 h-auto shrink-0"
                />
              </PaymentOption>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-4 bg-gray-50 space-y-4">
                <Textarea
                  placeholder={`Enter ${option.name} details`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full resize-none h-[140px]"
                  required
                />
                <Button className="w-full" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManagePaymentCms;
