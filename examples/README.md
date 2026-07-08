# Example workflows

Ready-to-import n8n workflows built on the Canva node. Each folder contains a `workflow.json` (import via *Workflows → Import from file*) and a README with setup steps.

| Example                                                | What it shows                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [Sales deck autofill](./sales-deck-autofill/)          | Google Sheets row → brand template autofill → PPTX export → Slack notification                          |
| [Monday.com creative request](./monday-creative-request/) | Monday item → asset upload → autofill → PNG export → file link + status posted back to Monday        |

> **Note:** both examples use Data Autofill, which requires a Canva Enterprise account and a brand template with a dataset. See each README for the exact scopes and template fields.
