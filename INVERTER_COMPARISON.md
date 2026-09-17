# Inverter Comparison – Data Document

**Verified:** 17 September 2026 · **Scope:** 5 kW single-phase inverters for Kerala residential rooftops
**Method:** every spec re-checked against the manufacturer's current datasheet PDF (text extracted
locally). Where a manufacturer publishes an India-specific sheet (Solis, Enphase, Sungrow RS-L) that
version was used. Warranty terms are the hardest column — they vary by country and distributor — so each
is sourced separately below. Fields that could not be confirmed from a primary source are marked ⚠.

---

## Comparison Table

### Product Header & Verdict

| ID | Brand | Model | Type | Capacity | Overall Rating | Best For |
| -- | ----- | ----- | ---- | -------- | -------------- | -------- |
| INV-001 | Sungrow | SG5.0RS | String inverter | 5 kW | Expert's Choice | Reliability + coastal protection |
| INV-002 | GoodWe | GW5000-DNS-30 (DNS G3) | String inverter | 5 kW | Very Good | Value + everyday residential use |
| INV-003 | Solis | S6-GR1P5K-S | String inverter | 5 kW | Very Good | Grid stability + protection |
| INV-004 | Growatt | MIN 5000TL-X2 (Pro) | String inverter | 5 kW | Very Good | High efficiency + value |
| INV-005 | Huawei | SUN2000-5KTL-L1 | Smart string inverter | 5 kW | Expert's Choice | Smart features + shading |
| INV-006 | Enphase | IQ8P (IQ8P-72-2-INT) | Microinverter | 475 W rated / 480 VA max per unit | Expert's Choice | Complex / shaded roofs |
| **INV-007** | **Sungrow** | **SH5.0RS** | **Hybrid inverter** | **5 kW (+ 5 kW backup)** | **Expert's Choice** | **Homes that need backup through power cuts** |

### Performance Specifications

| ID | Max Efficiency | EU / Weighted Eff. | MPPT | Max PV Input | Max DC Voltage | Max Input Current | IP Rating | Operating Temp. | Cooling | Weight |
| -- | -------------: | -----------------: | ---- | ------------ | -------------- | ----------------- | --------- | --------------- | ------- | -----: |
| INV-001 | 97.9% | 97.3% | 2 | **7.5 kWp** | 600 V | 16 A / 16 A | IP65 | −25 to 60 °C | Natural cooling | 10.0 kg |
| INV-002 | 97.9% | 97.3% | 2 | ⚠ 7.5 kWp (150% oversizing) | 600 V | 16 A / 16 A | IP66 | −25 to 60 °C | Natural convection | 12.8 kg |
| INV-003 | 97.7% | 97.1% | 2 | 7.5 kW | 550 V | 16 A / 16 A | IP66 | −25 to 60 °C | Natural convection | 9.0 kg |
| INV-004 | 98.4% | 97.5% | 2 | ⚠ 7.5 kWp | 550 V | ⚠ 16 A / 16 A | IP66 | −30 to 60 °C | Natural | 10.8 kg |
| INV-005 | 98.4% | 97.8% | 2 | 7.5 kWp | 600 V | 12.5 A / 12.5 A | IP65 | −25 to 60 °C | Natural convection | 12.0 kg |
| INV-006 | 97.3% | 97.0% (IS/IEC) | Per panel | 670 W per module | 65 V | 25 A (short-circuit max) | IPX6 / IP67 | −40 to 65 °C | Natural convection, no fans | 1.6 kg |
| **INV-007** | **97.7%** | **97.3%** | **2** | **7.5 kWp** | **600 V** | **16 A / 16 A** | **IP65** | **−25 to 60 °C** | **Natural convection** | **18.5 kg** |

### Build Quality & Protection

| ID | Surge Protection (DC / AC) | AFCI | Corrosion / Coastal | PID | Noise |
| -- | -------------------------- | ---- | ------------------- | --- | ----- |
| INV-001 | **Built-in Type II / Type II** | **Integrated** | **C5** | PID recovery built in | ⚠ not on datasheet |
| INV-002 | **Type III built-in; Type II optional** | **Optional** | Not specified | ⚠ | <25 dB |
| INV-003 | Built-in (type not stated) | **Integrated — activation required** | Not specified | Not listed | <20 dB(A) |
| INV-004 | Type II DC; ⚠ AC optional | Optional | Not specified | Not listed | ⚠ |
| INV-005 | Type II compatible / Type II compatible | **Built-in (AI-powered)** | Not specified | ⚠ | ⚠ |
| INV-006 | System dependent (IQ Relay / System Controller) | N/A — low-voltage DC, rapid shutdown built in | Corrosion-resistant polymeric enclosure | N/A | Silent |
| **INV-007** | **Built-in Type II / Type II** | **Not listed on datasheet** | Not specified | **PID Zero built in** | **<45 dB(A)** |

