export type EventStatus = "mendatang" | "selesai";
export type ApplicantStatus = "menunggu" | "diterima" | "ditolak";

export interface SiteStats {
  id: number;
  events_completed: number;
  total_volunteers: number;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  status: EventStatus;
  image_url: string | null;
  image_public_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryPhoto {
  id: string;
  caption: string | null;
  image_url: string;
  image_public_id: string | null;
  event_id: string | null;
  sort_order: number;
  created_at?: string;
}

export interface RegistrationForm {
  id: string;
  event_id: string | null;
  title: string;
  is_open: boolean;
  total_quota: number;
  created_at?: string;
  plotting?: Plotting[];
}

export interface Plotting {
  id: string;
  form_id: string | null;
  person_name: string;
  quota: number;
  created_at?: string;
  accepted_count?: number;
}

export interface Applicant {
  id: string;
  form_id: string | null;
  plotting_id: string | null;
  full_name: string;
  email: string;
  whatsapp: string;
  instagram: string | null;
  jersey_size: string | null;
  domicile: string | null;
  reason: string | null;
  cv_url: string | null;
  cv_path: string | null;
  status: ApplicantStatus;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Admin {
  id: string;
  name: string;
  role: string;
  created_at?: string;
}
