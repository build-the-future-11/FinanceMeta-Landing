import { publicHttpsUrl } from "./public-url.ts";

export const PARTNER_KINDS = ["Education", "Research", "Community", "Industry"] as const;
export const RELATIONSHIP_STATUSES = ["Active", "Past"] as const;

export type UnionPartner = {
  slug: string;
  name: string;
  kind: typeof PARTNER_KINDS[number];
  region: string;
  summary: string;
  website: string;
  relationship: typeof RELATIONSHIP_STATUSES[number];
  relationshipSummary: string;
  evidenceUrl: string;
  reviewedOn: string;
  reviewDue: string;
  publicationApproved: boolean;
  collaborations: {
    title: string;
    description: string;
    status: "Open" | "Closed";
    url: string;
    deadline?: string;
  }[];
};

// Deliberately empty: this source copy contains no verified partnership evidence.
// Add only records approved for public attribution; see UNION_EDITORIAL.md.
export const UNION_PARTNERS: UnionPartner[] = [];

const dateIsValid = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString().slice(0, 10) === value;

export function partnerErrors(partner: UnionPartner, today = new Date().toISOString().slice(0, 10)): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(partner.slug)) errors.push("Invalid slug");
  for (const key of ["name", "region", "summary", "relationshipSummary"] as const) {
    if (!partner[key]?.trim()) errors.push(`Missing ${key}`);
  }
  if (!PARTNER_KINDS.includes(partner.kind)) errors.push("Invalid kind");
  if (!RELATIONSHIP_STATUSES.includes(partner.relationship)) errors.push("Invalid relationship");
  if (!partner.publicationApproved) errors.push("Publication not approved");
  for (const key of ["website", "evidenceUrl"] as const) {
    if (!publicHttpsUrl(partner[key])) errors.push(`Unsafe ${key}`);
  }
  if (!dateIsValid(partner.reviewedOn) || partner.reviewedOn > today) errors.push("Invalid review date");
  if (!dateIsValid(partner.reviewDue) || partner.reviewDue < today || partner.reviewDue < partner.reviewedOn) errors.push("Review expired or invalid");
  for (const item of partner.collaborations) {
    if (!item.title.trim() || !item.description.trim() || !publicHttpsUrl(item.url)) errors.push("Invalid collaboration");
    if (!["Open", "Closed"].includes(item.status)) errors.push("Invalid collaboration status");
    if (item.deadline && !dateIsValid(item.deadline)) errors.push("Invalid deadline");
  }
  return errors;
}

export function publishablePartners(records: UnionPartner[], today?: string): UnionPartner[] {
  return records.filter((record) => records.filter((other) => other.slug === record.slug).length === 1
    && partnerErrors(record, today).length === 0);
}

export function collaborationIsOpen(item: UnionPartner["collaborations"][number], today = new Date().toISOString().slice(0, 10)) {
  return item.status === "Open" && (!item.deadline || item.deadline >= today);
}
