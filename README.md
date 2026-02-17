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
          guide: '📖',
          tutorial: '🎓',
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

2. Copy the theme override into your site:

```bash
npm run setup
```

This copies [theme/Root.tsx](theme/Root.tsx) into your site at `src/theme/Root.tsx`.

## Usage

Add tags to your docs front matter. The first tag is used to select an emoticon.

```md
---
title: Example
tags: [guide]
---
```

## Configuration

Pass configuration options to the plugin in your Docusaurus config:

- `tagEmojis`: Object mapping tag names to emoticons (required).
- `rootFoldersNoEmoji`: Array of folder names that should not receive emoticons (optional).

## How It Works

- The plugin scans `docs/` during build and creates `static/sidebar-emoticons.json`.
- The Root theme component loads that JSON and annotates sidebar links.

## License

GPL-3.0-only
