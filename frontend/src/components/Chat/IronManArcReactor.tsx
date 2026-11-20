import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../lib/store';
import { useTtsStore } from '../../lib/tts';
import { Zap, Activity, Cpu, Shield, Radio, Volume2 } from 'lucide-react';

interface IronManArcReactorProps {
  onActivate?: () => void;
  compact?: boolean;
}

export function IronManArcReactor({ onActivate, compact = false }: IronManArcReactorProps) {
  const streamState = useAppStore((s) => s.streamState);
  const isStreaming = streamState.isStreaming;
  const isSpeaking = useTtsStore((s) => s.speakingId !== null);
  const activeModel = useAppStore((s) => s.selectedModel || s.settings.defaultModel || 'my-combo');

  const [frequency, setFrequency] = useState(89.4);
  const [powerOutput, setPowerOutput] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrequency(88.0 + Math.random() * 3.5);
      if (isStreaming || isSpeaking) {
        setPowerOutput(98 + Math.floor(Math.random() * 5));
      } else {
        setPowerOutput(100);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isStreaming, isSpeaking]);

  const isActive = isStreaming || isSpeaking;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${compact ? 'py-2' : 'py-8'}`}>
      {/* Background radial glow */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{
          width: compact ? '220px' : '380px',
          height: compact ? '220px' : '380px',
          background: isActive
            ? 'radial-gradient(circle, rgba(0,240,255,0.25) 0%, rgba(0,180,216,0.12) 45%, transparent 75%)'
            : 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(8,145,178,0.05) 50%, transparent 75%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Main Arc Reactor SVG Graphic */}
      <div
        onClick={onActivate}
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${compact ? 'w-44 h-44' : 'w-72 h-72'}`}
        title="J.A.R.V.I.S. Core Reactor"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.45)]"
        >
          <defs>
            <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0077b6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#001824" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Ring Static Ticks */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />

          {/* Outer Orbital Ring (Slow Clockwise) */}
          <g
            className="origin-center"
            style={{
              animation: `spin ${isActive ? '6s' : '28s'} linear infinite`,
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="132"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="40 25 15 25 80 30"
              strokeOpacity="0.6"
            />
            {/* Degree Markings */}
            <text x="150" y="14" fill="#00f0ff" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">000°</text>
            <text x="286" y="152" fill="#00f0ff" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">090°</text>
            <text x="150" y="292" fill="#00f0ff" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">180°</text>
            <text x="14" y="152" fill="#00f0ff" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">270°</text>
          </g>

          {/* Secondary Ring (Counter-Clockwise) */}
          <g
            className="origin-center"
            style={{
              animation: `spin-reverse ${isActive ? '4s' : '18s'} linear infinite`,
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="115"
              fill="none"
              stroke="rgba(0, 240, 255, 0.5)"
              strokeWidth="3"
              strokeDasharray="20 12 50 15 10 20"
            />
            {/* Triangular alignment brackets */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="150"
                y1="38"
                x2="150"
                y2="46"
                stroke="#00f0ff"
                strokeWidth="2"
                transform={`rotate(${deg} 150 150)`}
                opacity="0.8"
              />
            ))}
          </g>

          {/* Segmented Rotor Ring (10 Arc Reactor segments) */}
          <g
            className="origin-center"
            style={{
              animation: `spin ${isActive ? '3s' : '12s'} linear infinite`,
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="90"
              fill="none"
              stroke="rgba(0, 180, 216, 0.35)"
              strokeWidth="14"
              strokeDasharray="42 14"
            />
            <circle
              cx="150"
              cy="150"
              r="90"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="4 52"
              opacity="0.9"
            />
          </g>

          {/* Inner Stabilizer Ring */}
          <g
            className="origin-center"
            style={{
              animation: `spin-reverse ${isActive ? '2.5s' : '10s'} linear infinite`,
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="68"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeDasharray="18 10 32 10"
              opacity="0.75"
            />
          </g>

          {/* Center Glowing Core Chamber (The Arc Reactor Heart) */}
          <circle
            cx="150"
            cy="150"
            r="48"
            fill="url(#arcGlow)"
            className={isActive ? 'animate-pulse' : ''}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))',
            }}
          />

          {/* Core Geometric Triangle Emitter */}
          <polygon
            points="150,118 178,166 122,166"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.9"
            className="origin-center"
            style={{
              animation: `spin ${isActive ? '2s' : '8s'} linear infinite`,
              filter: 'drop-shadow(0 0 4px #00f0ff)',
            }}
          />
          <polygon
            points="150,182 122,134 178,134"
            fill="none"
            stroke="rgba(0, 240, 255, 0.7)"
            strokeWidth="1.5"
            className="origin-center"
            style={{
              animation: `spin-reverse ${isActive ? '2s' : '8s'} linear infinite`,
            }}
          />

          {/* Core Center Pip */}
          <circle
            cx="150"
            cy="150"
            r="10"
            fill="#ffffff"
            style={{
              filter: 'drop-shadow(0 0 8px #00f0ff)',
            }}
          />
        </svg>

        {/* Dynamic Center Voice Wave Ring when speaking */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
          </div>
        )}
      </div>

      {/* Sci-Fi Telemetry & Status HUD Header */}
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_12px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
          <span>J.A.R.V.I.S. // MARK VII</span>
          <span className="text-cyan-600">|</span>
          <span>{isActive ? 'PROCESSING QUERY' : 'SYSTEM ONLINE'}</span>
        </div>

        {/* Audio Frequency Spectrum Visualizer Bars */}
        <div className="flex items-end justify-center gap-1 mt-3 h-6 px-4">
          {[40, 65, 85, 45, 95, 75, 55, 90, 60, 80, 100, 70, 50, 85, 60, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-150"
              style={{
                height: isActive
                  ? `${Math.max(15, (h * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%`
                  : '18%',
                opacity: isActive ? 0.9 : 0.35,
                boxShadow: isActive ? '0 0 6px rgba(0,240,255,0.6)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Telemetry Status Grid */}
        {!compact && (
          <div className="grid grid-cols-3 gap-3 mt-4 text-[11px] font-mono text-cyan-400/80 max-w-md w-full px-2">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <Cpu size={14} className="text-cyan-400 shrink-0" />
              <div className="truncate text-left">
                <div className="text-[9px] text-cyan-500 uppercase">Model Link</div>
                <div className="font-semibold text-cyan-200 truncate">{activeModel}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <Zap size={14} className="text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-[9px] text-cyan-500 uppercase">Reactor Output</div>
                <div className="font-semibold text-cyan-200">{powerOutput}% STABLE</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <Activity size={14} className="text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-[9px] text-cyan-500 uppercase">Frequency</div>
                <div className="font-semibold text-cyan-200">{frequency.toFixed(1)} GHz</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline styles for CSS keyframe rotations */}
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
