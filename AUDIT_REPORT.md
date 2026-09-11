# Mortgage Consultation Flow — Read-Only Audit Report

Generated as a temporary, additive audit document. No existing project files were modified, created, or deleted as part of producing this report — this file itself is new and does not alter any application behavior.

Repository: `layton-mortgage-lead-generator-updated`
Files inspected: `index.html`, `js/script.js`, `js/ai-message.js`, `css/style.css`, `netlify.toml`, `README.md`, `n8n/README.md`, `n8n/Mortgage Lead Intake.workflow.sanitized.json`

No secrets, API keys, tokens, or credentials were found in any inspected file. Both webhook URLs in this repo are plain (non-authenticated) endpoint strings, not credentials — they are reproduced below in full per the task's own example format; nothing has been redacted because there was nothing secret to redact.

---

## 1. CURRENT FORM

Location: `index.html:72-221`, `<form id="leadForm">`.

| id | name | Label | Type | Required | Options / Default |
|---|---|---|---|---|---|
| `name` | `name` | Full Name | text | ✅ required | none |
| `email` | `email` | Email Address | email | ✅ required | none |
| `address` | `address` | Property Address | text | ✅ required | none |
| `service` | `service` | What can we help you with? | select | ✅ required | Purchase, Refinance, Pre-Approval, Investment Property, Other |
| `note` | `note` | How can we help you? | textarea | optional | none |
| `estimated_property_value` | `estimated_property_value` | Estimated Property Value | number | optional | none |
| `down_payment_range` | `down_payment_range` | Estimated Down Payment | select | optional | Less than 5%, 5–10%, 10–20%, 20%+, Not sure |
| `employment_status` | `employment_status` | Employment Status | select | optional | Employed (W-2), Self-Employed, Retired, Other |
| `first_time_buyer` | `first_time_buyer` | Are you a first-time homebuyer? | select | optional | Yes, No, Not applicable |
| `desired_timeline` | `desired_timeline` | When are you looking to move forward? | select | optional | Immediately, 1–3 months, 3–6 months, 6+ months, Just exploring |
| `contact_phone` | `contact_phone` | Phone Number | tel | optional | none |
| `preferred_contact_method` | `preferred_contact_method` | Preferred Contact Method | select | optional | Phone, Email, Text |
| `best_time_to_contact` | `best_time_to_contact` | Best Time to Contact | select | optional | Morning, Afternoon, Evening, Anytime |

No field has a non-empty default value. Validation is native HTML5 only (`required`, `type="email"`) — no custom JS validation, no `pattern`/`minlength`/`maxlength`.

Submit button: `<button type="submit" id="submitButton">` (`index.html:215`).
Feedback region: `<div id="success" class="success-message" role="status">` (`index.html:219`).

---

## 2. FORM SUBMISSION

**Exact JavaScript submission function:** anonymous `async` function registered at `js/script.js:8`:
```js
leadForm.addEventListener("submit", async function (event) { ... });
```

**Endpoint called** — `js/script.js:1-2`:
```js
const N8N_WEBHOOK_URL =
    "https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead";
```

**Request** — `js/script.js:32-38`:
```js
fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
});
```
- Method: `POST`
- Headers: `Content-Type: application/json` only. **No Authorization header, no API key header, no signature header.**

**Complete payload structure** (`js/script.js:11-25`, placeholder values):
```json
{
  "name": "...",
  "email": "...",
  "address": "...",
  "service": "...",
  "note": "...",
  "estimated_property_value": "...",
  "down_payment_range": "...",
  "employment_status": "...",
  "first_time_buyer": "...",
  "desired_timeline": "...",
  "contact_phone": "...",
  "preferred_contact_method": "...",
  "best_time_to_contact": "..."
}
```
String fields are `.trim()`-ed client-side; no other transformation occurs before sending.

