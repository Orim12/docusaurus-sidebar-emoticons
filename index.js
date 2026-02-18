import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/* prettier-ignore */
const defaultTagEmojis = {
  'structure': '📐',
  'guide': '📖',
  'code-example': '💻',
  'wips': '🚧🏁',
  'wip': '🚧',
  'tutorial': '🎓',
  'blocks': '🧱',
  'configuration': '⚙️',
  'optimization': '⚡',
  'collections': '📚',
  'reference': '➡️📖',
  'hooks': '🪝',
  'security': '🔒',
  'setup': '🛠️',
};

export default async function sidebarEmoticonPlugin(context, options = {}) {
  // Use options provided in docusaurus.config.ts, or fall back to defaults
  const tagEmojis = options.tagEmojis || defaultTagEmojis;
  const rootFoldersNoEmoji = new Set(options.rootFoldersNoEmoji || []);

  return {
    name: 'docusaurus-sidebar-emoticons',
    async loadContent() {
      try {
        const docsPath = path.join(context.siteDir, 'docs');
        const allFiles = [];
        const allFolders = new Set();
        const missingEmoticonFolders = [];
        const missingEmoticonDocs = [];

        function walkDir(dir) {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && file !== '_docsinfo') {
              // Record all folders
              const relFolder = path
                .relative(docsPath, filePath)
                .replace(/\\/g, '/');
              allFolders.add(relFolder);
              walkDir(filePath);
            } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
              allFiles.push(filePath);
            }
          });
        }

        walkDir(docsPath);

        const docsWithTags = {};
        const sidebarLabels = {};
        const allDocTags = {};

        // First pass: add emoticons for docs with tags
        allFiles.forEach(filePath => {
          const content = fs.readFileSync(filePath, 'utf-8');
          const { data } = matter(content);
          const relativePath = path
            .relative(docsPath, filePath)
            .replace(/\\/g, '/');
          let docId = relativePath.replace(/\.(md|mdx)$/, '');
          allDocTags[relativePath] = Array.isArray(data.tags) ? data.tags : [];

          // For index files, use the folder path as the ID
          if (docId.endsWith('/index')) {
            docId = docId.replace('/index', '');
          }

          if (data.tags && data.tags.length > 0) {
            docsWithTags[relativePath] = data.tags;
            const firstTag = data.tags[0];
            const emoticon = tagEmojis[firstTag] || '📌';

            sidebarLabels[docId] = emoticon;

            if (data.slug) {
              const slugPath = String(data.slug)
                .replace(/^\/+/, '')
                .replace(/\/+$/, '');
              if (slugPath) {
                sidebarLabels[slugPath] = emoticon;
              }
            }

            // Add emoticon for all parent paths
            const parts = docId.split('/');
            for (let i = 1; i < parts.length; i++) {
              const parentPath = parts.slice(0, i).join('/');
              if (!sidebarLabels[parentPath]) {
                sidebarLabels[parentPath] = emoticon;
              }
            }
          } else if (relativePath !== 'index.mdx') {
            // Skip root index.mdx as it doesn't need tags/emoticons
            missingEmoticonDocs.push(relativePath);
          }
        });

        // Second pass: ensure all folders that don't have emoticons get one from their children
        allFolders.forEach(folderPath => {
          if (!sidebarLabels[folderPath]) {
            // Find first child document's emoticon
            for (const [docId, emoticon] of Object.entries(sidebarLabels)) {
              if (docId.startsWith(folderPath + '/')) {
                sidebarLabels[folderPath] = emoticon;
                break;
              }
            }
          }
          if (!sidebarLabels[folderPath]) {
            missingEmoticonFolders.push(folderPath);
          }
        });

        // Third pass: add emoticons for Docusaurus category paths
        // Map category/ paths to their actual folder equivalents
        const categoryMap = {};
        allFolders.forEach(folder => {
          const folderName = folder.split('/').pop();
          const categoryKey = `category/${folderName}`;

          // If this folder has an emoticon, add it for the category path too
          if (sidebarLabels[folder]) {
            categoryMap[categoryKey] = sidebarLabels[folder];
          }
        });

        // Merge category mappings
        Object.assign(sidebarLabels, categoryMap);

        // Remove emoticons for root folders that already have manual emojis
        rootFoldersNoEmoji.forEach(folder => {
          delete sidebarLabels[folder];
          delete sidebarLabels[`category/${folder}`];
        });

        // Save to static folder for runtime access
        const staticPath = path.join(context.siteDir, 'static');
        if (!fs.existsSync(staticPath)) {
          fs.mkdirSync(staticPath, { recursive: true });
        }

        fs.writeFileSync(
          path.join(staticPath, 'sidebar-emoticons.json'),
          JSON.stringify(sidebarLabels, null, 2)
        );

        if (missingEmoticonDocs.length > 0) {
          console.warn(
            '⚠️ Docs without tags (no emoticon source):',
            missingEmoticonDocs.sort().join(', ')
          );
        }
        if (missingEmoticonFolders.length > 0) {
          console.warn(
            '⚠️ Folders without emoticons:',
            missingEmoticonFolders.sort().join(', ')
          );
        }

        return docsWithTags;
      } catch (error) {
        console.error('❌ Error loading emoticons:', error.message);
        return {};
      }
    },
    async contentLoaded({ content, actions }) {
      // Plugin loaded silently
    },
  };
}
