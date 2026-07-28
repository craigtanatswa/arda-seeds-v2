"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabaseClient"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { PromoBannerPreview } from "@/components/admin/promo-banner-preview"
import { useNotification } from "@/components/notification-provider"
import type { HomepagePromoBannerItem, HomepagePromoBannerSettings } from "@/lib/types"
import { ArrowDown, ArrowUp, LogOut, Megaphone, Plus } from "lucide-react"

export default function PromoBannerAdminPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const { alert, confirm } = useNotification()
  const [settings, setSettings] = useState<HomepagePromoBannerSettings | null>(null)
  const [items, setItems] = useState<HomepagePromoBannerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [text, setText] = useState("")

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const [settingsRes, itemsRes] = await Promise.all([
      supabase.from("homepage_promo_banner_settings").select("*").eq("id", true).maybeSingle(),
      supabase
        .from("homepage_promo_banner_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ])
    if (settingsRes.error) console.error(settingsRes.error)
    if (itemsRes.error) console.error(itemsRes.error)
    setSettings((settingsRes.data as HomepagePromoBannerSettings) ?? { id: true, is_enabled: false })
    setItems((itemsRes.data as HomepagePromoBannerItem[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleBanner = async (enabled: boolean) => {
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase
      .from("homepage_promo_banner_settings")
      .upsert({ id: true, is_enabled: enabled, updated_at: new Date().toISOString() })
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else setSettings((prev) => ({ id: true, is_enabled: enabled, updated_at: prev?.updated_at }))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setText("")
  }

  const handleSave = async () => {
    if (!supabase || !text.trim()) {
      await alert("Message text is required.", "Missing fields")
      return
    }
    setBusy(true)
    if (editingId) {
      const { error } = await supabase
        .from("homepage_promo_banner_items")
        .update({ text: text.trim(), updated_at: new Date().toISOString() })
        .eq("id", editingId)
      setBusy(false)
      if (error) await alert(error.message, "Error")
      else {
        resetForm()
        await load()
      }
      return
    }

    const nextOrder =
      items.length > 0 ? Math.max(...items.map((item) => item.sort_order)) + 1 : 0
    const { error } = await supabase.from("homepage_promo_banner_items").insert({
      text: text.trim(),
      is_active: true,
      sort_order: nextOrder,
    })
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else {
      resetForm()
      await load()
    }
  }

  const startEdit = (item: HomepagePromoBannerItem) => {
    setEditingId(item.id)
    setText(item.text)
    setShowForm(true)
  }

  const toggleItemActive = async (item: HomepagePromoBannerItem) => {
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase
      .from("homepage_promo_banner_items")
      .update({ is_active: !item.is_active, updated_at: new Date().toISOString() })
      .eq("id", item.id)
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else await load()
  }

  const handleDelete = async (item: HomepagePromoBannerItem) => {
    if (!supabase) return
    const ok = await confirm(`Delete “${item.text}”?`, {
      title: "Delete message",
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return
    const { error } = await supabase.from("homepage_promo_banner_items").delete().eq("id", item.id)
    if (error) await alert(error.message, "Error")
    else await load()
  }

  const moveItem = async (item: HomepagePromoBannerItem, direction: "up" | "down") => {
    if (!supabase) return
    const index = items.findIndex((row) => row.id === item.id)
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= items.length) return

    const other = items[swapIndex]
    setBusy(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from("homepage_promo_banner_items").upsert([
      { id: item.id, text: item.text, is_active: item.is_active, sort_order: other.sort_order, updated_at: now },
      { id: other.id, text: other.text, is_active: other.is_active, sort_order: item.sort_order, updated_at: now },
    ])
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else await load()
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-green-700 font-semibold">
              ARDA Seeds
            </Link>
            {userRole === "admin" && (
              <Link href="/admin" className="text-gray-600 text-sm">
                Dashboard
              </Link>
            )}
            <Link href="/admin/sales" className="text-gray-600 text-sm">
              Orders
            </Link>
            <Link href="/admin/sales/customers" className="text-gray-600 text-sm">
              Customers
            </Link>
            <Link href="/admin/sales/collection-points" className="text-gray-600 text-sm">
              Collection points
            </Link>
            <Link href="/admin/sales/promo-banner" className="text-gray-900 font-medium">
              Promo banner
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-green-700" />
              Homepage promo banner
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the scrolling announcement strip shown below the hero on the homepage.
            </p>
          </div>
          <Button
            className="bg-green-700 hover:bg-green-800 gap-1"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            <Plus className="h-4 w-4" /> Add message
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">Banner visibility</h2>
              <p className="text-sm text-gray-500 mt-1">
                When enabled, active messages scroll left to right under the hero section.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="banner-enabled" className="text-sm font-medium">
                {settings?.is_enabled ? "Visible on homepage" : "Hidden on homepage"}
              </Label>
              <Switch
                id="banner-enabled"
                checked={settings?.is_enabled ?? false}
                disabled={busy || loading}
                onCheckedChange={toggleBanner}
              />
            </div>
          </div>
        </div>

        {!loading && <PromoBannerPreview settings={settings} items={items} />}

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-3 max-w-xl">
            <h2 className="font-semibold">{editingId ? "Edit message" : "New message"}</h2>
            <div>
              <Label htmlFor="promo-text">Message text</Label>
              <Input
                id="promo-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='e.g. "Sale Sale Sale!!!" or "ZS265 is now 50% off !!!"'
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={busy}
                className="bg-green-700 hover:bg-green-800"
              >
                Save
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No messages yet. Add promotional text for the homepage carousel.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3">Order</th>
                    <th className="text-left px-4 py-3">Message</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={busy || index === 0}
                            onClick={() => moveItem(item, "up")}
                            aria-label="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={busy || index === items.length - 1}
                            onClick={() => moveItem(item, "down")}
                            aria-label="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium max-w-md">{item.text}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            item.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button variant="outline" size="sm" disabled={busy} onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => toggleItemActive(item)}
                        >
                          {item.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
