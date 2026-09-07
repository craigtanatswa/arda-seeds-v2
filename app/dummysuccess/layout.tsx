import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order confirmed! Thanks for shopping with us",
  robots: { index: false, follow: false },
}

export default function DummySuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
