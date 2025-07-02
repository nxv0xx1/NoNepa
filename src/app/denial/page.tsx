import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react';

export default function DenialPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
      <Moon className="w-24 h-24 text-primary animate-pulse mb-8" />
      <h1 className="text-4xl font-bold mb-4">You and NEPA na 5 & 6!</h1>
      <p className="text-lg text-gray-300 max-w-md mb-8">
        No problem, we respect your commitment to the candle and generator business. May your power bank always be charged.
      </p>
      <Button asChild variant="secondary" size="lg">
        <Link href="/">
          I've changed my mind, show me the light
        </Link>
      </Button>
    </div>
  );
}