**Success/error handling** (`js/script.js:31-74`):
- Response is checked only via `if (!response.ok) throw new Error(...)` (line 40-42) — the body is never read (`response.json()`/`.text()` never called).
- **Success** (lines 44-56): `leadForm.reset()`; `#success` shown with a fixed thank-you string; inline error styles cleared; button re-enabled as "Submit Another Request"; a `setTimeout` hides the message after 5000ms (this timeout is not cancelled on repeat submissions — see `AUDIT.md` item 17.1 for the known race condition).
- **Error** (lines 61-73, catches both network failures and non-OK responses): `console.error("Lead submission error:", error)`; `#success` shown with a fixed generic error string; inline red styling applied directly via `element.style.*`; button re-enabled as "Try Again"; form values are **not** cleared.

---

## 3. N8N

Every `n8n` / `webhook` / `fetch(` / `axios` / `POST` reference found in the repo:

| File | Line(s) | Reference |
|---|---|---|
| `js/script.js` | 1-2 | `N8N_WEBHOOK_URL = "https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead"` |
| `js/script.js` | 32 | `fetch(N8N_WEBHOOK_URL, ...)` |
| `js/script.js` | 34 | `method: "POST"` |
| `js/ai-message.js` | 1-2 | `AI_MESSAGE_WEBHOOK_URL = "https://n8n-1-111-0-g3nd.onrender.com/webhook/ai-lead-message"` |
| `js/ai-message.js` | 39 | `fetch(AI_MESSAGE_WEBHOOK_URL, ...)` |
| `js/ai-message.js` | 40 | `method: "POST"` |
| `README.md` | workflow diagram | "Website Form → n8n Webhook → Validate Lead → Structure Data → CRM → Follow Up" (descriptive text) |
| `n8n/README.md` | whole file | Documents the sanitized n8n export; states production path `POST /webhook/mortgage-lead` |
| `n8n/Mortgage Lead Intake.workflow.sanitized.json` | whole file | Full n8n workflow definition (see below) |

No `axios` usage exists anywhere in the repo — `fetch` is the only HTTP client used.

**Is n8n called directly from the browser?** Yes. Both `js/script.js` and `js/ai-message.js` call `fetch()` straight from client-side code to the public n8n webhook URLs. There is no backend/serverless proxy in between.

**Webhook URL variable names** (URLs shown as-is; they are non-secret public endpoints, not credentials):
- `N8N_WEBHOOK_URL` → `js/script.js:1`
- `AI_MESSAGE_WEBHOOK_URL` → `js/ai-message.js:1`

**Exact payload fields sent to n8n (`/webhook/mortgage-lead`):** the 13 keys listed in Section 2 above.

**Exact payload fields sent to n8n (`/webhook/ai-lead-message`)** — `js/ai-message.js:28-32`:
```json
{
  "name": "...",
  "phone": "...",
  "message": "..."
}
```

**Backend workflow, per `n8n/Mortgage Lead Intake.workflow.sanitized.json`** (this file documents `/webhook/mortgage-lead` only — no export exists in this repo for `/webhook/ai-lead-message`):
```
Webhook (POST /webhook/mortgage-lead)
  → Validate Lead        [Code: checks required fields name/email/address/service + email regex]
  → Prepare Lead         [Code: builds lead_id, normalizes fields, status="NEW", source="Mortgage Website"]
  → Check Duplicate      [Supabase getAll on mortgage_leads WHERE email = lead.email]
  → Duplicate? (IF)
      ├─ true  → Handle Duplicate → google sheet Duplication (append, Result="Duplicate") → Duplicate Response (JSON success:false)
      └─ false → Restore Lead → Calculate Lead Priority [Code: scores lead_score/lead_priority] → supabase [insert into mortgage_leads] → google sheet New Lead (append, Result="Accepted") → Success Response (JSON success:true)
```
Workflow-level flag: `"active": true` (line 906 of the JSON).

