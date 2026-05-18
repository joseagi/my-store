'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
type OrderStatus = typeof STATUSES[number]

const statusStyles: Record<OrderStatus, string> = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID:      'bg-green-50  text-green-700  border-green-200',
  SHIPPED:   'bg-blue-50   text-blue-700   border-blue-200',
  DELIVERED: 'bg-green-50  text-green-700  border-green-200',
  CANCELLED: 'bg-red-50    text-red-700    border-red-200',
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(next: OrderStatus) {
    setSaving(true)
    const prev = status
    setStatus(next)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error()
      toast({ title: `Order status updated to ${next}` })
      router.refresh()
    } catch {
      setStatus(prev)
      toast({ title: 'Failed to update status', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={e => handleChange(e.target.value as OrderStatus)}
      className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
        ${statusStyles[status]}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
