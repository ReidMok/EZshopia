'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Customer, Email, Order, Product, PublicReview, Review, StoreConfig, Workflow } from '../../../../types';
import MerchantAdminConsole from '../../../../components/MerchantAdminConsole';
import { clearClientSession, getClientSession } from '../../../../lib/authSession';

const DEFAULT_EMAILS: Email[] = [
  {
    id: 'e1',
    from: 'Sarah Jenkins',
    subject: 'Question about shipping to Canada',
    body: 'Hi, I really love the Ceramic Vase but I was wondering if you ship to Toronto? And how long does it take?',
    date: '10:30 AM',
    isRead: false,
    status: 'PENDING',
  },
  {
    id: 'e2',
    from: 'Mike Ross',
    subject: 'Order #1002 Return',
    body: 'The item arrived broken. I need a refund immediately.',
    date: 'Yesterday',
    isRead: true,
    status: 'PENDING',
  },
];

const DEFAULT_WORKFLOWS: Workflow[] = [
  { id: '1', name: 'Auto-reply to 5-star reviews', trigger: 'NEW_REVIEW', condition: 'Rating equals 5', action: 'AUTO_REPLY', isActive: true },
  { id: '2', name: 'Alert Low Stock', trigger: 'LOW_STOCK', condition: 'Inventory < 5', action: 'NOTIFY_ADMIN', isActive: true },
  { id: '3', name: 'Thank You Email', trigger: 'NEW_ORDER', condition: 'Value > $100', action: 'SEND_EMAIL', isActive: false },
];

