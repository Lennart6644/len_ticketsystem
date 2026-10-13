const RES = typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'len_ticketsystem';
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const arr = (x) => (Array.isArray(x) ? x : Object.values(x || {}));
const clip = (s, n) => { s = String(s ?? ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
};
const post = (name, data = {}) =>
    fetch(`https://${RES}/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).catch(() => {});

const P = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    bug: '<rect x="8" y="7" width="8" height="12" rx="4"/><path d="M4 12h4M16 12h4M5 7l3 2M19 7l-3 2M12 7V4"/>',
    gavel: '<path d="M14 4l6 6-3 3-6-6zM9 9l-5 5 5 5 5-5M3 21h8"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17.5v.5"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z"/><path d="M14 4v16" stroke-dasharray="2 2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    power: '<path d="M12 3v9"/><path d="M6.4 6.4a8 8 0 1 0 11.2 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.5 0 4.5 1.5 4.5 4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    car: '<path d="M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    release: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    lock: '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
    snow: '<path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10"/>',
    drop: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L12 20l-3-3 8.7-8.7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 19a2 2 0 0 0 4 0"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>',
    plug: '<path d="M9 2v5M15 2v5M7 7h10v4a5 5 0 0 1-10 0zM12 16v6"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
};

const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[name] || P.bell}</svg>`;

const icon = (name, cls) => {
    const s = el('span', cls || '');
    s.setAttribute('data-icon', name);
    s.innerHTML = svg(name);
    return s;
};

const TOAST_ICON = { success: 'check', error: 'alert', info: 'bell', admin: 'ticket', chat: 'chat' };
const SCREENS = ['#player-ui', '#admin-ui', '#chat-ui'];
const THEME_VARS = {
    accent: '--accent', accent2: '--accent2', panel: '--panel', panelBorder: '--panel-border',
    text: '--text', muted: '--muted', success: '--success', danger: '--danger',
    warning: '--warning', radius: '--radius', font: '--font',
};

const LIVE = {
    hp: { max: 200, icon: 'heart', label: 'ui_hp' },
    armor: { max: 100, icon: 'shield', label: 'ui_armor' },
    fuel: { max: 100, icon: 'drop', label: 'ui_fuel', flash: false },
    engine: { max: 1000, icon: 'gear', label: 'ui_engine' },
    body: { max: 1000, icon: 'car', label: 'ui_body' },
    tank: { max: 1000, icon: 'drop', label: 'ui_vtank' },
};

let UI = {};
let CFG = { admin: {}, limits: {}, theme: {} };
let state = { tickets: [], admins: [], history: [], selected: null, duty: false };
let liveBars = {};
let toolInputs = {};
let detailKey = null;
let pollTimer = null;

const t = (key, fallback) => (UI[key] !== undefined ? UI[key] : (fallback !== undefined ? fallback : key));

function show(selector) {
    if (selector !== '#admin-ui') stopPoll();
    SCREENS.forEach((s) => $(s).classList.toggle('hidden', s !== selector));
}
function visible() {
    return SCREENS.find((s) => !$(s).classList.contains('hidden')) || null;
}
function closeUI() {
    show(null);
    post('close');
}
function startPoll() {
    stopPoll();
    pollTimer = setInterval(() => post('poll'), 1200);
}
function stopPoll() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
}

function applyIcons() {
    $$('[data-icon]').forEach((n) => { n.innerHTML = svg(n.dataset.icon); });
}
function applyI18n() {
    $$('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((n) => { n.placeholder = t(n.dataset.i18nPh); });
}
function applyConfig(cfg) {
    if (!cfg) return;
    CFG = cfg;
    Object.entries(THEME_VARS).forEach(([key, cssVar]) => {
        if (cfg.theme && cfg.theme[key]) document.documentElement.style.setProperty(cssVar, cfg.theme[key]);
    });
    if (cfg.limits) {
        $('#t-subject').maxLength = cfg.limits.maxSubjectLength;
        $('#t-message').maxLength = cfg.limits.maxMessageLength;
    }
}

function notify(d) {
    const box = $('#notify');
    box.className = 'notify ' + (d.position || 'top-right');
    const type = d.type || 'info';
    const n = el('div', 'toast ' + type);
    const ic = el('div', 'toast-ic');
    ic.append(icon(TOAST_ICON[type] || 'bell'));
    const body = el('div', 'toast-body');
    body.append(el('div', 'toast-title', clip(d.title, 50)));
    if (d.rows) {
        const rows = el('div', 'toast-rows');
        d.rows.forEach((r) => {
            if (!r.value) return;
            const row = el('div', 'toast-row');
            row.append(el('span', 'toast-label', r.label), el('b', 'toast-value', clip(r.value, 40)));
            rows.append(row);
        });
        body.append(rows);
    }
    if (d.message) body.append(el('div', 'toast-extra', clip(d.message, 100)));
    if (d.hint) body.append(el('div', 'toast-hint', d.hint));
    n.append(ic, body);
    box.prepend(n);
    while (box.children.length > 4) box.lastElementChild.remove();
    setTimeout(() => {
        n.classList.add('out');
        setTimeout(() => n.remove(), 300);
    }, d.duration || 5000);
}

function setData(d) {
    state.tickets = arr(d.tickets);
    state.admins = arr(d.admins);
    if (d.duty !== undefined) state.duty = !!d.duty;
}

function chip(iconName, label, value) {
    const c = el('span', 'chip');
    c.append(icon(iconName), el('span', '', label));
    c.append(el('b', '', value));
    return c;
}

function createBar(key, value) {
    const cfg = LIVE[key];
    const row = el('div', 'bar');
    const name = el('span');
    name.append(icon(cfg.icon), el('span', '', t(cfg.label)));
    const track = el('div', 'track');
    const fill = el('i');
    track.append(fill);
    const val = el('b', '', Math.round(value || 0));
    row.append(name, track, val);
    const pct = Math.max(0, Math.min(100, ((value || 0) / cfg.max) * 100));
    fill.style.width = pct + '%';
    liveBars[key] = { row, fill, val, shown: value || 0, raf: null, timer: null };
    return row;
}

function animateBar(key, target) {
    const b = liveBars[key];
    if (!b) return;
    const cfg = LIVE[key];
    const from = b.shown;
    const to = Number(target) || 0;
    if (from === to) return;
    if (b.raf) cancelAnimationFrame(b.raf);
    if (b.timer) clearTimeout(b.timer);
    b.row.classList.remove('up', 'down');
    if (cfg.flash !== false) {
        b.row.classList.add(to > from ? 'up' : 'down');
        b.timer = setTimeout(() => b.row.classList.remove('up', 'down'), 700);
    }
    const start = performance.now();
    const dur = 500;
    const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        const v = from + (to - from) * e;
        b.shown = v;
        b.fill.style.width = Math.max(0, Math.min(100, (v / cfg.max) * 100)) + '%';
        b.val.textContent = Math.round(v);
        if (p < 1) {
            b.raf = requestAnimationFrame(step);
        } else {
            b.shown = to;
            b.raf = null;
        }
    };
    b.raf = requestAnimationFrame(step);
}

function updateLive(stats) {
    Object.keys(liveBars).forEach((key) => {
        if (stats[key] !== undefined) animateBar(key, stats[key]);
    });
    Object.keys(toolInputs).forEach((key) => {
        if (stats[key] !== undefined) toolInputs[key].placeholder = Math.round(stats[key]);
    });
}

function tool(box, id, action, key, label, iconName, value) {
    const row = el('div', 'tool');
    const name = el('span', 'tool-name');
    name.append(icon(iconName), el('span', '', label));
    const inp = el('input');
    inp.type = 'number';
    inp.min = 0;
    inp.max = LIVE[key].max;
    inp.value = Math.round(value || 0);
    toolInputs[key] = inp;
    const btn = el('button', 'btn small', t('ui_apply'));
    btn.onclick = () => post('action', { id, action, value: Number(inp.value) });
    row.append(name, inp, btn);
    box.append(row);
}

function section(iconName, title, sub) {
    const s = el('div', 'section');
    const head = el('div', 'section-head');
    const ic = el('div', 'section-icon');
    ic.append(icon(iconName));
    const txt = el('div');
    txt.append(el('h5', '', title));
    if (sub) txt.append(el('small', '', sub));
    head.append(ic, txt);
    const body = el('div', 'section-body');
    s.append(head, body);
    return { root: s, body };
}

function renderAdmin() {
    $('#duty-toggle').checked = state.duty;
    $('#duty-label').textContent = t(state.duty ? 'ui_duty_on' : 'ui_duty_off');

    const team = $('#team-list');
    team.innerHTML = '';
    state.admins.forEach((a) => {
        const li = el('li');
        li.append(el('span', 'dot ' + (a.duty ? 'on' : '')), el('span', '', a.name));
        team.append(li);
    });

    const openCount = state.tickets.filter((x) => x.status === 'open').length;
    const stats = $('#stats');
    stats.innerHTML = '';
    stats.append(
        chip('inbox', t('ui_open'), openCount),
        chip('check', t('ui_claimed'), state.tickets.length - openCount)
    );

    const list = $('#ticket-list');
    const listScroll = list.scrollTop;
    list.innerHTML = '';
    if (!state.tickets.length) {
        const e = el('div', 'empty-list');
        e.append(icon('inbox'), el('div', '', t('ui_no_tickets')));
        list.append(e);
    }
    state.tickets.forEach((tk) => {
        const row = el('button', 'ticket' + (tk.id === state.selected ? ' active' : '') + (tk.online ? '' : ' offline'));
        const top = el('div', 'ticket-top');
        const claimed = tk.status === 'claimed';
        top.append(
            el('b', '', '#' + tk.id),
            el('span', 'status ' + (claimed ? 'claimed' : 'open'), t(claimed ? 'ui_claimed' : 'ui_open'))
        );
        const meta = tk.playerName + (tk.online ? '' : ' · ' + t('ui_offline'));
        row.append(top, el('div', 'ticket-subj', tk.subject), el('div', 'ticket-meta', meta));
        row.onclick = () => { state.selected = tk.id; renderAdmin(); };
        list.append(row);
    });
    list.scrollTop = listScroll;

    renderDetail();
}

function renderDetail() {
    const box = $('#detail');
    const tk = state.tickets.find((x) => x.id === state.selected);

    if (!tk) {
        detailKey = null;
        liveBars = {};
        toolInputs = {};
        box.innerHTML = '';
        const e = el('div', 'empty-list');
        e.style.marginTop = '60px';
        e.append(icon('ticket'), el('div', 'empty', t('ui_select')));
        box.append(e);
        return;
    }

    const hasVehicle = !!(tk.stats && tk.stats.inVehicle);
    const key = [tk.id, tk.status, tk.online, !!tk.stats, hasVehicle].join('|');
    if (key === detailKey) {
        if (tk.stats) updateLive(tk.stats);
        return;
    }

    const scroll = box.scrollTop;
    detailKey = key;
    liveBars = {};
    toolInputs = {};
    box.innerHTML = '';

    const admin = CFG.admin || {};
    const online = !!tk.online;

    const head = el('div', 'detail-head');
    head.append(el('h4', '', '#' + tk.id + ' · ' + tk.subject));
    box.append(head);

    const bar1 = el('div', 'ticket-bar');
    const label = el('div', 'label');
    label.append(icon('ticket'), el('span', '', t('ui_ticket_actions')));
    bar1.append(label);
    const claimed = tk.status === 'claimed';
    const claimBtn = el('button', 'btn small ' + (claimed ? 'ghost' : 'primary'));
    claimBtn.append(icon(claimed ? 'release' : 'check'), el('span', '', t(claimed ? 'ui_unclaim' : 'ui_claim')));
    claimBtn.onclick = () => post('action', { id: tk.id, action: claimed ? 'unclaim' : 'claim' });
    const closeBtn = el('button', 'btn small danger');
    closeBtn.append(icon('lock'), el('span', '', t('ui_close')));
    closeBtn.onclick = () => post('action', { id: tk.id, action: 'close' });
    bar1.append(claimBtn, closeBtn);
    box.append(bar1);

    box.append(el('div', 'message', tk.message));

    const ids = tk.identifiers || {};
    const player = section('user', t('ui_section_player'), tk.playerName + ' (ID ' + tk.playerId + ')');
    if (!online) {
        const off = el('div', 'empty-state');
        off.append(icon('plug'), el('div', '', t('ui_player_offline')));
        player.body.append(off);
    } else {
        const grid = el('div', 'grid');
        const info = [
            ['user', t('ui_player'), tk.playerName],
            ['id', t('ui_char'), tk.charName],
            ['briefcase', t('ui_job'), tk.job],
            ['clock', t('ui_time'), tk.timestamp],
            ['id', t('ui_steam'), ids.steam],
            ['id', t('ui_license'), ids.license],
            ['id', t('ui_discord'), ids.discord],
            ['id', t('ui_fivem'), ids.fivem],
        ];
        info.forEach(([iconName, k, v]) => {
            const c = el('div', 'kv');
            const kEl = el('span');
            kEl.append(icon(iconName), el('span', '', k));
            c.append(kEl, el('b', '', String(v ?? '-')));
            grid.append(c);
        });
        player.body.append(grid);

        const actions = el('div', 'actions');
        const add = (text, action, iconName, cls, enabled = true) => {
            const b = el('button', 'btn small ' + cls);
            b.append(icon(iconName), el('span', '', text));
            b.disabled = !enabled;
            b.onclick = () => post('action', { id: tk.id, action });
            actions.append(b);
        };
        add(t('ui_goto'), 'goto', 'arrowRight', 'ghost', admin.allowTeleport);
        add(t('ui_bring'), 'bring', 'arrowLeft', 'ghost', admin.allowTeleport);
        add(t('ui_waypoint'), 'waypoint', 'pin', 'ghost');
        if (admin.allowRevive) add(t('ui_revive'), 'revive', 'heart', 'ghost');
        if (admin.allowFreeze) add(t('ui_freeze'), 'freeze', 'snow', 'ghost');
        if (admin.allowKick) add(t('ui_kick'), 'kick', 'logout', 'danger');
        player.body.append(actions);

        if (tk.stats) {
            const s = tk.stats;
            const live = el('div', 'live');
            const lt = el('div', 'sub-title');
            lt.append(icon('pulse'), el('span', '', t('ui_live')));
            live.append(lt, createBar('hp', s.hp), createBar('armor', s.armor));
            player.body.append(live);

            const tools = el('div', 'tools');
            const tt = el('div', 'sub-title');
            tt.append(icon('sliders'), el('span', '', t('ui_player_tools')));
            tools.append(tt);
            tool(tools, tk.id, 'setHealth', 'hp', t('ui_hp'), 'heart', s.hp);
            tool(tools, tk.id, 'setArmor', 'armor', t('ui_armor'), 'shield', s.armor);
            player.body.append(tools);
        }
    }
    box.append(player.root);

    const vehicle = section('car', t('ui_section_vehicle'), null);
    if (!online) {
        const off = el('div', 'empty-state');
        off.append(icon('plug'), el('div', '', t('ui_player_offline')));
        vehicle.body.append(off);
    } else if (hasVehicle) {
        const s = tk.stats;
        const live = el('div', 'live');
        live.append(
            createBar('fuel', s.fuel),
            createBar('engine', s.engine),
            createBar('body', s.body),
            createBar('tank', s.tank)
        );
        vehicle.body.append(live);
        const tools = el('div', 'tools');
        const tt = el('div', 'sub-title');
        tt.append(icon('sliders'), el('span', '', t('ui_vehicle_tools')));
        tools.append(tt);
        tool(tools, tk.id, 'setFuel', 'fuel', t('ui_fuel'), 'drop', s.fuel);
        tool(tools, tk.id, 'setVehEngine', 'engine', t('ui_engine'), 'gear', s.engine);
        tool(tools, tk.id, 'setVehBody', 'body', t('ui_body'), 'car', s.body);
        tool(tools, tk.id, 'setVehTank', 'tank', t('ui_vtank'), 'drop', s.tank);
        const fix = el('button', 'btn small ghost fix-btn');
        fix.append(icon('wrench'), el('span', '', t('ui_fix_veh')));
        fix.onclick = () => post('action', { id: tk.id, action: 'fixVeh' });
        tools.append(fix);
        vehicle.body.append(tools);
    } else if (tk.stats) {
        const none = el('div', 'empty-state');
        none.append(icon('car'), el('div', '', t('ui_vehicle_none')));
        vehicle.body.append(none);
    }
    box.append(vehicle.root);

    box.scrollTop = scroll;
}

function renderChat() {
    const box = $('#chat-msgs');
    box.innerHTML = '';
    if (!state.history.length) {
        const e = el('div', 'empty-list');
        e.style.marginTop = '40px';
        e.append(icon('chat'), el('div', 'empty', t('ui_chat_empty')));
        box.append(e);
    }
    state.history.forEach((m) => {
        const row = el('div', 'msg');
        const head = el('div', 'msg-head');
        head.append(el('b', '', m.sender), el('span', '', m.time));
        row.append(head, el('div', 'msg-text', m.message));
        box.append(row);
    });
    box.scrollTop = box.scrollHeight;
}

function sendChat() {
    const input = $('#chat-input');
    const message = input.value.trim();
    if (!message) return;
    post('chatSend', { message });
    input.value = '';
}

window.addEventListener('message', ({ data }) => {
    if (data.ui) {
        UI = data.ui;
        applyI18n();
    }
    if (data.config) applyConfig(data.config);

    switch (data.action) {
        case 'openPlayer':
            show('#player-ui');
            $('#ticket-form').reset();
            break;
        case 'openAdmin':
            show('#admin-ui');
            setData(data);
            state.selected = null;
            detailKey = null;
            renderAdmin();
            startPoll();
            break;
        case 'refresh':
            if (visible() === '#admin-ui') {
                setData(data);
                renderAdmin();
            }
            break;
        case 'openChat':
            show('#chat-ui');
            state.history = arr(data.history);
            renderChat();
            break;
        case 'addChat':
            if (visible() === '#chat-ui') {
                state.history.push(data.data);
                renderChat();
            }
            break;
        case 'notify':
            notify(data);
            break;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && visible()) closeUI();
    if (e.key === 'Enter' && document.activeElement === $('#chat-input')) sendChat();
});

$$('[data-close]').forEach((b) => b.addEventListener('click', closeUI));

$('#ticket-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = $('#t-subject').value.trim();
    const message = $('#t-message').value.trim();
    const min = (CFG.limits && CFG.limits.minMessageLength) || 0;
    if (message.length < min) {
        notify({ title: t('title_error'), message: t('err_too_short').replace('%d', min), type: 'error' });
        return;
    }
    show(null);
    post('submit', { subject, message });
});

$('#duty-toggle').addEventListener('change', () => post('toggleDuty'));
$('#chat-send').addEventListener('click', sendChat);

applyIcons();
