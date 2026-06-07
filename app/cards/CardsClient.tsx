'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { CreditCard } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddCardModal } from '@/components/cards/AddCardModal'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface CardsClientProps {
  initialCards: CreditCard[]
  userId: string
  plan: string
}

export function CardsClient({ initialCards, userId, plan }: CardsClientProps) {
  const [cards, setCards] = useState<CreditCard[]>(initialCards)
  const [showAdd, setShowAdd] = useState(false)
  const [editCard, setEditCard] = useState<CreditCard | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const isFree = plan === 'free'
  const atLimit = isFree && cards.length >= 2

  async function refresh() {
    const supabase = createClient()
    const { data } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    setCards(data || [])
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('credit_cards').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Kad dipadam.')
      setDeleteConfirm(null)
      refresh()
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kad Kredit Saya</h1>
          <p className="text-muted-foreground text-sm mt-1">{cards.length} kad{isFree ? ` / 2 (Free Plan)` : ''}</p>
        </div>
        {atLimit ? (
          <Button disabled className="gap-2">
            <Lock className="h-4 w-4" />
            Had 2 Kad (Free)
          </Button>
        ) : (
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kad
          </Button>
        )}
      </div>

      {atLimit && (
        <div className="rounded-lg p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          ⚠ Anda telah mencapai had 2 kad untuk pelan Free.{' '}
          <a href="/settings" className="font-semibold underline">Naik taraf ke Pro</a> untuk tambah lebih banyak kad.
        </div>
      )}

      {cards.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Tiada kad lagi.</p>
          <Button onClick={() => setShowAdd(true)} className="mt-4">Tambah Kad Pertama</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => {
            const utilPct = Math.round((card.current_balance / card.credit_limit) * 100)
            return (
              <Card key={card.id} className="overflow-hidden">
                <div className="h-2" style={{ background: card.color }} />
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{card.name}</p>
                      <p className="text-sm text-muted-foreground">{card.bank}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">{card.card_type}</Badge>
                      {!card.is_active && <Badge variant="secondary" className="text-xs">Tidak Aktif</Badge>}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">•••• •••• •••• {card.last_four}</p>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Penggunaan</span>
                      <span className={cn('font-medium', utilPct > 70 ? 'text-red-600' : utilPct > 30 ? 'text-amber-600' : 'text-green-600')}>
                        {utilPct}%
                      </span>
                    </div>
                    <Progress
                      value={utilPct}
                      className={cn('h-1.5', utilPct > 70 ? '[&>div]:bg-red-500' : utilPct > 30 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500')}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>RM{card.current_balance.toLocaleString()}</span>
                      <span>RM{card.credit_limit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Statement: Hari {card.statement_day} • Due: +{card.due_day_offset} hari
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setEditCard(card)}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    {deleteConfirm === card.id ? (
                      <>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(card.id)}>
                          Confirm?
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setDeleteConfirm(card.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AddCardModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={refresh}
        userId={userId}
      />
      {editCard && (
        <AddCardModal
          open={!!editCard}
          onClose={() => setEditCard(null)}
          onSuccess={refresh}
          userId={userId}
          editCard={editCard}
        />
      )}
    </div>
  )
}
