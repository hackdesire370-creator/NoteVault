// ═══════════════════════════════════════════════════════
//  auth.js — Authentication helpers for NoteVault
// ═══════════════════════════════════════════════════════

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const user = USERS.find(u => u.email.toLowerCase() === email && u.password === password);
  if (!user) {
    showToast('❌ Invalid email or password.', 'error');
    return;
  }
  loginUser(user);
}

function handleRegister(e) {
  e.preventDefault();
  const first  = document.getElementById('regFirst').value.trim();
  const last   = document.getElementById('regLast').value.trim();
  const email  = document.getElementById('regEmail').value.trim().toLowerCase();
  const dept   = document.getElementById('regDept').value;
  const pass   = document.getElementById('regPassword').value;
  const pass2  = document.getElementById('regPassword2').value;

  if (pass !== pass2) { showToast('❌ Passwords do not match.', 'error'); return; }
  if (USERS.find(u => u.email.toLowerCase() === email)) {
    showToast('❌ An account with this email already exists.', 'error'); return;
  }

  const newUser = {
    id: 'u' + Date.now(), firstName: first, lastName: last,
    email, password: pass, dept, role: 'student',
    joined: new Date().toISOString().split('T')[0],
    uploads: 0, downloads: 0, favorites: []
  };
  USERS.push(newUser);
  loginUser(newUser);
}

function loginUser(user) {
  currentUser = user;
  try { sessionStorage.setItem('nv_user', JSON.stringify(user)); } catch(_) {}
  updateAuthUI();
  showPage('dashboard');
  showToast(`👋 Welcome back, ${user.firstName}!`);
}

function logout() {
  currentUser = null;
  try { sessionStorage.removeItem('nv_user'); } catch(_) {}
  updateAuthUI();
  closeAvatarMenu();
  showPage('home');
  showToast('👋 Logged out successfully.');
}

function restoreSession() {
  try {
    const stored = sessionStorage.getItem('nv_user');
    if (stored) {
      const saved = JSON.parse(stored);
      // Re-lookup from USERS array (so live data is used)
      currentUser = USERS.find(u => u.id === saved.id) || saved;
    }
  } catch(_) {}
}

function updateAuthUI() {
  const loggedIn  = !!currentUser;
  const isAdmin   = loggedIn && currentUser.role === 'admin';

  document.querySelectorAll('.auth-required').forEach(el => el.classList.toggle('hidden', !loggedIn));
  document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !isAdmin));
  document.getElementById('guestActions').classList.toggle('hidden', loggedIn);
  document.getElementById('userActions').classList.toggle('hidden', !loggedIn);

  if (loggedIn) {
    document.getElementById('userAvatar').textContent = currentUser.firstName[0].toUpperCase();
    document.getElementById('userName').textContent   = currentUser.firstName;
  }
}

function demoLogin(role) {
  const demos = { student: 'priya@example.com', admin: 'admin@notevault.com' };
  const pass  = { student: 'student123',         admin: 'admin123' };
  const user  = USERS.find(u => u.email === demos[role]);
  if (user) {
    user.password = pass[role]; // ensure match
    loginUser(user);
  }
}

function requireAuth() {
  if (!currentUser) { showPage('login'); showToast('⚠️ Please log in first.'); return false; }
  return true;
}

function requireAdmin() {
  if (!currentUser || currentUser.role !== 'admin') {
    showPage('home'); showToast('⛔ Admin access required.');
    return false;
  }
  return true;
}
