// ═══════════════════════════════════════════════════════
//  app.js — Core application logic for NoteVault
// ═══════════════════════════════════════════════════════

// ─── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  restoreSession();
  updateAuthUI();
  populateDeptsDropdowns();
  
  populateSubjectDropdown();
  renderDeptGrid();
  renderFeaturedNotes();
  renderBrowseNotes();
  updateStats();
  
});

// ─── PAGE ROUTING ─────────────────────────────────────
function showPage(pageId) {
  // Auth guards
  const authPages  = ['dashboard', 'upload', 'my-notes', 'favorites', 'profile'];
  const adminPages = ['admin'];
  if (authPages.includes(pageId)  && !requireAuth())  return;
  if (adminPages.includes(pageId) && !requireAdmin())  return;

  

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Highlight nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');

  // Per-page render hooks
  const renders = {
    home:        () => { renderFeaturedNotes(); renderDeptGrid(); updateStats(); },
    browse:      () => renderBrowseNotes(),
    dashboard:   renderDashboard,
    'my-notes':  renderMyNotes,
    favorites:   renderFavorites,
    profile:     renderProfile,
    admin:       () => { if (requireAdmin()) renderAdminPanel('pending'); },
    upload:      populateUploadDepts,
  };
  if (renders[pageId]) renders[pageId]();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeAvatarMenu();
}


// ─── DROPDOWN POPULATION ──────────────────────────────
function populateDeptsDropdowns() {
  const selectors = ['#filterDept', '#upDept', '#regDept'];
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const hasAll = sel !== '#regDept' && sel !== '#upDept';
    if (hasAll && !el.querySelector('option[value=""]')) return; // already has placeholder
    DEPARTMENTS.forEach(d => {
      if (!el.querySelector(`option[value="${d.id}"]`)) {
        const o = document.createElement('option');
        o.value = d.id; o.textContent = d.name;
        el.appendChild(o);
      }
    });
  });
}

function populateUploadDepts() {
  const el = document.getElementById('upDept');
  if (!el) return;
  el.innerHTML = '<option value="">Select Department</option>';
  DEPARTMENTS.forEach(d => {
    const o = document.createElement('option');
    o.value = d.id; o.textContent = d.name;
    el.appendChild(o);
  });
}




function populateSubjectDropdown() {
  const el = document.getElementById('filterSubject');
  if (!el) return;
  const allSubjects = [...new Set(Object.values(SUBJECTS_BY_DEPT).flat())].sort();
  allSubjects.forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    el.appendChild(o);
  });
}

// ─── HOME PAGE ────────────────────────────────────────
function updateStats() {
  const approved = NOTES.filter(n => n.status === 'approved');
  document.getElementById('statNotes').textContent = approved.length.toLocaleString();
  document.getElementById('statUsers').textContent = USERS.length.toLocaleString();
  document.getElementById('statDepts').textContent = DEPARTMENTS.length;
}

function renderFeaturedNotes() {
  const container = document.getElementById('featuredNotes');
  if (!container) return;
  const top = NOTES.filter(n => n.status === 'approved')
                   .sort((a, b) => b.downloads - a.downloads)
                   .slice(0, 6);
  container.innerHTML = top.length ? top.map(noteCard).join('') : emptyState('No notes yet.', 'Be the first to upload!');
} 


function renderDeptGrid() {
  const container = document.getElementById('deptGrid');
  if (!container) return;
  container.innerHTML = DEPARTMENTS.map(d => {
    const count = NOTES.filter(n => n.dept === d.id && n.status === 'approved').length;
    return `<div class="dept-card" onclick="filterByDept('${d.id}')">
      <div class="dept-icon">${d.icon}</div>
      <div class="dept-name">${d.name}</div>
      <div class="dept-count">${count} note${count !== 1 ? 's' : ''}</div>
    </div>`;
  }).join('');
}

