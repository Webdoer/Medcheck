// Shared TypeScript types

export type Lang = "hi" | "en" | "ta" | "bn" | "mr" | "te";

export interface FieldExtraction {
  value: string | null;
  confidence: number;
}

export interface LabelOCRResponse {
  drug_name: FieldExtraction;
  batch_number: FieldExtraction;
  manufacturer: FieldExtraction;
  mfg_date: FieldExtraction;
  expiry_date: FieldExtraction;
  licence_no: FieldExtraction;
  raw_llm_output?: string | null;
  routed_to_review?: boolean;
}

export interface MedicineForm {
  drug_name: string;
  batch_number: string;
  manufacturer: string;
  mfg_date: string;
  expiry_date: string;
  licence_no: string;
}

export type CheckStatus = "MATCH_FOUND" | "POSSIBLE_MATCH" | "NOT_FOUND";

export interface AlertDetail {
  id: string;
  drug_name: string;
  batch_number: string;
  manufacturer?: string;
  state?: string;
  failure_reason?: string;
  month_label?: string;
  category: "NSQ" | "SPURIOUS";
  source_pdf_url?: string;
  page_number?: number;
  extraction_confidence: number;
}

/** Non-sensitive candidate shown for POSSIBLE_MATCH before confirmation */
export interface CandidateDetail {
  id: string;
  drug_name: string;
  batch_no: string;
  manufacturer?: string;
  month?: string;
  category: string;
}

export interface DiffChar {
  position: number;
  user_char: string;
  flagged_char: string;
}

export interface CheckResponse {
  status: CheckStatus;
  alert?: AlertDetail;
  candidates?: CandidateDetail[];  // non-sensitive, for POSSIBLE_MATCH
  similarity_score?: number;
  diff_chars?: DiffChar[];
  message_key: string;
  plain_message: string;
  data_last_updated: string;       // safety rule §2
}
