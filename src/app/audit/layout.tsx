import { AuditProvider } from "@/context/AuditContext";
import ProgressBar from "@/components/audit/ProgressBar";
import Link from "next/link";
import { Sun } from "lucide-react";
import PageTransitionWrapper from "@/components/audit/PageTransitionWrapper";

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuditProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NoNepa
              </span>
            </Link>
            <div className="w-1/3">
              <ProgressBar />
            </div>
          </div>
        </header>
        <main className="flex-grow">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
      </div>
    </AuditProvider>
  )
}
