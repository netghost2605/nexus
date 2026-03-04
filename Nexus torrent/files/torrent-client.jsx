import React, { useState, useEffect, useRef } from "react";

const FONTS = ``; // Fonts loaded via <link> in HTML

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #020408;
    --bg2: #050c14;
    --bg3: #091520;
    --panel: #0a1628;
    --border: #0d2137;
    --border2: #1a3a5c;
    --cyan: #00e5ff;
    --cyan2: #00b4cc;
    --green: #00ff9d;
    --green2: #00cc7a;
    --orange: #ff6b2b;
    --red: #ff2b55;
    --yellow: #ffd700;
    --text: #c8e6f5;
    --text2: #7aafc9;
    --text3: #4a7a99;
    --mono: 'Share Tech Mono', monospace;
    --display: 'Orbitron', monospace;
    --body: 'Rajdhani', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--body); overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--cyan2); }

  .scanlines::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    pointer-events: none;
    z-index: 9999;
  }
  .grid-bg {
    background-image: 
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .neon-border { border: 1px solid var(--border2); box-shadow: inset 0 0 20px rgba(0,229,255,0.03), 0 0 0 1px rgba(0,229,255,0.05); }
  .neon-border-active { border: 1px solid var(--cyan); box-shadow: inset 0 0 20px rgba(0,229,255,0.08), 0 0 8px rgba(0,229,255,0.2); }
  .glow-text { text-shadow: 0 0 10px currentColor; }
  .corner-cut {
    clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);
  }
  .corner-cut-lg {
    clip-path: polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px);
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes slide-in { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes data-flow {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes float-up { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-blink { animation: blink 1s step-end infinite; }
  .animate-slide-in { animation: slide-in 0.3s ease; }
  .animate-float-up { animation: float-up 0.4s ease; }
  .btn {
    font-family: var(--display);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    padding: 6px 14px;
    background: transparent;
    border: 1px solid var(--border2);
    color: var(--text2);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);
    text-transform: uppercase;
  }
  .btn:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 12px rgba(0,229,255,0.25); background: rgba(0,229,255,0.05); }
  .btn-primary { border-color: var(--cyan); color: var(--cyan); background: rgba(0,229,255,0.08); }
  .btn-primary:hover { background: rgba(0,229,255,0.18); box-shadow: 0 0 20px rgba(0,229,255,0.4); }
  .btn-danger { border-color: var(--red); color: var(--red); background: rgba(255,43,85,0.05); }
  .btn-danger:hover { background: rgba(255,43,85,0.15); box-shadow: 0 0 12px rgba(255,43,85,0.3); }
  .btn-success { border-color: var(--green); color: var(--green); background: rgba(0,255,157,0.05); }
  .btn-success:hover { background: rgba(0,255,157,0.15); box-shadow: 0 0 12px rgba(0,255,157,0.3); }
  .progress-bar-container {
    height: 4px;
    background: rgba(0,229,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--cyan2), var(--cyan));
    box-shadow: 0 0 8px var(--cyan);
    transition: width 0.5s ease;
    border-radius: 2px;
  }
  .tab-btn {
    font-family: var(--display);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text3);
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .tab-btn:hover { color: var(--text2); }
  .tab-btn.active { color: var(--cyan); border-bottom-color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }
  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .input-field {
    background: rgba(0,229,255,0.04);
    border: 1px solid var(--border2);
    color: var(--text);
    font-family: var(--mono);
    font-size: 15px;
    padding: 8px 12px;
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }
  .input-field:focus { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,229,255,0.15); }
  .input-field::placeholder { color: var(--text3); }
  select.input-field option { background: var(--bg2); }
`;




function SpeedGraph({ data, color }) {
  const w = 120, h = 36;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#grad-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    seeding: { color: "#00ff9d", label: "SEEDING" },
    downloading: { color: "#00e5ff", label: "DOWNLOADING" },
    paused: { color: "#ffd700", label: "PAUSED" },
    queued: { color: "#7aafc9", label: "QUEUED" },
    error: { color: "#ff2b55", label: "ERROR" },
  };
  const s = map[status] || map.queued;
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 15, letterSpacing: 1, color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}44`, padding: "2px 6px", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function QualityBadge({ quality }) {
  const map = { "2160p": "#00e5ff", "1080p": "#00ff9d", "720p": "#ffd700", "480p": "#ff6b2b" };
  const color = map[quality] || "#7aafc9";
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 15, letterSpacing: 1, color, background: `${color}18`, border: `1px solid ${color}44`, padding: "2px 6px" }}>
      {quality}
    </span>
  );
}


const DEFAULTS = {
  downloadPath: "G:\\downloads",
  tvPath: "G:\\tv",
  moviesPath: "G:\\videos",
  musicPath: "",
  softwarePath: "",
  useCategories: true,
  maxDlSpeed: "0",
  maxUlSpeed: "0",
  maxActive: "5",
  maxDownloads: "3",
  port: "6881",
  encryption: "enabled",
  dhtEnabled: true,
  pexEnabled: true,
  lsdEnabled: true,
  globalMaxRatio: "2.0",
  seedingTimeLimit: "0",
  proxyType: "None",
  proxyHost: "",
  proxyPort: "8080",
  rssRefreshInterval: "30",
  qbUser: "admin",
  qbPass: "adminadmin",
  rssMaxItems: "200",
  theme: "dark",
  language: "English",
  startMinimized: false,
  closeToTray: true,
  startOnBoot: false,
  apiKey: "",
};