function filterByDept(deptId) {
  document.getElementById('filterDept').value = deptId;
  showPage('browse');
  applyFilters();
}

// ─── BROWSE ───────────────────────────────────────────
function applyFilters() {
  const dept    = document.getElementById('filterDept').value;
  const sem     = document.getElementById('filterSem').value;
  const subject = document.getElementById('filterSubject').value;
  const topic   = document.getElementById('filterTopic').value.toLowerCase().trim();
  const sort    = document.getElementById('filterSort').value;

  let results = NOTES.filter(n => n.status === 'approved');
  if (dept)    results = results.filter(n => n.dept === dept);
  if (sem)     results = results.filter(n => n.semester === sem);
  if (subject) results = results.filter(n => n.subject === subject);
  if (topic)   results = results.filter(n =>
    n.title.toLowerCase().includes(topic) ||
    n.topic.toLowerCase().includes(topic) ||
    n.tags.some(t => t.toLowerCase().includes(topic))
  );

  if (sort === 'popular') results.sort((a, b) => b.downloads - a.downloads);
  else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else results.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  document.getElementById('resultsCount').textContent = `${results.length} note${results.length !== 1 ? 's' : ''} found`;
  const container = document.getElementById('browseNotes');
  container.innerHTML = results.length
    ? results.map(noteCard).join('')
    : emptyState('No notes match your filters.', 'Try adjusting or clearing the filters.');
}

function renderBrowseNotes() { applyFilters(); }

function clearFilters() {
  ['filterDept','filterSem','filterSubject','filterSort'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('filterTopic').value = '';
  applyFilters();
}

// ─── GLOBAL SEARCH ────────────────────────────────────
function handleGlobalSearch(query) {
  if (!query.trim()) return;
  const q = query.toLowerCase();
  const results = NOTES.filter(n =>
    n.status === 'approved' && (
      n.title.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q)) ||
      n.topic.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q)
    )
  );

  // Switch to browse page and show results
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-browse').classList.add('active');
  document.getElementById('resultsCount').textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
  const container = document.getElementById('browseNotes');
  container.innerHTML = results.length
    ? results.map(noteCard).join('')
    : emptyState('No results found.', `Try different search terms for "${query}"`);
}

// ─── NOTE CARD ────────────────────────────────────────
function noteCard(note) {
  const dept = DEPARTMENTS.find(d => d.id === note.dept) || { name: note.dept, icon: '📄' };
  const stars = renderStars(note.rating);
  const isFav = currentUser && currentUser.favorites.includes(note.id);
  return `
  <div class="note-card" onclick="openNoteDetail('${note.id}')">
    <div class="note-card-dept">${dept.icon} ${dept.name} · Sem ${note.semester}</div>
    <div class="note-card-title">${escHtml(note.title)}</div>
    <div class="note-card-meta">📚 ${escHtml(note.subject)} · ${note.topic ? escHtml(note.topic) : ''}</div>
    <div class="note-card-tags">${note.tags.slice(0,3).map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>
    <div class="note-card-footer">
      <div class="note-actions">
        <span class="note-stat">⬇ ${note.downloads}</span>
        <span class="note-stat">⭐ ${note.rating.toFixed(1)}</span>
        <span class="note-stat">💬 ${note.comments.length}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${note.status !== 'approved' ? `<span class="status-badge status-${note.status}">${note.status}</span>` : ''}
        <span class="note-stat" style="color:${isFav ? '#f87171' : ''}">${isFav ? '❤️' : '🤍'}</span>
      </div>
    </div>
  </div>`;
}

