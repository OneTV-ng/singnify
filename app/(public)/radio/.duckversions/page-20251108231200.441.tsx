import React from "react";

// This page is intended for Next.js (App Router) at /radio
// It's written as a server-rendered page component with embedded client-side
// behavior via a small inline script for theme toggling and enhanced player UI.

export const metadata = {
  title: "SingCAST — Singnify Radio | Sweet Music to the World",
  description:
    "SingCAST — a global internet radio by Singnify. Sweet music to the world. A Global Music / Media Distribution and Promotion Portal — singnify.com",
  openGraph: {
    title: "SingCAST — Singnify Radio",
    description:
      "Listen live to SingCAST — Sweet Music to the World. Stream: https://radio.imediaport.com/singcast",
    url: "https://singnify.com/radio",
    siteName: "Singnify",
  },
  twitter: {
    card: "summary_large_image",
    title: "SingCAST — Singnify Radio",
    description:
      "Listen live to SingCAST — Sweet Music to the World. A Global Music / Media Distribution and Promotion Portal.",
  },
};

const STREAM_URL = "https://radio.imediaport.com/singcast"; // icecast .mp3 stream
const HOLDING_IMAGE = "/radio.jpg"; // replace with a real asset path in /public

export default function RadioPage() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect to the stream host for faster starts */}
        <link rel="preconnect" href="https://radio.imediaport.com" />
      </head>
      <body>
        <main style={styles.body}>
          <div style={styles.card}>
            <header style={styles.header}>
              <div>
                <h1 style={styles.title}>SingCAST</h1>
                <p style={styles.subtitle}>Singnify Radio — Sweet music to the world</p>
              </div>

              <div style={styles.controlsRow}>
                <button id="theme-toggle" aria-label="Toggle theme" style={styles.themeBtn}>
                  🌙
                </button>
              </div>
            </header>

            <section style={styles.playerArea}>
              <div style={styles.coverWrap}>
                <img
                  src={HOLDING_IMAGE}
                  alt="SingCAST cover — holding artwork"
                  style={styles.cover}
                />
                <div style={styles.badge}>LIVE</div>
              </div>

              <div style={styles.metaCol}>
                <div style={styles.nowPlaying}>
                  <strong id="track-title">SingCAST — Live DJ</strong>
                  <span id="track-sub">Singnify Radio • Global Stream</span>
                </div>

                <div style={styles.audioWrap}>
                  {/* Native audio element — playable in SSR, enhanced via small client script */}
                  <audio
                    id="icecast-audio"
                    controls
                    preload="none"
                    style={styles.audio}
                    // @ts-ignore
                    src={STREAM_URL}
                  >
                    Your browser does not support the audio element. Listen directly: <a href={STREAM_URL}>{STREAM_URL}</a>
                  </audio>

                  <div style={styles.helpText}>
                    If the stream doesn't play, try opening the direct stream link in a new tab, or check your network.
                  </div>
                </div>

                <div style={styles.footerRow}>
                  <a href="https://singnify.com" target="_blank" rel="noreferrer" style={styles.link}>
                    singnify.com
                  </a>
                  <a href={STREAM_URL} target="_blank" rel="noreferrer" style={styles.smallBtn}>
                    Open stream
                  </a>
                </div>
              </div>
            </section>

            <aside style={styles.infoBox}>
              <h3 style={{ margin: 0 }}>About SingCAST</h3>
              <p style={{ marginTop: 8 }}>
                SingCAST by Singnify is a global internet radio for emerging and classic artists — music, features,
                promos and more. Stream is Icecast/.mp3 compatible.
              </p>
            </aside>
          </div>

          {/* Minimal inline script for theme toggle and simple metadata updates. This keeps
              the page SSR-friendly while providing a small client-side enhancement. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
;(function(){
  try{
    const html = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const audio = document.getElementById('icecast-audio');
    const trackTitle = document.getElementById('track-title');
    const trackSub = document.getElementById('track-sub');

    // Initialize theme from localStorage or prefers-color-scheme
    const saved = localStorage.getItem('singcast-theme');
    if(saved) html.dataset.theme = saved;
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) html.dataset.theme = 'dark';
    else html.dataset.theme = 'light';

    function updateToggleIcon(){
      toggle.textContent = html.dataset.theme === 'dark' ? '🌙' : '☀️';
      toggle.setAttribute('aria-pressed', html.dataset.theme === 'dark');
    }
    updateToggleIcon();

    toggle.addEventListener('click', function(){
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('singcast-theme', html.dataset.theme);
      updateToggleIcon();
    });

    // Basic live metadata attempt: Icecast sometimes exposes metadata via the audio element's 'title' or via CORS endpoints.
    // We'll attempt simple metadata read from audio.currentSrc if available, and fallback to the static values.
    function tryUpdateMeta(){
      // no-op placeholder for future enhancements (WebAudio/ICY metadata parsing)
    }

    // Attempt to auto-play on user gesture (browsers often block auto-play). Keep it optional.
    document.addEventListener('click', function once(){
      document.removeEventListener('click', once);
      if(audio && audio.paused){
        // don't force play — try but catch errors
        audio.play().catch(()=>{});
      }
    });

    // mark the LIVE badge if stream is using http(s)
    var badge = document.querySelector('.live-badge');
    // nothing else for now

  }catch(e){
    console.warn('SingCAST client init failed', e);
  }
})();
`,
            }}
          />

          {/* Small theme styles — default dark mode */}
          <style>{`
:root{--bg:#0b0b0d;--panel:#0f1720;--muted:#9aa4b2;--accent:#6ee7b7;--glass: rgba(255,255,255,0.04);}
[data-theme='light']{--bg:#f6f7fb;--panel:#ffffff;--muted:#6b7280;--accent:#0b84ff;--glass: rgba(0,0,0,0.04);}
html,body{height:100%;margin:0;font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
body{background:linear-gradient(180deg,var(--bg), #071019);display:flex;align-items:center;justify-content:center;padding:32px;color:var(--muted)}

/* Card */
.card{width:100%;max-width:980px;background:var(--panel);border-radius:16px;padding:20px;box-shadow:0 10px 30px rgba(2,6,23,0.6);border:1px solid rgba(255,255,255,0.03)}

.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.title{font-size:22px;color:var(--accent);margin:0}
.subtitle{font-size:13px;color:var(--muted);margin:0}

.playerArea{display:flex;gap:20px}
.coverWrap{position:relative;width:220px;height:220px;border-radius:12px;overflow:hidden;flex:0 0 220px;box-shadow:inset 0 0 120px rgba(0,0,0,0.15)}
.coverWrap img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.02) saturate(1.03)}
.coverWrap .badge{position:absolute;left:12px;top:12px;background:linear-gradient(90deg,#ff7a7a,#ffb86b);padding:6px 10px;border-radius:999px;color:#fff;font-weight:700;font-size:12px}

.metaCol{flex:1;display:flex;flex-direction:column;justify-content:center}
.nowPlaying{margin-bottom:12px}
.nowPlaying strong{display:block;font-size:16px;color:var(--accent)}
.nowPlaying span{display:block;font-size:13px;color:var(--muted)}

.audioWrap{background:var(--glass);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.02)}
audio{width:100%;outline:none}
.helpText{font-size:12px;color:var(--muted);margin-top:8px}

.footerRow{display:flex;gap:12px;align-items:center;margin-top:14px}
.link{font-size:13px;color:var(--muted);text-decoration:none}
.smallBtn{background:transparent;border:1px solid rgba(255,255,255,0.04);padding:8px 12px;border-radius:8px;font-size:13px;color:var(--muted);text-decoration:none}

.infoBox{margin-top:16px;background:transparent;padding:12px;border-radius:10px;border:1px dashed rgba(255,255,255,0.02);color:var(--muted)}

.themeBtn{background:transparent;border:none;padding:8px;border-radius:8px;cursor:pointer;font-size:18px;color:var(--muted)}

@media (max-width:780px){
  .playerArea{flex-direction:column}
  .coverWrap{width:100%;height:260px}
}
`}</style>

        </main>
      </body>
    </html>
  );
}
