import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type ClearFiltersButtonProps = {
  visible: boolean
  onClick: () => void
}

export function ClearFiltersButton({ visible, onClick }: ClearFiltersButtonProps) {
  if (!visible) return null

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} className="gap-1.5 shrink-0">
      <X className="h-4 w-4" /> Clear filters
    </Button>
  )
}
