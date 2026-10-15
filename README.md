# n8n-nodes-canva

![Banner](./.github/assets/github-banner.jpg)

Use Canva in your n8n workflows. Create, autofill, and export designs, manage your assets and folders, and use Canva's AI to generate designs and images, remove backgrounds, or turn flat images into editable designs.

This node uses the [Canva REST APIs](https://www.canva.dev/docs/apps/rest-apis/) (formerly the Connect API).

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Good to know](#good-to-know)
- [Run it locally](#run-it-locally)
- [Resources](#resources)

## Installation

Follow n8n's guide to [installing community nodes](https://docs.n8n.io/integrations/community-nodes/installation-and-management), using the package name `@canva/n8n-nodes-canva`.

## Credentials

To connect n8n to Canva, you create an app in the Canva Developer Portal, then paste its details into n8n. It takes about five minutes.

### 1. Create an app in the Canva Developer Portal

1. Go to [**Your apps**](https://www.canva.com/developers/apps) in the Canva Developer Portal and create a new app. Choose **Private** if your team is on Canva Enterprise (the app stays inside your team), or **Public** otherwise. You can't change this later.
2. Open **Outside Canva** and click **Start integrating**.
3. On **Outside Canva → Configuration**:
   - Turn on **Canva REST APIs**.
   - Under **Credentials**, copy the **Client ID**, then click **Generate secret** and copy the secret too. Canva only shows the secret once, so keep it somewhere safe.
   - Under **Scopes**, turn on all of these:
     - `asset`: Read and Write
     - `brandtemplate:content`: Read and Write
     - `brandtemplate:meta`: Read
     - `comment`: Read and Write
     - `design:content`: Read and Write
     - `design:meta`: Read
     - `folder`: Read and Write
     - `profile`: Read

     The node asks for all of them when you connect, and Canva refuses the connection if any are missing.

4. On **Outside Canva → Redirect URLs**, paste n8n's redirect URL into **URL 1**. You'll find it in the n8n credential screen (step 2 below). It usually looks like this:
   - **n8n Cloud:** `https://oauth.n8n.cloud/oauth2/callback`
   - **Self-hosted n8n:** `https://your-n8n-instance.com/rest/oauth2-credential/callback`
   - **n8n on your computer:** `http://127.0.0.1:5678/rest/oauth2-credential/callback` (Canva doesn't accept `localhost`, so use `127.0.0.1`)

### 2. Connect it in n8n

1. In n8n, go to **Credentials → New** and pick **Canva OAuth2 API**.
2. Paste the **Client ID** and **Client secret** from step 1.
3. Click **Connect my account** and approve access in Canva.

## Operations

A few labels you'll see below:

- _(Preview)_: uses one of Canva's preview APIs. See [Preview APIs](#preview-apis).
- 💎: needs a paid Canva plan, such as Canva Pro.
- ✨: uses the Canva user's AI credits. See [AI credits](#ai-credits).

### Asset

| Operation                   | What it does                               |
| --------------------------- | ------------------------------------------ |
| Delete                      | Delete an asset                            |
| Get                         | Get an asset's details                     |
| Update                      | Rename an asset or change its tags         |
| Upload From URL _(Preview)_ | Upload an image or video from a public URL |

### Autofill

> 💎 Needs a Canva Pro plan or above.

| Operation | What it does                                              |
| --------- | --------------------------------------------------------- |
| Create    | Fill a brand template with your data to make a new design |

### Brand Template

> 💎 Needs a Canva plan with premium features, such as Canva Pro.

| Operation           | What it does                                        |
| ------------------- | --------------------------------------------------- |
| Get                 | Get a brand template's details                      |
| Get Dataset         | Get the fields you can autofill in a brand template |
| Get Many            | List the brand templates you can use                |
| Publish _(Preview)_ | Publish a design as a brand template                |

### Comment _(Preview API)_

| Operation     | What it does                       |
| ------------- | ---------------------------------- |
| Create Reply  | Reply to a comment thread          |
| Create Thread | Start a comment thread on a design |
| Get Reply     | Get one reply from a thread        |
| Get Thread    | Get a comment thread               |
| List Replies  | List the replies in a thread       |

### Design

| Operation             | What it does                                          |
| --------------------- | ----------------------------------------------------- |
| Create                | Create a blank design, optionally with an image in it |
| Get                   | Get a design's details                                |
| Get Dataset           | Get the fields you can autofill in a design           |
| Get Export Formats    | See which file formats a design can be exported to    |
| Get Many              | List your designs                                     |
| Get Pages _(Preview)_ | Get details about each page in a design               |

### Design Import

| Operation                     | What it does                                                        |
| ----------------------------- | ------------------------------------------------------------------- |
| Import From Image _(Preview)_ | ✨ Turn a flat image into an editable design with Magic Layers      |
| Import From URL               | Import a file from a public URL, such as a PPTX or PDF, as a design |

### Export

| Operation     | What it does                                                                         |
| ------------- | ------------------------------------------------------------------------------------ |
| Export Design | Export a design as a PDF, PNG, JPG, GIF, MP4, PPTX, and more, and get download links |

### Folder

| Operation  | What it does                                      |
| ---------- | ------------------------------------------------- |
| Create     | Create a folder                                   |
| Delete     | Delete a folder                                   |
| Get        | Get a folder's details                            |
| List Items | List what's in a folder                           |
| Move Item  | Move a design, image, or folder to another folder |
| Update     | Rename a folder                                   |

### Generation _(Preview API)_

| Operation       | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| Generate Design | ✨ Create a presentation or Canva doc from a written brief |
| Generate Image  | ✨ Create an image from a text prompt                      |

### Image Transformation _(Preview API)_

> 💎 Needs a Canva plan with premium features, such as Canva Pro.

| Operation         | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| Remove Background | ✨ Remove the background from an image and save it as a new image |

### Merge _(Preview API)_

| Operation        | What it does                                                                     |
| ---------------- | -------------------------------------------------------------------------------- |
| Create Merge Job | Combine pages from other designs into a new one, or rearrange an existing design |

### Resize

> 💎 Needs a Canva plan with premium features, such as Canva Pro. Canva Free users get a limited trial.

| Operation         | What it does                          |
| ----------------- | ------------------------------------- |
| Create Resize Job | Make a copy of a design in a new size |

### User

| Operation        | What it does                                        |
| ---------------- | --------------------------------------------------- |
| Get Capabilities | See which Canva features the connected user can use |
| Get Me           | Get the connected user's ID and team ID             |
| Get Profile      | Get the connected user's display name               |

## Good to know

### Waiting for Canva to finish

Some operations start a job in Canva and wait for it to finish: Upload From URL, Autofill, both imports, Export, Merge, Resize, and all the AI features. While it waits, the node checks every few seconds (**Poll Interval**) and gives up after a while (**Max Wait**, 60 to 300 seconds by default, depending on the operation). Big jobs, like long presentations, can take a couple of minutes.

If a job fails, the error tells you Canva's reason, such as a prompt that didn't pass Canva's safety checks.

### When Canva is busy, or a quota runs out

If Canva says it's getting too many requests, the node waits and tries again, up to three times. If the user has run out of AI credits, or used up their free autofill or resize trial, waiting won't help, so the node stops straight away and says so.

### Preview APIs

Operations marked _(Preview)_ use Canva APIs that are still in preview. They can change without notice, and apps that use them can't be submitted for Canva's public review. They're great for internal workflows and experiments.

### AI credits

**Import From Image**, **Generate Design**, **Generate Image**, and **Remove Background** use the Canva user's AI credits every time they run. Checking on a running job is free.

Not every account can use every AI feature. **User → Get Capabilities** lists what the connected user can do, for example `image_to_design_imports` (Magic Layers), `background_removal`, and `design_generation`.

### Tips

- **Autofill:** run **Brand Template → Get Dataset** first. Your data's field names need to match the template's fields.
- **Import From Image (Magic Layers):** works best on flat graphics like posters, flyers, and social posts. Upload the image first with **Asset → Upload From URL**, then use its ID: `{{ $json.job.asset.id }}`. Magic Layers must be allowed in your team's Canva settings.
- **Remove Background:** saves the result as a new image and leaves the original as it is. The new image's ID is at `job.result.asset.id`.
- **Generate Design:** the more your brief says about the topic, audience, wording, tone, and look, the better the result. For presentations, you can also plan the slides with **Outline**, using Canva's format: `{"sections": [{"title": "…", "description": "…", "points": ["…"]}]}` (up to 100 slides). Leave `sections` empty to let Canva decide. If an earlier node gives you just a list of slides, use `{{ { "sections": $json.slides } }}`. Open the new design from `job.result.design.urls.edit_url` (the link works for 30 days).
- **Generate Image:** leave **Model** on **Auto** unless you need a specific one. Images are saved to the user's Uploads by default, so you can use `job.result.image.asset.id` in **Design → Create** or **Autofill**. The download link at `job.result.image.url` works for 24 hours. To pass the file to another node, download it with an **HTTP Request** node.
- **Move Item:** use `root` as the **To Folder ID** to move something to the top level of your Projects.

## Run it locally

For developers who want to work on this node.

You'll need Node.js 24.15 or later and npm. Then run:

```bash
npm install
npm run dev
```

This builds the node and starts n8n at [http://127.0.0.1:5678](http://127.0.0.1:5678) with the Canva node loaded and hot reload turned on. When you set up your Canva app, use `http://127.0.0.1:5678/rest/oauth2-credential/callback` as the redirect URL.

**If `npm run dev` fails with `EACCES: permission denied, rename ...` in `~/.npm/_cacache`:** your npm cache has files owned by another user, usually left behind by running npm with `sudo`. Take ownership of the cache, then try again:

```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

## Resources

- [Example workflows](./examples/), ready to import
- [Canva REST APIs](https://www.canva.dev/docs/apps/rest-apis/) and the [REST API reference](https://www.canva.dev/docs/apps/reference/)
- [Canva Developer Portal](https://www.canva.com/developers/apps)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes)
