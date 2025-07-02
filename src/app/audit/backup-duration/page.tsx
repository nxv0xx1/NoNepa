"use client";

import { useAudit } from '@/context/AuditContext';
import config from '@/data/admin-config.json';
import AuditNavButtons from '@/components/audit/AuditNavButtons';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BatteryCharging } from 'lucide-react';

const backupOptions = config.backupOptions;

export default function BackupDurationPage() {
  const { audit, setBackupHours } = useAudit();

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center">How long you want light for?</h1>
        <p className="text-muted-foreground text-center mt-2 mb-8">
          When NEPA takes light, how many hours of backup do you need from your solar system?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {backupOptions.map(hours => {
            const isSelected = audit.backupHours === hours;
            return (
              <Card
                key={hours}
                onClick={() => setBackupHours(hours)}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 p-4 flex flex-col items-center justify-center text-center h-32",
                  isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                )}
              >
                <BatteryCharging className={cn("w-8 h-8 mb-2", isSelected ? "text-primary" : "text-muted-foreground")} />
                <p className="text-2xl font-bold">{hours} hours</p>
              </Card>
            );
          })}
        </div>
      </div>
      <AuditNavButtons backPath="/audit/location" nextPath="/audit/summary" isNextDisabled={audit.backupHours === 0} />
    </div>
  );
}
