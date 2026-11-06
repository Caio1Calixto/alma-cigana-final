const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
});

const { categorias, produtos } = window.ALMA_CATALOGO;
const categories = document.querySelector('#category-list');
const filters = document.querySelector('#filters');
const list = document.querySelector('#product-list');
const status = document.querySelector('#catalog-status');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected = '';
function renderCategories() {
  if (!categorias.length) {
    categories.innerHTML = [1,2,3,4].map(n => `<div class="category-card pending"><span class="category-icon">✧</span><h3>Categoria 0${n}</h3><p>Nome a definir pela loja</p></div>`).join('');
    return;
  }
  categories.innerHTML = categorias.map(c => `<button class="category-card" data-category="${escapeHTML(c.id)}"><span class="category-icon">✧</span><h3>${escapeHTML(c.nome)}</h3><p>Explorar peças ↗</p></button>`).join('');
}
function renderProducts() {
  filters.innerHTML = categorias.length ? `<button class="filter ${selected === '' ? 'active' : ''}" aria-pressed="${selected === ''}" data-filter="">Todos</button>` + categorias.map(c => `<button class="filter ${selected === c.id ? 'active' : ''}" aria-pressed="${selected === c.id}" data-filter="${escapeHTML(c.id)}">${escapeHTML(c.nome)}</button>`).join('') : '';
  const available = produtos.slice(0, 15).filter(p => !selected || p.categoriaId === selected);
  if (!produtos.length) {
    list.innerHTML = [1,2,3,4].map(n => `<article class="product-card"><div class="product-image placeholder-logo"><img src="assets/logo-alma-cigana.jpg" alt="Logotipo Alma Cigana" loading="lazy"></div><p class="product-meta">Produto provisório</p><h3>[Nome do produto]</h3><p class="product-price">[Preço a informar]</p></article>`).join('');
    status.textContent = 'Vitrine ilustrativa. Fotos, produtos, preços e destaques aguardam envio e aprovação da loja.';
    return;
  }
  list.innerHTML = available.map(p => `<article class="product-card"><div class="product-image">${p.imagem ? `<img src="${escapeHTML(p.imagem)}" alt="${escapeHTML(p.nome)}" loading="lazy">` : '<div class="no-image placeholder-logo"><img src="assets/logo-alma-cigana.jpg" alt="Logotipo Alma Cigana — fotografia do produto pendente"></div>'}</div><p class="product-meta">${escapeHTML(categorias.find(c => c.id === p.categoriaId)?.nome || 'Categoria a definir')}</p><h3>${escapeHTML(p.nome)}</h3><p class="product-price">${escapeHTML(p.preco || 'Valor sob consulta')}</p>${p.descricao ? `<p>${escapeHTML(p.descricao)}</p>` : ''}${p.caracteristicas ? `<p>${escapeHTML(p.caracteristicas)}</p>` : ''}<a class="text-link" href="https://wa.me/5511997721481?text=${escapeHTML(encodeURIComponent(`Olá! Tenho interesse no produto ${p.nome}. Gostaria de saber mais sobre disponibilidade e valores.`))}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${escapeHTML(p.nome)} pelo WhatsApp">Consultar pelo WhatsApp ↗</a></article>`).join('');
  status.textContent = available.length ? (selected ? '' : 'A classificação dos produtos por categoria está em atualização.') : 'Nenhum produto associado a esta categoria por enquanto. A classificação está em atualização.';
}
categories.addEventListener('click', e => { const button = e.target.closest('[data-category]'); if (!button) return; selected = button.dataset.category; renderProducts(); document.querySelector('#catalogo').scrollIntoView(); });
filters.addEventListener('click', e => { const button = e.target.closest('[data-filter]'); if (!button) return; selected = button.dataset.filter; renderProducts(); });
renderCategories(); renderProducts();
