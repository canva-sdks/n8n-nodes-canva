# Monday.com creative request

Turn a new item on a Monday.com "Design requests" board into a finished, on-brand Canva design — posted back to the item as a downloadable file link, with the status set to Done.

**The story:** anyone on the team files a design request in Monday (headline, supporting copy, optionally an image). Canva produces the asset from your brand template and the result appears on the request item a minute later. The team never leaves Monday.

```text
Monday webhook (item created) → Get item → Extract fields
  → [optional] Canva Asset Upload
  → Canva Autofill → Canva Export (PNG) → Monday update + status change
```

## Prerequisites

- A Canva **Enterprise** account (Data Autofill requires it) and a [Canva OAuth2 credential](../../README.md#credentials) with `brandtemplate:*`, `design:content:*` and `asset:*` scopes enabled.
- A **brand template with a dataset**. This example expects `headline` and `subheadline` (text) and optionally `hero_image` (image) — rename them in the _Create design from brand template_ node if yours differ.
- A Monday.com board with text columns for headline/subheadline, an optional Link column for a public image URL, and a Status column.
- A Monday.com credential in n8n (API token).

## Setup

1. Import `workflow.json` into n8n and select your credentials on each Monday and Canva node.
2. In _Create design from brand template_, set your brand template ID.
3. In _Extract request fields_, update the `COLUMNS` map with your board's column IDs.
4. Activate the workflow, then copy the **production** webhook URL from the _Monday webhook_ node.
5. In Monday: board → _Integrate_ → _Webhooks_ → _When an item is created, send a webhook_ → paste the URL. The workflow answers Monday's `challenge` handshake automatically (that's what the _Respond to Monday_ node does).
6. Create an item on the board to test.

## Notes

- The image URL must be **publicly accessible** — Canva fetches it server-side. Files attached to Monday items are behind auth, which is why this example uses a Link column instead of a Files column.
- _Set request status_ assumes a status column with ID `status` and a `Done` label — adjust to your board.
- Export download URLs **expire after 24 hours**; the update also includes a permanent Canva edit link.
- Swap the PNG export for `pdf`, `pptx` or `mp4` (video templates) in _Export design as PNG_.
