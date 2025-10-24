'use client'
import HeroSection from '@/components/marketing/hero-2';
import FeatureSection from '@/components/marketing/features';
import StatSection from '@/components/marketing/stats';
import FaqSection from '@/components/marketing/faq';
import FooterSection from '@/components/marketing/footer';
import { usePathname } from 'next/navigation';
 

 
export default function Home() {
  const dashboard = usePathname() === '/dashboard'
    return (
        <div>
            <HeroSection dashboard={dashboard} />
            <StatSection />
            <FeatureSection />
            <FaqSection />
            <FooterSection />
        </div>
    )
}