function loadSettings() {
  try {
    const saved = localStorage.getItem("nexus_settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
  } catch { return { ...DEFAULTS }; }
}

function getSavePath(category, settings) {
  if (!settings.useCategories) return settings.downloadPath || "G:\\downloads";
  const map = {
    "TV Shows": settings.tvPath,
    "Movies":   settings.moviesPath,
    "Music":    settings.musicPath,
    "Software": settings.softwarePath,
  };
  return map[category] || settings.downloadPath || "G:\\downloads";
}

async function openFolder(folderPath, notifyFn) {
  if (!folderPath) { notifyFn("No save path set for this torrent", "danger"); return; }
  try {
    await navigator.clipboard.writeText(folderPath);
    notifyFn(`📋 Path copied to clipboard: ${folderPath}`);
  } catch {
    notifyFn(`Save path: ${folderPath}`);
  }
}

// ── qBittorrent API v2 — direct calls (served from qBittorrent itself) ──────
const API = '/api/v2';

async function apiPost(path, params) {
  try {
    const body = new URLSearchParams(params).toString();
    const r = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    return r;
  } catch { return null; }
}

async function apiGet(path) {
  try { return await fetch(`${API}${path}`); }
  catch { return null; }
}

async function qbAdd(magnet, savePath, category) {
  if (!magnet || !magnet.trim()) return { ok: false, err: 'No URL provided' };
  const url = magnet.trim();
  // qBittorrent can only handle: magnet links, .torrent URLs, or info-hashes
  const isMagnet = url.startsWith('magnet:');
  const isTorrentFile = url.match(/\.torrent($|\?)/i);
  const isInfoHash = url.match(/^[a-fA-F0-9]{40}$/);
  if (!isMagnet && !isTorrentFile && !isInfoHash) {
    return { ok: false, err: 'Not a magnet link or .torrent URL — qBittorrent cannot add webpage links' };
  }
  try {
    const params = new URLSearchParams();
    params.append('urls', url);
    if (savePath) params.append('savepath', savePath);
    if (category) params.append('category', category);
    const r = await fetch(`${API}/torrents/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const text = r ? await r.text() : '';
    if (text === 'Ok.') return { ok: true };
    return { ok: false, err: text || 'qBittorrent rejected the torrent' };
  } catch (e) { return { ok: false, err: e.message }; }
}

async function qbStatus() {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 3000);
    const r = await fetch(`${API}/app/version`, { signal: ac.signal });
    clearTimeout(t);
    // 403 = not logged in, try auto-login with stored credentials
    if (r.status === 403) {
      const saved = localStorage.getItem('nexus_settings');
      const s = saved ? JSON.parse(saved) : {};
      const lr = await apiPost('/auth/login', { username: s.qbUser || 'admin', password: s.qbPass || 'adminadmin' });
      const ok = lr && (await lr.text()) === 'Ok.';
      if (!ok) return { ok: false, needsLogin: true };
      const r2 = await fetch(`${API}/app/version`);
      return { ok: r2.ok, version: r2.ok ? await r2.text() : null };
    }
    return { ok: r.ok, version: r.ok ? await r.text() : null };
  } catch { return { ok: false }; }
}

async function qbList() {
  try {
    const r = await apiGet('/torrents/info?sort=added_on&reverse=true');
    if (!r || !r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function qbTransferInfo() {
  try {
    const r = await apiGet('/transfer/info');
    if (!r || !r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function qbPause(hash) {
  try { await apiPost('/torrents/stop', { hashes: hash }); } catch {}
}

async function qbResume(hash) {
  try { await apiPost('/torrents/start', { hashes: hash }); } catch {}
}

async function qbDelete(hashes, deleteFiles = false) {
  try {
    await apiPost('/torrents/delete', {
      hashes: Array.isArray(hashes) ? hashes.join('|') : hashes,
      deleteFiles: deleteFiles ? 'true' : 'false'
    });
  } catch {}
}

// Map qBittorrent state to our status
function mapQbState(s) {
  if (['downloading', 'stalledDL', 'checkingDL', 'metaDL', 'forcedDL'].includes(s)) return 'downloading';
  if (['uploading', 'stalledUP', 'forcedUP'].includes(s)) return 'seeding';
  if (['pausedDL', 'pausedUP', 'stoppedDL', 'stoppedUP'].includes(s)) return 'paused';
  if (['queuedDL', 'queuedUP'].includes(s)) return 'queued';
  if (s === 'error' || s === 'missingFiles') return 'error';
  return 'queued';
}

function mapQbTorrent(t) {
  const dlSpeed = t.dlspeed > 0 ? `${(t.dlspeed / 1048576).toFixed(1)} MB/s` : '0 B/s';
  const ulSpeed = t.upspeed > 0 ? `${(t.upspeed / 1048576).toFixed(1)} MB/s` : '0 B/s';
  const size = t.size > 1e9 ? `${(t.size / 1e9).toFixed(1)} GB` : t.size > 1e6 ? `${(t.size / 1e6).toFixed(0)} MB` : `${t.size} B`;
  const eta = t.eta === 8640000 || t.eta < 0 ? '∞' : t.eta > 3600 ? `${Math.floor(t.eta / 3600)}h` : t.eta > 60 ? `${Math.floor(t.eta / 60)}m` : `${t.eta}s`;
  return {
    id: t.hash, hash: t.hash, name: t.name, size,
    progress: t.progress * 100, status: mapQbState(t.state),
    seeds: t.num_seeds, peers: t.num_leechs,
    dlSpeed, ulSpeed, eta,
    ratio: t.ratio, category: t.category || 'Other',
    added: new Date(t.added_on * 1000).toLocaleDateString(),
    savePath: t.save_path,
  };
}

function SettingsPanel({ notify }) {
  const [section, setSection] = useState("Downloads");
  const [s, setS] = useState(loadSettings);
  const [dirty, setDirty] = useState(false);

  const set = (key, val) => { setS(prev => ({ ...prev, [key]: val })); setDirty(true); };

  const save = () => {
    try { localStorage.setItem("nexus_settings", JSON.stringify(s)); } catch {}
    setDirty(false);
    notify("Settings saved successfully");
  };

  const reset = () => {
    setS({ ...DEFAULTS });
    try { localStorage.removeItem("nexus_settings"); } catch {}
    setDirty(false);
    notify("Settings reset to defaults");
  };

  const Field = ({ label, k, type = "text", options }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      {options ? (
        <select className="input-field" style={{ maxWidth: 400 }} value={s[k]} onChange={e => set(k, e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "toggle" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => set(k, !s[k])} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "all 0.3s", position: "relative",
            background: s[k] ? "var(--cyan)" : "var(--border2)", border: "1px solid", borderColor: s[k] ? "var(--cyan)" : "var(--border)",
            boxShadow: s[k] ? "0 0 12px rgba(0,229,255,0.4)" : "none"
          }}>
            <div style={{ position: "absolute", top: 2, left: s[k] ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: s[k] ? "#020408" : "var(--text3)", transition: "left 0.3s" }} />
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: s[k] ? "var(--cyan)" : "var(--text3)" }}>{s[k] ? "ENABLED" : "DISABLED"}</span>
        </div>
      ) : (
        <input className="input-field" type={type} style={{ maxWidth: 400 }} value={s[k]} onChange={e => set(k, e.target.value)} />
      )}
    </div>
  );

  const sections = {
    Downloads: (
      <>
        <Field label="USE CATEGORY-BASED SAVE PATHS" k="useCategories" type="toggle" />
        <div style={{ marginBottom: 8, marginTop: 4, fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>
          When enabled, each category saves to its own folder. Falls back to default path if not set.
        </div>
        <div style={{ background: "rgba(0,229,255,0.04)", border: "1px solid var(--border2)", padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", letterSpacing: 1, marginBottom: 12 }}>CATEGORY PATHS</div>
          <Field label="📺  TV SHOWS" k="tvPath" />
          <Field label="🎬  MOVIES" k="moviesPath" />
          <Field label="🎵  MUSIC" k="musicPath" />
          <Field label="💾  SOFTWARE" k="softwarePath" />
        </div>
        <Field label="DEFAULT PATH (fallback / uncategorized)" k="downloadPath" />
        <div style={{ height: 1, background: "var(--border2)", margin: "16px 0" }} />
        <Field label="MAX DOWNLOAD SPEED (0 = unlimited KB/s)" k="maxDlSpeed" />
        <Field label="MAX UPLOAD SPEED (0 = unlimited KB/s)" k="maxUlSpeed" />
        <Field label="MAX ACTIVE TORRENTS" k="maxActive" />
        <Field label="MAX ACTIVE DOWNLOADS" k="maxDownloads" />
        <Field label="GLOBAL MAX SHARE RATIO (0 = unlimited)" k="globalMaxRatio" />
        <Field label="SEEDING TIME LIMIT (minutes, 0 = unlimited)" k="seedingTimeLimit" />
      </>
    ),
    Connection: (
      <>
        <div style={{ marginBottom: 8, fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", letterSpacing: 1 }}>NEXUS LOGIN (qBittorrent Web UI credentials)</div>
        <Field label="USERNAME" k="qbUser" />
        <Field label="PASSWORD" k="qbPass" />
        <div style={{ height: 1, background: "var(--border2)", margin: "12px 0" }} />
        <Field label="LISTENING PORT" k="port" />
        <Field label="ENCRYPTION MODE" k="encryption" options={["enabled", "forced", "disabled"]} />
        <div style={{ marginBottom: 8, fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", letterSpacing: 1 }}>PROTOCOL SETTINGS</div>
        <Field label="DHT (DISTRIBUTED HASH TABLE)" k="dhtEnabled" type="toggle" />
        <Field label="PEER EXCHANGE (PEX)" k="pexEnabled" type="toggle" />
        <Field label="LOCAL SERVICE DISCOVERY (LSD)" k="lsdEnabled" type="toggle" />
        <div style={{ marginTop: 16, marginBottom: 8, fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", letterSpacing: 1 }}>PROXY</div>
        <Field label="PROXY TYPE" k="proxyType" options={["None", "HTTP", "SOCKS5", "SOCKS4"]} />
        {s.proxyType !== "None" && <>
          <Field label="PROXY HOST" k="proxyHost" />
          <Field label="PROXY PORT" k="proxyPort" />
        </>}
      </>
    ),
    Speed: (
      <>
        <div style={{ padding: 16, background: "rgba(0,229,255,0.04)", border: "1px solid var(--border2)", marginBottom: 20, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text2)" }}>
          Current: ↓ 26.0 MB/s &nbsp; ↑ 7.6 MB/s
        </div>
        <Field label="MAX GLOBAL DOWNLOAD SPEED (KB/s, 0 = unlimited)" k="maxDlSpeed" />
        <Field label="MAX GLOBAL UPLOAD SPEED (KB/s, 0 = unlimited)" k="maxUlSpeed" />
        <Field label="MAX ACTIVE TORRENTS" k="maxActive" />
        <Field label="MAX ACTIVE DOWNLOADS" k="maxDownloads" />
      </>
    ),
    BitTorrent: (
      <>
        <Field label="DHT ENABLED" k="dhtEnabled" type="toggle" />
        <Field label="PEER EXCHANGE (PEX)" k="pexEnabled" type="toggle" />
        <Field label="LOCAL SERVICE DISCOVERY" k="lsdEnabled" type="toggle" />
        <Field label="ENCRYPTION" k="encryption" options={["enabled", "forced", "disabled"]} />
        <Field label="GLOBAL MAX SHARE RATIO" k="globalMaxRatio" />
        <Field label="SEEDING TIME LIMIT (minutes)" k="seedingTimeLimit" />
      </>
    ),
    RSS: (
      <>
        <div style={{ padding: 16, background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.2)", marginBottom: 20, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text2)" }}>
          ⚡ RSS auto-download always grabs the latest episode at the highest available resolution matching your per-feed quality settings.
        </div>
        <Field label="REFRESH INTERVAL (minutes)" k="rssRefreshInterval" />
        <Field label="MAX ITEMS PER FEED" k="rssMaxItems" />
        <div style={{ marginTop: 16, marginBottom: 8, fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", letterSpacing: 1 }}>API KEY FOR AI SEARCH</div>
        <Field label="ANTHROPIC API KEY (for Search tab)" k="apiKey" type="password" />
        {s.apiKey && <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--green)", marginTop: -8, marginBottom: 16 }}>✓ API key set — Search is enabled</div>}
      </>
    ),
    Advanced: (
      <>
        <Field label="THEME" k="theme" options={["dark", "darker", "darkest"]} />
        <Field label="LANGUAGE" k="language" options={["English", "Spanish", "French", "German", "Japanese", "Chinese"]} />
        <Field label="START MINIMIZED" k="startMinimized" type="toggle" />
        <Field label="CLOSE TO TRAY" k="closeToTray" type="toggle" />
        <Field label="START ON BOOT" k="startOnBoot" type="toggle" />
        <div style={{ marginTop: 24, padding: 16, border: "1px solid rgba(255,43,85,0.3)", background: "rgba(255,43,85,0.05)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--red)", marginBottom: 10 }}>DANGER ZONE</div>
          <button className="btn btn-danger" onClick={() => { reset(); }}>RESET ALL SETTINGS TO DEFAULTS</button>
        </div>
      </>
    ),
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontFamily: "var(--display)", fontSize: 12, color: "var(--text3)", letterSpacing: 2 }}>PREFERENCES</div>
        {Object.keys(sections).map(sec => (
          <div key={sec}
            onClick={() => setSection(sec)}
            style={{ padding: "12px 20px", fontFamily: "var(--body)", fontSize: 16, cursor: "pointer", transition: "all 0.15s",
              color: section === sec ? "var(--cyan)" : "var(--text2)",
              borderLeft: `3px solid ${section === sec ? "var(--cyan)" : "transparent"}`,
              background: section === sec ? "rgba(0,229,255,0.06)" : "transparent",
              textShadow: section === sec ? "0 0 8px var(--cyan)" : "none"
            }}>
            {sec}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        {dirty && (
          <div style={{ padding: 12, borderTop: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--orange)", textAlign: "center" }}>
            ● UNSAVED CHANGES
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 16, color: "var(--cyan)", letterSpacing: 2, textShadow: "0 0 8px var(--cyan)" }}>
            {section.toUpperCase()} SETTINGS
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={reset}>RESET DEFAULTS</button>
            <button className={`btn ${dirty ? "btn-primary" : ""}`} onClick={save}>{dirty ? "● SAVE CHANGES" : "SAVE CHANGES"}</button>
          </div>
        </div>
        <div style={{ maxWidth: 520 }}>
          {sections[section]}
        </div>
      </div>
    </div>
  );
}

function SearchTab({ onAddTorrent }) {
  const ENGINES = [
    { id: "eztv",         name: "EZTV",           url: "https://eztvx.to/",               color: "#00e5ff", specialty: "TV Shows" },
    { id: "tpb",          name: "The Pirate Bay",  url: "https://thepiratebay.org",        color: "#00ff9d", specialty: "All" },
    { id: "yts",          name: "YTS",             url: "https://yts.lt/",                 color: "#ffd700", specialty: "Movies" },
    { id: "limetorrents", name: "LimeTorrents",    url: "https://www.limetorrents.lol",    color: "#00e5ff", specialty: "All" },
    { id: "solidtorrents",name: "Solid Torrents",  url: "https://solidtorrents.to",        color: "#00ff9d", specialty: "All" },
    { id: "torlock",      name: "TorLock",         url: "https://www.torlock.com",         color: "#ff6b2b", specialty: "All" },
    { id: "torrentdl",   name: "TorrentDownloads", url: "https://torrentdownloads.pro",    color: "#7aafc9", specialty: "All" },
    { id: "torrent9",     name: "Torrent9",        url: "http://torent9.fr",               color: "#ffd700", specialty: "Movies/TV" },
    { id: "torrentproject", name: "TorrentProject",url: "https://torrentproject.com.se",   color: "#00e5ff", specialty: "All" },
    { id: "torrentcsv",   name: "Torrents-CSV",    url: "https://torrents-csv.com",        color: "#00ff9d", specialty: "All" },
    { id: "kickass",      name: "KickassTorrents", url: "https://katcr.to/",               color: "#ff6b2b", specialty: "All" },
    { id: "yourbittorrent",name:"YourBitTorrent",  url: "https://yourbittorrent.com/",     color: "#7aafc9", specialty: "All" },
    { id: "traht",        name: "Traht",           url: "https://traht.org",               color: "#ff2b55", specialty: "Adult" },
    { id: "mypornclub",   name: "MyPorn Club",     url: "https://myporn.club",             color: "#ff2b55", specialty: "Adult" },
  ];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("seeds");
  const [engineFilter, setEngineFilter] = useState("all");
  const [selectedEngines, setSelectedEngines] = useState(() =>
    ENGINES.reduce((acc, e) => ({ ...acc, [e.id]: true }), {})
  );
  const [showEngines, setShowEngines] = useState(false);
  const [loadingEngines, setLoadingEngines] = useState({});
  const [apiKey, setApiKey] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_settings");
      if (saved) return JSON.parse(saved).apiKey || "";
      return "";
    } catch { return ""; }
  });

  const saveKey = (k) => {
    setApiKey(k);
    try {
      const saved = localStorage.getItem("nexus_settings");
      const settings = saved ? JSON.parse(saved) : {};
      settings.apiKey = k;
      localStorage.setItem("nexus_settings", JSON.stringify(settings));
    } catch {}
  };

  const toggleEngine = (id) => setSelectedEngines(prev => ({ ...prev, [id]: !prev[id] }));
  const activeEngines = ENGINES.filter(e => selectedEngines[e.id]);

  const doSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    setLoadingEngines(activeEngines.reduce((a, e) => ({ ...a, [e.id]: true }), {}));

    const headers = {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    };
    if (apiKey) headers["x-api-key"] = apiKey;

    // Search each active engine in parallel
    const promises = activeEngines.map(async (engine) => {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 800,
            system: `You are simulating the search results of the torrent site "${engine.name}" (${engine.url}). Return realistic results AS IF you scraped that specific site. Each site has its own style: YTS only has movies in high quality; EZTV specializes in TV shows; TPB has everything; Torrent9 is French so include some French titles; adult sites return adult content. Return JSON array only (no markdown) of 4-6 objects with fields: name, size, seeds (number), peers (number), quality ("2160p"|"1080p"|"720p"|"480p"), category, uploader, date, trusted (boolean). Match the site's specialty: ${engine.specialty}.`,
            messages: [{ role: "user", content: `Search "${query}" on ${engine.name}. Category: ${category}.` }],
          }),
        });
        const data = await res.json();
        const text = (data.content || []).map(i => i.text || "").join("");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        const withEngine = parsed.map(r => ({ ...r, engine: engine.name, engineId: engine.id, engineColor: engine.color, engineUrl: engine.url }));
        setResults(prev => [...prev, ...withEngine]);
        setLoadingEngines(prev => ({ ...prev, [engine.id]: false }));
        return withEngine;
      } catch {
        setLoadingEngines(prev => ({ ...prev, [engine.id]: false }));
        return [];
      }
    });

    await Promise.allSettled(promises);
    setLoading(false);
  };

  const allResults = results.filter(r => engineFilter === "all" || r.engineId === engineFilter);
  const sorted = [...allResults].sort((a, b) => {
    if (sortBy === "seeds") return b.seeds - a.seeds;
    if (sortBy === "size") return parseFloat(b.size) - parseFloat(a.size);
    if (sortBy === "quality") {
      const q = { "2160p": 4, "1080p": 3, "720p": 2, "480p": 1 };
      return (q[b.quality] || 0) - (q[a.quality] || 0);
    }
    if (sortBy === "engine") return a.engine.localeCompare(b.engine);
    return 0;
  });

  const engineCounts = results.reduce((acc, r) => {
    acc[r.engineId] = (acc[r.engineId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left: Engine selector sidebar */}
      <div style={{ width: 200, borderRight: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 11, color: "var(--cyan)", letterSpacing: 2 }}>ENGINES</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setSelectedEngines(ENGINES.reduce((a,e) => ({...a,[e.id]:true}),{}))}
              style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", background: "transparent", border: "none", cursor: "pointer" }}>ALL</button>
            <button onClick={() => setSelectedEngines(ENGINES.reduce((a,e) => ({...a,[e.id]:false}),{}))}
              style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", background: "transparent", border: "none", cursor: "pointer" }}>NONE</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {ENGINES.map(e => {
            const isLoading = loadingEngines[e.id];
            const count = engineCounts[e.id];
            return (
              <div key={e.id}
                onClick={() => toggleEngine(e.id)}
                style={{
                  padding: "8px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s",
                  background: selectedEngines[e.id] ? "rgba(0,229,255,0.04)" : "transparent",
                  opacity: selectedEngines[e.id] ? 1 : 0.4,
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = "rgba(0,229,255,0.07)"}
                onMouseLeave={ev => ev.currentTarget.style.background = selectedEngines[e.id] ? "rgba(0,229,255,0.04)" : "transparent"}
              >
                <div style={{ width: 10, height: 10, borderRadius: 2, background: selectedEngines[e.id] ? e.color : "var(--border2)", flexShrink: 0, boxShadow: selectedEngines[e.id] ? `0 0 6px ${e.color}` : "none", transition: "all 0.2s" }} />
                <span style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</span>
                {isLoading && <div style={{ width: 10, height: 10, border: "1.5px solid var(--border2)", borderTop: `1.5px solid ${e.color}`, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />}
                {!isLoading && count > 0 && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: e.color, background: `${e.color}18`, border: `1px solid ${e.color}44`, padding: "1px 5px", borderRadius: 2, flexShrink: 0 }}>{count}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
          {activeEngines.length}/{ENGINES.length} ACTIVE
        </div>
      </div>

      {/* Right: Search + Results */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Search bar */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border2)", background: "var(--bg2)", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input className="input-field" type="password" placeholder="Anthropic API Key (sk-ant-...)  —  get free at console.anthropic.com" value={apiKey} onChange={e => saveKey(e.target.value)} style={{ flex: 1, fontSize: 13, opacity: apiKey ? 0.7 : 1, color: apiKey ? "var(--green)" : undefined }} />
            {apiKey && <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)", alignSelf: "center", padding: "0 8px", whiteSpace: "nowrap" }}>✓ KEY ACTIVE</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input-field" style={{ flex: 1, fontSize: 15 }}
              placeholder={`Search across ${activeEngines.length} engines...`}
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch()} />
            <select className="input-field" style={{ width: 130 }} value={category} onChange={e => setCategory(e.target.value)}>
              {["All","Movies","TV Shows","Software","Music","Games","Books","Adult"].map(o => <option key={o}>{o}</option>)}
            </select>
            <button className="btn btn-primary" onClick={doSearch} disabled={loading || !query.trim()}>
              {loading ? `SCANNING ${Object.values(loadingEngines).filter(Boolean).length}...` : "⌕ SEARCH ALL"}
            </button>
          </div>
        </div>

        {/* Engine filter tabs */}
        {searched && results.length > 0 && (
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", background: "var(--bg2)", overflowX: "auto", flexShrink: 0, padding: "0 8px" }}>
            <button className={`tab-btn ${engineFilter === "all" ? "active" : ""}`} onClick={() => setEngineFilter("all")}>
              ALL ({results.length})
            </button>
            {ENGINES.filter(e => engineCounts[e.id]).map(e => (
              <button key={e.id} onClick={() => setEngineFilter(engineFilter === e.id ? "all" : e.id)}
                style={{
                  fontFamily: "var(--display)", fontSize: 10, letterSpacing: 1, padding: "8px 14px",
                  background: "transparent", border: "none", cursor: "pointer", transition: "all 0.2s",
                  color: engineFilter === e.id ? e.color : "var(--text3)",
                  borderBottom: engineFilter === e.id ? `2px solid ${e.color}` : "2px solid transparent",
                  textShadow: engineFilter === e.id ? `0 0 8px ${e.color}` : "none",
                  whiteSpace: "nowrap",
                }}>
                {e.name} ({engineCounts[e.id]})
              </button>
            ))}
            {Object.values(loadingEngines).some(Boolean) && (
              <span style={{ alignSelf: "center", marginLeft: 8, fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyan)" }}>
                <span style={{ animation: "blink 1s infinite" }}>●</span> SCANNING...
              </span>
            )}
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && results.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 20 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 400 }}>
                {activeEngines.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 11, color: loadingEngines[e.id] ? e.color : "var(--text3)" }}>
                    {loadingEngines[e.id]
                      ? <div style={{ width: 8, height: 8, border: `1.5px solid ${e.color}88`, borderTop: `1.5px solid ${e.color}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      : <span style={{ color: "var(--green)" }}>✓</span>
                    }
                    {e.name}
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "var(--display)", fontSize: 13, color: "var(--cyan)", letterSpacing: 3 }}>QUERYING {activeEngines.length} ENGINES...</div>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 36, color: "var(--border2)" }}>✕</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 15, color: "var(--text3)", letterSpacing: 2 }}>NO RESULTS — CHECK API KEY</div>
            </div>
          )}

          {sorted.length > 0 && (
            <>
              <div style={{ padding: "6px 16px", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.3)", display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", marginRight: 6 }}>SORT:</span>
                {[["seeds","SEEDS"],["size","SIZE"],["quality","QUALITY"],["engine","ENGINE"]].map(([k,label]) => (
                  <button key={k} onClick={() => setSortBy(k)} style={{
                    fontFamily: "var(--mono)", fontSize: 12, padding: "3px 10px",
                    background: sortBy === k ? "rgba(0,229,255,0.12)" : "transparent",
                    border: `1px solid ${sortBy === k ? "var(--cyan)" : "var(--border)"}`,
                    color: sortBy === k ? "var(--cyan)" : "var(--text3)", cursor: "pointer",
                  }}>{label}</button>
                ))}
                <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>
                  {sorted.length} RESULTS · "{query.toUpperCase()}"
                </span>
              </div>

              <div style={{ padding: "5px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 100px 70px 60px 70px 70px 70px 110px", gap: 8, background: "rgba(0,229,255,0.03)" }}>
                {["NAME", "ENGINE", "SIZE", "SEEDS", "PEERS", "QUALITY", "DATE", ""].map(h => (
                  <div key={h} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 1.5, color: "var(--text3)" }}>{h}</div>
                ))}
              </div>

              {sorted.map((r, i) => (
                <div key={i}
                  style={{ padding: "9px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 100px 70px 60px 60px 70px 70px 110px", gap: 8, alignItems: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `${r.engineColor}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {r.trusted && <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", border: "1px solid var(--green)", padding: "1px 4px", flexShrink: 0 }}>✓</span>}
                      <span style={{ fontFamily: "var(--body)", fontSize: 15, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{r.category} · {r.uploader}</div>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: r.engineColor, background: `${r.engineColor}12`, border: `1px solid ${r.engineColor}33`, padding: "2px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.engine}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text2)" }}>{r.size}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: r.seeds > 100 ? "var(--green)" : r.seeds > 10 ? "var(--yellow)" : "var(--red)" }}>▲ {r.seeds}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)" }}>▼ {r.peers}</div>
                  <div><QualityBadge quality={r.quality} /></div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>{r.date}</div>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: "4px 10px" }}
                    onClick={() => {
                      const searchUrl = `${r.engineUrl}/search/?q=${encodeURIComponent(r.name)}`;
                      window.open(searchUrl, "_blank");
                    }}
                    title="Open on torrent site to grab magnet link">
                    ↗ SITE
                  </button>
                </div>
              ))}
            </>
          )}

          {!searched && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 20, opacity: 0.5 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 380 }}>
                {ENGINES.map(e => (
                  <span key={e.id} style={{ fontFamily: "var(--mono)", fontSize: 11, color: e.color, background: `${e.color}12`, border: `1px solid ${e.color}33`, padding: "3px 8px" }}>{e.name}</span>
                ))}
              </div>
              <div style={{ fontFamily: "var(--display)", fontSize: 13, color: "var(--text3)", letterSpacing: 3 }}>SELECT ENGINES · ENTER QUERY</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function AddFeedModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [minQuality, setMinQuality] = useState("any");
  const [autoDownload, setAutoDownload] = useState(true);
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) { setError("Feed name is required"); return; }
    if (!url.trim()) { setError("Feed URL is required"); return; }
    if (!url.startsWith("http")) { setError("URL must start with http:// or https://"); return; }
    onAdd({ id: Date.now(), name: name.trim(), url: url.trim(), minQuality, autoDownload, active: true, lastUpdate: "just now", items: 0, filterPattern: ".*" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="neon-border-active corner-cut-lg animate-float-up" style={{ background: "var(--bg2)", padding: 28, width: 500, maxWidth: "95vw" }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 16, color: "var(--cyan)", letterSpacing: 2, marginBottom: 20, textShadow: "0 0 10px var(--cyan)" }}>
          ADD RSS FEED
        </div>

        {error && (
          <div style={{ marginBottom: 14, padding: "8px 12px", background: "rgba(255,43,85,0.1)", border: "1px solid var(--red)", fontFamily: "var(--mono)", fontSize: 13, color: "var(--red)" }}>
            ✕ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>FEED NAME *</div>
            <input className="input-field" placeholder="e.g. EZTV HD Shows" value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              autoFocus />
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>FEED URL *</div>
            <input className="input-field" placeholder="https://eztvx.to/feed/" value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>MINIMUM QUALITY FOR AUTO-DOWNLOAD</div>
            <select className="input-field" value={minQuality} onChange={e => setMinQuality(e.target.value)}>
              <option value="any">Any quality (recommended)</option>
              <option value="720p">720p+ HD minimum</option>
              <option value="1080p">1080p+ Full HD minimum</option>
              <option value="2160p">2160p+ 4K UHD minimum</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(0,229,255,0.04)", border: "1px solid var(--border2)" }}>
            <div onClick={() => setAutoDownload(v => !v)} style={{
              width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "all 0.3s", position: "relative", flexShrink: 0,
              background: autoDownload ? "var(--cyan)" : "var(--border2)",
              boxShadow: autoDownload ? "0 0 12px rgba(0,229,255,0.5)" : "none",
            }}>
              <div style={{ position: "absolute", top: 3, left: autoDownload ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: autoDownload ? "#020408" : "var(--text3)", transition: "left 0.3s" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: autoDownload ? "var(--cyan)" : "var(--text3)" }}>
                {autoDownload ? "AUTO-DOWNLOAD ENABLED" : "AUTO-DOWNLOAD DISABLED"}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                Automatically grab latest episodes at {minQuality}+
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>CANCEL</button>
          <button className="btn btn-primary" onClick={submit}>ADD FEED</button>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: "#020408", color: "#ff2b55", fontFamily: "monospace", padding: 40, height: "100vh", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 20, color: "#00e5ff" }}>NEXUS — RUNTIME ERROR</div>
          <div style={{ fontSize: 14 }}>{String(this.state.error)}</div>
          <button onClick={() => this.setState({ error: null })} style={{ background: "transparent", border: "1px solid #00e5ff", color: "#00e5ff", padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", width: 160 }}>↻ RELOAD APP</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function TorrentClientInner() {
  const [tab, setTab] = useState("torrents");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [detailId, setDetailId] = useState(null);
  const [torrents, setTorrents] = useState([]);
  const [qbConnected, setQbConnected] = useState(null); // null=checking, true/false
  const [needsLogin, setNeedsLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [feeds, setFeeds] = useState([]);
  const [rssItems, setRssItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [magnetUrl, setMagnetUrl] = useState("");
  const [magnetCategory, setMagnetCategory] = useState("");
  const [magnetSavePath, setMagnetSavePath] = useState("");
  const [newFeed, setNewFeed] = useState({ name: "", url: "", minQuality: "any", autoDownload: true });
  const [newRule, setNewRule] = useState({ show: "", quality: "2160p", autoStart: true });
  const [dlData, setDlData] = useState(Array(20).fill(0));
  const [ulData, setUlData] = useState(Array(20).fill(0));
  const [transferInfo, setTransferInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [autoRules, setAutoRules] = useState([]);
  const [detailTab, setDetailTab] = useState("info");



  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = torrents.filter(t => {
    if (filter === "all") return true;
    if (filter === "downloading") return t.status === "downloading";
    if (filter === "seeding") return t.status === "seeding";
    if (filter === "paused") return t.status === "paused" || t.status === "queued";
    if (filter === "tv") return t.category === "TV Shows";
    if (filter === "movies") return t.category === "Movies";
    return true;
  });

  const totalDl = transferInfo ? (transferInfo.dl_info_speed || 0) / 1048576 : 0;
  const totalUl = transferInfo ? (transferInfo.up_info_speed || 0) / 1048576 : 0;
  const selectedTorrent = torrents.find(t => t.id === detailId);

  const getSettings = () => { try { const s = localStorage.getItem("nexus_settings"); return s ? { ...DEFAULTS, ...JSON.parse(s) } : { ...DEFAULTS }; } catch { return { ...DEFAULTS }; } };

  // Live polling — qBittorrent data every 2s
  const pollRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const s = await qbStatus();
      if (cancelled) return;
      setQbConnected(s.ok);
      if (s.needsLogin) setNeedsLogin(true);
      if (s.ok) {
        setNeedsLogin(false);
        const [list, transfer] = await Promise.all([qbList(), qbTransferInfo()]);
        if (cancelled) return;
        if (list) setTorrents(list.map(mapQbTorrent));
        if (transfer) {
          setTransferInfo(transfer);
          const dlMB = (transfer.dl_info_speed || 0) / 1048576;
          const ulMB = (transfer.up_info_speed || 0) / 1048576;
          setDlData(prev => [...prev.slice(1), dlMB]);
          setUlData(prev => [...prev.slice(1), ulMB]);
        }
      }
    };
    pollRef.current = poll;
    poll();
    const interval = setInterval(poll, 2000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  // Instant refresh helper — call after any action
  const refresh = () => pollRef.current?.();

  const addTorrent = async () => {
    if (!magnetUrl) return;
    const settings = getSettings();
    const cat = magnetCategory || (magnetUrl.toLowerCase().includes("s0") ? "TV Shows" : "Other");
    const sp = magnetSavePath || getSavePath(cat, settings);
    if (qbConnected) {
      const res = await qbAdd(magnetUrl, sp, cat);
      if (res?.ok) { notify("Torrent sent to qBittorrent ✓"); setShowAddModal(false); setMagnetUrl(""); setMagnetCategory(""); setMagnetSavePath(""); setTimeout(refresh, 500); setTimeout(refresh, 1500); }
      else { notify(res?.err || "qBittorrent rejected the torrent", "danger"); }
    } else {
      notify("✕ qBittorrent is not running — start it first", "danger");
    }
  };

  const addFeed = () => {
    if (!newFeed.name || !newFeed.url) return;
    setFeeds(prev => [...prev, { ...newFeed, id: Date.now(), active: true, lastUpdate: "just now", items: 0 }]);
    setShowAddFeed(false);
    setNewFeed({ name: "", url: "", minQuality: "any", autoDownload: true });
    notify("RSS Feed added");
  };

  const addRule = () => {
    if (!newRule.show) return;
    setAutoRules(prev => [...prev, { ...newRule, id: Date.now(), enabled: true, lastMatch: "none", feed: "All Feeds" }]);
    setShowAddRule(false);
    setNewRule({ show: "", quality: "2160p", autoStart: true });
    notify("Auto-download rule created");
  };

  // Quality rank helper
  const qualityRank = (q) => ({ "2160p": 4, "1080p": 3, "720p": 2, "480p": 1, "unknown": 2 }[q] || 2);

  // Detect quality from torrent title
  const detectQuality = (title) => {
    if (/2160p|4K|UHD|uhd|2160/i.test(title)) return "2160p";
    if (/1080p|1080i|FHD/i.test(title)) return "1080p";
    if (/720p|720i|HD/i.test(title)) return "720p";
    if (/480p|480i|SD/i.test(title)) return "480p";
    if (/360p|240p/i.test(title)) return "480p";
    return "unknown";
  };

  // Parse RSS XML text into items
  const parseRSS = (xmlText, feedName, feedMinQuality) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, "application/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, 50);
      const parsed = items.map((el, idx) => {
        const title = el.querySelector("title")?.textContent || "Unknown";
        const enclosureEl = el.querySelector("enclosure");
        const sizeBytes = enclosureEl ? parseInt(enclosureEl.getAttribute("length") || "0") : 0;
        const size = sizeBytes > 1e9 ? `${(sizeBytes/1e9).toFixed(1)} GB` : sizeBytes > 1e6 ? `${(sizeBytes/1e6).toFixed(0)} MB` : "Unknown";
        const pubDate = el.querySelector("pubDate")?.textContent || "";
        const quality = detectQuality(title);
        const matched = feedMinQuality === "any" ? true : qualityRank(quality) >= qualityRank(feedMinQuality);
        // Extract magnet/torrent link
        const link = enclosureEl?.getAttribute("url") ||
                     el.querySelector("link")?.textContent ||
                     el.querySelector("torrent > magnetURI")?.textContent ||
                     el.querySelector("magnetURI")?.textContent || "";
        return { id: Date.now() + idx, title, size, feedName, quality, matched, downloaded: false, date: pubDate ? new Date(pubDate).toLocaleDateString() : "Recent", link };
      });
      return parsed;
    } catch { return []; }
  };

  // Fetch a feed via RSS proxy with multiple fallbacks
  const refreshFeed = async (feed) => {
    const encoded = encodeURIComponent(feed.url);
    const proxies = [
      { url: `https://corsproxy.io/?${encoded}`, type: "direct" },
      { url: `https://api.allorigins.win/get?url=${encoded}`, type: "allorigins" },
      { url: `https://api.codetabs.com/v1/proxy?quest=${encoded}`, type: "direct" },
    ];
    let xmlText = null;
    for (const proxy of proxies) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(proxy.url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        if (proxy.type === "allorigins") {
          const json = await res.json();
          if (json.contents && json.contents.includes("<item")) { xmlText = json.contents; break; }
        } else {
          const text = await res.text();
          if (text.includes("<item") || text.includes("<rss") || text.includes("<feed")) { xmlText = text; break; }
        }
      } catch { continue; }
    }
    try {
      if (!xmlText) { notify(`Could not fetch "${feed.name}" — check the URL is a valid RSS feed`, "danger"); return; }
      const items = parseRSS(xmlText, feed.name, feed.minQuality);
      if (items.length === 0) { notify(`No items found in ${feed.name}`, "danger"); return; }

      // Add items to rssItems (deduplicate by title)
      setRssItems(prev => {
        const existingTitles = new Set(prev.map(x => x.title));
        const newItems = items.filter(x => !existingTitles.has(x.title));
        return [...newItems, ...prev];
      });

      // Auto-download matched items
      if (feed.autoDownload) {
        const toDownload = items.filter(x => x.matched);
        if (toDownload.length > 0) {
          // Send each matched item to qBittorrent with correct save path
          let sent = 0;
          for (const x of toDownload) {
            const cat = x.category || "TV Shows";
            const sp = getSavePath(cat, getSettings());
            if (x.link) {
              const res = await qbAdd(x.link, sp, cat);
              if (res?.ok) sent++;
              else if (res?.err && !res.err.includes('webpage')) notify(res.err, "danger");
            }
          }
          setRssItems(prev => prev.map(x => toDownload.find(d => d.title === x.title) ? { ...x, downloaded: true } : x));
          if (sent > 0) { notify(`Auto-sent ${sent}/${toDownload.length} to qBittorrent from ${feed.name}`); setTimeout(refresh, 800); }
          else notify(`${toDownload.length} matched in ${feed.name} but no magnet links found`, "danger");
        } else {
          notify(`Refreshed ${feed.name} — no items matched ${feed.minQuality}+`);
        }
      } else {
        notify(`Refreshed ${feed.name} — ${items.length} items loaded`);
      }

      // Update feed last-update time and item count
      setFeeds(prev => prev.map(f => f.id === feed.id ? { ...f, lastUpdate: "just now", items: items.length } : f));
    } catch (err) {
      notify(`Error processing "${feed.name}": ${err.message}`, "danger");
    }
  };

  const refreshAllFeeds = () => {
    const activeFeeds = feeds.filter(f => f.active);
    if (activeFeeds.length === 0) { notify("No active feeds to refresh", "danger"); return; }
    activeFeeds.forEach(f => refreshFeed(f));
    notify(`Refreshing ${activeFeeds.length} feed(s)...`);
  };

  const toggleTorrent = async (id) => {
    const t = torrents.find(x => x.id === id);
    if (!t) return;
    if (qbConnected && t.hash) {
      if (t.status === "paused") await qbResume(t.hash);
      else await qbPause(t.hash);
      setTimeout(refresh, 400);
    }
    setTorrents(prev => prev.map(x => {
      if (x.id !== id) return x;
      if (x.status === "paused") return { ...x, status: x.progress >= 100 ? "seeding" : "downloading" };
      if (x.status === "downloading" || x.status === "seeding") return { ...x, status: "paused" };
      return x;
    }));
  };

  const deleteTorrent = async (id) => {
    const t = torrents.find(x => x.id === id);
    if (qbConnected && t?.hash) { await qbDelete([t.hash], false); setTimeout(refresh, 400); }
    setTorrents(prev => prev.filter(x => x.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    if (detailId === id) setDetailId(null);
    notify("Torrent removed", "danger");
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const hashes = torrents.filter(t => selected.has(t.id) && t.hash).map(t => t.hash);
    if (qbConnected && hashes.length > 0) { await qbDelete(hashes, false); setTimeout(refresh, 400); }
    setTorrents(prev => prev.filter(t => !selected.has(t.id)));
    if (selected.has(detailId)) setDetailId(null);
    notify(`${selected.size} torrent(s) removed`, "danger");
    setSelected(new Set());
  };

  const pauseSelected = async () => {
    for (const id of selected) {
      const t = torrents.find(x => x.id === id);
      if (!t || !t.hash) continue;
      if (t.status === "paused") await qbResume(t.hash);
      else await qbPause(t.hash);
    }
    setTimeout(refresh, 400);
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(t => t.id)));
    }
  };

  return (
    <div className="scanlines" style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--body)", overflow: "hidden" }}>
      <style>{FONTS + CSS}</style>

      {/* TOP BAR */}
      <div className="grid-bg" style={{ background: "linear-gradient(180deg, #060f1a 0%, var(--bg2) 100%)", borderBottom: "1px solid var(--border2)", padding: "0 16px", display: "flex", alignItems: "center", gap: 16, height: 48, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#00e5ff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px #00e5ff)" }} />
            <polygon points="14,7 21,11 21,19 14,23 7,19 7,11" fill="rgba(0,229,255,0.1)" stroke="#00e5ff" strokeWidth="0.5" />
            <circle cx="14" cy="15" r="3" fill="#00e5ff" style={{ filter: "drop-shadow(0 0 4px #00e5ff)" }} />
            <line x1="14" y1="2" x2="14" y2="7" stroke="#00e5ff" strokeWidth="1" />
            <line x1="14" y1="23" x2="14" y2="28" stroke="#00e5ff" strokeWidth="1" />
          </svg>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 700, color: "#00e5ff", letterSpacing: 3, textShadow: "0 0 12px #00e5ff" }}>NEXUS</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--text3)", letterSpacing: 2 }}>TORRENT CLIENT v4.2.0</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ ADD TORRENT</button>
          <button className="btn btn-success" onClick={() => { setTab("rss"); setShowAddFeed(true); }}>+ RSS FEED</button>
        </div>

        <div style={{ flex: 1 }} />

        {/* Speed stats */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <SpeedGraph data={dlData} color="#00e5ff" />
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)", letterSpacing: 1 }}>▼ DOWNLOAD</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 19, color: "#00e5ff", textShadow: "0 0 8px #00e5ff" }}>
                {totalDl.toFixed(1)} <span style={{ fontSize: 9 }}>MB/s</span>
              </div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "var(--border2)" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <SpeedGraph data={ulData} color="#00ff9d" />
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)", letterSpacing: 1 }}>▲ UPLOAD</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 19, color: "#00ff9d", textShadow: "0 0 8px #00ff9d" }}>
                {totalUl.toFixed(1)} <span style={{ fontSize: 9 }}>MB/s</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 32, background: "var(--border2)" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>ACTIVE TORRENTS</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 21, color: "var(--cyan)", textShadow: "0 0 8px var(--cyan)" }}>
            {torrents.filter(t => t.status === "downloading" || t.status === "seeding").length}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", paddingLeft: 8, flexShrink: 0 }}>
        {[
          { id: "torrents", label: "TORRENTS" },
          { id: "rss", label: "RSS FEEDS" },
          { id: "search", label: "SEARCH" },
          { id: "stats", label: "STATISTICS" },
          { id: "settings", label: "SETTINGS" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {tab === "torrents" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Filter bar */}
            <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "6px 12px", display: "flex", gap: 6, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
              {[
                { id: "all", label: `ALL (${torrents.length})` },
                { id: "downloading", label: `DOWNLOADING (${torrents.filter(t=>t.status==="downloading").length})` },
                { id: "seeding", label: `SEEDING (${torrents.filter(t=>t.status==="seeding").length})` },
                { id: "paused", label: `PAUSED` },
                { id: "tv", label: "TV SHOWS" },
                { id: "movies", label: "MOVIES" },
              ].map(f => (
                <button key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: 15, letterSpacing: 1, padding: "4px 10px",
                    background: filter === f.id ? "rgba(0,229,255,0.12)" : "transparent",
                    border: `1px solid ${filter === f.id ? "var(--cyan)" : "var(--border)"}`,
                    color: filter === f.id ? "var(--cyan)" : "var(--text3)",
                    cursor: "pointer", transition: "all 0.2s",
                    textShadow: filter === f.id ? "0 0 6px var(--cyan)" : "none"
                  }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Bulk action toolbar */}
            {selected.size > 0 && (
              <div style={{ background: "rgba(0,229,255,0.08)", borderBottom: "1px solid var(--cyan)", padding: "6px 12px", display: "flex", gap: 10, alignItems: "center", flexShrink: 0, boxShadow: "0 0 12px rgba(0,229,255,0.15)" }}>
                <span style={{ fontFamily: "var(--display)", fontSize: 12, color: "var(--cyan)", letterSpacing: 1 }}>{selected.size} SELECTED</span>
                <div style={{ width: 1, height: 18, background: "var(--border2)" }} />
                <button className="btn" style={{ fontSize: 11, padding: "3px 12px" }} onClick={pauseSelected}>⏸ PAUSE/RESUME</button>
                <button className="btn btn-danger" style={{ fontSize: 11, padding: "3px 12px" }} onClick={deleteSelected}>✕ REMOVE {selected.size}</button>
                <button className="btn" style={{ fontSize: 11, padding: "3px 10px" }} onClick={() => setSelected(new Set())}>DESELECT ALL</button>
              </div>
            )}

            {/* Torrent table header */}
            <div style={{ background: "rgba(0,229,255,0.04)", borderBottom: "1px solid var(--border)", padding: "6px 12px", display: "grid", gridTemplateColumns: "28px 1fr 90px 100px 80px 80px 80px 80px 60px", gap: 8, flexShrink: 0, alignItems: "center" }}>
              <div onClick={selectAll} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 14, height: 14, border: `2px solid ${selected.size > 0 && selected.size === filtered.length ? "var(--cyan)" : "var(--border2)"}`, background: selected.size > 0 && selected.size === filtered.length ? "var(--cyan)" : selected.size > 0 ? "rgba(0,229,255,0.3)" : "transparent", borderRadius: 2, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.size > 0 && <span style={{ fontSize: 9, color: "#020408", fontWeight: 900 }}>✓</span>}
                </div>
              </div>
              {["NAME", "SIZE", "PROGRESS", "STATUS", "SEEDS", "DOWN", "UP", "RATIO"].map(h => (
                <div key={h} style={{ fontFamily: "var(--mono)", fontSize: 15, letterSpacing: 1.5, color: "var(--text3)" }}>{h}</div>
              ))}
            </div>

            {/* Torrent list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map(t => (
                <div key={t.id}
                  className="animate-slide-in"
                  onClick={() => setDetailId(t.id === detailId ? null : t.id)}
                  style={{
                    padding: "10px 12px", borderBottom: "1px solid var(--border)",
                    background: selected.has(t.id) ? "rgba(0,229,255,0.08)" : detailId === t.id ? "rgba(0,229,255,0.04)" : "transparent",
                    borderLeft: `3px solid ${selected.has(t.id) ? "var(--cyan)" : detailId === t.id ? "rgba(0,229,255,0.5)" : "transparent"}`,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "grid", gridTemplateColumns: "28px 1fr 90px 100px 80px 80px 80px 80px 60px",
                    gap: 8, alignItems: "center",
                  }}
                  onMouseEnter={e => { if (!selected.has(t.id) && detailId !== t.id) e.currentTarget.style.background = "rgba(0,229,255,0.03)"; }}
                  onMouseLeave={e => { if (!selected.has(t.id) && detailId !== t.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div onClick={e => toggleSelect(t.id, e)} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 4px" }}>
                    <div style={{ width: 14, height: 14, border: `2px solid ${selected.has(t.id) ? "var(--cyan)" : "var(--border2)"}`, background: selected.has(t.id) ? "var(--cyan)" : "transparent", borderRadius: 2, transition: "all 0.15s", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selected.has(t.id) && <span style={{ fontSize: 9, color: "#020408", fontWeight: 900, lineHeight: 1 }}>✓</span>}
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--body)", fontSize: 19, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)", marginTop: 2 }}>{t.category} • {t.added}</div>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 17, color: "var(--text2)" }}>{t.size}</div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: t.progress >= 100 ? "var(--green)" : "var(--cyan)" }}>{t.progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${t.progress}%`, background: t.progress >= 100 ? "linear-gradient(90deg, var(--green2), var(--green))" : undefined }} />
                    </div>
                  </div>
                  <div><StatusBadge status={t.status} /></div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 17, color: "var(--text2)" }}>{t.seeds}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 17, color: t.status === "downloading" ? "var(--cyan)" : "var(--text3)" }}>{t.dlSpeed}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 17, color: t.status === "seeding" ? "var(--green)" : "var(--text3)" }}>{t.ulSpeed}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 17, color: t.ratio > 1 ? "var(--green)" : "var(--text2)" }}>{t.ratio.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selectedTorrent && detailId && (
              <div style={{ height: 200, borderTop: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 12px", alignItems: "center", gap: 4 }}>
                  {["info", "trackers", "peers", "files"].map(dt => (
                    <button key={dt} className={`tab-btn ${detailTab === dt ? "active" : ""}`} style={{ fontSize: 15, padding: "6px 12px" }} onClick={() => setDetailTab(dt)}>
                      {dt.toUpperCase()}
                    </button>
                  ))}
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => { toggleTorrent(selectedTorrent.id); }}>
                      {selectedTorrent.status === "paused" ? "▶ RESUME" : "⏸ PAUSE"}
                    </button>
                    <button className="btn btn-danger" onClick={() => { deleteTorrent(selectedTorrent.id); setDetailId(null); }}>✕ REMOVE</button>
                  </div>
                </div>
                {detailTab === "info" && (
                  <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, overflowY: "auto" }}>
                    {[
                      ["HASH", selectedTorrent.hash],
                      ["SIZE", selectedTorrent.size],
                      ["PROGRESS", `${selectedTorrent.progress.toFixed(2)}%`],
                      ["STATUS", selectedTorrent.status.toUpperCase()],
                      ["SEEDS", selectedTorrent.seeds],
                      ["PEERS", selectedTorrent.peers],
                      ["RATIO", selectedTorrent.ratio.toFixed(3)],
                      ["ETA", selectedTorrent.eta],
                      ["CATEGORY", selectedTorrent.category],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1 }}>{k}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>SAVE PATH</div>
                      <div
                        onClick={() => openFolder(selectedTorrent.savePath || getSavePath(selectedTorrent.category, getSettings()), notify)}
                        title="Click to open folder in Explorer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.25)", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,229,255,0.15)"; e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(0,229,255,0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,229,255,0.06)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <span style={{ fontSize: 16 }}>📂</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)" }}>{selectedTorrent.savePath || getSavePath(selectedTorrent.category, getSettings())}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>↗ OPEN</span>
                      </div>
                    </div>
                  </div>
                )}
                {detailTab === "trackers" && (
                  <div style={{ padding: 16, overflowY: "auto", fontFamily: "var(--mono)", fontSize: 12 }}>
                    <div style={{ color: "var(--text3)", marginBottom: 12 }}>Tracker details are loaded directly from qBittorrent.</div>
                    <a href="http://localhost:8080" target="_blank" style={{ color: "var(--cyan)", textDecoration: "none", border: "1px solid rgba(0,229,255,0.3)", padding: "6px 16px", display: "inline-block" }}>
                      ↗ Open qBittorrent Web UI
                    </a>
                  </div>
                )}
                {detailTab === "peers" && (
                  <div style={{ padding: 16, overflowY: "auto", fontFamily: "var(--mono)", fontSize: 12 }}>
                    <div style={{ color: "var(--text3)", marginBottom: 12 }}>
                      <span style={{ color: "var(--cyan)" }}>{selectedTorrent.peers}</span> peers connected · <span style={{ color: "var(--green)" }}>{selectedTorrent.seeds}</span> seeds
                    </div>
                    <div style={{ color: "var(--text3)", marginBottom: 12 }}>Full peer list available in qBittorrent.</div>
                    <a href="http://localhost:8080" target="_blank" style={{ color: "var(--cyan)", textDecoration: "none", border: "1px solid rgba(0,229,255,0.3)", padding: "6px 16px", display: "inline-block" }}>
                      ↗ Open qBittorrent Web UI
                    </a>
                  </div>
                )}
                {detailTab === "files" && (
                  <div style={{ padding: 12, overflowY: "auto" }}>
                    <div style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 12 }}>🎬</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 17, color: "var(--text)", flex: 1 }}>{selectedTorrent.name}.mkv</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--text3)" }}>{selectedTorrent.size}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "rss" && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Feeds sidebar */}
            <div style={{ width: 280, borderRight: "1px solid var(--border2)", display: "flex", flexDirection: "column", background: "var(--bg2)", flexShrink: 0 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 14, color: "var(--cyan)", letterSpacing: 2 }}>RSS FEEDS</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn" style={{ fontSize: 11, padding: "3px 8px" }} onClick={refreshAllFeeds} title="Refresh all active feeds">↻ ALL</button>
                  <button className="btn btn-primary" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setShowAddFeed(true)}>+ ADD</button>
                </div>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {feeds.map(f => (
                  <div key={f.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}>
                    <div style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span className="status-dot animate-pulse-glow" style={{ background: f.active ? "var(--green)" : "var(--text3)" }} />
                        <span style={{ fontFamily: "var(--body)", fontSize: 16, fontWeight: 600, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                        {f.autoDownload && (
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", border: "1px solid var(--cyan)", padding: "1px 5px", flexShrink: 0 }}>AUTO</span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.url}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>{f.items} items</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>MIN:</span>
                          <select
                            value={f.minQuality}
                            onClick={e => e.stopPropagation()}
                            onChange={e => { e.stopPropagation(); setFeeds(prev => prev.map(x => x.id === f.id ? { ...x, minQuality: e.target.value } : x)); }}
                            style={{ fontFamily: "var(--mono)", fontSize: 11, background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--cyan)", padding: "1px 4px", cursor: "pointer" }}
                          >
                            <option value="any">ANY</option>
                            <option value="720p">720p+</option>
                            <option value="1080p">1080p+</option>
                            <option value="2160p">2160p+</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); refreshFeed(f); }}
                            style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.3)", padding: "3px 8px", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,229,255,0.18)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,229,255,0.06)"; }}
                          >↻</button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFeeds(prev => prev.filter(x => x.id !== f.id)); notify("Feed removed", "danger"); }}
                            style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)", background: "rgba(255,43,85,0.06)", border: "1px solid rgba(255,43,85,0.3)", padding: "3px 8px", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,43,85,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,43,85,0.06)"; }}
                          >✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {feeds.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)" }}>No feeds yet.<br/>Click + ADD to get started.</div>
                )}
              </div>
            </div>

            {/* RSS main area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Auto-download rules */}
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border2)", background: "rgba(0,229,255,0.03)", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: 17, color: "var(--cyan)", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--green)", animation: "pulse-glow 2s infinite" }}>⚡</span>
                    AUTO-DOWNLOAD RULES
                    <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}> — LATEST EPISODE AT HIGHEST RESOLUTION</span>
                  </div>
                  <button className="btn btn-success" style={{ fontSize: 15, padding: "4px 10px" }} onClick={() => setShowAddRule(true)}>+ NEW RULE</button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {autoRules.map(rule => (
                    <div key={rule.id} className="neon-border corner-cut" style={{ padding: "8px 14px", background: rule.enabled ? "rgba(0,255,157,0.05)" : "rgba(255,255,255,0.02)", minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span className="status-dot" style={{ background: rule.enabled ? "var(--green)" : "var(--text3)" }} />
                        <span style={{ fontFamily: "var(--body)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{rule.show}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <QualityBadge quality={rule.quality} />
                        <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>Latest: {rule.lastMatch}</span>
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)", marginTop: 4 }}>{rule.feed}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RSS items feed */}
              <div style={{ flex: 1, overflowY: "auto", padding: 0 }}>
                <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: 15, color: "var(--text3)", letterSpacing: 2 }}>
                    FEED ITEMS — {rssItems.length} TOTAL
                  </div>
                  {rssItems.length > 0 && (
                    <button className="btn btn-danger" style={{ fontSize: 11, padding: "3px 10px" }}
                      onClick={() => { setRssItems([]); notify("All feed items cleared", "danger"); }}>
                      CLEAR ALL
                    </button>
                  )}
                </div>
                {rssItems.length === 0 && (
                  <div style={{ padding: 40, textAlign: "center", fontFamily: "var(--mono)", fontSize: 14, color: "var(--text3)" }}>
                    No feed items yet.<br/>Add a feed and click REFRESH to populate.
                  </div>
                )}
                {rssItems.map(item => (
                  <div key={item.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--body)", fontSize: 16, color: item.matched ? "var(--text)" : "var(--text3)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>{item.feedName}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>{item.size}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>{item.date}</span>
                      </div>
                    </div>
                    <QualityBadge quality={item.quality} />
                    {item.matched ? (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)", border: "1px solid var(--green)", padding: "2px 6px", whiteSpace: "nowrap" }}>✓ MATCHED</span>
                    ) : (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", border: "1px solid var(--border)", padding: "2px 6px", whiteSpace: "nowrap" }}>NO MATCH</span>
                    )}
                    {item.downloaded ? (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", padding: "2px 6px", background: "rgba(0,229,255,0.1)", whiteSpace: "nowrap" }}>⬇ AUTO DL</span>
                    ) : item.matched ? (
                      <button className="btn btn-primary" style={{ fontSize: 12, padding: "3px 10px", whiteSpace: "nowrap" }}
                        onClick={async () => {
                          const _cat = item.category || "TV Shows";
                          const sp = getSavePath(_cat, getSettings());
                          if (item.link) {
                            const res = await qbAdd(item.link, sp, _cat);
                            if (res?.ok) {
                              setRssItems(prev => prev.map(x => x.id === item.id ? { ...x, downloaded: true } : x));
                              notify(`Sent to qBittorrent → ${sp}`);
                              setTimeout(refresh, 800);
                            } else {
                              notify(res?.err || "Failed — is qBittorrent running?", "danger");
                            }
                          } else {
                            notify("No magnet/torrent link in this feed item", "danger");
                          }
                        }}>
                        ↓ DOWNLOAD
                      </button>
                    ) : null}
                    <button
                      onClick={() => { setRssItems(prev => prev.filter(x => x.id !== item.id)); }}
                      title="Delete item"
                      style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", background: "transparent", border: "1px solid transparent", padding: "3px 8px", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "rgba(255,43,85,0.4)"; e.currentTarget.style.background = "rgba(255,43,85,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "search" && (
          <SearchTab onAddTorrent={async (magnet, category) => {
            const cat = category || "Other";
            const sp = getSavePath(cat, getSettings());
            if (magnet && magnet.startsWith("magnet:")) {
              const res = await qbAdd(magnet, sp, cat);
              if (res?.ok) { setTab("torrents"); notify(`Sent to qBittorrent → ${sp}`); }
              else notify(res?.err || "Failed to send to qBittorrent", "danger");
            } else {
              notify("Paste a real magnet link into the Add Torrent box", "danger");
            }
          }} />
        )}

        {tab === "stats" && (() => {
          const fmtBytes = b => {
            if (!b) return "0 B";
            if (b > 1e12) return `${(b/1e12).toFixed(2)} TB`;
            if (b > 1e9)  return `${(b/1e9).toFixed(2)} GB`;
            if (b > 1e6)  return `${(b/1e6).toFixed(1)} MB`;
            return `${(b/1e3).toFixed(0)} KB`;
          };
          const ti = transferInfo;
          const dlSession = ti?.dl_info_data || 0;
          const ulSession = ti?.up_info_data || 0;
          const dlAll = ti?.alltime_dl || 0;
          const ulAll = ti?.alltime_ul || 0;
          const ratio = dlAll > 0 ? (ulAll / dlAll).toFixed(2) : "—";
          const connStatus = ti?.connection_status || "unknown";
          const dhtNodes = ti?.dht_nodes ?? "—";
          const dlRate = ti ? `${((ti.dl_info_speed||0)/1048576).toFixed(2)} MB/s` : "—";
          const ulRate = ti ? `${((ti.up_info_speed||0)/1048576).toFixed(2)} MB/s` : "—";

          return (
          <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 19, color: "var(--cyan)", letterSpacing: 3, marginBottom: 24 }}>STATISTICS</div>
            {!ti && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--red)", marginBottom: 20 }}>
                ✕ qBittorrent offline — no data available
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "ALL-TIME DOWNLOADED", value: fmtBytes(dlAll), color: "var(--cyan)" },
                { label: "ALL-TIME UPLOADED",   value: fmtBytes(ulAll), color: "var(--green)" },
                { label: "GLOBAL RATIO",        value: ratio,            color: "var(--yellow)" },
                { label: "TOTAL TORRENTS",      value: torrents.length,  color: "var(--orange)" },
              ].map(s => (
                <div key={s.label} className="neon-border corner-cut-lg" style={{ padding: 20, background: "var(--bg2)" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--display)", fontSize: 28, color: s.color, textShadow: `0 0 12px ${s.color}` }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="neon-border" style={{ padding: 16, background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 14, color: "var(--text3)", letterSpacing: 2, marginBottom: 12 }}>SESSION</div>
                {[
                  ["Downloaded this session", fmtBytes(dlSession)],
                  ["Uploaded this session",   fmtBytes(ulSession)],
                  ["Current download speed",  dlRate],
                  ["Current upload speed",    ulRate],
                  ["Downloading",  `${torrents.filter(t=>t.status==="downloading").length} torrents`],
                  ["Seeding",      `${torrents.filter(t=>t.status==="seeding").length} torrents`],
                  ["Paused",       `${torrents.filter(t=>t.status==="paused").length} torrents`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="neon-border" style={{ padding: 16, background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 14, color: "var(--text3)", letterSpacing: 2, marginBottom: 12 }}>NETWORK</div>
                {[
                  ["Connection status", connStatus],
                  ["DHT nodes", dhtNodes],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)" }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          );
        })()}

        {tab === "settings" && <SettingsPanel notify={notify} />}
      </div>

      {/* STATUS BAR */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "4px 16px", display: "flex", gap: 24, alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>
          <span className="status-dot animate-pulse-glow" style={{ background: qbConnected ? "var(--green)" : qbConnected === null ? "var(--yellow)" : "var(--red)", marginRight: 6 }} />
          {qbConnected === null ? "CONNECTING..." : qbConnected ? "⬡ qBITTORRENT CONNECTED" : "✕ qBITTORRENT OFFLINE — check Web UI is enabled in qBittorrent"}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>
          ↓ {totalDl.toFixed(1)} MB/s · ↑ {totalUl.toFixed(1)} MB/s
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>
          {torrents.filter(t => t.status === "downloading").length} downloading · {torrents.filter(t => t.status === "seeding").length} seeding
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text3)" }}>
          RSS AUTO-DL: <span style={{ color: "var(--green)" }}>{autoRules.filter(r => r.enabled).length} ACTIVE RULES</span>
        </div>
      </div>

      {/* ADD TORRENT MODAL */}
      {needsLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="neon-border-active corner-cut-lg" style={{ background: "var(--bg2)", padding: 36, width: 400, maxWidth: "90vw" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 18, color: "var(--cyan)", letterSpacing: 3, marginBottom: 8, textShadow: "0 0 10px var(--cyan)" }}>NEXUS</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", letterSpacing: 1, marginBottom: 24 }}>qBITTORRENT LOGIN REQUIRED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>USERNAME</div>
                <input className="input-field" value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="admin" autoFocus />
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)", letterSpacing: 1, marginBottom: 6 }}>PASSWORD</div>
                <input className="input-field" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="adminadmin"
                  onKeyDown={async e => {
                    if (e.key !== "Enter") return;
                    const lr = await apiPost('/auth/login', { username: loginUser || 'admin', password: loginPass || 'adminadmin' });
                    const ok = lr && (await lr.text()) === 'Ok.';
                    if (ok) { setNeedsLogin(false); refresh(); } else notify("Login failed — wrong credentials", "danger");
                  }} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={async () => {
              const lr = await apiPost('/auth/login', { username: loginUser || 'admin', password: loginPass || 'adminadmin' });
              const ok = lr && (await lr.text()) === 'Ok.';
              if (ok) { setNeedsLogin(false); refresh(); } else notify("Login failed — wrong credentials", "danger");
            }}>LOGIN</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="neon-border-active corner-cut-lg animate-float-up" style={{ background: "var(--bg2)", padding: 28, width: 520, maxWidth: "90vw" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 17, color: "var(--cyan)", letterSpacing: 2, marginBottom: 20, textShadow: "0 0 10px var(--cyan)" }}>
              ADD TORRENT
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--text3)", letterSpacing: 1, marginBottom: 8 }}>MAGNET LINK OR TORRENT URL</div>
              <textarea className="input-field" rows={4} placeholder="magnet:?xt=urn:btih:..." value={magnetUrl} onChange={e => setMagnetUrl(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            {(() => {
              const settings = getSettings();
              return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", marginBottom: 6 }}>CATEGORY</div>
                  <select className="input-field" value={magnetCategory} onChange={e => setMagnetCategory(e.target.value)}>
                    <option value="">Uncategorized</option>
                    <option value="TV Shows">TV Shows</option>
                    <option value="Movies">Movies</option>
                    <option value="Software">Software</option>
                    <option value="Music">Music</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text3)", marginBottom: 6 }}>SAVE PATH</div>
                  <input className="input-field" value={magnetSavePath || getSavePath(magnetCategory || "Other", settings)} onChange={e => setMagnetSavePath(e.target.value)} />
                </div>
              </div>
              );
            })()}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setShowAddModal(false)}>CANCEL</button>
              <button className="btn btn-primary" onClick={addTorrent}>▶ START DOWNLOAD</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FEED MODAL */}
      {showAddFeed && <AddFeedModal onClose={() => setShowAddFeed(false)} onAdd={(feed) => { setFeeds(prev => [...prev, feed]); setShowAddFeed(false); notify("RSS Feed added successfully"); }} />}

      {/* ADD AUTO-RULE MODAL */}
      {showAddRule && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddRule(false); }}>
          <div className="neon-border-active corner-cut-lg animate-float-up" style={{ background: "var(--bg2)", padding: 28, width: 480 }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 17, color: "var(--green)", letterSpacing: 2, marginBottom: 8 }}>⚡ NEW AUTO-DOWNLOAD RULE</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--text3)", marginBottom: 20 }}>Automatically grab the latest episode at the highest available resolution</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--text3)", marginBottom: 6 }}>SHOW / SERIES NAME</div>
                <input className="input-field" placeholder="e.g. House of the Dragon" value={newRule.show} onChange={e => setNewRule({ ...newRule, show: e.target.value })} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--text3)", marginBottom: 6 }}>MINIMUM QUALITY</div>
                <select className="input-field" value={newRule.quality} onChange={e => setNewRule({ ...newRule, quality: e.target.value })}>
                  <option value="2160p">2160p UHD (Best)</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>
              <div style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.2)", padding: 12, fontFamily: "var(--mono)", fontSize: 19, color: "var(--text2)" }}>
                ⚡ NEXUS will monitor all active RSS feeds, match new episodes automatically, and prefer the highest available resolution above your minimum threshold.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setShowAddRule(false)}>CANCEL</button>
              <button className="btn btn-success" onClick={addRule}>CREATE RULE</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notification && (
        <div className="animate-float-up" style={{
          position: "fixed", bottom: 48, right: 24,
          background: notification.type === "danger" ? "rgba(255,43,85,0.15)" : "rgba(0,255,157,0.12)",
          border: `1px solid ${notification.type === "danger" ? "var(--red)" : "var(--green)"}`,
          color: notification.type === "danger" ? "var(--red)" : "var(--green)",
          padding: "10px 20px", fontFamily: "var(--display)", fontSize: 17, letterSpacing: 1,
          boxShadow: `0 0 20px ${notification.type === "danger" ? "rgba(255,43,85,0.3)" : "rgba(0,255,157,0.3)"}`,
          zIndex: 2000,
          clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)"
        }}>
          {notification.msg}
        </div>
      )}
    </div>
  );
}

export default function TorrentClient() {
  return <ErrorBoundary><TorrentClientInner /></ErrorBoundary>;
}
