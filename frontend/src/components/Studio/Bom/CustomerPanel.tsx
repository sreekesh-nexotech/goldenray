"use client";

// src/components/Studio/Bom/CustomerPanel.tsx
//
// Who the quote is for.
//
// The BOM screen can price a system without knowing the customer, and should:
// a sales person on a phone call sizes the system first and takes the details
// after. So nothing here is required to get a price -- the panel exists because
// a *quotation* cannot be created without a customer
// (`quotations.services.create` resolves `customer_uid` before anything else
// and refuses the request when it finds none).
//
// ── Two platform rules shape the form ────────────────────────────────────
//
// 1. **A phone number is unique among live customers.** `create_customer`
//    raises `phone_taken` rather than reusing the row, so repeat business and
//    two sales people quoting the same household both land on the same 409.
//    The conflict carries the existing customer's uid, so this panel offers
//    that customer rather than reporting a failure and making someone retype.
//
// 2. **Only `name` and `phone` are required.** The address block is optional
//    server-side and stays optional here -- but it is worth filling, because
//    those fields print on the quotation, so the panel says so rather than
//    presenting eleven equal-looking boxes.
//
// Searching first is the default path: most quotes are for someone already on
// the system, and typing a name that already exists is how duplicates are made.

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, GhostButton } from "../shared/primitives";
import { FieldGrid, TextField } from "../shared/rows";
import { studioColors } from "../shared/format";
import {
  customerErrorMessage,
  customers,
  existingCustomerUid,
  type CustomerInput,
  type CustomerRow,
} from "@/services/customerService";

export interface CustomerDraft extends CustomerInput {
  /** Set once the customer exists on the platform; null while they are only typed in. */
  uid: string | null;
}

export const EMPTY_CUSTOMER: CustomerDraft = {
  uid: null,
  name: "",
  phone: "",
  email: "",
  address: "",
  pincode: "",
  district: "",
  state: "",
  location: "",
};

/** Enough to create: the two fields the serializer requires. */
export function customerIsQuotable(draft: CustomerDraft): boolean {
  return Boolean(draft.uid) || Boolean(draft.name.trim() && draft.phone.trim());
}

