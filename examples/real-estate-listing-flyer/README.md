# Real estate listing flyer

Google Sheets row → Google Drive photo lookup → Canva asset upload → Data Autofill → design link written back to the sheet.

Import `workflow.json` via _Workflows → Import from file_.

## Prerequisites

- n8n with the `@canva/n8n-nodes-canva` node installed — a [verified community node](https://docs.n8n.io/integrations/community-nodes/installation/verified-install/), available on n8n Cloud (Starter+, v1.94+) via the Nodes panel, or on self-hosted n8n
- A Canva **Enterprise** account (Data Autofill requires it) and a [Canva OAuth2 credential](../../README.md#credentials) with `brandtemplate:*`, `design:content:*` and `asset:*` scopes enabled (the workflow uploads the photo and autofills a brand template).
- Google credentials in n8n: a **Google Sheets** credential (used by the trigger and both write-back nodes) and a **Google Drive** credential (used by the photo search). Both are Google OAuth2 credentials — enable the Sheets and Drive APIs in your Google Cloud project.
- A Canva brand template with a dataset:

  | Field          | Type  |
  | -------------- | ----- |
  | property_photo | image |
  | address        | text  |
  | price          | text  |
  | beds_baths     | text  |
  | agent_name     | text  |
  | agent_phone    | text  |

## Setup

1. Create a Google Sheet with header columns: `ready`, `listing_id`, `address`, `price`, `beds`, `baths`, `agent_name`, `agent_phone`, `design_url`, `status`.
2. Create a Google Drive folder for listing photos. Name each photo after its listing ID (e.g. `RE-1024.jpg`) and share the folder as **Anyone with the link → Viewer** (Canva fetches the image by URL).
3. In the **Workflow configuration** node, set your brand template ID and Drive folder ID.
4. Point the trigger and both Google Sheets nodes at your spreadsheet, and select your credentials on all nodes.
5. Activate the workflow, fill in a row, set `ready` to `YES`.

## Notes

### Why does the trigger watch only the `ready` column?

The Google Sheets trigger polls and fires on any cell change — typically before an agent has finished typing the row. This template avoids half-filled rows in three ways:

1. The trigger's **Columns to Watch** option is set to `ready` only, so edits to other columns never fire the workflow.
2. An IF node only lets rows through when `ready` is exactly `YES` — a deliberate action by the agent.
3. On success the workflow sets `ready` to `DONE` (re-triggering once, then stopping at the guard), so a row can't be processed twice. Setting `ready` back to `YES` re-runs a listing.

If no photo is found in Drive, the row is marked `NO_PHOTO` with instructions in `status` instead of failing the execution.
