"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Fuel, Wallet, Users, Sun, Wrench, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const stats = [
  { id: 'homes', text: 'homes don lose light', base: 4321, increment: 3, Icon: Zap },
  { id: 'fuel', text: 'litres of fuel burnt on gen', base: 8765, increment: 7, Icon: Fuel },
  { id: 'naira', text: 'naira wasted on generator', base: 1234567, increment: 150, Icon: Wallet },
  { id: 'shouts', text: 'people don shout "Up NEPA!"', base: 9876, increment: 11, Icon: Users },
];

const StatCard = ({ stat, isVisible }: { stat: typeof stats[0], isVisible: boolean }) => {
  const [count, setCount] = useState(stat.base);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + stat.increment);
    }, 2000);
    return () => clearInterval(interval);
  }, [stat.increment]);

  return (
    <div className={cn("absolute inset-0 transition-opacity duration-1000", isVisible ? "opacity-100" : "opacity-0")}>
      <Card className="h-full bg-primary/10 border-primary/20 flex flex-col items-center justify-center p-4 text-center shadow-lg">
        <stat.Icon className="w-10 h-10 text-primary mb-2" />
        <p className="text-3xl md:text-4xl font-bold text-primary tracking-tighter">
          {count.toLocaleString()}
        </p>
        <p className="text-base text-foreground/80 mt-1">{stat.text}</p>
      </Card>
    </div>
  )
};


export default function OnboardingPage() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [onGenerator, setOnGenerator] = useState(false);
  const [generatorUsers, setGeneratorUsers] = useState(5432);

  useEffect(() => {
    const statTimer = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % stats.length);
    }, 5000);

    return () => clearInterval(statTimer);
  }, []);

  useEffect(() => {
    let generatorTimer: NodeJS.Timeout;
    if (onGenerator) {
      generatorTimer = setInterval(() => {
        setGeneratorUsers(prev => prev + 1);
      }, 3000);
    }
    return () => {
      if (generatorTimer) clearInterval(generatorTimer);
    }
  }, [onGenerator]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:py-6 sm:px-4">
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col justify-around flex-grow">
        
        {/* Top Section */}
        <div>
            <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NoNepa
            </h1>
            </div>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Your friendly guide to kicking NEPA goodbye. Let's find the perfect solar solution for you.
            </p>
        </div>

        {/* Middle Section */}
        <div className="my-4">
            <Card className="w-full max-w-sm mx-auto h-52 relative overflow-hidden">
                <CardContent className="p-0 h-full">
                    <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground z-10 bg-background/80 px-2 py-1 rounded-full">Since you landed here...</p>
                    {stats.map((stat, index) => (
                    <StatCard key={stat.id} stat={stat} isVisible={index === currentStatIndex} />
                    ))}
                </CardContent>
            </Card>

            <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">NEPA dey show you shege?</h2>
                <p className="text-muted-foreground mt-2">Let's calculate your solar needs in a few steps.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-lg transition-transform hover:scale-105">
                        <Link href="/audit/location">
                            Yes, Start My Solar Audit <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="ghost" className="text-lg">
                        <Link href="/denial">
                            No, I enjoy darkness
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
        
        {/* Bottom Section */}
        <div>
            <div className="mt-10 w-full max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center p-4">
                        <Wrench className="w-8 h-8 text-accent mb-2" />
                        <h4 className="font-semibold text-lg">Repairs & Maintenance</h4>
                        <p className="text-sm text-muted-foreground">Keep your lights on, always.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <TrendingUp className="w-8 h-8 text-accent mb-2" />
                        <h4 className="font-semibold text-lg">System Upgrades</h4>
                        <p className="text-sm text-muted-foreground">More power for your growing needs.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <ShieldCheck className="w-8 h-8 text-accent mb-2" />
                        <h4 className="font-semibold text-lg">New Installations</h4>
                        <p className="text-sm text-muted-foreground">From scratch, done right.</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-center space-x-3">
                <Switch id="generator-mode" checked={onGenerator} onCheckedChange={setOnGenerator} aria-label="I am on generator right now" />
                <Label htmlFor="generator-mode" className="text-base font-medium">I'm on generator right now 😡</Label>
            </div>
            {onGenerator && (
                <p className="mt-2 text-accent font-semibold animate-pulse">{generatorUsers.toLocaleString()} people are running generators with you.</p>
            )}
        </div>

      </div>
    </main>
  );
}