// ─── NOTE DETAIL ──────────────────────────────────────
function openNoteDetail(noteId) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return;
  const dept = DEPARTMENTS.find(d => d.id === note.dept) || { name: note.dept, icon: '📄' };
  const isFav = currentUser && currentUser.favorites.includes(noteId);

  document.getElementById('modalBody').innerHTML = buildNoteDetailHTML(note, dept, isFav);
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function buildNoteDetailHTML(note, dept, isFav) {
  const commentsHTML = note.comments.map(c => buildCommentHTML(c)).join('') ||
    '<p style="color:var(--muted);font-size:14px;">No comments yet. Be the first!</p>';

  return `
  <div class="note-detail-header">
    <div class="note-card-dept">${dept.icon} ${dept.name}</div>
    <div class="note-detail-title">${escHtml(note.title)}</div>
    <div class="note-detail-meta">
      <span>📚 ${escHtml(note.subject)}</span>
      <span>🗓 Sem ${note.semester}</span>
      <span>📝 ${escHtml(note.topic)}</span>
      <span>👤 ${escHtml(note.uploaderName)}</span>
      <span>📅 ${formatDate(note.uploadDate)}</span>
      <span>📄 ${note.fileType} · ${note.fileSize}</span>
    </div>
    <div class="note-card-tags">${note.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>
  </div>

  <div class="note-detail-desc">${escHtml(note.description)}</div>

  <div class="note-detail-actions">
    <button class="btn btn-primary btn-lg" onclick="downloadNote('${note.id}')">⬇ Download (${note.fileType}) · ${note.fileSize}</button>
    <button class="btn btn-outline" id="favBtn-${note.id}" onclick="toggleFavorite('${note.id}')">${isFav ? '❤️ Saved' : '🤍 Save'}</button>
    <button class="btn btn-ghost">⬇ ${note.downloads} downloads</button>
  </div>

  <!-- Rating -->
  ${currentUser ? `
  <div style="margin-bottom:28px;">
    <p style="font-size:14px;color:var(--muted);margin-bottom:10px;">Rate this note:</p>
    <div class="star-rating" id="starRating-${note.id}">
      ${[1,2,3,4,5].map(i => `<span class="star ${i <= Math.round(note.rating) ? 'filled' : ''}"
        onmouseover="hoverStars(${i},'${note.id}')" onmouseout="unhoverStars('${note.id}',${Math.round(note.rating)})"
        onclick="submitRating('${note.id}',${i})">★</span>`).join('')}
    </div>
    <small style="color:var(--muted);">Average: ⭐ ${note.rating.toFixed(1)} (${note.ratingCount} ratings)</small>
  </div>
  ` : '<p style="font-size:13px;color:var(--muted);margin-bottom:28px;"><a href="#" onclick="closeModal();showPage(\'login\')">Log in</a> to rate this note.</p>'}

  <!-- Comments -->
  <div class="comments-section">
    <h3>Comments (${note.comments.length})</h3>
    ${currentUser ? `
    <div class="comment-form">
      <input type="text" id="commentInput-${note.id}" placeholder="Add a comment…" onkeydown="if(event.key==='Enter')submitComment('${note.id}')" />
      <button class="btn btn-primary" onclick="submitComment('${note.id}')">Post</button>
    </div>` : '<p style="font-size:13px;color:var(--muted);margin-bottom:20px;"><a href="#" onclick="closeModal();showPage(\'login\')">Log in</a> to comment.</p>'}
    <div id="commentsList-${note.id}">${commentsHTML}</div>
  </div>`;
}

