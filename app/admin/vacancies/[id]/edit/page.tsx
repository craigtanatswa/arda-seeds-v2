import { redirect } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

export default async function AdminVacancyEditRedirect({ params }: Props) {
  const { id } = await params
  redirect(`/admin/hr/vacancies/${id}/edit`)
}
