"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { useAdminRole } from "@/lib/hooks/use-admin-role"
import { useNotification } from "@/components/notification-provider"
import { ClearFiltersButton } from "@/components/admin/clear-filters-button"
import type { CollectionPoint, CollectionPointType } from "@/lib/types"
import { LogOut, Plus } from "lucide-react"

export default function CollectionPointsAdminPage() {
  const router = useRouter()
  const userRole = useAdminRole()
  const { alert, confirm } = useNotification()
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [cityFilter, setCityFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | CollectionPointType>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [type, setType] = useState<CollectionPointType>("depot")

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("collection_points").select("*").order("city").order("name")
    if (cityFilter !== "all") q = q.eq("city", cityFilter)
    if (activeFilter === "active") q = q.eq("is_active", true)
    if (activeFilter === "inactive") q = q.eq("is_active", false)
    if (typeFilter !== "all") q = q.eq("type", typeFilter)
    const { data, error } = await q
    if (error) console.error(error)
    const next = (data as CollectionPoint[]) ?? []
    setPoints(next)
    setSelectedIds((prev) => {
      const visible = new Set(next.map((p) => p.id))
      return new Set([...prev].filter((id) => visible.has(id)))
    })
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [cityFilter, activeFilter, typeFilter])

  const cities = useMemo(
    () => Array.from(new Set(points.map((p) => p.city))).sort(),
    [points]
  )

  const allVisibleSelected =
    points.length > 0 && points.every((point) => selectedIds.has(point.id))
  const someVisibleSelected = points.some((point) => selectedIds.has(point.id))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        points.forEach((p) => next.delete(p.id))
        return next
      })
      return
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      points.forEach((p) => next.add(p.id))
      return next
    })
  }

  const handleAdd = async () => {
    if (!supabase || !name.trim() || !city.trim()) {
      await alert("Name and city are required.", "Missing fields")
      return
    }
    const { error } = await supabase.from("collection_points").insert({
      name: name.trim(),
      city: city.trim(),
      address: address.trim() || null,
      type,
      is_active: true,
    })
    if (error) await alert(error.message, "Error")
    else {
      setShowForm(false)
      setName("")
      setCity("")
      setAddress("")
      setType("depot")
      await load()
    }
  }

  const setActiveForIds = async (ids: string[], nextActive: boolean) => {
    if (!supabase || ids.length === 0) return
    const label = nextActive ? "Activate" : "Deactivate"
    const ok = await confirm(
      nextActive
        ? `Activate ${ids.length} selected location(s) so customers can choose them at checkout?`
        : `Deactivate ${ids.length} selected location(s)? They will be hidden from checkout (orders keep historical snapshots).`,
      {
        title: `${label} selected locations`,
        confirmLabel: label,
      }
    )
    if (!ok) return
    setBusy(true)
    const { error } = await supabase
      .from("collection_points")
      .update({ is_active: nextActive, updated_at: new Date().toISOString() })
      .in("id", ids)
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else {
      setSelectedIds(new Set())
      await load()
    }
  }

  const toggleActive = async (point: CollectionPoint) => {
    await setActiveForIds([point.id], !point.is_active)
  }

  const bulkActivate = async () => {
    await setActiveForIds([...selectedIds], true)
  }

  const bulkDeactivate = async () => {
    await setActiveForIds([...selectedIds], false)
  }

  const handleDelete = async (point: CollectionPoint) => {
    if (!supabase) return
    const ok = await confirm("Hard-delete this location? Prefer deactivate if it was used on orders.", {
      title: "Delete location",
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return
    const { error } = await supabase.from("collection_points").delete().eq("id", point.id)
    if (error) {
      await alert(
        `${error.message}. Tip: deactivate instead if orders reference this point.`,
        "Could not delete"
      )
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(point.id)
        return next
      })
      await load()
    }
  }

  const seedDefaults = async () => {
    const ok = await confirm(
      "If the table is empty, this loads Head Office, GMB depots, Farm & City, and Electrosales. Continue?",
      { title: "Seed default locations", confirmLabel: "Seed" }
    )
    if (!ok) return
    const res = await fetch("/api/collection-points")
    const data = await res.json()
    if (!res.ok) await alert(data.error || "Seed failed", "Error")
    else {
      await alert(`Active locations available: ${(data.points ?? []).length}`, "Done")
      await load()
    }
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
            <Link href="/admin/sales/collection-points" className="text-gray-900 font-medium">
              Collection points
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
            <h1 className="text-2xl font-bold">Collection points</h1>
            <p className="text-sm text-gray-500 mt-1">
              Activate only locations that currently have stock for collection. Select multiple
              rows to activate or deactivate in bulk.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={seedDefaults}>
              Seed defaults
            </Button>
            <Button className="bg-green-700 hover:bg-green-800 gap-1" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Add location
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-3 max-w-xl">
            <h2 className="font-semibold">New collection point</h2>
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CollectionPointType)}
                className="mt-1 w-full h-10 rounded-md border px-3 text-sm"
              >
                <option value="depot">Depot</option>
                <option value="retail_partner">Retail partner</option>
                <option value="head_office">Head office</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-green-700 hover:bg-green-800">
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="all">All types</option>
            <option value="depot">Depot</option>
            <option value="retail_partner">Retail partner</option>
            <option value="head_office">Head office</option>
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ClearFiltersButton
            visible={activeFilter !== "all" || cityFilter !== "all" || typeFilter !== "all"}
            onClick={() => {
              setActiveFilter("all")
              setTypeFilter("all")
              setCityFilter("all")
            }}
          />
        </div>

        {someVisibleSelected && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="text-sm font-medium text-green-900">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              className="bg-green-700 hover:bg-green-800"
              disabled={busy}
              onClick={bulkActivate}
            >
              Activate selected
            </Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={bulkDeactivate}>
              Deactivate selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading…</p>
          ) : points.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No locations yet. Click “Seed defaults” or add a location.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected
                        }}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select all visible locations"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">City</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => {
                    const selected = selectedIds.has(point.id)
                    return (
                      <tr
                        key={point.id}
                        className={`border-b last:border-0 ${selected ? "bg-green-50/60" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect(point.id)}
                            aria-label={`Select ${point.name}`}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{point.name}</div>
                          {point.address && (
                            <div className="text-xs text-gray-500">{point.address}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">{point.city}</td>
                        <td className="px-4 py-3 capitalize">{point.type.replace("_", " ")}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              point.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {point.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => toggleActive(point)}
                          >
                            {point.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => handleDelete(point)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
