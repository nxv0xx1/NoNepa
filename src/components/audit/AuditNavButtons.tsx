"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuditNavButtonsProps {
  backPath?: string;
  nextPath?: string;
  isNextDisabled?: boolean;
  onNextClick?: () => void;
}

export default function AuditNavButtons({ backPath, nextPath, isNextDisabled = false, onNextClick }: AuditNavButtonsProps) {
  const router = useRouter();

  const handleNext = () => {
    if (onNextClick) {
      onNextClick();
    }
    if (nextPath) {
      router.push(nextPath);
    }
  };

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Button variant="outline" size="lg" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button size="lg" onClick={handleNext} disabled={isNextDisabled} className="bg-accent hover:bg-accent/90">
          Next
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
