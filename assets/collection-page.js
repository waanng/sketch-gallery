(function () {
  const site = window.SKETCH_SITE;
  const slug = document.body.dataset.collection;
  const collection = window.SKETCH_COLLECTIONS_BY_SLUG?.[slug];

  if (!collection) {
    document.body.innerHTML = '<main style="padding: 120px 24px; font-family: Inter, sans-serif;">未找到对应画集。</main>';
    return;
  }

  const pageUrl = `${site.url}${collection.page}`;
  const imageUrl = `${site.url}${collection.coverImage}`;
  const worksCount = collection.images.length;

  document.title = `${collection.name} | ${site.name}`;

  setMeta('name', 'description', collection.description);
  setMeta('name', 'keywords', `速写, ${collection.name}, 画册, 王安, 无形艺趣`);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:title', `${collection.name} | ${site.name}`);
  setMeta('property', 'og:description', collection.shareDescription);
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'twitter:card', 'summary_large_image');
  setMeta('property', 'twitter:title', `${collection.name} | ${site.name}`);
  setMeta('property', 'twitter:description', collection.shareDescription);
  setMeta('property', 'twitter:image', imageUrl);

  setSchema({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.schemaDescription,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: site.url
    },
    creator: {
      '@type': 'Person',
      name: site.author
    }
  });

  document.body.innerHTML = `
    <header id="header">
      <div class="header-inner">
        <a href="index.html" class="logo">${site.name}</a>
        <nav>
          <a href="index.html">画册</a>
          <a href="about.html">关于</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="collection-header">
        <a href="index.html" class="back-link">← 返回画册</a>
        <h1>${collection.name}</h1>
        <p>${collection.year} · ${worksCount} 幅作品</p>
      </section>

      <section class="gallery" id="gallery">
        ${collection.images.map((image, index) => `
          <div class="gallery-item" data-index="${index}" style="animation-delay: ${Math.min(index * 0.04, 0.48).toFixed(2)}s">
            <img src="${image}" alt="作品 ${String(index + 1).padStart(2, '0')}" loading="lazy">
            <div class="gallery-item-overlay">
              <span class="gallery-item-number">${String(index + 1).padStart(2, '0')}</span>
            </div>
          </div>
        `).join('')}
      </section>
    </main>

    <footer>
      <div class="footer-left">© 2026 Wang An</div>
      <div class="footer-right">
        <a href="mailto:wangan@shuce.top">Email</a>
        <a href="https://instagram.com/waanng" target="_blank" rel="noreferrer">Instagram</a>
        <a href="#" id="wechat-link" title="微信: waanng">WeChat</a>
      </div>
    </footer>

    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" type="button" aria-label="关闭">&times;</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="上一张">&#8249;</button>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="下一张">&#8250;</button>
      <div class="lightbox-content">
        <img src="" alt="" id="lightbox-img">
      </div>
    </div>
  `;

  const header = document.getElementById('header');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentImageIndex = 0;

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  function updateLightbox() {
    lightboxImg.src = galleryItems[currentImageIndex].src;
    lightboxImg.alt = galleryItems[currentImageIndex].alt;
  }

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = galleryItems.length - 1;
    if (currentImageIndex >= galleryItems.length) currentImageIndex = 0;
    updateLightbox();
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader();

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => openLightbox(Number(item.dataset.index)));
  });

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => changeImage(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => changeImage(1));
  document.getElementById('wechat-link').addEventListener('click', (event) => {
    event.preventDefault();
    window.alert('微信: waanng');
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') changeImage(-1);
    if (event.key === 'ArrowRight') changeImage(1);
  });

  function setMeta(attrName, attrValue, content) {
    let meta = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attrName, attrValue);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function setSchema(schema) {
    let script = document.head.querySelector('#collection-schema');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'collection-schema';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }
})();
