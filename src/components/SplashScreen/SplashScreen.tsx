"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  show: boolean;
  message?: string;
  progress?: number; // 0–100, optional controlled progress
}

const STAGES = [
  { label: "Verifying credentials…", icon: "🔐" },
  { label: "Loading billing records…", icon: "📋" },
  { label: "Fetching hospital details…", icon: "🏥" },
  { label: "Preparing dashboard…", icon: "✅" },
];

const SplashScreen: React.FC<SplashScreenProps> = ({
  show,
  message,
  progress: controlledProgress,
}) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [visible, setVisible] = useState(show);
  const [fadeOut, setFadeOut] = useState(false);
  const [tick, setTick] = useState(0);
  const [companyName, setCompanyName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");

  // Animate progress bar when uncontrolled
  useEffect(() => {
    if (!show) return;
    setProgress(0);
    setStageIndex(0);
    setFadeOut(false);
    setVisible(true);

    if (controlledProgress !== undefined) return; // controlled mode

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 3.5 + 0.5;
        return next >= 100 ? 100 : next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [show]);

  // Use controlled progress if provided
  useEffect(() => {
    if (controlledProgress !== undefined) setProgress(controlledProgress);
  }, [controlledProgress]);

  // Advance stage based on progress
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * STAGES.length),
      STAGES.length - 1
    );
    setStageIndex(idx);
  }, [progress]);

  // Dot animation tick
  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  // Fade-out when !show
  useEffect(() => {
    if (!show) {
      setFadeOut(true);
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [show]);

  // Fetch company and branch information
  useEffect(() => {
    if (!show) return;
    
    const fetchCompanyAndBranch = async () => {
      try {
        // Fetch company
        const companyResponse = await fetch('https://192.168.7.221:4422/api/method/quantbit_hims_integration.api.pos_api.get_user_default_company', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (companyResponse.ok) {
          const companyData = await companyResponse.json();
          if (companyData.message) {
            setCompanyName(companyData.message);
          }
        }

        // Fetch branch
        const branchResponse = await fetch('https://192.168.7.221:4422/api/method/quantbit_hims_integration.api.pos_api.get_user_default_branch', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (branchResponse.ok) {
          const branchData = await branchResponse.json();
          if (branchData.message) {
            setBranchName(branchData.message);
          }
        }
      } catch (error) {
        console.error('Error fetching company/branch:', error);
      }
    };

    fetchCompanyAndBranch();
  }, [show]);

  if (!visible) return null;

  const currentStage = STAGES[stageIndex];
  const dots = ".".repeat(tick);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        .splash-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          transition: opacity 0.6s ease;
          opacity: ${fadeOut ? 0 : 1};
          pointer-events: ${fadeOut ? "none" : "all"};
          box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.7);
        }

        /* Fine grid background */
        .splash-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,99,198,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,99,198,0.05) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* Ambient blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
        }
        .blob-1 {
          width: 420px; height: 420px;
          background: #bfdbfe;
          top: -120px; left: -120px;
          animation: drift 8s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 320px; height: 320px;
          background: #93c5fd;
          bottom: -80px; right: -80px;
          animation: drift 10s ease-in-out infinite alternate-reverse;
        }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.05); }
        }

        /* Card */
        .splash-card {
          position: relative;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(14,99,198,0.12);
          border-radius: 20px;
          padding: 52px 56px 44px;
          width: 440px;
          box-shadow:
            0 0 0 1px rgba(14,99,198,0.06),
            0 20px 60px rgba(14,99,198,0.10),
            0 4px 16px rgba(0,0,0,0.04);
          animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* Header bar */
        .header-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
        }

        .logo-mark {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(29,78,216,0.35);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .logo-mark::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent);
        }
        .logo-mark svg {
          width: 26px; height: 26px;
          fill: white;
          position: relative;
          z-index: 1;
        }

        .brand-text {}
        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }
        .brand-sub {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #1d4ed8;
          margin-top: 1px;
        }

        /* Divider */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,99,198,0.18), transparent);
          margin-bottom: 32px;
        }

        /* Stage area */
        .stage-area {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          min-height: 44px;
        }
        .stage-icon {
          font-size: 22px;
          flex-shrink: 0;
          animation: iconPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes iconPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .stage-text {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          animation: textIn 0.3s ease both;
        }
        @keyframes textIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .stage-dots {
          font-size: 14px;
          color: #1d4ed8;
          font-weight: 600;
          width: 20px;
          display: inline-block;
        }

        /* Progress track */
        .progress-track {
          height: 6px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 10px;
          position: relative;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1d4ed8, #0ea5e9);
          transition: width 0.2s ease;
          position: relative;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
          border-radius: 99px;
          animation: shimmer 1.2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Footer */
        .splash-footer {
          margin-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }
        .security-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.4px;
          color: #64748b;
        }
        .security-badge svg {
          width: 12px; height: 12px;
          fill: #22c55e;
          flex-shrink: 0;
        }
        .version-tag {
          font-size: 10px;
          color: #cbd5e1;
          font-weight: 400;
        }

        /* Pulse ring on logo */
        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 18px;
          border: 2px solid rgba(29,78,216,0.3);
          animation: ringPulse 2s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0;   transform: scale(1.25); }
        }
      `}</style>

      <div className="splash-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="splash-card">
          {/* Header */}
          <div className="header-bar">
            <div className="logo-mark" style={{ position: "relative" }}>
              <div className="pulse-ring" />
              {/* Cross / medical icon */}
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 8h-4V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-name">{companyName || "Healthcare Billing"}</div>
              <div className="brand-sub">{branchName ? `${branchName} Branch` : "Healthcare Billing Suite"}</div>
            </div>
          </div>

          <div className="divider" />

          {/* Stage */}
          <div className="stage-area" key={stageIndex}>
            <span className="stage-icon">{currentStage.icon}</span>
            <span className="stage-text">
              {message ?? currentStage.label}
              <span className="stage-dots">{dots}</span>
            </span>
          </div>

          {/* Progress */}
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-label">
            <span>Initializing system</span>
            <span>{Math.round(progress)}%</span>
          </div>

          {/* Footer */}
          
        </div>
      </div>
    </>
  );
};

export default SplashScreen;