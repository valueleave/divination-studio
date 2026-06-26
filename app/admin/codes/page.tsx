'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PendingOrder {
  id: string;
  orderNo: string;
  amount: number;
  turnCount: number;
  createdAt: string;
}

export default function AdminCodes() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const secret = sessionStorage.getItem('admin_secret');
      const res = await fetch('/api/admin/codes', { headers: { authorization: 'Bearer ' + secret } });
      if (!res.ok) throw new Error('Failed');
      setOrders(await res.json());
    } catch (err) { setMessage('Error loading orders'); }
    finally { setLoading(false); }
  };

  const activateOrder = async (orderId: string) => {
    setActivating(orderId);
    try {
      const secret = sessionStorage.getItem('admin_secret');
      const res = await fetch('/api/admin/codes', {
        method: 'POST', headers: { 'Content-Type': 'application/json', authorization: 'Bearer ' + secret },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.code) { setMessage('Activated: ' + data.code); fetchOrders(); }
    } catch { setMessage('Failed to activate'); }
    finally { setActivating(null); }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-2xl font-display tracking-[0.1em] text-foreground mb-2">Pending Orders</h1>
          <p className="text-muted-foreground text-sm">Verify payments and activate redemption codes</p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 mb-8" />
        </div>
        {message && <p className="text-gold text-sm text-center mb-4">{message}</p>}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-8 h-8 text-gold" />
            </motion.div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground"><p>No pending orders.</p></div>
        ) : (
          <div className="space-y-3">
            {orders.map(function(o) {
              return (
                <div key={o.id}>
                  <Card className="border-gold/10">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground font-mono">{o.orderNo}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{new Date(o.createdAt).toLocaleString('zh-CN')}
                        </p>
                        <p className="text-xs text-muted-foreground">{o.amount}元 | {o.turnCount}次</p>
                      </div>
                      <Button size="sm" onClick={function(){activateOrder(o.id)}} disabled={activating === o.id}>
                        {activating === o.id ? '...' : <><Check className="w-3 h-3 mr-1" /> Activate</>}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
