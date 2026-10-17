# 🛡️ PlotGuard — Land Fraud & Ownership Inconsistency Detection

> **LandTech Innovation Hackathon 2026**  
> **Challenge Track:** Digital Land Records, Verification & Digitization  
> **Problem Statement:** P3 — Detect potential fraud, double-selling, and registry/mutation mismatches  
> **Core Principle:** Explainable alerts for human review — *not automated legal judgments*.

---

## 📌 1. Executive Summary

Land records in multi-agency jurisdictions often suffer from synchronization lag between District Sub-Registry offices (deed registration) and Upazila/Circle AC (Land) offices (mutation of Record of Rights / Khatian). Fraudulent actors exploit these gaps to attempt **double-selling**, conveyances by non-owners, and unauthorized mutation claims.

**PlotGuard** is a rule-based screening prototype that ingests deed, transfer, and mutation records to detect ownership conflicts, duplicate conveyances, and title chain inconsistencies. Instead of producing opaque statistical scores, PlotGuard generates **explainable alerts**:
1. **Which deterministic rule was triggered (R1–R5)**
2. **Which exact sample records conflict (linked evidence references)**
3. **Why the case needs attention**
4. **Actionable recommendations for an authorized land officer**
5. **Interactive review workflow with an immutable audit log**

---

## 🏛️ 2. Fraud & Conflict Detection Rules (R1–R5)

| Rule ID | Name | Priority | Trigger Condition |
| :--- | :--- | :--- | :--- |
| **R1** | **Potential Double-Selling** | **High** | The same plot has two overlapping active sale/transfer records that have not been cancelled or superseded. |
| **R2** | **Seller / Owner Conflict** | **High / Review** | The seller in a new transfer does not match the latest recorded owner in the available sample history without documented inheritance/power of attorney. |
| **R3** | **Registry / Mutation Mismatch** | **Review** | The recorded owner or linked deed in mutation data disagrees with the relevant registry deed (or approved mutation still reflects prior owner while second sale is attempted). |
| **R4** | **Duplicate Deed Reference** | **High** | The same deed registration reference is attached to multiple distinct parcels or transactions. |
| **R5** | **Inconsistent Transfer Sequence** | **Review** | A later transfer depends on an earlier parent transfer that is unresolved, invalid, cancelled, or chronologically inverted. |

> **Balanced Screening (Zero False Alarms):**  
> Legitimate single transfers (e.g., `PLOT-2001`) and properly cancelled deeds (e.g., `PLOT-3005`) do **not** trigger alerts, proving high specificity.

---

## 🎯 3. Demonstration Scenarios (Seeded Data)

PlotGuard includes 7 pre-configured benchmark scenarios accessible directly from the UI header:

1. **PLOT-1042 (Primary Demo — Double-Selling Conflict):**  
   - Seller `S-01` (Rafiqul Islam) executes Deed `DEED-2026-0042-A` to Buyer `B-01` (Anisur Rahman). Mutation `MUT-1042-01` is approved for `B-01`.
   - A second active deed `DEED-2026-0042-B` attempts to sell the same parcel to Buyer `B-02` (Kamal Hossain) while the first sale remains active.
   - **PlotGuard Result:** Triggers **R1 (Potential Double-Selling)** and **R3 (Registry/Mutation Lag)**; recommends "Hold for human review".
2. **PLOT-2001 (Legitimate Ownership Transfer):**  
   - Lawful conveyance to Dr. Shahana Parveen with synchronized mutation. **0 alerts generated** (validates false-positive avoidance).
3. **PLOT-3005 (Cancelled Deed Handling):**  
   - Earlier draft deed was cancelled before a subsequent legitimate buyer purchased the parcel. System honors cancellation and raises **no alerts**.
4. **PLOT-4010 (Seller/Owner Conflict — R2):**  
   - Unauthorized party `S-99` attempts conveyance with no title record in Khatian `KH-6632`.
