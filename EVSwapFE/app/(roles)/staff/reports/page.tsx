"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookingHeader } from "@/components/shared/booking-header";

type Health = { db: string; queue: string; payments: string; version: string };
type Tx = { id: string; amount: number; status: "approved" | "pending" | "failed"; createdAt: string };

export default function StaffReportsPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    fetch("/api/staff/system/health")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setHealth)
      .catch(() => {
        // Silently fail if health endpoint unavailable (e.g., 404)
        setHealth(null);
      });
    fetch("/api/staff/transactions")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setTxs)
      .catch(() => {
        // Silently fail if transactions endpoint unavailable
        setTxs([]);
      });
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Reports" />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-3">System Health</h3>
          {!health ? <div className="text-sm text-gray-500">Loadingâ€¦</div> : (
            <ul className="text-sm space-y-1">
              <li>DB: <b>{health.db}</b></li>
              <li>Queue: <b>{health.queue}</b></li>
              <li>Payments: <b>{health.payments}</b></li>
              <li>Version: <span className="font-mono">{health.version}</span></li>
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            {txs.length === 0 && <div className="text-sm text-gray-500">No data.</div>}
            {txs.map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                <div>
                  <div className="font-medium">{t.id}</div>
                  <div className="text-xs text-gray-600">{new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div>{t.amount.toLocaleString()} Ä‘</div>
                  <div className={
                    t.status === "approved" ? "text-green-700"
                    : t.status === "failed" ? "text-red-700"
                    : "text-amber-700"
                  }>{t.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