**Headers/authentication mechanism on the n8n side:** none are configured in the client requests (see Section 2) — no API key, bearer token, or HMAC signature is sent or expected by the Webhook node's parameters (`httpMethod: POST`, `path: mortgage-lead`, `responseMode: responseNode` — no auth option set). This matches the documented weakness in `AUDIT.md §13`.

---

## 4. GHL / GOHIGHLEVEL

Every occurrence of `GHL`, `GoHighLevel`, `HighLevel`, `CRM`, `contact`, `opportunity`, `pipeline`, `custom field`, `tag` was searched across all files.

**Result: GHL/GoHighLevel/HighLevel does not appear anywhere in this repository — 0 matches for any of those three literal terms in any file, including the n8n workflow export.**

Related terms found, all non-functional / unrelated to GHL:
- `CRM` — plain marketing copy only: `index.html:56` ("CRM connected" feature bullet), `index.html:266` ("CRM" step label in the static workflow diagram), `index.html:283` ("CRM" node label in the static architecture diagram). None of these are wired to code.
- `contact` — only appears as part of unrelated field names: `contact_phone`, `preferred_contact_method`, `aiMessageForm`'s implicit "contact" purpose. Not a GHL Contact object/API call.
- `opportunity`, `pipeline`, `custom field` — zero matches anywhere.
- `tag` — the only match is `"tags": []` at `n8n/Mortgage Lead Intake.workflow.sanitized.json:910`, which is n8n's own empty workflow-tagging metadata field, unrelated to GHL/CRM tags.

**Where GHL is handled: D — not present in this codebase in any form** (not frontend, not backend/n8n export in this repo, not a Netlify function — there are no Netlify functions at all). The actual downstream systems verified in the n8n export are **Supabase** (`mortgage_leads` table) and **Google Sheets**. If GHL exists, it is configured only on infrastructure outside this repository (e.g., directly in your live n8n instance, in a node not captured by this sanitized export) and cannot be confirmed or described from the code available here.

---

## 5. AI AGENT / MESSAGING

Every occurrence of `AI`, `agent`, `messaging`, `conversation`, `SMS`, `text`, `OpenAI`, `GPT`, `assistant` was searched across all files. This section distinguishes what the **repository** contains from what the **live production webhook** was observed to do, since these two turned out to diverge significantly across this session's testing.

### Repository

**Result: no AI agent code, LLM API call, or SMS-sending code exists anywhere in this repository, and no specific AI provider/model implementation is present in source.**

| Match | Location | Nature |
|---|---|---|
| `AI_MESSAGE_WEBHOOK_URL` | `js/ai-message.js:1` | Just a variable name — no AI processing occurs in this file |
| `js/ai-message.js` (filename) | `js/ai-message.js` | Filename only |
| `#aiMessageForm`, `#aiSubmitButton`, `#aiFormStatus` | `index.html` | Element IDs, named for the feature, not AI logic |
| `/webhook/ai-lead-message` | `js/ai-message.js:2` | Webhook path name only |
| `type="text"` | `index.html` (multiple) | HTML input type attribute, unrelated to "messaging" |
| "Text" (option value) | `index.html` (`preferred_contact_method`) | A contact-method choice, not an SMS integration |

No `openai`, `gpt`, `gemini`, `anthropic`, `assistant`, `conversation`, or `SMS` string literal exists anywhere in the repo. `js/ai-message.js` is a plain frontend POST client: it reads `name`/`phone`/`message`, disables the button, and `fetch()`s that JSON to the URL above, handling only `response.ok` — it never reads the response body. **No AI backend workflow definition or export for `/webhook/ai-lead-message` exists anywhere in this repository** (the only n8n export present, `n8n/Mortgage Lead Intake.workflow.sanitized.json`, documents the unrelated `/webhook/mortgage-lead` path only). Because no such export exists here, no provider/model, prompt, or processing logic behind that endpoint can be inspected from source.

### Live production (as observed in this session, not from repository source)

Multiple live tests were run directly against `https://n8n-1-111-0-g3nd.onrender.com/webhook/ai-lead-message` in later turns of this session:

