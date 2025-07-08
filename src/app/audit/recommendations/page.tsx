"use client";

import { useAudit } from '@/context/AuditContext';
import config from '@/data/admin-config.json';
import AuditNavButtons from '@/components/audit/AuditNavButtons';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { calculateSolarNeeds } from '@/lib/solar-calculations';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';


export default function RecommendationsPage() {
    const { audit } = useAudit();
    const calculations = useMemo(() => calculateSolarNeeds(audit), [audit]);
    const { packages } = config;

    const getRecommendationLevel = (packageTitle: string) => {
        const packageKVA = parseFloat(packageTitle.match(/(\d\.\d)kVA/)?.[1] || '0');
        if (calculations.inverterSizeKVA <= packageKVA && calculations.inverterSizeKVA > packageKVA - 2) {
            return 'recommended';
        }
        if (calculations.inverterSizeKVA <= packageKVA) {
            return 'upgrade';
        }
        return 'basic';
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Our Recommended Packages</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Based on your needs, here are some packages that might work for you. The green one is our top suggestion!
                    </p>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {packages.map(pkg => {
                        const level = getRecommendationLevel(pkg.inverter);
                        return (
                            <Card key={pkg.id} className={cn(
                                "flex flex-col transition-all hover:shadow-xl hover:-translate-y-1",
                                level === 'recommended' && "border-2 border-primary shadow-2xl"
                            )}>
                                <CardHeader className="pb-4">
                                    {level === 'recommended' && <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">Recommended</Badge>}
                                    <CardTitle className="text-xl font-bold">{pkg.title}</CardTitle>
                                    {level === 'recommended' ? (
                                        <CardDescription className="text-primary font-semibold h-10">
                                            This is a great fit for your ~{calculations.inverterSizeKVA.toFixed(1)}kVA load.
                                        </CardDescription>
                                    ) : (
                                        <CardDescription className="h-10">{pkg.idealFor}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    {pkg.imageUrl && (
                                        <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                                            <Image
                                                src={pkg.imageUrl}
                                                alt={pkg.title}
                                                fill
                                                className="object-cover"
                                                data-ai-hint="solar package"
                                            />
                                        </div>
                                    )}
                                    <p className="text-3xl font-extrabold my-4">
                                        ~&#8358;{pkg.price}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-6 flex-grow">{pkg.description}</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <strong>Inverter:</strong> {pkg.inverter}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <strong>Battery:</strong> {pkg.battery}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <strong>Panels:</strong> {pkg.panel}
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full bg-accent hover:bg-accent/90">
                                        <Link href="/audit/contact">
                                            Choose Plan <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <AuditNavButtons backPath="/audit/summary" nextPath="/audit/contact" />
        </div>
    );
}
