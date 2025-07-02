"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveAdminConfig } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdminConfig } from "@/lib/types";

const packageSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  inverter: z.string().min(1, "Inverter spec is required"),
  battery: z.string().min(1, "Battery spec is required"),
  panel: z.string().min(1, "Panel spec is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  idealFor: z.string().min(1, "Ideal For is required"),
});

const whatsappSchema = z.object({
    contactName: z.string().min(1, "Contact name is required"),
    number: z.string().min(1, "WhatsApp number is required"),
    message: z.string().min(1, "Default message is required"),
});

const KeyValueSchema = z.object({
    key: z.string().min(1, "Key cannot be empty"),
    value: z.number({ required_error: "Value is required", invalid_type_error: "Value must be a number" }),
});

const formSchema = z.object({
    defaultWattages: z.array(KeyValueSchema),
    locations: z.array(KeyValueSchema),
    backupOptions: z.array(z.object({ value: z.number().min(0) })),
    packages: z.array(packageSchema),
    whatsapp: whatsappSchema,
});


export default function AdminForm({ initialConfig }: { initialConfig: AdminConfig }) {
    const { toast } = useToast();
    
    const preparedInitialData = {
        ...initialConfig,
        defaultWattages: Object.entries(initialConfig.defaultWattages).map(([key, value]) => ({ key, value })),
        locations: Object.entries(initialConfig.locations).map(([key, value]) => ({ key, value })),
        backupOptions: initialConfig.backupOptions.map(value => ({ value }))
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: preparedInitialData,
    });

    const { fields: wattageFields, append: appendWattage, remove: removeWattage } = useFieldArray({
        control: form.control,
        name: "defaultWattages",
    });

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control: form.control,
        name: "locations",
    });

    const { fields: backupFields, append: appendBackup, remove: removeBackup } = useFieldArray({
        control: form.control,
        name: "backupOptions",
    });
     
    const { fields: packageFields, append: appendPackage, remove: removePackage } = useFieldArray({
        control: form.control,
        name: "packages",
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const finalConfig: AdminConfig = {
            ...data,
            defaultWattages: data.defaultWattages.reduce((acc: Record<string, number>, { key, value }) => {
                if(key) acc[key] = value;
                return acc;
            }, {}),
            locations: data.locations.reduce((acc: Record<string, number>, { key, value }) => {
                if(key) acc[key] = value;
                return acc;
            }, {}),
            backupOptions: data.backupOptions.map(({ value }) => value),
        };

        const result = await saveAdminConfig(finalConfig);

        toast({
            title: result.success ? "Success!" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
    };

    const { isSubmitting, errors } = form.formState;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['wattages']} className="w-full">
                <AccordionItem value="wattages">
                    <AccordionTrigger className="text-xl font-semibold">Default Appliance Wattages</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        {wattageFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start">
                                <div className="flex-1 space-y-1">
                                    <Label>Appliance Name</Label>
                                    <Input {...form.register(`defaultWattages.${index}.key`)} />
                                    {errors.defaultWattages?.[index]?.key && <p className="text-sm text-destructive">{errors.defaultWattages[index]?.key?.message}</p>}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label>Wattage (W)</Label>
                                    <Input type="number" {...form.register(`defaultWattages.${index}.value`, { valueAsNumber: true })} />
                                     {errors.defaultWattages?.[index]?.value && <p className="text-sm text-destructive">{errors.defaultWattages[index]?.value?.message}</p>}
                                </div>
                                <Button type="button" variant="destructive" size="icon" className="mt-6" onClick={() => removeWattage(index)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendWattage({ key: '', value: 0 })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Wattage
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="locations">
                    <AccordionTrigger className="text-xl font-semibold">Locations & Sun Hours</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                         {locationFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start">
                                <div className="flex-1 space-y-1">
                                    <Label>Location Name</Label>
                                    <Input {...form.register(`locations.${index}.key`)} />
                                    {errors.locations?.[index]?.key && <p className="text-sm text-destructive">{errors.locations[index]?.key?.message}</p>}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label>Avg. Sun Hours</Label>
                                    <Input type="number" step="0.1" {...form.register(`locations.${index}.value`, { valueAsNumber: true })} />
                                    {errors.locations?.[index]?.value && <p className="text-sm text-destructive">{errors.locations[index]?.value?.message}</p>}
                                </div>
                                <Button type="button" variant="destructive" size="icon" className="mt-6" onClick={() => removeLocation(index)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendLocation({ key: '', value: 5 })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                        </Button>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="backup">
                    <AccordionTrigger className="text-xl font-semibold">Backup Duration Options</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {backupFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <div className="flex-1 space-y-1">
                                        <Input type="number" {...form.register(`backupOptions.${index}.value`, { valueAsNumber: true })} placeholder="Hours" />
                                        {errors.backupOptions?.[index]?.value && <p className="text-sm text-destructive">{errors.backupOptions[index]?.value?.message}</p>}
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeBackup(index)}><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" onClick={() => appendBackup({ value: 0 })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="packages">
                    <AccordionTrigger className="text-xl font-semibold">Solar Packages</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        {packageFields.map((field, index) => (
                             <Card key={field.id} className="relative p-4 pt-8">
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removePackage(index)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <Label>ID (unique, lowercase, no spaces)</Label>
                                        <Input {...form.register(`packages.${index}.id`)} />
                                        {errors.packages?.[index]?.id && <p className="text-sm text-destructive">{errors.packages[index]?.id?.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Title</Label>
                                        <Input {...form.register(`packages.${index}.title`)} />
                                        {errors.packages?.[index]?.title && <p className="text-sm text-destructive">{errors.packages[index]?.title?.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Inverter</Label>
                                        <Input {...form.register(`packages.${index}.inverter`)} />
                                        {errors.packages?.[index]?.inverter && <p className="text-sm text-destructive">{errors.packages[index]?.inverter?.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Battery</Label>
                                        <Input {...form.register(`packages.${index}.battery`)} />
                                        {errors.packages?.[index]?.battery && <p className="text-sm text-destructive">{errors.packages[index]?.battery?.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Panel</Label>
                                        <Input {...form.register(`packages.${index}.panel`)} />
                                        {errors.packages?.[index]?.panel && <p className="text-sm text-destructive">{errors.packages[index]?.panel?.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Price Range</Label>
                                        <Input {...form.register(`packages.${index}.price`)} />
                                        {errors.packages?.[index]?.price && <p className="text-sm text-destructive">{errors.packages[index]?.price?.message}</p>}
                                    </div>
                                    <div className="sm:col-span-2 space-y-1">
                                        <Label>Ideal For</Label>
                                        <Input {...form.register(`packages.${index}.idealFor`)} />
                                        {errors.packages?.[index]?.idealFor && <p className="text-sm text-destructive">{errors.packages[index]?.idealFor?.message}</p>}
                                    </div>
                                    <div className="sm:col-span-2 space-y-1">
                                        <Label>Description</Label>
                                        <Textarea {...form.register(`packages.${index}.description`)} />
                                        {errors.packages?.[index]?.description && <p className="text-sm text-destructive">{errors.packages[index]?.description?.message}</p>}
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendPackage({ id: '', title: '', inverter: '', battery: '', panel: '', price: '', description: '', idealFor: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Package
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="whatsapp">
                    <AccordionTrigger className="text-xl font-semibold">WhatsApp Settings</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-1">
                            <Label>Contact Name</Label>
                            <Input {...form.register('whatsapp.contactName')} />
                            {errors.whatsapp?.contactName && <p className="text-sm text-destructive">{errors.whatsapp.contactName.message}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label>WhatsApp Number</Label>
                            <Input {...form.register('whatsapp.number')} placeholder="+234..." />
                            {errors.whatsapp?.number && <p className="text-sm text-destructive">{errors.whatsapp.number.message}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label>Default Message</Label>
                            <Textarea {...form.register('whatsapp.message')} />
                             {errors.whatsapp?.message && <p className="text-sm text-destructive">{errors.whatsapp.message.message}</p>}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </form>
    );
}
