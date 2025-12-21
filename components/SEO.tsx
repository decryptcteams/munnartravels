
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://images.unsplash.com/photo-1593693397690-362cb9666c64?q=80&w=1200'
}) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | Munner Travels`;

    // Helper to update meta tag by name or property
    const updateMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        return;
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('meta[name="description"]', description);

    // Open Graph
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[property="og:url"]', window.location.href);

    // Twitter
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', image);

  }, [title, description, image]);

  return null;
};

export default SEO;
