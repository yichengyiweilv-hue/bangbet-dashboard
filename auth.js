(function () {
  "use strict";

  /**
   * BangBet Dashboard Auth (Front-end only)
   * - Admin: jerry / admin  | remember: 30d | default: 24h
   * - Users: Jessica/Randy/WeiHailey/Winning/Normal | pwd same as username | remember: 7d | default: 24h
   * - Hidden command: jerry666 / logout -> force logout (this browser + all open tabs)
   *
   * 注意：
   * 1) 纯前端鉴权不等于真正安全（源码可见），适合内部低敏看板。
   * 2) “全员强制登出（跨所有人的浏览器）”在纯静态前端无法远程实现；
   *    最靠谱的方式：改下面 buildId 并发布一次，让所有旧 token 在用户刷新后失效。
   */

  // =================配置区=================
  const CONFIG = {
    token: {
      schemaVersion: 2,
      // 发布时改它（如 2025-12-07.2），即可让所有旧 token 在刷新后失效（达到“全员重新登录”效果）
      buildId: "2025-12-07.1",
    },
    sessions: {
      defaultHours: 24, // 不勾选时：24小时
      adminRememberDays: 30, // 管理员勾选：30天
      userRememberDays: 7, // 普通用户勾选：7天
    },
    storage: {
      tokenKey: "bangbet_auth_token", // 沿用你现有 key，部署新逻辑会自动清理旧结构 token
      forceLogoutAtKey: "bangbet_auth_force_logout_at",
      broadcastKey: "bangbet_auth_broadcast",
    },
    accounts: {
      admin: {
        jerry: "admin",
      },
      users: {
        Jessica: "Jessica",
        Randy: "Randy",
        WeiHailey: "WeiHailey",
        Winning: "Winning",
        Normal: "Normal",
        // 预留扩展位：后续新增普通用户直接在这里加
        // Alice: "Alice"= 账户名：“密码”
        // Bob: "Bob",
      },
      killSwitch: {
        username: "jerry666",
        password: "logout",
      },
    },
    ui: {
      title: "自然量与买量增长分析看板",
      subtitle: "BangBet Data Intelligence System",
      owner: "用户增长部-Jerry Lyu",
      rememberAdminText: "记住我 (30天免登录)",
      rememberUserText: "记住我 (7天免登录)",
      buttonText: "INITIALIZE SESSION ▶",
      brandMark: "B",
    },
  };
  // =======================================

  // ----------------- Utils -----------------
  const nowMs = () => Date.now();

  function safeJsonParse(str) {
    try {
      return JSON.parse(str);
    } catch (_) {
      return null;
    }
  }

  const storage = (() => {
    const hasLS = (() => {
      try {
        const k = "__bb_auth_test__";
        window.localStorage.setItem(k, "1");
        window.localStorage.removeItem(k);
        return true;
      } catch (_) {
        return false;
      }
    })();

    const hasSS = (() => {
      try {
        const k = "__bb_auth_test__";
        window.sessionStorage.setItem(k, "1");
        window.sessionStorage.removeItem(k);
        return true;
      } catch (_) {
        return false;
      }
    })();

    // 优先 localStorage，兜底 sessionStorage（极少数环境 localStorage 不可用）
    const s = hasLS ? window.localStorage : hasSS ? window.sessionStorage : null;

    return {
      ok: !!s,
      get(key) {
        if (!s) return null;
        return s.getItem(key);
      },
      set(key, value) {
        if (!s) return false;
        s.setItem(key, value);
        return true;
      },
      remove(key) {
        if (!s) return false;
        s.removeItem(key);
        return true;
      },
    };
  })();

  function resolveAccount(username) {
    if (!username) return null;
    if (Object.prototype.hasOwnProperty.call(CONFIG.accounts.admin, username)) {
      return { role: "admin", username, password: CONFIG.accounts.admin[username] };
    }
    if (Object.prototype.hasOwnProperty.call(CONFIG.accounts.users, username)) {
      return { role: "user", username, password: CONFIG.accounts.users[username] };
    }
    return null;
  }

  function rememberDaysForRole(role) {
    return role === "admin" ? CONFIG.sessions.adminRememberDays : CONFIG.sessions.userRememberDays;
  }

  function rememberLabelForUsername(username) {
    const acc = resolveAccount(username);
    if (acc?.role === "admin") return CONFIG.ui.rememberAdminText;
    return CONFIG.ui.rememberUserText;
  }

  function readToken() {
    const raw = storage.get(CONFIG.storage.tokenKey);
    if (!raw) return null;
    return safeJsonParse(raw);
  }

  function writeToken(token) {
    storage.set(CONFIG.storage.tokenKey, JSON.stringify(token));
  }

  function clearToken() {
    storage.remove(CONFIG.storage.tokenKey);
  }

  function getForceLogoutAt() {
    const raw = storage.get(CONFIG.storage.forceLogoutAtKey);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }

  function setForceLogoutAt(ts) {
    const cur = getForceLogoutAt();
    const next = Math.max(cur, ts);
    storage.set(CONFIG.storage.forceLogoutAtKey, String(next));
  }

  function isTokenValid(token) {
    if (!token || typeof token !== "object") return false;

    // 必要字段校验
    if (token.v !== CONFIG.token.schemaVersion) return false;
    if (token.build !== CONFIG.token.buildId) return false;
    if (typeof token.user !== "string" || !token.user) return false;
    if (token.role !== "admin" && token.role !== "user") return false;
    if (typeof token.iat !== "number" || typeof token.exp !== "number") return false;

    const now = nowMs();
    if (now >= token.exp) return false;

    // 强制登出时间戳：iat 早于 forceLogoutAt 的 token 一律失效
    const forcedAt = getForceLogoutAt();
    if (forcedAt && token.iat < forcedAt) return false;

    // 账号仍存在（你“后台删账号=改代码发布”后，token 会被判失效）
    const acc = resolveAccount(token.user);
    if (!acc) return false;
    if (acc.role !== token.role) return false;

    return true;
  }

  // ----------------- Cross-tab sync -----------------
  const CHANNEL_NAME = "bangbet_auth_channel_v2";
  const bc = typeof window.BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;

  function broadcast(msg) {
    // 1) BroadcastChannel（更直接）
    if (bc) {
      try {
        bc.postMessage(msg);
      } catch (_) {}
    }
    // 2) localStorage storage-event 兜底（触发其它 tab 的 storage 监听）
    try {
      const payload = Object.assign({}, msg, { _nonce: Math.random().toString(16).slice(2) });
      storage.set(CONFIG.storage.broadcastKey, JSON.stringify(payload));
    } catch (_) {}
  }

  function handleRemoteMessage(msg) {
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "FORCE_LOGOUT" && typeof msg.ts === "number") {
      setForceLogoutAt(msg.ts);
      clearToken();
      renderLoginModal({ notice: "已触发强制登出，请重新登录" });
    }
  }

  if (bc) {
    bc.onmessage = (e) => handleRemoteMessage(e?.data);
  }

  window.addEventListener("storage", (e) => {
    if (!e) return;
    if (e.key === CONFIG.storage.forceLogoutAtKey) {
      // 其它 tab 写入了强制登出时间戳
      clearToken();
      renderLoginModal({ notice: "已触发强制登出，请重新登录" });
      return;
    }
    if (e.key === CONFIG.storage.broadcastKey && e.newValue) {
      const msg = safeJsonParse(e.newValue);
      handleRemoteMessage(msg);
    }
  });

  // ----------------- UI -----------------
  function injectStylesOnce() {
    if (document.getElementById("bb-auth-style")) return;

    const style = document.createElement("style");
    style.id = "bb-auth-style";
    style.textContent = `
      :root {
        --tech-primary: #0ea5e9;
        --tech-bg-dark: #0f172a;
        --tech-text: #e2e8f0;
        --tech-muted: #94a3b8;
        --tech-danger: #fb7185;
      }

      #auth-modal {
        position: fixed; inset: 0;
        background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
        z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Inter', system-ui, sans-serif;
        color: var(--tech-text);
      }

      #auth-modal::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
        background-size: 30px 30px;
        pointer-events: none;
        opacity: 0.4;
      }

      .tech-auth-box {
        position: relative;
        background: rgba(30, 41, 59, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 40px 35px 58px 35px;
        border-radius: 12px;
        border: 1px solid rgba(14, 165, 233, 0.3);
        box-shadow: 0 0 40px rgba(14, 165, 233, 0.15), inset 0 0 10px rgba(14, 165, 233, 0.05);
        width: 392px;
        text-align: center;
        animation: slideUpFade 0.6s ease-out;
      }

      .tech-decoration-line {
        position: absolute; top: 0; left: 50%; transform: translateX(-50%);
        width: 60%; height: 3px;
        background: linear-gradient(90deg, transparent, var(--tech-primary), transparent);
        box-shadow: 0 0 10px var(--tech-primary);
      }

      .tech-logo-b {
        width: 40px; height: 40px; margin: 0 auto 20px;
        background: linear-gradient(135deg, var(--tech-primary), #3b82f6);
        border-radius: 8px; color: white; font-weight: 800; font-size: 22px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
        user-select: none;
      }

      .tech-title {
        margin: 0 0 10px;
        font-size: 20px; font-weight: 700; color: #fff;
        letter-spacing: 0.5px;
        text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
      }

      .tech-subtitle {
        margin: 0 0 18px;
        font-size: 12px;
        color: var(--tech-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .tech-msg {
        min-height: 18px;
        margin: 0 0 14px;
        font-size: 12px;
        color: var(--tech-muted);
      }

      .tech-msg.error { color: var(--tech-danger); }
      .tech-msg.ok { color: #34d399; }

      .tech-input {
        width: 100%; padding: 12px 15px; margin-bottom: 12px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid #334155;
        color: var(--tech-primary);
        border-radius: 6px;
        box-sizing: border-box;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 14px;
        transition: all 0.18s ease-out;
      }

      .tech-input:focus {
        outline: none;
        border-color: var(--tech-primary);
        box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
      }

      .tech-options {
        display: flex; align-items: center; justify-content: flex-start;
        width: 100%; margin: 6px 0 18px;
        color: var(--tech-muted); font-size: 13px;
        gap: 8px;
      }

      .tech-checkbox {
        accent-color: var(--tech-primary);
        width: 16px; height: 16px;
        cursor: pointer;
      }

      .tech-label {
        cursor: pointer;
        transition: color 0.18s ease-out;
        user-select: none;
      }
      .tech-label:hover { color: #e2e8f0; }

      .tech-btn {
        width: 100%; padding: 12px;
        background: linear-gradient(90deg, var(--tech-primary), #2563eb);
        color: white;
        border: none; border-radius: 6px;
        font-weight: 650;
        cursor: pointer;
        letter-spacing: 1px;
        transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
      }

      .tech-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(14, 165, 233, 0.5);
      }

      .tech-owner-info {
        position: absolute; bottom: 14px; right: 18px;
        font-size: 11px; color: #64748b;
        font-weight: 500; letter-spacing: 0.5px;
      }
      .tech-owner-info span { color: var(--tech-primary); opacity: 0.85; }

      .shake {
        animation: shake 0.45s;
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);
  }

  function setMsg(text, type) {
    const msg = document.getElementById("auth-msg");
    if (!msg) return;
    msg.textContent = text || "";
    msg.className = "tech-msg" + (type ? " " + type : "");
  }

  function closeModal() {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      try {
        modal.remove();
      } catch (_) {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
      }
    }, 420);
  }

  function forceLogoutAll(reason) {
    const ts = nowMs();
    setForceLogoutAt(ts);
    clearToken();

    broadcast({ type: "FORCE_LOGOUT", ts, reason: reason || "manual" });

    // 当前页直接留在登录界面
    renderLoginModal({ notice: "已触发强制登出，请重新登录" });
  }

  function doLogin(usernameRaw, passwordRaw, remember) {
    const username = (usernameRaw || "").trim();
    const password = passwordRaw || "";

    // hidden kill-switch
    if (
      username === CONFIG.accounts.killSwitch.username &&
      password === CONFIG.accounts.killSwitch.password
    ) {
      forceLogoutAll("killSwitch");
      setMsg("强制登出指令已执行（本浏览器全部 Tab 立即失效）", "ok");
      return false;
    }

    const acc = resolveAccount(username);
    if (!acc || password !== acc.password) {
      return false;
    }

    const now = nowMs();
    const durationMs = remember
      ? rememberDaysForRole(acc.role) * 24 * 60 * 60 * 1000
      : CONFIG.sessions.defaultHours * 60 * 60 * 1000;

    const token = {
      v: CONFIG.token.schemaVersion,
      build: CONFIG.token.buildId,
      role: acc.role,
      user: acc.username,
      iat: now,
      exp: now + durationMs,
    };

    writeToken(token);

    closeModal();
    return true;
  }

  function renderLoginModal(opts) {
    if (document.getElementById("auth-modal")) {
      // 已存在时，只更新提示
      if (opts?.notice) setMsg(opts.notice, "ok");
      return;
    }

    injectStylesOnce();

    const modalHtml = `
      <div id="auth-modal" role="dialog" aria-modal="true" aria-label="Auth">
        <div class="tech-auth-box" id="auth-box">
          <div class="tech-decoration-line"></div>

          <div class="tech-logo-b">${CONFIG.ui.brandMark}</div>
          <h2 class="tech-title">${CONFIG.ui.title}</h2>
          <p class="tech-subtitle">${CONFIG.ui.subtitle}</p>

          <div id="auth-msg" class="tech-msg"></div>

          <input type="text" id="auth-user" class="tech-input" placeholder="USER ID / 账号" autocomplete="off" />
          <input type="password" id="auth-pass" class="tech-input" placeholder="PASSWORD / 密码" />

          <div class="tech-options">
            <input type="checkbox" id="auth-remember" class="tech-checkbox" />
            <label for="auth-remember" id="auth-remember-label" class="tech-label"></label>
          </div>

          <button id="auth-btn" class="tech-btn">${CONFIG.ui.buttonText}</button>

          <div class="tech-owner-info">
            Owner：<span>${CONFIG.ui.owner}</span>
          </div>
        </div>
      </div>
    `;

    // 直接插入 body（避免多一层 wrapper）
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const userInput = document.getElementById("auth-user");
    const passInput = document.getElementById("auth-pass");
    const rememberInput = document.getElementById("auth-remember");
    const rememberLabel = document.getElementById("auth-remember-label");
    const btn = document.getElementById("auth-btn");
    const box = document.getElementById("auth-box");

    const refreshRememberLabel = () => {
      if (!rememberLabel) return;
      rememberLabel.textContent = rememberLabelForUsername(userInput?.value || "");
    };

    const shakeBox = () => {
      if (!box) return;
      box.classList.remove("shake");
      // 触发 reflow，确保重复 shake 生效
      void box.offsetWidth;
      box.classList.add("shake");
      setTimeout(() => box.classList.remove("shake"), 480);
    };

    const triggerLogin = () => {
      setMsg("", "");
      const ok = doLogin(userInput?.value, passInput?.value, !!rememberInput?.checked);
      if (!ok) {
        // 失败情况：命令已处理 or 密码错误
        const username = (userInput?.value || "").trim();
        const password = passInput?.value || "";
        const isKill =
          username === CONFIG.accounts.killSwitch.username &&
          password === CONFIG.accounts.killSwitch.password;

        if (!isKill) {
          setMsg("ACCESS DENIED // 账号或密码错误", "error");
          shakeBox();
          if (passInput) passInput.focus();
        }
      }
    };

    if (btn) btn.onclick = triggerLogin;

    if (userInput) {
      userInput.addEventListener("input", refreshRememberLabel);
      userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          if (passInput) passInput.focus();
        }
      });
    }

    if (passInput) {
      passInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") triggerLogin();
      });
    }

    refreshRememberLabel();

    if (opts?.notice) setMsg(opts.notice, "ok");

    if (userInput) userInput.focus();
  }

  // ----------------- Boot -----------------
  function boot() {
    // storage 不可用时，直接放行（避免把页面锁死）
    if (!storage.ok) return;

    const token = readToken();
    if (!isTokenValid(token)) {
      clearToken();
      renderLoginModal();
    }

    // 可选：暴露一个很轻量的调试入口（不影响使用）
    // window.BangBetAuth = {
    //   whoami: () => readToken(),
    //   logout: () => { clearToken(); renderLoginModal({ notice: "已登出，请重新登录" }); },
    //   forceLogout: () => forceLogoutAll("manual"),
    // };
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
