'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { CreditCard } from '@/types'

const PRESET_COLORS = [
  '#378ADD', '#E24B4A', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C',
  '#E91E8C', '#FF6B35', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B',
  '#3F51B5', '#009688', '#FFC107', '#795548', '#F06292', '#26C6DA',
]

interface AddCardModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
  editCard?: CreditCard | null
}

export function AddCardModal({ open, onClose, onSuccess, userId, editCard }: AddCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: editCard?.name || '',
    bank: editCard?.bank || '',
    card_type: editCard?.card_type || 'Visa',
    last_four: editCard?.last_four || '',
    credit_limit: editCard?.credit_limit?.toString() || '',
    current_balance: editCard?.current_balance?.toString() || '',
    statement_day: editCard?.statement_day?.toString() || '',
    color: editCard?.color || '#378ADD',
    shared_limit_group: editCard?.shared_limit_group || '',
  })

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = {
      user_id: userId,
      name: form.name,
      bank: form.bank,
      card_type: form.card_type,
      last_four: form.last_four,
      credit_limit: parseFloat(form.credit_limit),
      current_balance: parseFloat(form.current_balance) || 0,
      statement_day: parseInt(form.statement_day),
      due_day_offset: 20,
      color: form.color,
      is_active: true,
      shared_limit_group: form.shared_limit_group.trim() || null,
    }

    let error
    if (editCard) {
      const result = await supabase.from('credit_cards').update(payload).eq('id', editCard.id)
      error = result.error
    } else {
      const result = await supabase.from('credit_cards').insert(payload)
      error = result.error
    }

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(editCard ? 'Kad dikemaskini!' : 'Kad berjaya ditambah!')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCard ? 'Edit Kad' : 'Tambah Kad Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nama Kad</Label>
              <Input placeholder="Contoh: Al-Taslif" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Bank</Label>
              <Input placeholder="Contoh: Maybank" value={form.bank} onChange={e => update('bank', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Jenis Kad</Label>
              <Select value={form.card_type} onValueChange={v => update('card_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="Amex">Amex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>4 Digit Terakhir</Label>
              <Input placeholder="1234" maxLength={4} value={form.last_four} onChange={e => update('last_four', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Had Kredit (RM)</Label>
              <Input type="number" placeholder="10000" value={form.credit_limit} onChange={e => update('credit_limit', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Baki Semasa (RM)</Label>
              <Input type="number" placeholder="0" value={form.current_balance} onChange={e => update('current_balance', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Hari Statement (1–28)</Label>
            <Input type="number" min={1} max={28} placeholder="8" value={form.statement_day} onChange={e => update('statement_day', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Kumpulan Limit Dikongsi <span className="text-muted-foreground font-normal">(pilihan)</span></Label>
            <Input
              placeholder="Contoh: Maybank"
              value={form.shared_limit_group}
              onChange={e => update('shared_limit_group', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Isi jika kad ini berkongsi limit kredit dengan kad lain dari bank yang sama.</p>
          </div>
          <div className="space-y-2">
            <Label>Warna Kad</Label>
            <div className="grid grid-cols-9 gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                  style={{ background: color }}
                  onClick={() => update('color', color)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editCard ? 'Kemaskini' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
