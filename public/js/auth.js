// Universal Authentication & Account Manager
const Auth = {
  user: null,
  token: null,

  init() {
    this.loadSession();
    this.injectAuthModal();
    this.renderNavUser();
    this.checkSession();
  },

  loadSession() {
    try {
      this.token = localStorage.getItem('nova_auth_token');
      const savedUser = localStorage.getItem('nova_user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
      this.token = null;
      this.user = null;
    }
  },

  saveSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('nova_auth_token', token);
    localStorage.setItem('nova_user', JSON.stringify(user));
    this.renderNavUser();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  },

  clearSession() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('nova_auth_token');
    localStorage.removeItem('nova_user');
    this.renderNavUser();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));
    Toast.info('You have logged out.');
  },

  isLoggedIn() {
    return !!(this.token && this.user);
  },

  async checkSession() {
    if (!this.token) return;
    try {
      const data = await API.getMe();
      if (data.success && data.user) {
        this.user = data.user;
        localStorage.setItem('nova_user', JSON.stringify(data.user));
        this.renderNavUser();
      } else {
        this.clearSession();
      }
    } catch {
      // Offline / network fallback: keep local cache
    }
  },

  async login(email, password) {
    const res = await API.login({ email, password });
    if (res.success && res.token) {
      this.saveSession(res.token, res.user);
      Toast.success(res.message || 'Logged in successfully!');
      this.closeModal();
      return true;
    } else {
      Toast.error(res.error || 'Login failed');
      return false;
    }
  },

  async register(name, email, phone, password) {
    const res = await API.register({ name, email, phone, password });
    if (res.success && res.token) {
      this.saveSession(res.token, res.user);
      Toast.success(res.message || 'Registration successful!');
      this.closeModal();
      return true;
    } else {
      Toast.error(res.error || 'Registration failed');
      return false;
    }
  },

  renderNavUser() {
    const containers = document.querySelectorAll('.nav-auth-container');
    containers.forEach(container => {
      if (this.isLoggedIn()) {
        const firstName = this.user.name.split(' ')[0];
        container.innerHTML = `
          <div class="user-profile-menu-wrap" style="position: relative;">
            <button class="nav-user-btn" id="nav-user-menu-btn" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 0.45rem 0.95rem; border-radius: var(--radius-full); font-size: 0.88rem; font-weight: 700; color: var(--text-main); cursor: pointer;">
              <div style="width: 26px; height: 26px; border-radius: var(--radius-full); background: var(--primary); color: #fff; display: grid; place-items: center; font-size: 0.78rem;">
                ${firstName.charAt(0).toUpperCase()}
              </div>
              <span>Hi, ${firstName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            <div id="nav-user-dropdown" class="user-dropdown-card" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; width: 230px; background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 250; padding: 0.75rem 0;">
              <div style="padding: 0.75rem 1.15rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-weight: 800; color: var(--text-main); font-size: 0.92rem;">${this.user.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${this.user.email}</div>
              </div>
              <a href="/orders.html" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.75rem 1.15rem; color: var(--text-main); font-size: 0.88rem; font-weight: 600; transition: background 0.2s;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                My Orders & Invoices
              </a>
              <button onclick="Auth.clearSession()" style="width: 100%; display: flex; align-items: center; gap: 0.65rem; padding: 0.75rem 1.15rem; color: var(--accent-rose); font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; border-top: 1px solid var(--border-light);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>
        `;

        const menuBtn = container.querySelector('#nav-user-menu-btn');
        const dropdown = container.querySelector('#nav-user-dropdown');
        if (menuBtn && dropdown) {
          menuBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          };
          document.addEventListener('click', () => { dropdown.style.display = 'none'; });
        }
      } else {
        container.innerHTML = `
          <button onclick="Auth.openModal()" class="btn-primary" style="padding: 0.5rem 1.15rem; font-size: 0.88rem; font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Sign In / Register
          </button>
        `;
      }
    });
  },

  openModal(tab = 'login') {
    const overlay = document.getElementById('auth-modal-overlay');
    if (!overlay) return;
    this.switchModalTab(tab);
    overlay.classList.add('active');
  },

  closeModal() {
    const overlay = document.getElementById('auth-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  switchModalTab(tab) {
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const tabLogin = document.getElementById('tab-btn-login');
    const tabReg = document.getElementById('tab-btn-register');

    if (tab === 'login') {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      tabLogin.classList.add('active');
      tabReg.classList.remove('active');
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      tabReg.classList.add('active');
      tabLogin.classList.remove('active');
    }
  },

  injectAuthModal() {
    if (document.getElementById('auth-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'cart-drawer-overlay';
    overlay.innerHTML = `
      <div style="background: #ffffff; border-radius: var(--radius-xl); width: 92%; max-width: 440px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2.25rem 2rem; box-shadow: var(--shadow-lg); z-index: 260;">
        <button id="auth-modal-close" style="position: absolute; top: 1.25rem; right: 1.25rem; width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--bg-subtle); display: grid; place-items: center; color: var(--text-main); font-weight: 700; cursor: pointer;">✕</button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div class="brand-logo" style="justify-content: center; margin-bottom: 0.5rem;">
            <div class="logo-icon" style="width: 32px; height: 32px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <span>NOVA<span>LUXE</span> 🇮🇳</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Your Verified Indian Tech & Lifestyle Account</p>
        </div>

        <!-- Tabs Switcher -->
        <div style="display: flex; gap: 0.5rem; background: var(--bg-subtle); padding: 0.35rem; border-radius: var(--radius-full); margin-bottom: 1.5rem;">
          <button id="tab-btn-login" class="cat-pill active" style="flex: 1; text-align: center; padding: 0.45rem; font-weight: 700;" onclick="Auth.switchModalTab('login')">Sign In</button>
          <button id="tab-btn-register" class="cat-pill" style="flex: 1; text-align: center; padding: 0.45rem; font-weight: 700;" onclick="Auth.switchModalTab('register')">Create Account</button>
        </div>

        <!-- 1-Click Demo Login Box -->
        <div style="margin-bottom: 1.5rem; background: var(--primary-light); border: 1px dashed var(--primary); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 0.35rem;">⚡ Instant Demo Account (For Interviewer)</div>
          <button type="button" id="btn-quick-demo-login" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.82rem; width: 100%; justify-content: center;">
            Log In as Rahul Sharma (demo@novaluxe.in)
          </button>
        </div>

        <!-- Login Form -->
        <form id="auth-login-form">
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" id="login-email" class="form-input" placeholder="e.g. rahul@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password *</label>
            <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
          </div>
          <button type="submit" id="btn-submit-login" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 800; margin-top: 1rem;">
            Sign In to Account
          </button>
        </form>

        <!-- Register Form -->
        <form id="auth-register-form" style="display: none;">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="reg-name" class="form-input" placeholder="e.g. Priya Patel" required>
          </div>
          <div class="form-row" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" id="reg-email" class="form-input" placeholder="priya@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" id="reg-phone" class="form-input" placeholder="9876543210" maxlength="10">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Create Password (Min 6 chars) *</label>
            <input type="password" id="reg-password" class="form-input" placeholder="••••••••" minlength="6" required>
          </div>
          <button type="submit" id="btn-submit-register" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 800; margin-top: 1rem; background: linear-gradient(135deg, #059669, #047857);">
            Register & Create Account
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });

    document.getElementById('auth-modal-close').addEventListener('click', () => {
      this.closeModal();
    });

    // 1-Click Demo Login
    document.getElementById('btn-quick-demo-login').addEventListener('click', async () => {
      document.getElementById('login-email').value = 'demo@novaluxe.in';
      document.getElementById('login-password').value = 'password123';
      await this.login('demo@novaluxe.in', 'password123');
    });

    // Submit Login
    document.getElementById('auth-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      const btn = document.getElementById('btn-submit-login');
      btn.disabled = true;
      btn.textContent = 'Authenticating...';
      try {
        await this.login(email, pass);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In to Account';
      }
    });

    // Submit Register
    document.getElementById('auth-register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const pass = document.getElementById('reg-password').value;
      const btn = document.getElementById('btn-submit-register');
      btn.disabled = true;
      btn.textContent = 'Creating Account...';
      try {
        await this.register(name, email, phone, pass);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Register & Create Account';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
