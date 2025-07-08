"use client";

import { useAudit } from '@/context/AuditContext';
import { calculateSolarNeeds } from '@/lib/solar-calculations';
import AuditNavButtons from '@/components/audit/AuditNavButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Zap, Sun, Battery, Sigma, Pencil } from 'lucide-react';
import { useMemo } from 'react';
import type { AuditCalculations } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SummaryItem = ({ icon, title, value, tooltip }: { icon: React.ReactNode, title: string, value: string, tooltip: string }) => (
  <Card className="flex-1 min-w-[200px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
              <AlertCircle className="w-3 h-3" />
              <span>What's this?</span>
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardContent>
  </Card>
);


export default function SummaryPage() {
  const { audit, resetAudit } = useAudit();
  const calculations: AuditCalculations = useMemo(() => calculateSolarNeeds(audit), [audit]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Your Solar Power Estimate</h1>
            <p className="text-muted-foreground mt-2">
            Here's the system we recommend based on your needs. This is just an estimate, o!
            </p>
        </div>
        
        <Card className="mt-8 p-6">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Your Load Summary</CardTitle>
                        <CardDescription>A breakdown of your power consumption.</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/audit/appliances">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Load
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    <SummaryItem 
                        icon={<Sigma className="h-4 w-4 text-muted-foreground" />}
                        title="Total Appliance Wattage"
                        value={`${calculations.totalWattage} W`}
                        tooltip="This is the total power all your selected appliances draw at the same time."
                    />
                     <SummaryItem 
                        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
                        title="Daily Energy Use"
                        value={`${calculations.dailyEnergyKWh.toFixed(2)} kWh`}
                        tooltip="This is the estimated total electricity your appliances will use in a day. We measure this in kilowatt-hours (kWh)."
                    />
                </div>
            </CardContent>
        </Card>

        <Card className="mt-8 p-6">
            <CardHeader>
                <CardTitle>Recommended System Specs</CardTitle>
                <CardDescription>The gear you need to say 'bye-bye' to NEPA.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-wrap gap-4">
                    <SummaryItem 
                        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
                        title="Inverter Size"
                        value={`~${calculations.inverterSizeKVA.toFixed(1)} kVA`}
                        tooltip="The inverter is the 'brain' of your solar system. This size is recommended to handle all your appliances safely."
                    />
                     <SummaryItem 
                        icon={<Battery className="h-4 w-4 text-muted-foreground" />}
                        title="Battery Bank"
                        value={`~${calculations.batteryCapacityAh} Ah @ ${calculations.batteryVoltage}V`}
                        tooltip={`To give you ${audit.backupHours} hours of backup, you need this much battery storage. Ah (Amp-hours) is a measure of battery capacity.`}
                    />
                     <SummaryItem 
                        icon={<Sun className="h-4 w-4 text-muted-foreground" />}
                        title="Solar Panels"
                        value={`${calculations.panelCount} x ${calculations.singlePanelWattage}W panels`}
                        tooltip={`You'll need this many panels to charge your batteries and power your home during the day in ${audit.location}.`}
                    />
                </div>
            </CardContent>
        </Card>

      </div>
      <AuditNavButtons backPath="/audit/backup-duration" nextPath="/audit/recommendations" />
    </div>
  );
}
