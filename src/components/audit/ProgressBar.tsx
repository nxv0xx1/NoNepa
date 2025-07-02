"use client";

import { useAudit } from "@/context/AuditContext";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressBar() {
  const { getStepProgress } = useAudit();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentStep = pathname.split('/').pop() || 'appliances';
    setProgress(getStepProgress(currentStep));
  }, [pathname, getStepProgress]);

  return <Progress value={progress} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />;
}
