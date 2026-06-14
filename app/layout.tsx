import './globals.css';
import type {Metadata} from 'next';
import { AuthProvider } from '@/hooks/use-auth';
import MouseSpotlight from '@/components/MouseSpotlight';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'Portfolio | Full-stack Developer',
  description: 'รวบรวมผลงานและการพัฒนาซอฟต์แวร์โดยนักพัฒนา Full-stack',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth scroll-pt-16 md:scroll-pt-20">
      <body suppressHydrationWarning className="bg-[#0A0A0A] text-white overflow-x-hidden">
        <MouseSpotlight />
        <AuthProvider>
          {children}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
