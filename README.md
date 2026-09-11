# MortgageConnect Lead Generator

Portfolio demonstration of a mortgage lead generation and workflow automation system.

## Frontend

Static HTML, CSS, and JavaScript.

The hero section presents two side-by-side experiences: an AI Lead
Messaging form on the left, and the 9-step guided mortgage consultation
wizard on the right.

The page no longer includes the earlier "Behind the Form" or "System
Architecture" sections.

## AI Lead Messaging

`index.html` includes an AI Lead Messaging form (`#aiMessageForm`), and
`js/ai-message.js` is loaded by the page. Submitting the form sends a
JSON payload (`name`, `phone`, `message`) via `fetch()` directly to:

https://n8n-1-111-0-g3nd.onrender.com/webhook/ai-lead-message

This is a frontend interface only. **No AI backend workflow definition
exists in this repository** — there is no n8n export for this endpoint,
and no OpenAI, GPT, GoHighLevel (GHL), or SMS integration is implemented
anywhere in this codebase. The webhook above would need to be built and
activated separately on the live n8n instance for this form to receive
a real response.

This is a separate integration from the mortgage lead intake workflow
below, which uses its own webhook path and is unrelated to AI messaging.

## Current workflow

Website Form
→ n8n Webhook
→ Validate Lead
→ Structure Data
→ CRM
→ Follow Up

## n8n webhook

The mortgage consultation wizard (`#leadForm`) points to the n8n
production webhook for mortgage lead intake — a separate workflow from
AI Lead Messaging above:

https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead

## Netlify

No build command is required.

Publish directory:

.

## Portfolio disclaimer

This is a sample portfolio system. No real loan application is being submitted.
