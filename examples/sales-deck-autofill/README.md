# Sales deck autofill

Turn a row in a Google Sheet into a client-ready, on-brand pitch deck — exported as PPTX and delivered to Slack.

**The story:** a sales rep adds a client to a "Deck requests" sheet. A minute later, a personalised deck built from your brand template lands in their Slack channel. No designer, no copy-paste, always on-brand.

```text
Google Sheets (new row) → Canva Autofill → Canva Export (PPTX) → Slack
```

## Prerequisites

- A Canva **Enterprise** account (Data Autofill requires it) and a [Canva OAuth2 credential](../../README.md#credentials) with `brandtemplate:*`, `design:content:*` and `asset:read` scopes enabled.
- A **brand template with a dataset**. This example expects four text fields — rename them in the *Create deck from brand template* node if yours differ:
  - `client_name`, `headline`, `key_points`, `prepared_by`
  - Tip: to build one, create a deck, tag the text elements as data fields (or ask Claude with the Canva connector to do it), and publish via *Share → Publish as brand template*. Autofill replaces each tagged element's **entire** text, so include any static prefix (e.g. "Prepared by …") in the workflow data, not the template.
- A Google Sheet with matching column headers: `client_name`, `headline`, `key_points`, `prepared_by`.
- Google Sheets and Slack credentials in n8n.

## Setup

1. Import `workflow.json` into n8n (*Workflows → Import from file*).
2. Open each node and select your credentials.
3. In the trigger, point to your spreadsheet and sheet.
4. In *Create deck from brand template*, set your brand template ID (from the template's URL: `canva.com/brand/templates/{ID}`) and check the field mapping. Use the **Brand Template → Get Dataset** operation to inspect a template's field names.
5. In *Notify the rep in Slack*, pick your channel.
6. Activate the workflow and add a row to the sheet.

## Notes

- Export download URLs **expire after 24 hours** — the Slack message also includes a permanent edit link.
- The autofill and export operations poll until the job completes (`maxWait` 120s by default).
- Swap the trigger for a Slack slash command, HubSpot/Salesforce trigger, or n8n Form to match your intake process — the Canva part stays identical.
