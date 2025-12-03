(function() {
    // =================配置区=================
    const CONFIG = {
        username: "jerry",      // 账号
        password: "666",        // 密码
        validHours: 24,         // 默认有效期(小时) - 不勾选时
        extendedDays: 30,       // 长期有效期(天)   - 勾选"记住我"时
        storageKey: "bangbet_auth_token" // 浏览器缓存的Key
    };
    // =======================================

    // 1. 检查是否已登录且未过期
    function checkLogin() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                const now = new Date().getTime();
                
                // 优先判断是否有明确的过期时间戳 (兼容新逻辑)
                if (data.expiry) {
                    if (now < data.expiry) return true;
                } 
                // 兼容旧版逻辑 (默认24小时)
                else if (now - data.timestamp < CONFIG.validHours * 60 * 60 * 1000) {
                    return true;
                }
            } catch(e) {
                return false;
            }
        }
        return false; // 未登录或已过期
    }

    // 2. 执行登录逻辑
    function doLogin(u, p, remember) {
        if (u === CONFIG.username && p === CONFIG.password) {
            const now = new Date().getTime();
            
            // 核心逻辑：如果勾选 remember，有效期=30天；否则=24小时
            const duration = remember 
                ? CONFIG.extendedDays * 24 * 60 * 60 * 1000 
                : CONFIG.validHours * 60 * 60 * 1000;

            const data = {
                timestamp: now,
                expiry: now + duration, // 写入具体的过期时间点
                user: u
            };
            
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
            
            // 登录成功，播放退场动画
            const modal = document.getElementById('auth-modal');
            if (modal) {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.5s ease';
                setTimeout(() => modal.remove(), 500);
            }
            return true;
        } else {
            // 密码错误，播放摇晃动画
            const box = document.querySelector('.tech-auth-box');
            if (box) {
                box.style.animation = 'shake 0.5s';
                setTimeout(() => box.style.animation = '', 500);
            }
            alert("ACCESS DENIED // 账号或密码错误");
            return false;
        }
    }

    // 3. 渲染登录遮罩 (科技感 UI + 记住我选项)
    function renderLoginModal() {
        if (document.getElementById('auth-modal')) return;

        // 注入 CSS 样式
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --tech-primary: #0ea5e9;
                --tech-bg-dark: #0f172a;
            }
            #auth-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
                z-index: 999999;
                display: flex; align-items: center; justify-content: center;
                font-family: 'Inter', system-ui, sans-serif;
                color: #e2e8f0;
            }
            #auth-modal::before {
                content: '';
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
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
                padding: 40px 35px 60px 35px;
                border-radius: 12px;
                border: 1px solid rgba(14, 165, 233, 0.3);
                box-shadow: 0 0 40px rgba(14, 165, 233, 0.15), inset 0 0 10px rgba(14, 165, 233, 0.05);
                width: 380px;
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
                border-radius: 8px; color: white; font-weight: bold; font-size: 22px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
            }
            .tech-title {
                margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #fff;
                letter-spacing: 0.5px;
                text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
            }
            .tech-subtitle {
                margin: 0 0 25px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;
            }
            .tech-input {
                width: 100%; padding: 12px 15px; margin-bottom: 15px;
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid #334155; color: var(--tech-primary);
                border-radius: 6px; box-sizing: border-box; font-family: monospace; font-size: 14px;
                transition: all 0.3s;
            }
            .tech-input:focus {
                outline: none; border-color: var(--tech-primary);
                box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
            }
            /* 新增：复选框样式 */
            .tech-options {
                display: flex; align-items: center; justify-content: flex-start;
                width: 100%; margin-bottom: 20px;
                color: #94a3b8; font-size: 13px;
            }
            .tech-checkbox {
                accent-color: var(--tech-primary);
                margin-right: 8px;
                width: 16px; height: 16px;
                cursor: pointer;
            }
            .tech-label { cursor: pointer; transition: color 0.3s; }
            .tech-label:hover { color: #e2e8f0; }
            
            .tech-btn {
                width: 100%; padding: 12px; 
                background: linear-gradient(90deg, var(--tech-primary), #2563eb);
                color: white; border: none; border-radius: 6px;
                font-weight: 600; cursor: pointer; letter-spacing: 1px;
                transition: all 0.3s; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            }
            .tech-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(14, 165, 233, 0.5);
            }
            .tech-owner-info {
                position: absolute; bottom: 15px; right: 20px;
                font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: 0.5px;
            }
            .tech-owner-info span { color: var(--tech-primary); opacity: 0.8; }

            @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-10px); }
                40%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);

        // 注入 HTML
        const modalHtml = `
        <div id="auth-modal">
            <div class="tech-auth-box">
                <div class="tech-decoration-line"></div>
                
                <div class="tech-logo-b">B</div>
                <h2 class="tech-title">自然量与买量增长分析看板</h2>
                <p class="tech-subtitle">BangBet Data Intelligence System</p>
                
                <input type="text" id="auth-user" class="tech-input" placeholder="USER ID / 账号" autocomplete="off">
                <input type="password" id="auth-pass" class="tech-input" placeholder="PASSWORD / 密码">
                
                <div class="tech-options">
                    <input type="checkbox" id="auth-remember" class="tech-checkbox">
                    <label for="auth-remember" class="tech-label">记住我 (30天免登录)</label>
                </div>
                
                <button id="auth-btn" class="tech-btn">INITIALIZE SESSION ▶</button>

                <div class="tech-owner-info">
                    Owner：<span>用户增长部-Jerry Lyu</span>
                </div>
            </div>
        </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div);

        // 绑定事件
        // 【已修复】之前这里多了一个空格导致报错，现在修复了
        const userInput = document.getElementById('auth-user');
        const passInput = document.getElementById('auth-pass');
        const rememberInput = document.getElementById('auth-remember');
        const btn = document.getElementById('auth-btn');

        const triggerLogin = () => {
            // 将 checkbox 的状态传递给登录逻辑
            doLogin(userInput.value, passInput.value, rememberInput.checked);
        };

        if (btn) btn.onclick = triggerLogin;
        
        if (passInput) {
            passInput.addEventListener("keypress", function(event) {
                if (event.key === "Enter") triggerLogin();
            });
        }
        
        if (userInput) userInput.focus();
    }

    // 4. 启动检查
    if (!checkLogin()) {
        if (document.body) {
            renderLoginModal();
        } else {
            window.addEventListener('DOMContentLoaded', renderLoginModal);
        }
    }
})();
