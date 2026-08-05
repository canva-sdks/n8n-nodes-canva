# Course certificates

Turn a Google Sheets row into a personalised, on-brand course certificate — exported as PDF and emailed to the recipient as an attachment.

**The story:** a course coordinator fills in a row (name, date, course, instructor, email) and flips `ready` to `YES`. A minute later the recipient has their certificate in their inbox, and the sheet shows `SENT` with the Canva design link.

```text
Google Sheets (row update) → Canva Autofill → Canva Export (PDF) → Download → Gmail (attach) → status written back
```

## Prerequisites

- n8n with the `@canva/n8n-nodes-canva` node installed — a [verified community node](https://docs.n8n.io/integrations/community-nodes/installation/verified-install/), available on n8n Cloud (Starter+, v1.94+) via the Nodes panel, or on self-hosted n8n
- A Canva **Enterprise** account (Data Autofill requires it) and a [Canva OAuth2 credential](../../README.md#credentials) with `brandtemplate:*` and `design:content:*` scopes enabled (no asset scopes needed — nothing is uploaded)
- A **certificate brand template with a dataset** — all text fields:

  | Field           | Type |
  | --------------- | ---- |
  | full_name       | text |
  | full_date       | text |
  | course_name     | text |
  | instructor_name | text |

  Autofill replaces each tagged element's **entire** text, so keep static labels ("This certifies that…") in separate, untagged elements.

- Google credentials in n8n: a **Google Sheets** credential (trigger + write-backs) and a **Gmail** credential (sending). Enable the corresponding APIs in your Google Cloud project.

## Setup

1. Create a Google Sheet with header columns: `ready`, `certificate_id`, `full_name`, `full_date`, `course_name`, `instructor_name`, `email`, `design_url`, `status`.
2. In **Workflow configuration**, set your brand template ID (`spreadsheet_id`/`sheet_id` are derived from the trigger automatically — don't touch them).
3. Point the trigger at your spreadsheet and select credentials on all nodes.
4. Personalise the email subject/body in _Email certificate to recipient_.
5. Activate, fill in a row, set `ready` to `YES`.

## Notes

- **Why `certificate_id`?** It's the unique key the write-back nodes match on — names and emails can repeat (same person, two courses). It isn't printed on the certificate unless you add it to your template's dataset.
- **Why download before emailing?** Canva export URLs expire after 24 hours. Attaching the PDF means the recipient's copy never dies.
- **Dates:** on row-update events the trigger returns date cells as [serial numbers](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.googlesheetstrigger/common-issues#date-and-time-columns-are-rendering-as-numbers) (the DateTime Render fix only applies to _Row Added_). **Workflow configuration** normalises `full_date` to text (e.g. `5 August 2026`) — change the locale/format there if needed.
- The trigger watches **only the `ready` column**, and rows only process when `ready` is exactly `YES`. On success the row flips to `DONE`; on any failure it flips to `ERROR` with the message in `status` — fix and set back to `YES` to retry.
- Swap Gmail for **SMTP (Send Email)** or **Microsoft Outlook** without touching the rest of the workflow.
