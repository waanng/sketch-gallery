(function () {
  const site = window.SKETCH_SITE;
  const collections = window.SKETCH_COLLECTIONS || [];
  const grid = document.getElementById('collections-grid');

  if (!grid) return;

  grid.innerHTML = collections.map((collection, index) => `
    <a href="${collection.page}" class="collection-card" style="animation-delay: ${(index + 1) * 0.1}s">
      <div class="collection-cover">
        <img src="${collection.coverImage}" alt="${collection.name}" loading="lazy">
      </div>
      <div class="collection-info">
        <h2>${collection.name}</h2>
        <p>${collection.year}</p>
        <span class="collection-count">${collection.images.length} 幅作品</span>
      </div>
    </a>
  `).join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    alternateName: 'Wang An Sketch Portfolio',
    url: site.url,
    description: '王安的速写作品集网站，展示多年速写创作画册',
    author: {
      '@type': 'Person',
      name: site.author
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collections.map((collection, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: collection.name,
        url: `${site.url}${collection.page}`
      }))
    }
  };

  let script = document.head.querySelector('#site-schema');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'site-schema';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
})();
