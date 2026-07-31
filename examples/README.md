# Example workflows

Ready-to-import n8n workflows built on the Canva node. Each folder contains a `workflow.json` (import via _Workflows → Import from file_) and a README with setup steps.

| Example                                                   | What it shows                                                                                 |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Sales deck autofill](./sales-deck-autofill/)             | Google Sheets row → autofill → PPTX export → Slack notification                               |
| [Monday.com creative request](./monday-creative-request/) | Monday item → asset upload → autofill → PNG export → file link + status posted back to Monday |
| [Real estate listing flyer](./real-estate-listing-flyer/) | Google Sheets row → Drive photo lookup → asset upload → autofill → design link written back   |

> **Note:** These examples use "Data Autofill" (or sometimes simply referred to as "Autofill"), which requires a Canva Enterprise account and a brand template with a dataset. See each README for the exact scopes and template fields.
