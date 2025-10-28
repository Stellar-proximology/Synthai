import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-deep-space">
      <Navigation />
      
      {/* Main content with proper spacing for navigation */}
      <main className={`
        ${!isMobile ? 'pt-16' : 'pb-16'} 
        min-h-screen
      `}>
        {children}
      </main>
    </div>
  );
}