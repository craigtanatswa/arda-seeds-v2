"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { useNotification } from "@/components/notification-provider"
import { ClearFiltersButton } from "@/components/admin/clear-filters-button"
import { SalesAdminNav } from "@/components/admin/sales-admin-nav"
import {
  DEFAULT_DELIVERY_SETTINGS,
  parseDeliverySettings,
  type DeliveryLocation,
  type DeliverySettings,
} from "@/lib/delivery"
import { Plus } from "lucide-react"

export default function DeliveryLocationsAdminPage() {
  const { alert, confirm } = useNotification()
  const [locations, setLocations] = useState<DeliveryLocation[]>([])
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [city, setCity] = useState("")
  const [distanceKm, setDistanceKm] = useState("")
  const [baseFee, setBaseFee] = useState(String(DEFAULT_DELIVERY_SETTINGS.base_fee_usd))
  const [perKm, setPerKm] = useState(String(DEFAULT_DELIVERY_SETTINGS.per_km_usd))
  const [perKg, setPerKg] = useState(String(DEFAULT_DELIVERY_SETTINGS.per_kg_usd))
  const [minimumFee, setMinimumFee] = useState(String(DEFAULT_DELIVERY_SETTINGS.minimum_fee_usd))

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    let q = supabase.from("delivery_locations").select("*").order("city")
    if (activeFilter === "active") q = q.eq("is_active", true)
    if (activeFilter === "inactive") q = q.eq("is_active", false)
    const [{ data, error }, settingsRes] = await Promise.all([
      q,
      supabase.from("delivery_settings").select("*").eq("id", true).maybeSingle(),
    ])
    if (error) console.error(error)
    if (settingsRes.error) console.error(settingsRes.error)
    const next = (data as DeliveryLocation[]) ?? []
    setLocations(next)
    const parsed = parseDeliverySettings(settingsRes.data)
    setSettings(parsed)
    setBaseFee(String(parsed.base_fee_usd))
    setPerKm(String(parsed.per_km_usd))
    setPerKg(String(parsed.per_kg_usd))
    setMinimumFee(String(parsed.minimum_fee_usd))
    setSelectedIds((prev) => {
      const visible = new Set(next.map((location) => location.id))
      return new Set([...prev].filter((id) => visible.has(id)))
    })
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [activeFilter])

  const allVisibleSelected =
    locations.length > 0 && locations.every((location) => selectedIds.has(location.id))
  const someVisibleSelected = locations.some((location) => selectedIds.has(location.id))

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setCity("")
    setDistanceKm("")
  }

  const openEdit = (location: DeliveryLocation) => {
    setEditingId(location.id)
    setCity(location.city)
    setDistanceKm(String(location.distance_km))
    setShowForm(true)
  }

  const handleSaveLocation = async () => {
    if (!supabase || !city.trim() || !distanceKm.trim()) {
      await alert("City and distance are required.", "Missing fields")
      return
    }
    const km = Number(distanceKm)
    if (!Number.isFinite(km) || km < 0) {
      await alert("Distance must be a number of kilometres (0 or more).", "Invalid distance")
      return
    }
    const payload = {
      city: city.trim(),
      distance_km: km,
      updated_at: new Date().toISOString(),
    }
    const { error } = editingId
      ? await supabase.from("delivery_locations").update(payload).eq("id", editingId)
      : await supabase.from("delivery_locations").insert({ ...payload, is_active: true })
    if (error) await alert(error.message, "Error")
    else {
      resetForm()
      await load()
    }
  }

  const setActiveForIds = async (ids: string[], nextActive: boolean) => {
    if (!supabase || ids.length === 0) return
    const label = nextActive ? "Activate" : "Deactivate"
    const ok = await confirm(
      nextActive
        ? `Activate ${ids.length} selected city(ies) so customers can choose them for delivery at checkout?`
        : `Deactivate ${ids.length} selected city(ies)? They will be hidden from checkout.`,
      { title: `${label} selected cities`, confirmLabel: label }
    )
    if (!ok) return
    setBusy(true)
    const { error } = await supabase
      .from("delivery_locations")
      .update({ is_active: nextActive, updated_at: new Date().toISOString() })
      .in("id", ids)
    setBusy(false)
    if (error) await alert(error.message, "Error")
    else {
      setSelectedIds(new Set())
      await load()
    }
  }

  const handleDelete = async (location: DeliveryLocation) => {
    if (!supabase) return
    const ok = await confirm("Hard-delete this delivery city? Prefer deactivate if it was used on orders.", {
      title: "Delete city",
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return
    const { error } = await supabase.from("delivery_locations").delete().eq("id", location.id)
    if (error) await alert(error.message, "Could not delete")
    else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(location.id)
        return next
      })
      await load()
    }
  }

  const seedDefaults = async () => {
    const ok = await confirm(
      "If the table is empty, this loads Zimbabwe cities with road distances from Harare. Continue?",
      { title: "Seed default delivery cities", confirmLabel: "Seed" }
    )
    if (!ok) return
    const res = await fetch("/api/delivery-locations")
    const data = await res.json()
    if (!res.ok) await alert(data.error || "Seed failed", "Error")
    else {
      await alert(`Active delivery cities available: ${(data.locations ?? []).length}`, "Done")
      await load()
    }
  }

  const saveRates = async () => {
    if (!supabase) return
    const payload = {
      id: true,
      origin_name: settings.origin_name,
      origin_city: settings.origin_city,
      base_fee_usd: Number(baseFee),
      per_km_usd: Number(perKm),
      per_kg_usd: Number(perKg),
      minimum_fee_usd: Number(minimumFee),
      updated_at: new Date().toISOString(),
    }
    if (
      [payload.base_fee_usd, payload.per_km_usd, payload.per_kg_usd, payload.minimum_fee_usd].some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      await alert("All rates must be valid numbers of 0 or more.", "Invalid rates")
      return
    }
    const { error } = await supabase.from("delivery_settings").upsert(payload, { onConflict: "id" })
    if (error) await alert(error.message, "Error")
    else {
      await alert("Delivery rates saved. New checkout orders will use these values.", "Saved")
      await load()
    }
  }

  const exampleFee = useMemo(() => {
    const raw =
      Number(baseFee || 0) + 100 * Number(perKm || 0) + 25 * Number(perKg || 0)
    return Math.max(Number(minimumFee || 0), raw)
  }, [baseFee, perKm, perKg, minimumFee])

  return (
    <div className="min-h-screen bg-gray-50">
      <SalesAdminNav current="delivery-locations" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Delivery</h1>
            <p className="text-sm text-gray-500 mt-1">
              Set rates and the cities customers can choose for delivery. The fee is $5 + $0.10 per
              km + $0.10 per kg (or the saved rates below). Distances are from ARDA Head Office,
              Harare.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={seedDefaults}>
              Seed defaults
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 gap-1"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              <Plus className="h-4 w-4" /> Add city
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 max-w-3xl space-y-4">
          <h2 className="font-semibold">Delivery rates</h2>
          <p className="text-sm text-gray-500">
            Formula: max(base + (km × per km) + (kg × per kg)). Default is $5 + $0.10/km +
            $0.10/kg. Example for 25 kg over 100 km: US$ {exampleFee.toFixed(2)}.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Base fee (USD)</Label>
              <Input value={baseFee} onChange={(e) => setBaseFee(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Per kilometre (USD)</Label>
              <Input value={perKm} onChange={(e) => setPerKm(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Per kilogram (USD)</Label>
              <Input value={perKg} onChange={(e) => setPerKg(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Minimum fee (USD)</Label>
              <Input value={minimumFee} onChange={(e) => setMinimumFee(e.target.value)} className="mt-1" />
            </div>
          </div>
          <Button onClick={saveRates} className="bg-green-700 hover:bg-green-800">
            Save rates
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-3 max-w-xl">
            <h2 className="font-semibold">{editingId ? "Edit delivery city" : "New delivery city"}</h2>
            <div>
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Distance from Harare (km)</Label>
              <Input
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="mt-1"
                inputMode="decimal"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveLocation} className="bg-green-700 hover:bg-green-800">
                Save
              </Button>
              <Button variant="outline" onClick={resetForm}>
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
          <ClearFiltersButton
            visible={activeFilter !== "all"}
            onClick={() => setActiveFilter("all")}
          />
        </div>

        {someVisibleSelected && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="text-sm font-medium text-green-900">{selectedIds.size} selected</span>
            <Button
              size="sm"
              className="bg-green-700 hover:bg-green-800"
              disabled={busy}
              onClick={() => setActiveForIds([...selectedIds], true)}
            >
              Activate selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setActiveForIds([...selectedIds], false)}
            >
              Deactivate selected
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setSelectedIds(new Set())}>
              Clear selection
            </Button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading…</p>
          ) : locations.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No delivery cities yet. Click “Seed defaults” or add a city.
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
                        onChange={() => {
                          if (allVisibleSelected) {
                            setSelectedIds((prev) => {
                              const next = new Set(prev)
                              locations.forEach((location) => next.delete(location.id))
                              return next
                            })
                            return
                          }
                          setSelectedIds((prev) => {
                            const next = new Set(prev)
                            locations.forEach((location) => next.add(location.id))
                            return next
                          })
                        }}
                        aria-label="Select all visible cities"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-4 py-3">City</th>
                    <th className="text-left px-4 py-3">Distance from Harare</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => {
                    const selected = selectedIds.has(location.id)
                    return (
                      <tr
                        key={location.id}
                        className={`border-b last:border-0 ${selected ? "bg-green-50/60" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              setSelectedIds((prev) => {
                                const next = new Set(prev)
                                if (next.has(location.id)) next.delete(location.id)
                                else next.add(location.id)
                                return next
                              })
                            }}
                            aria-label={`Select ${location.city}`}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{location.city}</td>
                        <td className="px-4 py-3">{Number(location.distance_km).toFixed(0)} km</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              location.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {location.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => openEdit(location)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => setActiveForIds([location.id], !location.is_active)}
                          >
                            {location.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => handleDelete(location)}
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