### Warranty (India)

| ID | Standard | Maximum | Extension | Source |
| -- | -------- | ------- | --------- | ------ |
| INV-001 | **5 years** | up to 25 years | Purchasable, must cover whole plant | Sungrow APAC manufacturer warranty: string inverters 5 yr (≤ 6 yr from production); extensions "up to a total period of 25 years" for specific ranges |
| INV-002 | **5 years** | 10 years | Registration / purchase | GoodWe global limited warranty rev 5.2 (Apr 2026); India listings consistently 5 yr std, 10 yr ext |
| INV-003 | 8 years | ⚠ extension available | Via SolisCloud app | Indian distributors list S6-GR1P at 8 yr; Solis 4G series 5 yr + optional 20 |
| INV-004 | 8 years ⚠ | 10 years ⚠ | Free extension via Growatt OSS | Growatt base is 5 yr; India distributors list X2 (Pro) at 8–10 yr |
| INV-005 | **5 years** | up to 15 years | Purchasable (5 / 10 / 15 yr options) | Huawei Residential Smart PV Warranty Policy (Global) issue 04, Nov 2025 |
| INV-006 | **15 years** | up to 25 years ⚠ | Extension options via Enphase | India datasheet DSH-00055-6.0 (May 2026): "15-year warranty valid provided an internet-connected IQ Gateway is installed" |
| **INV-007** | **5 years** | ⚠ up to 25 years | Purchasable | Same Sungrow APAC terms as INV-001 |

### Technology & Monitoring

| ID | Architecture | Battery Ready | Optimizer | Panel-Level Monitoring | App | Connectivity |
| -- | ------------ | ------------- | --------- | ---------------------- | --- | ------------ |
| INV-001 | String | No (grid-tie only) | Not listed | No | iSolarCloud | WLAN / Ethernet / RS485 |
| INV-002 | String | No | Not listed | No | SEMS Portal | WiFi / LAN / RS485 / 4G (optional) |
| INV-003 | String | No | Not listed | No | SolisCloud | RS485 / USB; WiFi or GPRS optional |
| INV-004 | String | No | Not listed | No | ShinePhone | WiFi / 4G (ShineWiFi-X) |
| INV-005 | Smart string | **Yes — LUNA2000-5/10/15-S0, 7/14/21-S1** | **Yes — SUN2000-450W-P2 / 600W-P** | With optimizer | FusionSolar | WLAN / 4G / Ethernet (Smart Dongle) |
| INV-006 | Microinverter | System dependent (IQ Battery) | N/A | **Yes** | Enphase App | IQ Gateway |
| **INV-007** | **Hybrid** | **Yes — Li-ion, 80–460 V, 30 A charge/discharge** | **Optional (consult Sungrow)** | No | iSolarCloud | RS485 / Ethernet / WLAN / CAN |

### Kerala Performance

| ID | Kerala Weather Fit | Heat | Humidity | Heavy Rain | Coastal / Salt Air | Lightning | Voltage Stability | Shade | Service Network | Overall Kerala Score |
| -- | ------------------ | ---- | -------- | ---------- | ------------------ | --------- | ----------------- | ----- | --------------- | -------------------: |
| INV-001 | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent | Very Good | Very Good | 92 |
| INV-002 | Very Good | Very Good | Excellent | Excellent | Very Good | Very Good | Very Good | Very Good | Very Good | 88 |
| INV-003 | Very Good | Very Good | Excellent | Excellent | Very Good | Excellent | Excellent | Very Good | Very Good | 89 |
| INV-004 | Very Good | Excellent | Excellent | Excellent | Good | Very Good | Very Good | Very Good | Very Good | 86 |
| INV-005 | Excellent | Very Good | Very Good | Very Good | Very Good | Excellent | Excellent | Excellent | Excellent | 91 |
| INV-006 | Excellent | Excellent | Excellent | Excellent | Excellent | Very Good | Excellent | Excellent | Good | 94 |
| **INV-007** | **Excellent** | **Excellent** | **Excellent** | **Excellent** | **Very Good** | **Excellent** | **Excellent** | **Very Good** | **Very Good** | **90** |

