"use client";

import { useState } from 'react';
import { useAudit } from '@/context/AuditContext';
import config from '@/data/admin-config.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Trash2 } from 'lucide-react';
import ApplianceIcon from '@/components/icons/ApplianceIcon';
import AuditNavButtons from '@/components/audit/AuditNavButtons';
import type { CustomAppliance } from '@/lib/types';

const defaultAppliances = Object.keys(config.defaultWattages);

const ApplianceCard = ({ name, quantity, onQuantityChange }: { name: string, quantity: number, onQuantityChange: (newQuantity: number) => void }) => (
  <Card className="w-full text-center transition-all hover:shadow-lg hover:-translate-y-1">
    <CardHeader className="flex flex-col items-center pb-2">
      <ApplianceIcon name={name} className="w-10 h-10 mb-2 text-primary" />
      <CardTitle className="text-lg font-semibold">{name}</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onQuantityChange(quantity - 1)} disabled={quantity <= 0}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="w-16 h-8 text-center text-lg font-bold"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value, 10) || 0)}
        min="0"
      />
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onQuantityChange(quantity + 1)}>
        <Plus className="h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

const CustomApplianceCard = ({ appliance, onUpdate, onRemove }: { appliance: CustomAppliance, onUpdate: (id: string, updates: Partial<CustomAppliance>) => void, onRemove: (id: string) => void }) => (
    <Card className="w-full p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="grid gap-2 flex-1 w-full">
            <Label htmlFor={`name-${appliance.id}`}>Appliance Name</Label>
            <Input id={`name-${appliance.id}`} value={appliance.name} onChange={(e) => onUpdate(appliance.id, { name: e.target.value })} placeholder="e.g. Water Pump" />
        </div>
        <div className="grid gap-2 flex-1 w-full">
            <Label htmlFor={`wattage-${appliance.id}`}>Wattage (W)</Label>
            <Input id={`wattage-${appliance.id}`} type="number" value={appliance.wattage} onChange={(e) => onUpdate(appliance.id, { wattage: parseInt(e.target.value) || 0 })} placeholder="e.g. 750" />
        </div>
        <div className="grid gap-2 flex-1 w-full">
            <Label htmlFor={`quantity-${appliance.id}`}>Quantity</Label>
            <Input id={`quantity-${appliance.id}`} type="number" value={appliance.quantity} onChange={(e) => onUpdate(appliance.id, { quantity: parseInt(e.target.value) || 0 })} placeholder="e.g. 1" />
        </div>
        <Button variant="ghost" size="icon" className="text-destructive self-end sm:self-center" onClick={() => onRemove(appliance.id)}>
            <Trash2 className="h-5 w-5" />
        </Button>
    </Card>
);

export default function AppliancesPage() {
  const { audit, setAppliances, customAppliances, addCustomAppliance, updateCustomAppliance, removeCustomAppliance } = useAudit();
  
  const totalAppliances = Object.values(audit.appliances).reduce((sum, q) => sum + q, 0) + audit.customAppliances.reduce((sum, a) => sum + a.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center">Wetin you dey use light for?</h1>
        <p className="text-muted-foreground text-center mt-2 mb-8">
          Select the quantity of each appliance. If your item no dey list, add am for 'Others'.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {defaultAppliances.map(name => (
            <ApplianceCard
              key={name}
              name={name}
              quantity={audit.appliances[name] || 0}
              onQuantityChange={(quantity) => setAppliances(name, quantity)}
            />
          ))}
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold">Others</h2>
            <p className="text-muted-foreground mb-4">Add any other appliances we no list.</p>
            <div className="space-y-4">
                {audit.customAppliances.map(app => (
                    <CustomApplianceCard key={app.id} appliance={app} onUpdate={updateCustomAppliance} onRemove={removeCustomAppliance} />
                ))}
            </div>
             <Button variant="outline" className="mt-4" onClick={() => addCustomAppliance({ name: '', wattage: 0, quantity: 1 })}>
                <Plus className="mr-2 h-4 w-4" /> Add Another Appliance
            </Button>
        </div>
      </div>
      <AuditNavButtons backPath="/audit/location" nextPath="/audit/backup-duration" isNextDisabled={totalAppliances === 0} />
    </div>
  );
}