function buildCommentHTML(c) {
  return `
  <div class="comment" id="comment-${c.id}">
    <div class="comment-header">
      <span class="comment-user">👤 ${escHtml(c.userName)}</span>
      <span class="comment-date">${formatDate(c.date)}</span>
    </div>
    <div class="comment-text">${escHtml(c.text)}</div>
    <div class="comment-actions">
      <button class="like-btn ${c.liked ? 'liked' : ''}" onclick="likeComment('${c.id}',event)">
        ${c.liked ? '❤️' : '🤍'} <span id="likes-${c.id}">${c.likes}</span>
      </button>
      ${currentUser && (currentUser.role === 'admin' || currentUser.id === c.userId)
        ? `<button class="btn btn-ghost btn-sm" onclick="deleteComment('${c.id}',event)">🗑 Delete</button>` : ''}
    </div>
  </div>`;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

// ─── DOWNLOAD ─────────────────────────────────────────
function downloadNote(noteId) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return;
  note.downloads++;
  if (currentUser) currentUser.downloads++;
  showToast(`⬇ Downloading "${note.title}"… (demo: file download simulated)`);
  // In a real app: window.open(note.fileUrl)
  // Update download count in UI
  document.querySelectorAll('.note-stat').forEach(el => {
    if (el.closest('.note-card') && el.closest('.note-card').onclick?.toString().includes(noteId)) {
      if (el.textContent.startsWith('⬇')) el.textContent = `⬇ ${note.downloads}`;
    }
  });
}

// ─── FAVORITES ────────────────────────────────────────
function toggleFavorite(noteId) {
  if (!requireAuth()) return;
  const idx = currentUser.favorites.indexOf(noteId);
  if (idx === -1) {
    currentUser.favorites.push(noteId);
    showToast('❤️ Added to favorites');
  } else {
    currentUser.favorites.splice(idx, 1);
    showToast('🤍 Removed from favorites');
  }
  // Update button if in modal
  const btn = document.getElementById(`favBtn-${noteId}`);
  if (btn) {
    const isFav = currentUser.favorites.includes(noteId);
    btn.textContent = isFav ? '❤️ Saved' : '🤍 Save';
  }
  // Sync to USERS array
  const u = USERS.find(u => u.id === currentUser.id);
  if (u) u.favorites = currentUser.favorites;
  try { sessionStorage.setItem('nv_user', JSON.stringify(currentUser)); } catch(_) {}
}

// ─── RATING ───────────────────────────────────────────
function hoverStars(n, noteId) {
  document.querySelectorAll(`#starRating-${noteId} .star`).forEach((s, i) =>
    s.classList.toggle('hovered', i < n));
}
function unhoverStars(noteId, current) {
  document.querySelectorAll(`#starRating-${noteId} .star`).forEach((s, i) => {
    s.classList.remove('hovered');
    s.classList.toggle('filled', i < Math.round(current));
  });
}
function submitRating(noteId, stars) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return;
  const total = note.rating * note.ratingCount + stars;
  note.ratingCount++;
  note.rating = parseFloat((total / note.ratingCount).toFixed(1));
  document.querySelectorAll(`#starRating-${noteId} .star`).forEach((s, i) =>
    s.classList.toggle('filled', i < stars));
  showToast(`⭐ You rated this ${stars}/5`);
}

// ─── COMMENTS ─────────────────────────────────────────
function submitComment(noteId) {
  if (!requireAuth()) return;
  const input = document.getElementById(`commentInput-${noteId}`);
  const text  = input.value.trim();
  if (!text) return;

  const note = NOTES.find(n => n.id === noteId);
  const comment = {
    id: 'c' + Date.now(), userId: currentUser.id,
    userName: currentUser.firstName + ' ' + currentUser.lastName[0] + '.',
    text, date: new Date().toISOString().split('T')[0], likes: 0, liked: false
  };
  note.comments.push(comment);
  input.value = '';

  const list = document.getElementById(`commentsList-${noteId}`);
  list.innerHTML += buildCommentHTML(comment);

  // Update count in heading
  const heading = list.closest('.comments-section').querySelector('h3');
  if (heading) heading.textContent = `Comments (${note.comments.length})`;
  showToast('💬 Comment posted!');
}

function likeComment(commentId, e) {
  e.stopPropagation();
  if (!requireAuth()) return;
  // Find comment in any note
  let comment = null;
  for (const note of NOTES) {
    comment = note.comments.find(c => c.id === commentId);
    if (comment) break;
  }
  if (!comment) return;
  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;
  const btn = e.currentTarget;
  btn.classList.toggle('liked', comment.liked);
  btn.innerHTML = `${comment.liked ? '❤️' : '🤍'} <span id="likes-${commentId}">${comment.likes}</span>`;
}

