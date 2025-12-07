import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { PageViewTracker } from '@/components/shared/PageViewTracker';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageViewTracker />
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
