'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Check } from 'lucide-react'

const FREE_FEATURES = ['Sehingga 2 kad kredit', 'Kalkulator float', 'Perancang Pintar', 'Sejarah 30 hari']
const PRO_FEATURES = ['Kad kredit tanpa had', 'Eksport CSV', 'Sejarah penuh', 'Sokongan keutamaan', 'Analitik lanjutan']

export function SettingsClient({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile?.id) {
      toast.error('Profil tidak dimuatkan. Sila muat semula.')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)
    if (error) toast.error(error.message)
    else toast.success('Profil dikemaskini!')
    setSaving(false)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Akaun dipadam.')
      router.push('/')
    } catch {
      toast.error('Gagal memadam akaun. Sila hubungi sokongan.')
    } finally {
      setDeleting(false)
    }
  }

  const isPro = profile?.plan === 'pro'

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Tetapan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Maklumat akaun anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Penuh</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mel</Label>
              <Input value={profile?.email || ''} disabled className="bg-muted" />
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pelan Semasa
            <Badge variant={isPro ? 'default' : 'secondary'}>{isPro ? 'Pro' : 'Percuma'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Percuma</h3>
              <ul className="space-y-1.5">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-1">Pro — RM9/bulan</h3>
              <p className="text-xs text-muted-foreground mb-3">Everything in Percuma, plus:</p>
              <ul className="space-y-1.5">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              {!isPro && (
                <Button className="w-full mt-4" size="sm">
                  Naik Taraf ke Pro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zon Bahaya</CardTitle>
          <CardDescription>Tindakan ini tidak boleh dibatalkan.</CardDescription>
        </CardHeader>
        <CardContent>
          {deleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Anda pasti? Semua data anda akan dipadam secara kekal.
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ya, Padam Akaun
                </Button>
                <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Batal</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteConfirm(true)}>
              Padam Akaun
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
