"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { ADMIN_SYSTEMS, getSystemByRole } from "@/lib/admin-systems"
import { Plus, LogOut, LayoutDashboard, Shield, Trash2 } from "lucide-react"

type AdminRow = { id: string; email: string | null; role: string }

export default function ManageAdminsPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addPassword, setAddPassword] = useState("")
  const [addRole, setAddRole] = useState(ADMIN_SYSTEMS[0]?.role ?? "admin_hr")
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login")
        return
      }
      setAccessToken(session.access_token)
      supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.role !== "admin") {
            router.replace("/admin")
            return
          }
          setLoading(false)
        })
    })
  }, [router])

  useEffect(() => {
    if (!accessToken) return
    fetch("/api/admin/admins", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.admins) setAdmins(data.admins)
      })
      .catch(() => setAdmins([]))
  }, [accessToken, addOpen, editId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return
    setAddSubmitting(true)
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          email: addEmail.trim(),
          password: addPassword.trim() || undefined,
          role: addRole,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? "Failed to add admin")
        return
      }
      setAdmins((prev) => [...prev.filter((a) => a.id !== data.id), { id: data.id, email: data.email ?? addEmail, role: data.role }])
      setAddOpen(false)
      setAddEmail("")
      setAddPassword("")
      setAddRole(ADMIN_SYSTEMS[0]?.role ?? "admin_hr")
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!accessToken || !editId) return
    setEditSubmitting(true)
    try {
      const res = await fetch(`/api/admin/admins/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ role: editRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? "Failed to update")
        return
      }
      setAdmins((prev) => prev.map((a) => (a.id === editId ? { ...a, role: data.role } : a)))
      setEditId(null)
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-800">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="/admin/admins" className="flex items-center gap-2 text-gray-900 font-medium">
              <Shield className="h-5 w-5" /> Manage Admins
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
            <p className="text-gray-600 mt-1">Add or remove system admins. Each admin can only access their assigned system.</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="bg-green-700 hover:bg-green-800 gap-2">
            <Plus className="h-4 w-4" /> Add admin
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">System</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                    No system admins yet. Add one to grant access to HR or Procurement.
                  </td>
                </tr>
              ) : (
                admins.map((a) => {
                  const system = getSystemByRole(a.role)
                  return (
                    <tr key={a.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 text-gray-900">{a.email ?? "(no email)"}</td>
                      <td className="py-3 px-4 text-gray-600">{system?.label ?? a.role}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditId(a.id)
                            setEditRole(a.role)
                          }}
                        >
                          Change role
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => {
                            setEditId(a.id)
                            setEditRole("user")
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Revoke
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add system admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Password (optional; min 6 characters)</Label>
              <Input
                type="password"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                placeholder="Leave blank to send invite"
                className="mt-1"
                minLength={6}
              />
            </div>
            <div>
              <Label>System access *</Label>
              <Select value={addRole} onValueChange={setAddRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_SYSTEMS.map((s) => (
                    <SelectItem key={s.key} value={s.role}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addSubmitting} className="bg-green-700 hover:bg-green-800">
                {addSubmitting ? "Adding..." : "Add admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRole === "user" ? "Revoke admin access" : "Change role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editRole === "user" ? (
              <p className="text-gray-600">This user will lose admin access and become a regular user.</p>
            ) : (
              <div>
                <Label>System access</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_SYSTEMS.map((s) => (
                      <SelectItem key={s.key} value={s.role}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditId(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} disabled={editSubmitting} className="bg-green-700 hover:bg-green-800">
                {editSubmitting ? "Saving..." : editRole === "user" ? "Revoke access" : "Save"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
