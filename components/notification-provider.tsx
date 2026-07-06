"use client"

import { createContext, useCallback, useContext, useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type ConfirmOptions = {
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type NotificationContextValue = {
  alert: (message: string, title?: string) => Promise<void>
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

type DialogState =
  | {
      kind: "alert"
      title: string
      message: string
      resolve: () => void
    }
  | {
      kind: "confirm"
      title: string
      message: string
      confirmLabel: string
      cancelLabel: string
      destructive: boolean
      resolve: (value: boolean) => void
    }

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const alert = useCallback((message: string, title = "Notice") => {
    return new Promise<void>((resolve) => {
      setDialog({
        kind: "alert",
        title,
        message,
        resolve: () => {
          resolve()
          setDialog(null)
        },
      })
    })
  }, [])

  const confirm = useCallback((message: string, options?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        kind: "confirm",
        title: options?.title ?? "Confirm",
        message,
        confirmLabel: options?.confirmLabel ?? "Confirm",
        cancelLabel: options?.cancelLabel ?? "Cancel",
        destructive: options?.destructive ?? false,
        resolve: (value) => {
          resolve(value)
          setDialog(null)
        },
      })
    })
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (open || !dialog) return
    if (dialog.kind === "alert") dialog.resolve()
    else dialog.resolve(false)
    setDialog(null)
  }

  const isError = dialog?.kind === "alert" && dialog.title.toLowerCase() === "error"

  return (
    <NotificationContext.Provider value={{ alert, confirm }}>
      {children}
      <AlertDialog open={dialog !== null} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="rounded-xl border border-gray-200 bg-white p-0 gap-0 max-w-md overflow-hidden">
          <AlertDialogHeader className="px-6 pt-6 pb-4 space-y-3">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  dialog?.kind === "confirm" || isError
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                )}
              >
                {dialog?.kind === "confirm" || isError ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1.5 text-left">
                <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                  {dialog?.title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {dialog?.message}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 sm:space-x-2">
            {dialog?.kind === "confirm" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => dialog.resolve(false)}
                >
                  {dialog.cancelLabel}
                </Button>
                <Button
                  type="button"
                  className={cn(
                    "rounded-lg",
                    dialog.destructive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  )}
                  onClick={() => dialog.resolve(true)}
                >
                  {dialog.confirmLabel}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="rounded-lg bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto"
                onClick={() => dialog?.resolve()}
              >
                OK
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return context
}
