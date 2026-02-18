# Docusaurus Sidebar Emoticon Plugin

Adds sidebar emoticons based on document tags in a Docusaurus site.

## Features

- Maps doc tags to emoticons for sidebar labels.
- Propagates emoticons to parent folders and category paths.
- Emits a JSON map to the Docusaurus static folder for runtime use.
- Warns about docs or folders without tags.

## Install

```bash
npm install sidebar-emoticon-plugin
```

If the name is not available, publish and install with a scope:

```bash
npm install @orim12/sidebar-emoticon-plugin
```

## Setup

1. Add the plugin to your Docusaurus config with your tag-to-emoticon mappings:

```js
// docusaurus.config.js
export default {
  // ...
  plugins: [
    [
      'sidebar-emoticon-plugin',
      {
        tagEmojis: {
          'guide': '📖',
          'tutorial': '🎓',
          'code-example': '💻',
          // Add your custom tag-to-emoticon mappings
        },
        // Optional: exclude certain folders from getting emoticons
        rootFoldersNoEmoji: ['advanced-features', 'setup'],
      },
    ],
  ],
};
```

2. Add a setup script to your `package.json`:

```json
{
  "scripts": {
    "sidebar-emoticon-setup": "sidebar-emoticon-plugin"
  }
}
```

3. Run the setup script to copy the theme override:

```bash
npm run sidebar-emoticon-setup
```

This copies [theme/Root.tsx](theme/Root.tsx) into your site at `src/theme/Root.tsx`.

## Usage

Add tags to your docs front matter. The first tag is used to select an emoticon.

```md
---
title: Example
tags:
  - structure
  - guide
  - code-example
---
```

## Configuration

Pass configuration options to the plugin in your Docusaurus config:

- `tagEmojis`: Object mapping tag names to emoticons (required).
- `rootFoldersNoEmoji`: Array of folder names that should not receive emoticons (optional).

## How It Works

- The plugin scans `docs/` during build and creates `static/sidebar-emoticons.json`.
- The Root theme component loads that JSON and annotates sidebar links.

## Testing locally (developer)

Follow one of these approaches to test the plugin with a local Docusaurus site.

1) Quick link (recommended for iterative development)

```bash
# In the plugin repo
npm install
npm link

# In your Docusaurus site repo
npm link sidebar-emoticon-plugin
npm install
npm run start # or `yarn start`
```

Then add the plugin to your site's `docusaurus.config.js` (see Setup above) and verify that `static/sidebar-emoticons.json` is generated and the sidebar shows emoticons.

2) Pack and install (closer to a release install)

```bash
# In the plugin repo
npm install
npm pack

# In your Docusaurus site repo
npm install /path/to/sidebar-emoticon-plugin-<version>.tgz
npm run start
```

3) Run the setup script to copy the theme override

After installing the plugin into your site, you can run the setup script that copies `theme/Root.tsx` into your site. Add the script to your site's `package.json` as described in Setup, then run:

```bash
npm run sidebar-emoticon-setup
# or, if you installed the plugin globally with `npm link`, run:
npx sidebar-emoticon-plugin
```

Verification

- Confirm `static/sidebar-emoticons.json` exists in the built site or in `build` when running locally.
- Check the browser UI for emoticons appearing next to sidebar items.
- Inspect browser console for plugin warnings about missing tags.


## License

GPL-3.0-only