5. **PLOT-5020 (Registry vs Mutation Mismatch — R3):**  
   - Sub-Registry deed conveys parcel to Farzana Begum, but AC (Land) mutation ledger awards title to an unrelated applicant `M-99`.
6. **PLOT-6030 (Duplicate Deed Reference — R4):**  
   - Deed registration number `DEED-DUP-9901` is duplicated across distinct parcels.
7. **PLOT-7040 (Broken Title Chain — R5):**  
   - Derivative conveyance relies on a parent deed that was voided due to non-clearance of stamp duty.

---

## 🏗️ 4. Technology Stack & Architecture

- **Frontend:** React 19, Vite, Lucide Icons, Modern responsive glassmorphism CSS design system.
- **Backend:** Node.js, Express REST API (ES Modules).
- **Database:** MongoDB via Mongoose with automatic fallback to an in-memory cached data store (100% portable zero-setup run).
- **Cryptographic Extension:** Node.js `crypto` SHA-256 deed fingerprint verification.
- **Testing:** Standalone deterministic rule test suite (`backend/src/tests/rules.test.js`).

---

## 🚀 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm
- *(Optional)* MongoDB on `localhost:27017` (PlotGuard auto-connects to local MongoDB, or falls back to in-memory store if MongoDB is not running).

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PlotGuard.git
   cd PlotGuard
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   npm run seed    # Seeds benchmark scenarios and runs rules
   npm start       # Starts API on http://localhost:5000
   ```

3. **Start Frontend (in a second terminal):**
   ```bash
   cd client
   npm install
   npm run dev     # Starts Vite dev server on http://localhost:5173
   ```

4. **Open in Browser:**  
   Navigate to **`http://localhost:5173`**

### Running Automated Rule Tests
```bash
cd backend
npm test
```
*Expected Output:* `ALL 7 PLOTGUARD DETECTION TESTS PASSED SUCCESSFULLY!`

---

## ⏱️ 6. Three-Minute Presentation Script for Judges

| Time | Step | What to Show & Say |
| :--- | :--- | :--- |
| **0:00–0:30** | **The Problem** | Explain that registry records (deeds) and land revenue records (mutations) exist in administrative silos, enabling double-selling. |
| **0:30–1:05** | **Find a Plot** | Click **PLOT-1042** in the top preset bar. Show recorded owner Rafiqul Islam, Deed A to Buyer B-01, and mutation in B-01's name. |
| **1:05–1:50** | **Trigger Alert** | Click **"Run Detection Engine"**. Highlight **Rule R1** alert: two concurrent active deeds (Deed A & Deed B) on the same parcel. |
| **1:50–2:25** | **Inspect Evidence** | Click **"Inspect Evidence"**. Compare the side-by-side deed instruments, observe mutation mismatch, and select **"Under Review"** with reviewer notes. Show the new entry in the **Audit Trail**. |
| **2:25–3:00** | **Impact & Specificity** | Click **PLOT-2001** and **PLOT-3005** to show zero false positives. Reiterate that PlotGuard flags explainable inconsistencies rather than claiming automated legal authority. |

---

## 🔒 7. Safety, Data, and Integrity Statement

- **100% Fictional Data:** All citizen names, NIDs, Khatians, and Deed volumes are completely synthetic and anonymized.
- **No Scraping:** PlotGuard does not scrape, query, or connect to any live government portal or production database.
- **Human-in-the-Loop:** Uses terms like *"Potential conflict detected"* or *"Requires review"*, preserving final discretion for human officers.

---

## 🤖 8. AI-Tool Disclosure (Hackathon Compliance)

- **AI Tools Used:** Generative AI assistant (DeepMind Antigravity) used for architectural scaffolding, synthetic seed dataset authoring, and test generation under human engineering supervision.
- **Review & Verification:** All deterministic screening algorithms (R1–R5) and business logic were rigorously verified and tested against the hackathon project plan.

---

*Submitted for the LandTech Innovation Hackathon 2026.*
