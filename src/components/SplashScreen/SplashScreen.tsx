"use client";
import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  show: boolean;
  message?: string;
  progress?: number;
}

const STAGES = [
  { label: "Verifying credentials",     short: "AUTH",     },
  { label: "Loading billing records",   short: "BILLING",  },
  { label: "Fetching hospital details", short: "FACILITY", },
  { label: "Preparing dashboard",       short: "READY",    },
];

const SplashScreen: React.FC<SplashScreenProps> = ({
  show,
  message,
  progress: controlledProgress,
}) => {
  const [progress, setProgress]       = useState(0);
  const [stageIndex, setStageIndex]   = useState(0);
  const [visible, setVisible]         = useState(show);
  const [fadeOut, setFadeOut]         = useState(false);
  const [tick, setTick]               = useState(0);
  const [mounted, setMounted]         = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [branchName, setBranchName]   = useState("");

  useEffect(() => {
    if (!show) return;
    setProgress(0); setStageIndex(0); setFadeOut(false); setVisible(true);
    setTimeout(() => setMounted(true), 30);
    if (controlledProgress !== undefined) return;
    const iv = setInterval(() => {
      setProgress((p) => { const n = p + Math.random() * 3.5 + 0.5; return n >= 100 ? 100 : n; });
    }, 80);
    return () => clearInterval(iv);
  }, [show]);

  useEffect(() => { if (controlledProgress !== undefined) setProgress(controlledProgress); }, [controlledProgress]);

  useEffect(() => {
    setStageIndex(Math.min(Math.floor((progress / 100) * STAGES.length), STAGES.length - 1));
  }, [progress]);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % 4), 480);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!show) {
      setMounted(false); setFadeOut(true);
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const [cr, br] = await Promise.all([
          fetch("https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.api.pos_api.get_user_default_company", { credentials: "include" }),
          fetch("https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.api.pos_api.get_user_default_branch",  { credentials: "include" }),
        ]);
        if (cr.ok) { const d = await cr.json(); if (d.message) setCompanyName(d.message); }
        if (br.ok) { const d = await br.json(); if (d.message) setBranchName(d.message);  }
      } catch (e) { console.error(e); }
    })();
  }, [show]);

  if (!visible) return null;

  const pct = Math.round(progress);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Source+Code+Pro:wght@400;500&display=swap');

        .sp-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 12, 22, 0.80);
          backdrop-filter: blur(24px) saturate(110%);
          -webkit-backdrop-filter: blur(24px) saturate(110%);
          font-family: 'Lato', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .sp-overlay.sp-in  { opacity: 1; }
        .sp-overlay.sp-out { opacity: 0; }

        .sp-card {
          width: 100%;
          max-width: 390px;
          background: rgba(11, 20, 34, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 5px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.025) inset,
            0 40px 80px rgba(0, 0, 0, 0.65),
            0 4px 16px rgba(0, 0, 0, 0.5);
          transform: translateY(10px);
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sp-overlay.sp-in .sp-card { transform: translateY(0); }

        /* ── Top rule bar ─────────────────────────────── */
        .sp-topbar {
          height: 2px;
          background: #1e6fa8;
        }

        /* ── Header ───────────────────────────────────── */
        .sp-head {
          padding: 26px 30px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sp-logo {
          width: 42px;
          height: 42px;
          border-radius: 3px;
          background: #0f2235;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sp-logo svg { width: 22px; height: 22px; }

        .sp-head-text { flex: 1; min-width: 0; }

        .sp-company {
          font-size: 14.5px;
          font-weight: 700;
          color: #dde4ec;
          letter-spacing: 0.005em;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sp-branch {
          font-size: 11px;
          font-weight: 400;
          color: #5c7a94;
          letter-spacing: 0.04em;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .sp-tags {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .sp-tag {
          font-family: 'Source Code Pro', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.07);
          color: #4a6478;
          background: rgba(255,255,255,0.02);
        }

        .sp-tag.live {
          color: #3a8f6e;
          border-color: rgba(58,143,110,0.3);
          background: rgba(58,143,110,0.08);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sp-tag-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #3a8f6e;
          animation: sp-blink 2s ease-in-out infinite;
        }
        @keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* ── Body ─────────────────────────────────────── */
        .sp-body { padding: 22px 30px 20px; }

        /* Stage rows */
        .sp-stages { margin-bottom: 22px; }

        .sp-stage {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .sp-stage:last-child { border-bottom: none; }

        /* State indicator */
        .sp-indicator {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sp-dot-pending {
          width: 8px; height: 8px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.12);
        }

        .sp-dot-active {
          width: 8px; height: 8px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: #1e6fa8;
          border-right-color: rgba(30,111,168,0.35);
          animation: sp-spin 0.85s linear infinite;
        }
        @keyframes sp-spin { to { transform: rotate(360deg); } }

        .sp-dot-done {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #3a8f6e;
        }

        /* Stage label */
        .sp-stage-name {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1;
        }
        .sp-stage.pending .sp-stage-name { color: #3a4f62; }
        .sp-stage.active  .sp-stage-name { color: #c4cdd8; }
        .sp-stage.done    .sp-stage-name { color: #4a6478; }

        /* Animated dots */
        .sp-ellipsis {
          font-family: 'Source Code Pro', monospace;
          font-size: 11px;
          color: #1e6fa8;
          width: 18px;
          flex-shrink: 0;
        }

        /* Code tag */
        .sp-code {
          font-family: 'Source Code Pro', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .sp-stage.pending .sp-code {
          color: #2d4255;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .sp-stage.active .sp-code {
          color: #1e6fa8;
          background: rgba(30,111,168,0.12);
          border: 1px solid rgba(30,111,168,0.25);
        }
        .sp-stage.done .sp-code {
          color: #3a8f6e;
          background: rgba(58,143,110,0.1);
          border: 1px solid rgba(58,143,110,0.2);
        }

        /* ── Progress ─────────────────────────────────── */
        .sp-progress { margin-bottom: 0; }

        .sp-prog-meta {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 7px;
        }

        .sp-prog-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #334758;
        }

        .sp-prog-pct {
          font-family: 'Source Code Pro', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #1e6fa8;
          letter-spacing: 0.05em;
        }

        .sp-prog-track {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
        }

        .sp-prog-fill {
          position: absolute;
          left: 0; top: 0; height: 100%;
          background: #1e6fa8;
          border-radius: 1px;
          transition: width 0.12s linear;
        }

        /* Subtle shimmer on fill */
        .sp-prog-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          animation: sp-shimmer 1.8s ease-in-out infinite;
        }
        @keyframes sp-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        .sp-prog-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }
        .sp-prog-mark {
          font-family: 'Source Code Pro', monospace;
          font-size: 8px;
          color: #243444;
          letter-spacing: 0;
        }

        /* ── Footer ───────────────────────────────────── */
        .sp-foot {
          padding: 12px 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sp-foot-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sp-foot-left svg {
          width: 10px; height: 10px;
          color: #334758;
        }

        .sp-foot-txt {
          font-size: 9.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #334758;
        }

        .sp-foot-right {
          font-family: 'Source Code Pro', monospace;
          font-size: 9px;
          color: #243444;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className={`sp-overlay${mounted ? " sp-in" : ""}${fadeOut ? " sp-out" : ""}`}>
        <div className="sp-card">

          {/* Top rule */}
          <div className="sp-topbar" />

          {/* Header */}
          <div className="sp-head">
            <div className="sp-logo">
              {/* Medical cross */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9.5" y="2" width="5" height="20" rx="1" fill="#1e6fa8"/>
                <rect x="2"   y="9.5" width="20" height="5" rx="1" fill="#1e6fa8"/>
              </svg>
            </div>

            <div className="sp-head-text">
              <div className="sp-company">{companyName || "Healthcare ERP System"}</div>
              <div className="sp-branch">{branchName ? `${branchName} Branch` : "Integrated Hospital Information System"}</div>
            </div>

            <div className="sp-tags">
              <div className="sp-tag live">
                <div className="sp-tag-dot" />
                Online
              </div>
              {/* <div className="sp-tag">v4.2.1</div> */}
            </div>
          </div>

          {/* Body */}
          <div className="sp-body">

            {/* Stage list */}
            <div className="sp-stages">
              {STAGES.map((s, i) => {
                const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
                return (
                  <div key={i} className={`sp-stage ${state}`}>
                    <div className="sp-indicator">
                      {state === "pending" && <div className="sp-dot-pending" />}
                      {state === "active"  && <div className="sp-dot-active"  />}
                      {state === "done"    && <div className="sp-dot-done"    />}
                    </div>
                    <span className="sp-stage-name">
                      {state === "active" && message ? message : s.label}
                    </span>
                    {state === "active" && (
                      <span className="sp-ellipsis">{".".repeat(tick)}</span>
                    )}
                    <span className="sp-code">{s.short}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="sp-progress">
              <div className="sp-prog-meta">
                <span className="sp-prog-label">System Initialization</span>
                <span className="sp-prog-pct">{pct}%</span>
              </div>
              <div className="sp-prog-track">
                <div className="sp-prog-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="sp-prog-scale">
                {["0", "25", "50", "75", "100"].map((m) => (
                  <span key={m} className="sp-prog-mark">{m}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="sp-foot">
            <div className="sp-foot-left">
              {/* Lock icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="sp-foot-txt">TLS 1.3 Encrypted</span>
            </div>
            {/* <span className="sp-foot-right">QuantBit HIMS · BUILD 2024.12</span> */}
          </div>

        </div>
      </div>
    </>
  );
};

export default SplashScreen;