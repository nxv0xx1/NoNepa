"use client";

import { useAudit } from '@/context/AuditContext';
import config from '@/data/admin-config.json';
import AuditNavButtons from '@/components/audit/AuditNavButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';

const locations = Object.keys(config.locations);

export default function LocationPage() {
  const { audit, setLocation } = useAudit();

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center">Where you dey live?</h1>
        <p className="text-muted-foreground text-center mt-2 mb-8">
          Your location helps us estimate how much sun you'll get. More sun, more power!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locations.map(locationName => {
            const isSelected = audit.location === locationName;
            const sunHours = config.locations[locationName as keyof typeof config.locations];
            return (
              <Card
                key={locationName}
                onClick={() => setLocation(locationName)}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
                  isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                )}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{locationName}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-muted-foreground">
                  <Sun className={cn("w-5 h-5", isSelected ? 'text-primary' : '')} />
                  <span>~{sunHours} hours of sun daily</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <AuditNavButtons backPath="/audit/appliances" nextPath="/audit/backup-duration" isNextDisabled={!audit.location} />
    </div>
  );
}