function deleteComment(commentId, e) {
  e.stopPropagation();
  for (const note of NOTES) {
    const idx = note.comments.findIndex(c => c.id === commentId);
    if (idx !== -1) { note.comments.splice(idx, 1); break; }
  }
  document.getElementById(`comment-${commentId}`)?.remove();
  showToast('🗑 Comment deleted.');
}

// ─── DASHBOARD ────────────────────────────────────────
function renderDashboard() {
  if (!currentUser) return;
  document.getElementById('dashGreeting').textContent = `Welcome back, ${currentUser.firstName}! Here's your activity.`;

  const myNotes  = NOTES.filter(n => n.uploadedBy === currentUser.id);
  const myFavs   = NOTES.filter(n => currentUser.favorites.includes(n.id));
  const totalDL  = myNotes.reduce((s, n) => s + n.downloads, 0);

  document.getElementById('dashStats').innerHTML = `
    <div class="dash-stat-card"><div class="dash-stat-num">${myNotes.length}</div><div class="dash-stat-label">Notes Uploaded</div></div>
    <div class="dash-stat-card"><div class="dash-stat-num">${totalDL}</div><div class="dash-stat-label">Total Downloads</div></div>
    <div class="dash-stat-card"><div class="dash-stat-num">${myFavs.length}</div><div class="dash-stat-label">Saved Favorites</div></div>
    <div class="dash-stat-card"><div class="dash-stat-num">${currentUser.downloads || 0}</div><div class="dash-stat-label">Notes Downloaded</div></div>
  `;

  const recent = myNotes.slice(-4).reverse();
  document.getElementById('myRecentNotes').innerHTML = recent.length
    ? recent.map(noteCard).join('')
    : emptyState('📭', 'No uploads yet.', 'Upload your first note!', "showPage('upload')");

  document.getElementById('myFavNotes').innerHTML = myFavs.length
    ? myFavs.slice(0, 4).map(noteCard).join('')
    : `<div class="empty-state"><div class="empty-icon">🤍</div><h3>No favorites yet</h3><p>Browse notes and save the ones you like!</p></div>`;
}

// ─── MY NOTES ─────────────────────────────────────────
function renderMyNotes() {
  if (!currentUser) return;
  const myNotes = NOTES.filter(n => n.uploadedBy === currentUser.id);
  document.getElementById('myAllNotes').innerHTML = myNotes.length
    ? myNotes.map(noteCard).join('')
    : emptyState('📭', "You haven't uploaded any notes yet.", '', "showPage('upload')");
}

// ─── FAVORITES ────────────────────────────────────────
function renderFavorites() {
  if (!currentUser) return;
  const favs = NOTES.filter(n => currentUser.favorites.includes(n.id));
  document.getElementById('favNotes').innerHTML = favs.length
    ? favs.map(noteCard).join('')
    : `<div class="empty-state"><div class="empty-icon">🤍</div><h3>No favorites saved</h3><p>Browse notes and save the ones you like.</p><button class="btn btn-primary" onclick="showPage('browse')">Browse Notes</button></div>`;
}

