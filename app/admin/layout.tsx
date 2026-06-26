'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, BarChart3, Database, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_secret');
    if (stored) {
      setAuthenticated(true);
      setSecretInput(stored);
    }
  }, []);
  const handleLogin = () => {
    sessionStorage.setItem('admin_secret', secretInput);
    setAuthenticated(true);
  };
  if (!authenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-6'>
        <div className='max-w-sm w-full'>
          <div className='text-center mb-8'>
            <Shield className='w-12 h-12 text-gold mx-auto mb-4' />
            <h1 className='text-2xl font-display tracking-wider text-foreground'>Admin Access</h1>
            <p className='text-sm text-muted-foreground mt-2'>Enter admin secret to continue</p>
          </div>
          <input
            type='password'
            value={secretInput}
            onChange={e => setSecretInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder='Admin Secret'
            className='w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 mb-4'
          />
          <Button onClick={handleLogin} className='w-full'>
            <LogIn className='w-4 h-4 mr-2' /> Authenticate
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className='border-b border-gold/10 bg-card'>
        <div className='max-w-7xl mx-auto px-6 flex items-center gap-6 h-12'>
          <a href='/admin' className={'text-xs tracking-wider flex items-center gap-1 ' + (pathname === '/admin' ? 'text-gold' : 'text-muted-foreground hover:text-gold transition-colors')}>
            <BarChart3 className='w-3 h-3' /> Dashboard
          </a>
          <a href='/admin/records' className={'text-xs tracking-wider flex items-center gap-1 ' + (pathname === '/admin/records' ? 'text-gold' : 'text-muted-foreground hover:text-gold transition-colors')}>
            <Database className='w-3 h-3' /> Records
          </a>
          <span className='ml-auto text-xs text-muted-foreground'>Admin Panel</span>
        </div>
      </div>
      {children}
    </div>
  );
}
