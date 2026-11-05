import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";

export async function getEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching events:", error);
      return [];
    }
    return data as Event[];
  } catch (err) {
    console.error("Failed to getEvents:", err);
    return [];
  }
}

export async function getRecentEvents(limit = 3): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error("Error fetching recent events:", error);
      return [];
    }
    return data as Event[];
  } catch (err) {
    console.error("Failed to getRecentEvents:", err);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }
    return data as Event;
  } catch (err) {
    console.error(`Failed to getEventById for ${id}:`, err);
    return null;
  }
}
