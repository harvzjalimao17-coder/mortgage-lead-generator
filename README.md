# MortgageConnect Lead Generator

Portfolio demonstration of a mortgage lead generation and workflow automation system.

## Frontend

Static HTML, CSS, and JavaScript.

The page is centered on a single Mortgage Consultation experience: a hero
section with four feature points (Simple intake, Fast lead routing, n8n
ready, CRM connected) and a 9-step guided mortgage intake wizard.

The page no longer includes the earlier "Behind the Form," "System
Architecture," or "Get in Touch" (AI Message form) sections.

`js/ai-message.js` remains in the repository but is no longer loaded by
`index.html`, since the AI Message form it powered was removed from the
page.

## Current workflow

Website Form
→ n8n Webhook
→ Validate Lead
→ Structure Data
→ CRM
→ Follow Up

## n8n webhook

The JavaScript points to the n8n production webhook:

https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead

## Netlify

No build command is required.

Publish directory:

.

## Portfolio disclaimer

This is a sample portfolio system. No real loan application is being submitted.
