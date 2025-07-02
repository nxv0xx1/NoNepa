"use client";

import { useAudit } from '@/context/AuditContext';
import { calculateSolarNeeds } from '@/lib/solar-calculations';
import config from '@/data/admin-config.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const { audit, resetAudit } = useAudit();
  const router = useRouter();
  const calculations = useMemo(() => calculateSolarNeeds(audit), [audit]);
  const { whatsapp } = config;

  const summaryText = `
- Location: ${audit.location}
- Backup: ${audit.backupHours} hours
- Daily Use: ${calculations.dailyEnergyKWh.toFixed(2)} kWh
- Rec. Inverter: ~${calculations.inverterSizeKVA.toFixed(1)} kVA
- Rec. Battery: ~${calculations.batteryCapacityAh} Ah @ ${calculations.batteryVoltage}V
- Rec. Panels: ${calculations.panelCount} x ${calculations.singlePanelWattage}W
  `;

  const whatsappMessage = encodeURIComponent(`${whatsapp.message}\n${summaryText}`);
  const whatsappLink = `https://wa.me/${whatsapp.number}?text=${whatsappMessage}`;
  
  const handleStartOver = () => {
    resetAudit();
    router.push('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">Oya, Let's Talk!</h1>
        <p className="text-muted-foreground mt-2 mb-8">
          You're one step away from reliable power. Our experts are ready to answer your questions and get you started.
        </p>

        <Card className="text-left">
          <CardHeader>
            <CardTitle>Your Audit Summary</CardTitle>
            <CardDescription>Here's a copy of your results for our chat.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-sans">
              {summaryText.trim()}
            </pre>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-lg py-7 px-8 shadow-lg">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-3 h-6 w-6" />
              Chat with {whatsapp.contactName} on WhatsApp
            </a>
          </Button>
        </div>

        <div className="mt-12">
           <Button variant="outline" onClick={handleStartOver}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
            </Button>
        </div>
      </div>
    </div>
  );
}
