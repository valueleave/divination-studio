'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, ArrowLeft, ArrowRight, BookOpen, Compass, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
interface AdminRecord {
  id: string; method: string; question: string; createdAt: string;
}
export default function AdminRecords() {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const fetchRecords = async (p: number, q: string) => {
    setLoading(true);
    try {
      const secret = sessionStorage.getItem('admin_secret');
      const res = await fetch('/api/admin/records?page=' + p + '&limit=20&search=' + encodeURIComponent(q), {
        headers: { authorization: 'Bearer ' + secret },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRecords(data.records); setTotalPages(data.totalPages); setTotal(data.total);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchRecords(page, search); }, [page]);
  const handleSearch = () => { setPage(1); fetchRecords(1, search); };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    try {
      const secret = sessionStorage.getItem('admin_secret');
      await fetch('/api/admin/records', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', authorization: 'Bearer ' + secret },
        body: JSON.stringify({ id }),
      });
      fetchRecords(page, search);
    } catch (err) { console.error(err); }
  };
  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL records? This cannot be undone.')) return;
    try {
      const secret = sessionStorage.getItem('admin_secret');
      await fetch('/api/admin/records', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', authorization: 'Bearer ' + secret },
        body: JSON.stringify({ id: 'all' }),
      });
      fetchRecords(1, ''); setSearch('');
    } catch (err) { console.error(err); }
  };
  const formatDate = (iso: string) => new Date(iso).toLocaleString('zh-CN');
  return (
    <div className='min-h-screen py-12 px-6'>
      <div className='max-w-5xl mx-auto'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className='w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6' />
          <h1 className='text-2xl md:text-3xl font-display tracking-[0.1em] text-foreground text-center mb-2'>Records Management</h1>
          <p className='text-muted-foreground text-sm text-center font-display tracking-wider'>Total: {total} records</p>
          <div className='w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 mb-8' />
        </motion.div>
        <div className='flex gap-3 mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder='Search by question or method...'
              className='w-full h-10 pl-10 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50'
            />
          </div>
          <Button onClick={handleSearch} variant='outline'>Search</Button>
          <Button onClick={handleDeleteAll} variant='destructive' className='whitespace-nowrap'>Delete All</Button>
        </div>
        {loading ? (
          <div className='flex justify-center py-20'>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className='w-8 h-8 text-gold' />
            </motion.div>
          </div>
        ) : error ? (
          <div className='text-center py-20 text-red-400'><p>Error: {error}</p></div>
        ) : records.length === 0 ? (
          <div className='text-center py-20 text-muted-foreground'><p>No records found.</p></div>
        ) : (
          <>
            <div className='space-y-2'>
              {records.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                  <Card className='border-gold/10 hover:border-gold/30 transition-all'>
                    <CardContent className='p-3 flex items-center gap-3'>
                      {r.method === 'meihua' ? <BookOpen className='w-4 h-4 text-gold shrink-0' /> : <Compass className='w-4 h-4 text-purple-400 shrink-0' />}
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-foreground/80 truncate'>{r.question}</p>
                        <p className='text-xs text-muted-foreground/60 flex items-center gap-1 mt-0.5'>
                          <Clock className='w-3 h-3' />{formatDate(r.createdAt)}
                          <span className={'ml-2 px-1.5 py-0.5 rounded text-[10px] ' + (r.method === 'meihua' ? 'bg-gold/10 text-gold' : 'bg-purple-500/10 text-purple-400')}>{r.method}</span>
                        </p>
                      </div>
                      <Button variant='ghost' size='sm' onClick={() => handleDelete(r.id)} className='text-muted-foreground hover:text-red-400 shrink-0'>
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-4 mt-8'>
                <Button variant='outline' size='sm' onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ArrowLeft className='w-3 h-3 mr-1' /> Prev
                </Button>
                <span className='text-xs text-muted-foreground'>Page {page} of {totalPages}</span>
                <Button variant='outline' size='sm' onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next <ArrowRight className='w-3 h-3 ml-1' />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