- **Currently operational.** Three consecutive identical synthetic POSTs (`{"name":"Demo Borrower","phone":"555-0100","message":"I would like to learn more about mortgage options."}`) each returned `HTTP 200`, `Content-Type: application/json`, and `Access-Control-Allow-Origin: https://demo-lead-generator.netlify.app`. Response times were ~3.90s, ~1.99s, and ~3.80s. A subsequent `OPTIONS` preflight returned `204` with matching `Access-Control-Allow-Origin`/`-Methods`/`-Headers`.
- **Each response was a distinct record**: every call returned a unique `id` and a distinct, increasing `created_at` timestamp, alongside `customer_name`, `phone`, `original_message`, `intent`, `wants_callback`, and `status` fields.
- **Reliability is not fully established.** Earlier in this same session, the identical endpoint returned `404 Not Found` ("webhook not registered"), then `502 Bad Gateway`, then `500 Internal Server Error`, before the three consecutive `200`s above. The endpoint should be described as **currently operational, with observed intermittent availability/cold-start-like behavior** — not as durably reliable. A Render free-tier service sleeping/waking is a **plausible inference** consistent with this pattern (the first successful call took ~54s, suggestive of a cold start; the next three were fast), but this has not been confirmed against Render's actual service configuration and should not be stated as a confirmed root cause.
- **AI provider cannot be verified.** The `intent` field's exact wording varied between calls for the identical input message (e.g. "Inquire about mortgage options" vs. "Learn more about mortgage options"), which suggests some processing or generative step runs server-side rather than a fixed template/lookup. However, **no specific provider or model (OpenAI, GPT, Gemini, Anthropic, or otherwise) can be claimed** — nothing in the repository or in any response body identifies one, and no such workflow export exists here to inspect.

**Net conclusion:** the repository's own contents and the live production endpoint's current behavior are two separate facts that should not be conflated. The repository has no AI backend implementation to show. The live endpoint, independently, is presently returning real structured responses, but its short-term history in this session shows it is not a status that can be assumed permanent without repeated monitoring.

---

## 6. NETLIFY

**`netlify.toml`** — present at repo root, full contents:
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"

  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Netlify functions:** none. No `netlify/functions` directory exists anywhere in the repo.

**Redirects/proxy rules:** none. No `[[redirects]]` block in `netlify.toml`, no `_redirects` file anywhere.

**Environment variable references:** none. No `.env`/`.env.example` file, no `process.env.*` usage anywhere in the codebase. Both n8n webhook URLs are hardcoded string literals in client-side JS (`js/script.js:1-2`, `js/ai-message.js:1-2`), not environment-variable-driven.

**Deployment configuration:** static publish only — `publish = "."`, no `[build.command]`, meaning Netlify serves the repo root as-is with zero build step.

---

## 7. PRESERVATION MAP

| File | Purpose | Change? | Reason |
|---|---|---|---|
| `index.html` (lines 72-221, contents inside `#leadForm`) | Renders the 12-field flat mortgage form | **YES** | Must be restructured into 6 step-groups for the guided UX |
| `index.html` (`<form id="leadForm">` tag + single-submit boundary) | Form identity and one-shot submission contract | **NO** | n8n's `Validate Lead`/`Prepare Lead` nodes expect one complete JSON object per submission, not partial per-step posts |
| `js/script.js` lines 1-6 (webhook constant + element refs) | Endpoint + DOM lookups | **NO** | Changing the endpoint or element IDs would break the live n8n integration with no corresponding need |
| `js/script.js` lines 8-75 (submit handler body) | Reads fields, POSTs, handles success/error | **PARTIAL** | Step-navigation logic should be added *around* this handler; the payload-building, `fetch()` call, and success/error branches must remain functionally identical |
| `css/style.css` | Shared visual styling (`.form-card`, `.form-group`, inputs, buttons, `.success-message`) | **PARTIAL (additive only)** | New rules needed for step visibility, progress indicator, and choice-button cards; existing selectors must not be renamed/removed since `#aiMessageForm` also depends on them |
| `n8n/Mortgage Lead Intake.workflow.sanitized.json` | Read-only backup of the live n8n workflow | **NO** | Required-fields list and Supabase/Sheets column mappings depend on the current payload shape |
| `js/ai-message.js` + its `index.html` section (296-353) + its CSS | Separate "Request a Call/Message" feature | **NO** | Unrelated feature; out of scope for the mortgage-form wizard conversion |
| `netlify.toml` | Static publish + security headers | **NO** | No routing/build changes required for a frontend-only UX change |