export default function CustomerPanel({
  value,
  onChange,
  canCreate,
  canSearch,
}: {
  value: CustomerDraft;
  onChange: (next: CustomerDraft) => void;
  /** `customers.create` — adding a customer is its own verb, not `edit`. */
  canCreate: boolean;
  /** `customers.view` — without it the search box would 403 on every keystroke. */
  canSearch: boolean;
}) {
  const [term, setTerm] = useState("");
  const [matches, setMatches] = useState<CustomerRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState("");
  const [problem, setProblem] = useState("");
  const [saving, setSaving] = useState(false);
  const seq = useRef(0);

  const set = useCallback(
    <K extends keyof CustomerDraft>(key: K, v: CustomerDraft[K]) => {
      // Editing any field detaches the draft from the saved customer: the fields
      // would otherwise read as that customer's while no longer matching them.
      onChange({ ...value, [key]: v, ...(key === "uid" ? {} : { uid: null }) });
      setNotice("");
      setProblem("");
    },
    [onChange, value]
  );

  // Debounced search. The sequence guard means a slow earlier response cannot
  // overwrite a newer one, which otherwise shows results for a prefix.
  useEffect(() => {
    if (!canSearch || term.trim().length < 2) {
      setMatches([]);
      return;
    }
    const mine = ++seq.current;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const found = await customers.search(term);
        if (mine === seq.current) setMatches(found);
      } catch {
        // A failed lookup must not block typing the details by hand.
        if (mine === seq.current) setMatches([]);
      } finally {
        if (mine === seq.current) setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [term, canSearch]);

  const pick = useCallback(
    (row: CustomerRow) => {
      onChange({
        uid: row.uid,
        name: row.name,
        phone: row.phone || row.phone_e164 || "",
        email: row.email ?? "",
        address: row.address ?? "",
        pincode: row.pincode ?? "",
        district: row.district ?? "",
        state: row.state ?? "",
        location: row.location ?? "",
      });
      setTerm("");
      setMatches([]);
      setProblem("");
      setNotice(`Quoting for ${row.name} (${row.code}).`);
    },
    [onChange]
  );

  /** Create the customer now, so the quotation has one to attach to. */
  const save = useCallback(async () => {
    setSaving(true);
    setProblem("");
    try {
      const created = await customers.create({
        name: value.name.trim(),
        phone: value.phone.trim(),
        email: value.email?.trim() || undefined,
        address: value.address?.trim() || undefined,
        pincode: value.pincode?.trim() || undefined,
        district: value.district?.trim() || undefined,
        state: value.state?.trim() || undefined,
        location: value.location?.trim() || undefined,
      });
      onChange({ ...value, uid: created.uid });
      setNotice(`Saved as ${created.code}.`);
    } catch (err) {
      // A duplicate number is a redirect, not a failure: the customer exists, so
      // offer them rather than asking for the details again.
      const uid = existingCustomerUid(err);
      if (uid) {
        try {
          pick(await customers.get(uid));
          setNotice("That number already belongs to a customer — quoting for them.");
          return;
        } catch {
          // Fall through to the plain message if they cannot be loaded.
        }
      }
      setProblem(customerErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [value, onChange, pick]);

  const named = Boolean(value.name.trim() && value.phone.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
        <span style={{ fontSize: 11.5, color: studioColors.mutedGray }}>
          optional for a price · needed for a quotation
        </span>
      </CardHeader>

      <div style={{ padding: "0 16px 16px" }}>
        {canSearch && (
          <div style={{ marginBottom: 12 }}>
            <TextField
              label="Find an existing customer"
              value={term}
              onChange={setTerm}
              placeholder="Name, phone, code or email…"
              hint="Most quotes are for someone already on the system — searching first is what stops duplicates."
            />
            {searching && (
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: studioColors.mutedGray }}>Searching…</p>
            )}
            {matches.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  margin: "8px 0 0",
                  padding: 0,
                  border: `1px solid ${studioColors.ring}`,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {matches.map((row) => (
                  <li key={row.uid}>
                    <button
                      type="button"
                      onClick={() => pick(row)}
                      className="w-full text-left transition-colors hover:bg-[rgba(7,74,77,0.05)]"
                      style={{
                        appearance: "none",
                        border: "none",
                        background: "transparent",
                        padding: "9px 12px",
                        cursor: "pointer",
                        fontFamily: "var(--font-switzer)",
                        fontSize: 12.5,
                        color: studioColors.tealDeep,
                      }}
                    >
                      <strong>{row.name}</strong>
                      <span style={{ color: studioColors.mutedGray, marginLeft: 8 }}>
                        {row.phone || row.phone_e164} · {row.code}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <FieldGrid>
          <TextField
            label="Name"
            value={value.name}
            onChange={(v) => set("name", v)}
            hint="Printed on the quotation."
          />
          <TextField
            label="Phone"
            value={value.phone}
            onChange={(v) => set("phone", v)}
            placeholder="9876543210"
            hint="Identifies the customer — one number, one customer."
          />
          <TextField label="Email" value={value.email ?? ""} onChange={(v) => set("email", v)} />
          <TextField
            label="Location"
            value={value.location ?? ""}
            onChange={(v) => set("location", v)}
            placeholder="Town or locality"
          />
          <TextField label="District" value={value.district ?? ""} onChange={(v) => set("district", v)} />
          <TextField label="State" value={value.state ?? ""} onChange={(v) => set("state", v)} />
          <TextField
            label="Pincode"
            value={value.pincode ?? ""}
            onChange={(v) => set("pincode", v)}
            placeholder="6 digits"
          />
          <TextField
            label="Address"
            value={value.address ?? ""}
            onChange={(v) => set("address", v)}
            hint="The install address, as it should print."
          />
        </FieldGrid>

        <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 14 }}>
          {!value.uid && canCreate && (
            <GhostButton onClick={save} disabled={!named || saving} style={{ height: 34, fontSize: 12.5 }}>
              {saving ? "Saving…" : "Save customer"}
            </GhostButton>
          )}
          {value.uid && (
            <GhostButton
              onClick={() => onChange({ ...EMPTY_CUSTOMER })}
              style={{ height: 34, fontSize: 12.5 }}
            >
              Clear
            </GhostButton>
          )}
          <span
            style={{
              fontSize: 11.5,
              lineHeight: 1.5,
              color: problem
                ? studioColors.danger
                : value.uid
                  ? studioColors.mutedGray
                  : studioColors.amberInk,
            }}
          >
            {problem ||
              notice ||
              (value.uid
                ? "Saved — a quotation can be raised for this customer."
                : named
                  ? canCreate
                    ? "Not saved yet. Save to raise a quotation; the price above does not need it."
                    : "Your role does not include adding customers, so pick an existing one."
                  : "A name and phone number are all that is needed to save.")}
          </span>
        </div>
      </div>
    </Card>
  );
}
