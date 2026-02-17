import React, { useEffect, useState } from 'react';

export default function Root({ children }) {
  const [emoticons, setEmoticons] = useState({});

  useEffect(() => {
    // Fetch emoticons data
    fetch(`/sidebar-emoticons.json?ts=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setEmoticons(data);
      })
      .catch(err => {
        console.error('❌ Could not load emoticons:', err);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(emoticons).length === 0) return;

    const applyEmoticons = () => {
      const currentDocId = decodeURIComponent(window.location.pathname)
        .replace(/^\/docs\/?/, '')
        .replace(/\/$/, '');

      // Get all sidebar items - both category labels and doc links
      const sidebarItems = document.querySelectorAll('[class*="sidebar"] a, .menu__link');
      
      sidebarItems.forEach((link) => {
        const text = link.textContent;

        
        // Skip if already decorated
        if (link.getAttribute('data-emoji')) {
          return;
        }

        const href = link.getAttribute('href');
        
        let docId = '';

        if (!href) {
          const isActive =
            link.getAttribute('aria-current') === 'page' ||
            link.classList.contains('menu__link--active');

          if (!isActive || !currentDocId) {
            return;
          }

          docId = currentDocId;
        } else {
          const decodedHref = (() => {
            try {
              return decodeURIComponent(href);
            } catch {
              return href;
            }
          })();

          // Extract docId from href
          docId = decodedHref
            .replace(/^#/, '')
            .replace(/\?.*$/, '')
            .replace(/#.*$/, '')
            .replace(/\.html$/, '')
            .replace(/\/$/, '');

          if (docId.startsWith('/')) {
            docId = docId.slice(1);
          }
          if (docId.startsWith('docs/')) {
            docId = docId.replace(/^docs\//, '');
          }
        }

        // Look for exact match first
        let emoticon = emoticons[docId];

        // If not found, try looking for parent paths
        if (!emoticon) {
          const parts = docId.split('/');
          for (let i = parts.length; i > 0; i--) {
            const pathToCheck = parts.slice(0, i).join('/');
            if (emoticons[pathToCheck]) {
              emoticon = emoticons[pathToCheck];
              break;
            }
          }
        }

        if (emoticon) {
          try {
            link.setAttribute('data-emoji', emoticon);
          } catch (e) {
            console.error(`❌ Error adding emoticon to "${text}":`, e.message);
          }
        }
      });
    };

    // Run with delays to ensure DOM is ready
    setTimeout(applyEmoticons, 100);
    setTimeout(applyEmoticons, 500);
    setTimeout(applyEmoticons, 1000);

    // Watch for sidebar changes
    const observer = new MutationObserver(() => {
      applyEmoticons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => {
      observer.disconnect();
    };
  }, [emoticons]);

  return <>{children}</>;
}