---

## 8. IMPLEMENTATION PLAN

Convert the flat form into a 6-step guided experience without altering the backend contract:

1. **Keep `<form id="leadForm">` and every existing input's `id`/`name`.** Group the 13 existing inputs into six `<div class="form-step" data-step="N">` containers within the same form, so `js/script.js`'s `document.getElementById(...)` reads require no changes. Show only the active step (e.g., via the `hidden` attribute), hide the rest.

2. **Add step-navigation code in `js/script.js`, placed before the existing submit handler**, not inside it: track a `currentStep` variable; "Next"/"Back" buttons toggle which `.form-step` is visible; before advancing, call `reportValidity()` on just the visible step's required inputs (native HTML5 validation, consistent with the existing validation approach). The final step's "Submit" button remains the same `<button type="submit" id="submitButton">`, still triggering the existing, unmodified `leadForm.addEventListener("submit", ...)` block — same payload build, same `fetch()` call, same success/error handling.

3. **Map new step questions onto existing fields where possible** (no backend change needed):
   - Step 1 "What are you looking to do?" → `service` (add "Cash-Out Refinance" / "Exploring" as new `<option>` values under the same field)
   - Step 5 "Timeline" → `desired_timeline` (near-exact match already)
   - Step 6 "Contact information" → `name`, `email`, `contact_phone`, `preferred_contact_method` (splitting `name` into first/last would change the payload shape — needs a decision, see below)

4. **Two fields need an explicit decision before implementation, because they don't map 1:1 today:**
   - Step 2 "Property type" — no existing field; either add a new one (which n8n does not currently read into Supabase/Sheets — needs a coordinated backend change) or fold the answer into the existing `note` field as text (no backend change, but loses structured queryability).
   - Step 3 "Price range" — `estimated_property_value` is currently a raw number, and n8n's `Prepare Lead` node does `Number(propertyValue)`. Switching to range buttons (e.g., "$300K–$500K") changes this to a non-numeric string, which would break that `Number()` coercion unless either (a) n8n is updated to store a range string, or (b) the frontend maps each range option to a representative numeric value (e.g., midpoint) before sending, preserving the existing numeric contract with zero backend changes.

5. **CSS-only additions** in `css/style.css` for step visibility, a progress indicator, and large tappable choice-buttons, reusing existing design tokens (`--navy`, `--gold`, `--border`, etc.) rather than introducing new colors or a new stylesheet.

6. **No changes** to `N8N_WEBHOOK_URL`, `netlify.toml`, or the `n8n/Mortgage Lead Intake.workflow.sanitized.json` documentation are required for four of the six steps. The remaining two (Property Type, Price Range shape) are the only parts of this plan that touch the backend contract, and only if you choose the "add new field" / "change value shape" options above rather than the no-backend-change alternatives also offered.

---

**READY FOR IMPLEMENTATION: NO**

Reason: Steps 2 (Property Type) and 3 (Price Range) in the requested UX do not have a confirmed, backend-safe mapping onto the current payload yet. Everything else (Steps 1, 4, 5, 6, plus all step-navigation UI/CSS) can be implemented immediately with zero backend impact. Implementation should proceed only after you choose, for each of the two open fields, between the no-backend-change option (fold into `note` / map to numeric midpoint) and the schema-change option (new field / new value shape, requiring a coordinated update to the live n8n workflow) described in Section 8.
