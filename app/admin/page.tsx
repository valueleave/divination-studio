'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Compass, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const secret = sessionStorage.getItem('admin_secret');
        const res = await fetch('/api/admin/stats', {
          headers: { authorization: 'Bearer ' + secret },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  const statCards = [
    { label: 'Total Divinations', value: stats?.totalRecords ?? 0, icon: BarChart3, color: 'text-blue-400' },
    { label: 'Today', value: stats?.todayRecords ?? 0, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Meihua Yishu', value: stats?.meihuaCount ?? 0, icon: BookOpen, color: 'text-gold' },
    { label: 'Xiao Liu Ren', value: stats?.xiaoliurenCount ?? 0, icon: Compass, color: 'text-purple-400' },
  ];
  return (
    <div className='min-h-screen py-12 px-6'>
      <div className='max-w-6xl mx-auto'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className='w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6' />
          <h1 className='text-2xl md:text-3xl font-display tracking-[0.1em] text-foreground text-center mb-2'>Admin Dashboard</h1>
          <p className='text-muted-foreground text-sm text-center font-display tracking-wider'>Divination Studio Statistics</p>
          <div className='w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 mb-12' />
        </motion.div>
        {loading ? (
          <div className='flex justify-center py-20'>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className='w-8 h-8 text-gold' />
            </motion.div>
          </div>
        ) : error ? (
          <div className='text-center py-20'>
            <p className='text-red-400 mb-4'>Error: {error}</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Card className='border-gold/10 subtle-glow'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-xs text-muted-foreground font-medium flex items-center gap-2'>
                        <Icon className={'w-4 h-4 ' + card.color} />
                        {card.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={'text-3xl font-display tracking-wider ' + card.color}>{card.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          className='border-t border-gold/10 mt-12 pt-6 text-center'>
          <p className='text-xs text-muted-foreground/60'>Last updated: {stats?.generatedAt ? new Date(stats.generatedAt).toLocaleString('zh-CN') : 'N/A'}</p>
        </motion.div>
      </div>
    </div>
  );
}