> Kerala ratings are editorial and carried over unchanged from the source document; INV-007's are new.
> INV-007's Coastal score is Very Good rather than Excellent because, unlike the SG5.0RS, the SH5.0RS
> datasheet makes no corrosion-class claim.

---

## Changes Made in This Revision

### 1. Gaps filled from datasheets
| Row | Was | Now |
| --- | --- | --- |
| INV-001 Max PV Input | "—" | **7.5 kWp** (datasheet: "Recommended max. PV input power") |
| INV-001 AFCI | "Model dependent" | **Integrated** — "Integrated arc fault circuit interrupter" is a headline feature on the SG5.0RS sheet |
| INV-001 Surge Protection | "Type II" | **Built-in Type II DC and Type II AC** |
| INV-002 Surge Protection | "Model dependent" | **Type III built-in on both DC and AC; Type II optional** |
| INV-002 AFCI | "Model dependent" | **Optional** |
| INV-003 AFCI | "Yes" | **Integrated, activation required** (datasheet footnote) |
| INV-005 Max PV Input | "7.5 kWp" | Confirmed; also **600 V max input, 12.5 A per MPPT, 12.0 kg** |
| INV-006 IP Rating | "IPX6 / IP67" | Confirmed — and the **codebase had IP68**, which is wrong |

### 2. Warranty column resolved
Both "India terms to confirm" cells are now sourced. Sungrow's APAC manufacturer warranty sets string
inverters at **5 years** (not the 10 years shown in Australia/Europe and in the old seeder). GoodWe is
**5 years** standard. The Growatt asterisks stay: Growatt's own base term is 5 years and the 8–10 years
seen in India comes from distributor/registration programmes, so it is real but not manufacturer-guaranteed.

### 3. Sungrow RS-L warning
Sungrow India distributes a lower-cost **SG4.0/5.0/6.0RS-L** line alongside the SG5.0RS. The RS-L India
datasheet lists Type II SPD and PID Zero but **does not list AFCI or a C5 corrosion rating** — the two
features that earn the SG5.0RS its coastal-protection verdict. A Kerala buyer quoted an "SG5.0RS-L" is not
getting the spec in this row. Worth stating on the site.

### 4. Model lifecycle
- **INV-002** GoodWe GW5000-DNS-30 is the DNS **G3** generation (datasheet v4, March 2023). Still current.
- **INV-004** Growatt ships two variants, **MIN 5000TL-X2 (Pro)** and **(Pro E)**. Specs verified are
  for the (Pro); confirm which is quoted.
- **INV-005** Huawei's newer single-phase **LC0** series exists only at 8/10 kW, so the 5KTL-L1 remains
  Huawei's current 5 kW model.
- **INV-006** Enphase IQ8P India datasheet is dated **8 May 2026** and confirms the unit is assembled in
  India and BIS-labelled.

### 5. Removed from the codebase
The previous seeder carried **SolarEdge SE5000H HD-Wave** and **Fronius Primo GEN24 5.0** instead of
Solis and Huawei. Neither is in this document, and both rows had visible copy-paste damage (SolarEdge
listed with Growatt's "ShinePhone / SEMS" app; SolarEdge and Growatt both carrying Sungrow's "269+ GW").
They are pruned. If you want them back on the site, say so and I will verify and re-add them properly.

---

## New Inverter Added

**INV-007 — Sungrow SH5.0RS (hybrid).** The table had no answer for Kerala's power cuts: every other
inverter here shuts down with the grid. The SH5.0RS keeps 5 kW of backup load running with a **<10 ms**
transfer, charges/discharges a Li-ion battery at 30 A across an 80–460 V window, and shares the SG5.0RS's
600 V / 2-MPPT / 16 A front end with built-in Type II SPD and PID Zero. Datasheet V18 (2024). Trade-offs
versus the SG5.0RS: 0.2 pt lower efficiency, 18.5 kg vs 10 kg, <45 dB, and no AFCI or C5 claim on the
sheet. Same 5-year APAC warranty base.

---

## Open Items

| # | Item | Why it matters |
| - | ---- | -------------- |
| 1 | **Pricing** — `price_range` is unverified for all seven and is shown on the site | Replace `₹` tier strings with real dealer pricing |
| 2 | **Growatt (Pro) fine print** — max PV input, per-MPPT current, AC SPD | Datasheet not retrievable as text; values carried from the previous seed and marked ⚠ |
| 3 | **Extension caps** — Solis, Enphase (25), Sungrow SH5.0RS (25) | Extension *availability* is confirmed; the maximum year figure is not, except Huawei (15) and GoodWe (10) |
| 4 | **MPPT efficiency, noise (Sungrow, Growatt, Huawei), night consumption** | Not on the retrieved sheets; carried from previous seed, marked `# UNVERIFIED` |
| 5 | **Brand-trust strings** (capacity shipped, countries) | Marketing figures, date quickly; marked `# UNVERIFIED` in the seeder |