// ─── PROFILE ──────────────────────────────────────────
function renderProfile() {
  if (!currentUser) return;
  const myNotes = NOTES.filter(n => n.uploadedBy === currentUser.id);
  const dept    = DEPARTMENTS.find(d => d.id === currentUser.dept);

  document.getElementById('profileContent').innerHTML = `
  <div class="profile-header">
    <div class="profile-avatar">${currentUser.firstName[0]}</div>
    <div class="profile-info">
      <h2>${currentUser.firstName} ${currentUser.lastName}</h2>
      <p>📧 ${currentUser.email} · 🏛 ${dept ? dept.name : currentUser.dept} · 📅 Joined ${formatDate(currentUser.joined)}</p>
    </div>
  </div>
  <div class="dashboard-stats" style="padding:0 0 40px;">
    <div class="dash-stat-card"><div class="dash-stat-num">${myNotes.length}</div><div class="dash-stat-label">Notes Uploaded</div></div>
    <div class="dash-stat-card"><div class="dash-stat-num">${myNotes.reduce((s,n)=>s+n.downloads,0)}</div><div class="dash-stat-label">Total Downloads</div></div>
    <div class="dash-stat-card"><div class="dash-stat-num">${currentUser.favorites.length}</div><div class="dash-stat-label">Favorites</div></div>
  </div>
  <div class="section" style="padding:0;">
    <div class="section-header"><h2>Uploaded Notes</h2></div>
    <div class="notes-grid">${myNotes.length ? myNotes.map(noteCard).join('') : '<p style="color:var(--muted)">No uploads yet.</p>'}</div>
  </div>`;
}

// ─── UPLOAD ───────────────────────────────────────────
let selectedFile = null;

function handleFileDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) previewFile(file);
}
function handleFileSelect(input) {
  if (input.files[0]) previewFile(input.files[0]);
}
function previewFile(file) {
  selectedFile = file;
  const preview = document.getElementById('filePreview');
  const icons   = { 'application/pdf': '📄', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝', default: '📎' };
  const icon    = icons[file.type] || icons.default;
  const size    = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  preview.innerHTML = `${icon} <strong>${escHtml(file.name)}</strong> · ${size}`;
  preview.classList.remove('hidden');
  document.getElementById('fileDrop').style.borderColor = 'var(--indigo)';
}

function submitUpload(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  if (!selectedFile) { showToast('⚠️ Please attach a file.', 'error'); return; }

  const title   = document.getElementById('upTitle').value.trim();
  const subject = document.getElementById('upSubject').value.trim();
  const dept    = document.getElementById('upDept').value;
  const sem     = document.getElementById('upSem').value;
  const topic   = document.getElementById('upTopic').value.trim();
  const desc    = document.getElementById('upDesc').value.trim();
  const tags    = document.getElementById('upTags').value.split(',').map(t => t.trim()).filter(Boolean);
  const ext     = selectedFile.name.split('.').pop().toUpperCase();
  const size    = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

  const newNote = {
    id: 'n' + Date.now(), title, subject, dept, semester: sem, topic, description: desc,
    tags, uploadedBy: currentUser.id, uploaderName: `${currentUser.firstName} ${currentUser.lastName}`,
    uploadDate: new Date().toISOString().split('T')[0],
    downloads: 0, likes: 0, rating: 0, ratingCount: 0,
    status: currentUser.role === 'admin' ? 'approved' : 'pending',
    fileType: ext, fileSize: size, fileName: selectedFile.name, comments: []
  };

  NOTES.push(newNote);
  currentUser.uploads++;
  const u = USERS.find(u => u.id === currentUser.id);
  if (u) u.uploads++;
  selectedFile = null;
  document.getElementById('filePreview').classList.add('hidden');
  e.target.reset();

  showToast(`✅ Note submitted! ${currentUser.role === 'admin' ? 'Published immediately.' : 'Pending admin review.'}`);
  showPage('my-notes');
}

// ─── ADMIN PANEL ──────────────────────────────────────
let currentAdminTab = 'pending';

function switchAdminTab(tab, btn) {
  currentAdminTab = tab;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderAdminPanel(tab);
}

function renderAdminPanel(tab) {
  if (!requireAdmin()) return;
  const pending = NOTES.filter(n => n.status === 'pending');
  document.getElementById('pendingCount').textContent = pending.length;

  const container = document.getElementById('adminContent');
  if (tab === 'pending') {
    container.innerHTML = pending.length
      ? pending.map(adminNoteRow).join('')
      : `<div class="empty-state"><div class="empty-icon">✅</div><h3>All caught up!</h3><p>No notes pending review.</p></div>`;
  } else if (tab === 'approved') {
    const approved = NOTES.filter(n => n.status === 'approved');
    container.innerHTML = approved.length
      ? approved.map(adminNoteRow).join('')
      : `<div class="empty-state"><div class="empty-icon">📭</div><h3>No approved notes.</h3></div>`;
  } else if (tab === 'users') {
    container.innerHTML = `
    <table class="admin-users-table">
      <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Uploads</th><th>Joined</th></tr></thead>
      <tbody>${USERS.map(u => {
        const dept = DEPARTMENTS.find(d => d.id === u.dept);
        return `<tr>
          <td>${escHtml(u.firstName)} ${escHtml(u.lastName)}</td>
          <td style="color:var(--muted)">${escHtml(u.email)}</td>
          <td>${dept ? dept.name : u.dept}</td>
          <td><span class="status-badge ${u.role === 'admin' ? 'status-approved' : 'status-pending'}">${u.role}</span></td>
          <td>${u.uploads}</td>
          <td>${formatDate(u.joined)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  }
}

function adminNoteRow(note) {
  const dept = DEPARTMENTS.find(d => d.id === note.dept);
  return `
  <div class="admin-note-row">
    <div class="admin-note-info">
      <h4>${escHtml(note.title)}</h4>
      <p>📚 ${escHtml(note.subject)} · ${dept ? dept.name : note.dept} · Sem ${note.semester} · By ${escHtml(note.uploaderName)} · ${formatDate(note.uploadDate)}</p>
      <span class="status-badge status-${note.status}">${note.status}</span>
    </div>
    <div class="admin-note-actions">
      ${note.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="adminAction('${note.id}','approved')">✅ Approve</button>` : ''}
      ${note.status === 'approved' ? `<button class="btn btn-outline btn-sm" onclick="adminAction('${note.id}','pending')">⏸ Unpublish</button>` : ''}
      <button class="btn btn-ghost btn-sm" onclick="openNoteDetail('${note.id}')">👁 View</button>
      <button class="btn btn-danger btn-sm" onclick="adminDelete('${note.id}')">🗑 Delete</button>
    </div>
  </div>`;
}

function adminAction(noteId, action) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return;
  note.status = action;
  showToast(`✅ Note ${action === 'approved' ? 'approved and published' : 'unpublished'}.`);
  renderAdminPanel(currentAdminTab);
  updateStats();
}

function adminDelete(noteId) {
  if (!confirm('Delete this note permanently?')) return;
  const idx = NOTES.findIndex(n => n.id === noteId);
  if (idx !== -1) NOTES.splice(idx, 1);
  showToast('🗑 Note deleted.');
  renderAdminPanel(currentAdminTab);
  updateStats();
}

// ─── NAV HELPERS ──────────────────────────────────────
function toggleAvatarMenu() {
  document.getElementById('avatarDropdown').classList.toggle('hidden');
}
function closeAvatarMenu() {
  document.getElementById('avatarDropdown')?.classList.add('hidden');
}
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.avatar-menu')) closeAvatarMenu();
});

// ─── TOAST ────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.style.borderLeftColor = type === 'error' ? 'var(--red)' : 'var(--indigo)';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ─── UTILITIES ────────────────────────────────────────
function escHtml(str = '') {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function renderStars(rating) {
  return [1,2,3,4,5].map(i => `<span style="color:${i<=Math.round(rating)?'#fbbf24':'#374151'}">★</span>`).join('');
}
function emptyState(icon, title, msg = '', action = '') {
  return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-icon">${icon}</div>
    <h3>${title}</h3>
    ${msg ? `<p>${msg}</p>` : ''}
    ${action ? `<button class="btn btn-primary" onclick="${action}">Browse Notes</button>` : ''}
  </div>`;
  
}
            
