# Mortgage Lead Intake n8n Backup

This directory contains a sanitized export of the Mortgage Lead Intake n8n workflow.

## Purpose

The JSON preserves the workflow architecture, node configuration, JavaScript logic, connections, validation, duplicate detection, lead scoring, Supabase mappings, Google Sheets mappings, and webhook responses.

Credential references and the live Google Sheet identifier have been removed or replaced with placeholders before version control.

## Important

This is a documentation and recovery backup, not a one click production import.

Before importing into another n8n instance, restore the appropriate credentials and external resource identifiers.

The production webhook path is:

POST /webhook/mortgage-lead

Do not commit raw n8n exports containing credential references, private resource identifiers, or other environment specific data unless the repository is intentionally private and the exposure has been reviewed.
