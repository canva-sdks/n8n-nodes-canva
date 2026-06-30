# n8n-nodes-canva

This is an n8n community node for the [Canva Connect API](https://www.canva.dev/docs/connect/). It lets you automate Canva workflows — creating and exporting designs, managing folders, uploading assets, running autofill jobs, and more — directly from n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Running n8n locally](#running-n8n-locally)
- [Credentials](#credentials)
- [Operations](#operations)
- [Usage notes](#usage-notes)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Running n8n locally

If you want to try this node on your machine before publishing, you can run n8n locally and load the node straight from this repo.

**Prerequisites:** Node.js 20+, npm.

1. Install n8n globally

   ```bash
   npm install -g n8n
   ```

2. Build the node

   From the root of this repo:

   ```bash
   npm install
   npm run build
   ```

3. Link the package

   ```bash
   npm link
   ```

   Then, in a separate terminal, tell n8n to load it:

   ```bash
   npm link @canva/n8n-nodes-canva
   ```

   > Run this inside the n8n installation directory — typically `~/.n8n` or wherever `n8n` was installed globally. You can find it with `npm root -g`.

4. Start n8n in dev mode

   Back in this repo:

   ```bash
   npm run dev
   ```

This starts n8n at [http://localhost:5678](http://localhost:5678) and watches for file changes. The **Canva** node will be available in the node picker under *Community Nodes*.

⚠️ If you're running the local instance of n8n, the your "Redirect URI" in the setup steps below should look like `http://127.0.0.1:5678/rest/oauth2-credential/callback` (Canva doesn't allow you to use "localhost" as a domain, you must use your local IP address instead).

## Credentials

This node uses **OAuth2 with PKCE** to authenticate with Canva.

### Prerequisites

1. A [Canva account](https://www.canva.com/)
2. A Canva integration registered at the [Canva Developer Portal](https://www.canva.dev/)

### Setup

1. In the Canva Developer Portal, create a new integration and note your **Client ID**.
2. Set the redirect URI to match your n8n instance (e.g. `https://your-n8n-instance.com/rest/oauth2-credential/callback`).
3. In n8n, open **Credentials → New → Canva OAuth2 API** and enter your Client ID.
4. Click **Connect my account** and complete the OAuth flow.

The node requests the following OAuth scopes:

| Scope                                                                                     | Used by                                           |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `asset:read` / `asset:write`                                                              | Asset resource                                    |
| `brandtemplate:content:read` / `brandtemplate:content:write` / `brandtemplate:meta:read`  | Brand Template resource                           |
| `comment:read` / `comment:write`                                                          | Comment resource (Preview)                        |
| `design:content:read` / `design:content:write` / `design:meta:read`                       | Design, Autofill, Export, Merge, Resize resources |
| `folder:read` / `folder:write`                                                            | Folder resource                                   |
| `profile:read`                                                                            | User resource                                     |

## Operations

### Asset

| Operation | Description                    |
| --------- | ------------------------------ |
| Delete    | Delete an asset                |
| Get       | Get metadata for an asset      |
| List      | List assets in a folder        |
| Update    | Update an asset's name or tags |
| Upload    | Upload an asset from a URL     |

### Autofill

| Operation  | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| Create Job | Populate a brand template with data and wait for the resulting design (async) |

### Brand Template

| Operation           | Description                                   |
| ------------------- | --------------------------------------------- |
| Get                 | Get metadata for a brand template             |
| Get Dataset         | Get the autofill dataset for a brand template |
| List                | List brand templates accessible to the user   |
| Publish *(Preview)* | Publish a design as a brand template          |

### Comment *(Preview API)*

> ⚠️ All Comment operations use a Preview API that may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.

| Operation     | Description                                |
| ------------- | ------------------------------------------ |
| Create Reply  | Reply to a comment thread on a design      |
| Create Thread | Create a new comment thread on a design    |
| Get Reply     | Get a specific reply from a comment thread |
| Get Thread    | Get metadata for a comment thread          |
| List Replies  | List all replies in a comment thread       |

### Design

| Operation               | Description                                   |
| ----------------------- | --------------------------------------------- |
| Create                  | Create a new design                           |
| Get                     | Get metadata for a design                     |
| Get Dataset *(Preview)* | Get the autofill dataset for a design         |
| Get Export Formats      | Get the available export formats for a design |
| Get Pages               | Get metadata for pages in a design            |
| List                    | List designs in the user's projects           |

### Design Import

| Operation         | Description                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Create Import Job | Import an external file (e.g. PPTX, PDF) into Canva from a URL and wait for completion (async) |

### Export

| Operation  | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| Create Job | Export a design to a file format and wait for the download URL (async) |

### Folder

| Operation  | Description                                           |
| ---------- | ----------------------------------------------------- |
| Create     | Create a new folder                                   |
| Delete     | Delete a folder                                       |
| Get        | Get metadata for a folder                             |
| List Items | List items inside a folder                            |
| Move Item  | Move a design, asset, or folder to a different folder |
| Update     | Rename a folder                                       |

### Merge *(Preview API)*

> ⚠️ All Merge operations use a Preview API that may have unannounced breaking changes and cannot be used in public integrations submitted for Canva review.

| Operation        | Description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| Create Merge Job | Merge design pages by applying page operations to create or modify a design (async) |

### Resize

> 💎 The Resize API requires a Canva plan with premium features (such as Canva Pro). Users on the Canva Free plan have access to a limited trial.

| Operation         | Description                                                                       |
| ----------------- | --------------------------------------------------------------------------------- |
| Create Resize Job | Create a resized copy of a design in new dimensions or a different format (async) |

### User

| Operation        | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| Get Capabilities | Get the API capabilities available to the current user account |
| Get Me           | Get the User ID and Team ID of the authenticated user          |
| Get Profile      | Get the display name of the authenticated user                 |

## Usage notes

### Async operations

Several operations — **Autofill**, **Design Import**, **Export**, **Merge**, and **Resize** — create background jobs in Canva. This node automatically polls for completion and returns the final result once the job succeeds.

You can tune polling behaviour with two optional parameters available on each async operation:

- **Poll Interval** (default 3 s) — how often to check for job completion
- **Max Wait** (default 120 s) — maximum time to wait before throwing a timeout error

If a job fails, the node throws an error with the Canva error details.

### Preview APIs

Operations marked **(Preview)** use endpoints that are still in preview on the Canva platform. They may change without notice and **cannot be used in integrations submitted to Canva's public integration review**. Use them only for internal or development workflows.

### Moving items

The **Folder → Move Item** operation accepts any item ID (design, asset, or folder). To move an item to the top-level Projects folder, use `root` as the **To Folder ID**.

### Autofill dataset format

The **Autofill → Create Job** operation requires a `data` object whose keys must match the dataset fields returned by **Brand Template → Get Dataset**. Use the Get Dataset operation first to discover the correct field names.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Canva Connect API reference](https://www.canva.dev/docs/connect/api-reference/)
- [Canva Developer Portal](https://www.canva.dev/)
