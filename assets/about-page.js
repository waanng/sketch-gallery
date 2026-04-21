(function () {
  const collections = window.SKETCH_COLLECTIONS || [];
  if (!collections.length) return;

  const worksCount = collections.reduce((sum, collection) => sum + collection.images.length, 0);
  const years = collections.map((collection) => collection.year);
  const span = Math.max(...years) - Math.min(...years) + 1;
  const latest = collections[collections.length - 1];

  const statsYears = document.getElementById('stat-years');
  const statsAlbums = document.getElementById('stat-albums');
  const statsWorks = document.getElementById('stat-works');
  const narrative = document.getElementById('collections-narrative');

  if (statsYears) statsYears.textContent = `${span}+`;
  if (statsAlbums) statsAlbums.textContent = String(collections.length);
  if (statsWorks) statsWorks.textContent = String(worksCount);
  if (narrative) {
    narrative.textContent = `多年来，坚持每天速写，将看到的风景、人物、建筑都记录在画册中。从「${collections[0].name}」到最新的「${latest.name}」，每一本画册都承载着那个时期的故事和心情。`;
  }
})();