export default function StoreAdminPage() {
  const params = useParams<{ store: string }>();
  const store = params?.store || 'demo';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'checking' | 'ok' | 'blocked'>('checking');

  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [publicReviews, setPublicReviews] = useState<Array<PublicReview & { productTitle?: string; productSlug?: string }>>([]);

  const [emails, setEmails] = useState<Email[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [reviewReplies, setReviewReplies] = useState<Record<string, string>>({});

  const merchantReviews: Review[] = useMemo(() => {
    return (publicReviews || []).slice(0, 50).map((r) => {
      const visibility = r.visibility || 'VISIBLE';
      const status: Review['status'] = visibility === 'VISIBLE' ? 'APPROVED' : 'PENDING';
      return {
        id: r.id,
        productId: r.productId,
        productName: r.productTitle || 'Product',
        customer: r.authorName,
        rating: r.rating,
        comment: r.body,
        date: new Date(r.createdAt).toLocaleDateString(),
        status,
        reply: status === 'APPROVED' ? reviewReplies[r.id] : undefined,
      };
    });
  }, [publicReviews, reviewReplies]);

  useEffect(() => {
    const session = getClientSession();
    if (!session || session.storeKey !== store) {
      setAuthStatus('blocked');
      router.push('/sign-in');
      return;
    }
    setAuthStatus('ok');
  }, [store, router]);

  useEffect(() => {
    if (authStatus !== 'ok') return;

    const emailsKey = `ezshopia_emails_${encodeURIComponent(store)}`;
    const workflowsKey = `ezshopia_workflows_${encodeURIComponent(store)}`;
    const repliesKey = `ezshopia_review_replies_${encodeURIComponent(store)}`;

    try {
      const rawEmails = localStorage.getItem(emailsKey);
      setEmails(rawEmails ? (JSON.parse(rawEmails) as Email[]) : DEFAULT_EMAILS);
    } catch {
      setEmails(DEFAULT_EMAILS);
    }

    try {
      const rawWorkflows = localStorage.getItem(workflowsKey);
      setWorkflows(rawWorkflows ? (JSON.parse(rawWorkflows) as Workflow[]) : DEFAULT_WORKFLOWS);
    } catch {
      setWorkflows(DEFAULT_WORKFLOWS);
    }

    try {
      const rawReplies = localStorage.getItem(repliesKey);
      setReviewReplies(rawReplies ? (JSON.parse(rawReplies) as Record<string, string>) : {});
    } catch {
      setReviewReplies({});
    }
  }, [store, authStatus]);

  useEffect(() => {
    if (authStatus !== 'ok') return;
    const emailsKey = `ezshopia_emails_${encodeURIComponent(store)}`;
    try {
      localStorage.setItem(emailsKey, JSON.stringify(emails));
    } catch {}
  }, [emails, store, authStatus]);

  useEffect(() => {
    if (authStatus !== 'ok') return;
    const workflowsKey = `ezshopia_workflows_${encodeURIComponent(store)}`;
    try {
      localStorage.setItem(workflowsKey, JSON.stringify(workflows));
    } catch {}
  }, [workflows, store, authStatus]);

  useEffect(() => {
    if (authStatus !== 'ok') return;
    const repliesKey = `ezshopia_review_replies_${encodeURIComponent(store)}`;
    try {
      localStorage.setItem(repliesKey, JSON.stringify(reviewReplies));
    } catch {}
  }, [reviewReplies, store, authStatus]);

  useEffect(() => {
    if (authStatus !== 'ok') return;

    const run = async () => {
      setLoading(true);
      try {
        const bootstrapRes = await fetch(`/api/store/${encodeURIComponent(store)}/bootstrap`, { cache: 'no-store' });
        const bootstrap = await bootstrapRes.json();
        setStoreConfig(bootstrap.storeConfig || null);
        setProducts(Array.isArray(bootstrap.products) ? bootstrap.products : []);
        setOrders(Array.isArray(bootstrap.orders) ? bootstrap.orders : []);
        setCustomers(Array.isArray(bootstrap.customers) ? bootstrap.customers : []);

        try {
          const rRes = await fetch(`/api/store/${encodeURIComponent(store)}/reviews`, { cache: 'no-store' });
          const rData = await rRes.json();
          setPublicReviews(Array.isArray(rData) ? rData : []);
        } catch {
          setPublicReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [store, authStatus]);

  if (loading || !storeConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading store admin…</p>
        </div>
      </div>
    );
  }

  return (
    <MerchantAdminConsole
      storeKey={store}
      storeConfig={storeConfig}
      products={products}
      orders={orders}
      customers={customers}
      reviews={merchantReviews}
      emails={emails}
      workflows={workflows}
      onLogout={() => {
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        clearClientSession();
        router.push('/sign-in');
      }}
      onUpdateStoreConfig={async (patch) => {
        const res = await fetch(`/api/store/${encodeURIComponent(store)}/store-config`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        const updated = await res.json().catch(() => null);
        if (updated && !updated.error) setStoreConfig(updated);
      }}
      onSaveProduct={async (partial) => {
        const res = await fetch(`/api/store/${encodeURIComponent(store)}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial),
        });
        const created = await res.json().catch(() => null);
        if (created && !created.error) setProducts((prev) => [created, ...prev]);
      }}
      onUpdateProduct={async (updatedProduct) => {
        const res = await fetch(`/api/store/${encodeURIComponent(store)}/products/${encodeURIComponent(updatedProduct.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        const updated = await res.json().catch(() => null);
        if (updated && !updated.error) {
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      }}
      onUpdateOrderStatus={async (orderId, newStatus) => {
        const res = await fetch(`/api/store/${encodeURIComponent(store)}/orders/${encodeURIComponent(orderId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        const updated = await res.json().catch(() => null);
        if (updated && !updated.error) {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        }
      }}
      onUpdateCustomer={async (updatedCustomer) => {
        const res = await fetch(`/api/store/${encodeURIComponent(store)}/customers`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCustomer),
        });
        const updated = await res.json().catch(() => null);
        if (updated && !updated.error) {
          setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }
      }}
      onReplyEmail={async (id, replyText) => {
        setEmails((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, status: 'REPLIED', replyDraft: replyText, isRead: true } : e
          )
        );
      }}
      onUpdateReview={async (updatedReview) => {
        const nextVisibility = updatedReview.status === 'APPROVED' ? 'VISIBLE' : 'HIDDEN';

        // Persist reply locally for UI.
        setReviewReplies((prev) => {
          const next = { ...prev };
          if (updatedReview.reply && updatedReview.reply.trim()) next[updatedReview.id] = updatedReview.reply;
          else delete next[updatedReview.id];
          return next;
        });

        // Persist visibility in backend.
        try {
          await fetch(`/api/store/${encodeURIComponent(store)}/reviews`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: updatedReview.productId,
              reviewId: updatedReview.id,
              visibility: nextVisibility,
            }),
          });
        } catch {}

        // Optimistic UI update.
        setPublicReviews((prev) => prev.map((r) => (r.id === updatedReview.id ? { ...r, visibility: nextVisibility } : r)));
      }}
      onToggleWorkflow={(workflowId, nextIsActive) => {
        setWorkflows((prev) => prev.map((w) => (w.id === workflowId ? { ...w, isActive: nextIsActive } : w)));
      }}
    />
  );
}

