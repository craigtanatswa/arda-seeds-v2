import { supabase } from "@/lib/supabaseClient";
import type { Vacancy } from "@/lib/types";

const VACANCIES_TABLE = "vacancies";

export async function getOpenVacancies(): Promise<Vacancy[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(VACANCIES_TABLE)
    .select("*")
    .eq("status", "open")
    .order("closing_date", { ascending: true });
  if (error) {
    console.error("getOpenVacancies error:", error);
    return [];
  }
  return (data ?? []) as Vacancy[];
}

export async function getVacancyById(id: string): Promise<Vacancy | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(VACANCIES_TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Vacancy;
}
