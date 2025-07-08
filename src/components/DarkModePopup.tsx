"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DarkModePopup() {
  const { setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('darkModePopupShown');
    if (hasBeenShown) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Small delay before showing

    const hideTimer = setTimeout(() => {
      handleClose();
    }, 4000); // 1s delay + 3s visible

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('darkModePopupShown', 'true');
  };

  const switchToDark = () => {
    setTheme('dark');
    handleClose();
  };

  return (
    <div
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
    >
      <Card className="shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <p className="text-sm font-medium">Prefer a darker view?</p>
          <Button size="sm" onClick={switchToDark}>
            <Moon className="mr-2 h-4 w-4" />
            Switch to Dark Mode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
