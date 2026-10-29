// src/services/customerService.ts
//
// Customers, for the screens that need to attach one to the work they are
// doing. Today that is the BOM calculator, which cannot create a quotation
// without a customer -- `quotations.services.create` resolves `customer_uid`
// first and refuses the whole request when it does not find one.
//
// Only `name` and `phone` are required by `_CustomerWriteSerializer`; the rest
// of the address block is optional, which is what lets a sales person take a
// phone call and quote before they have the full address.
//
// ── The one rule this client has to surface ──────────────────────────────
//
// A phone number is unique among live customers, and `create_customer` raises
// `phone_taken` rather than quietly reusing the existing row. That is the right
// behaviour -- two sales people quoting the same household should end up on one
// customer, not two -- but it means a 409 here is not an error so much as a
// redirect: the conflict carries `existing_customer` with the uid when the
// caller is allowed to see it, so the screen can offer that customer instead of
// making someone retype anything.

import { StudioApiError, query, studioRequest, type Paginated } from "./studioService";

export interface CustomerRow {
  uid: string;
  code: string;
  name: string;
  phone: string;
  phone_e164?: string;
  alt_phone?: string;
  email?: string;
  address?: string;
  pincode?: string;
  district?: string;
  state?: string;
  location?: string;
  current_bill?: string | null;
  bill_cycle?: string;
  version: number;
}

/** What `POST customers/` accepts. `name` and `phone` are the only required fields. */
export interface CustomerInput {
  name: string;
  phone: string;
  alt_phone?: string;
  email?: string;
  address?: string;
  pincode?: string;
  district?: string;
  state?: string;
  location?: string;
  current_bill?: string | null;
  bill_cycle?: string;
}

export const customers = {
  /** Search by name, phone, code or email -- the fields the viewset indexes. */
  search: async (term: string, limit = 10): Promise<CustomerRow[]> =>
    (
      await studioRequest<Paginated<CustomerRow>>(
        `customers/${query({ search: term.trim(), page_size: limit })}`,
      )
    ).results,

  get: (uid: string) => studioRequest<CustomerRow>(`customers/${uid}/`),

  create: (body: CustomerInput) => studioRequest<CustomerRow>("customers/", { method: "POST", body }),

  update: (uid: string, body: Partial<CustomerInput> & { expected_version?: number }) =>
    studioRequest<CustomerRow>(`customers/${uid}/`, { method: "PATCH", body }),
};

/**
 * The uid of the customer an existing phone number belongs to, or null.
 *
 * Returns null when the number is taken by a customer this user cannot see --
 * the conflict omits `existing_customer` in that case, and offering a customer
 * the person has no scope for would be worse than asking them to check.
 */
export function existingCustomerUid(err: unknown): string | null {
  if (!(err instanceof StudioApiError) || err.code !== "phone_taken") return null;
  const value = err.fieldErrors?.existing_customer;
  const uid = Array.isArray(value) ? value[0] : value;
  return typeof uid === "string" && uid ? uid : null;
}

/** A failed customer write, said in terms the person can act on. */
export function customerErrorMessage(err: unknown): string {
  if (err instanceof StudioApiError) {
    if (err.code === "phone_taken") {
      return "A customer with this phone number already exists.";
    }
    if (err.status === 403) return "Your role does not include adding customers (customers.create).";
    const fields = err.fieldErrors ? Object.entries(err.fieldErrors) : [];
    if (fields.length) {
      return fields
        .filter(([key]) => key !== "existing_customer")
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : String(v)}`)
        .join("; ");
    }
  }
  return err instanceof Error ? err.message : "Could not save the customer.";
}