---

## Applied to the Codebase

`goldenray-backend/backend/goldenray/management/commands/populate_solar_inverters.py` seeds these seven.

```bash
cd goldenray-backend/backend && python manage.py populate_solar_inverters
```

The command **prunes** rows not in the seed set (SolarEdge, Fronius, and the old "GoodWe GW5000-MS" /
"Growatt MIN 5000TL-X" names that the corrected model numbers replace). Pass `--no-prune` to keep them.

Data-integrity fixes carried into the seeder beyond the spec corrections above:

- **Sungrow warranty 10 → 5 years** (APAC term; 10 is Australia/Europe).
- **Enphase IQ8P: IP68 → IP67, 60 V → 65 V max input, 540 W → 670 W max input, 1.08 kg → 1.6 kg, 480 W
  → 475 W rated** — all from the May 2026 India datasheet.
- **Copy-paste errors removed**: SolarEdge/Growatt "269+ GW", SolarEdge "ShinePhone" app.
- **`ac_overloading` now reflects the datasheet's max AC power**: Sungrow SG5.0RS and Solis are 100%
  (max AC = rated), GoodWe is 110% (5500 W). The old seeder had 110% across the board.
- **`dc_oversizing` derived** as `max PV input ÷ rated AC`, rather than hand-picked.

No migrations needed — no model fields changed.

---

## Sources

- [Sungrow SG3.0–6.0RS datasheet V1.1.1 (2021)](https://www.irishellas.com/files/Datasheet_Sungrow_1ph_SG3.0-6.0RS_solar-inverter_AFCI_600Vdc_V11-20210413_ENG.pdf) · [SG5.0/6.0RS product page (current, 97.9%)](https://www.sungrowpower.com/en/products/string-inverter/sg5-0-6-0rs) · [Sungrow APAC warranty terms](https://www.sungrowpowerservice.com/Page/Warranty/warranty-term)
- [Sungrow SG3.0RS-L India datasheet V12 (2023)](https://cdn.enfsolar.com/z/pp/2023/9/75w4y9p5bobi8o/DS-20230616-SG3.0RS-L-Datasheet-V12-EN-India.pdf) · [SG4.0/5.0/6.0RS-L India product page](https://en.sungrowpower.com/productDetail/4074/string-inverter-sg4-0-5-0-6-0rs-l)
- [Sungrow SH3.0–6.0RS hybrid datasheet V18 (2024)](https://info-support.sungrowpower.com/application/pdf/2025/06/30/DS_20240320_SH3.0_3.6_4.0_5.0_6.0RS_Datasheet_V18_EN.pdf)
- [GoodWe DNS G3 series datasheet v4 (March 2023)](https://www.victoriansolar.com/wp-content/uploads/2024/04/GoodWe-DNS-30-Series-Single-Phase-3-6kW.pdf) · [GoodWe global limited warranty rev 5.2](https://en.goodwe.com/Ftp/Downloads/Warranty/GOODWE%20Limited%20Warranty%20for%20Inverter%20System-GLOBAL.pdf)
- [Solis S6-GR1P(2.5–6)K-S **India** datasheet V1.2 (April 2023)](https://www.solisinverters.com/uploads/file/Solis_datasheet_S6-GR1P(2,5-6)K-S_IND_V1,2_2023_04.pdf)
- [Growatt MIN 5000TL-X2 (Pro) spec listing](https://globalsunhub.com/solar-inverters/growatt/min-5000tl-x2-(pro)) · [Growatt product page](https://en.growatt.com/products/min-2500-6000tl-x-x2(pro))
- [Huawei SUN2000-3/4/5/6KTL-L1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6ktl-l1/specs/) · [Huawei Residential Smart PV Warranty Policy (Global) issue 04, Nov 2025](https://solar.huawei.com/admin/asset/v1/pro/view/d373d9834172413b85d346e1f691915d.pdf)
- [Enphase IQ8P **India** datasheet DSH-00055-6.0 (8 May 2026)](https://enphase.com/en-in/download/iq8p-microinverter-data-sheet)
