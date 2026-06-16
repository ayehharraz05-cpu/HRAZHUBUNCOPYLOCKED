import { useState, useEffect, useRef } from "react";

const MEDIAFIRE_LINK = "https://www.mediafire.com/file/24nwd8rgpwwibh9/Sab.zip/file";

type CheckpointStatus = "idle" | "pending" | "done";

interface Checkpoint {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  action: "visit" | "watch" | "subscribe";
  timer: number; // seconds to wait
}

const CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    title: "Visit Our Sponsor",
    description: "Visit our sponsor website to support us and unlock Checkpoint 1.",
    buttonText: "Visit Website",
    icon: "🌐",
    action: "visit",
    timer: 15,
  },
  {
    id: 2,
    title: "Watch Advertisement",
    description: "Watch a short ad to support the creator and unlock Checkpoint 2.",
    buttonText: "Watch Ad",
    icon: "📺",
    action: "watch",
    timer: 20,
  },
  {
    id: 3,
    title: "Subscribe & Follow",
    description: "Subscribe to our channel / follow our page to unlock the final checkpoint.",
    buttonText: "Subscribe Now",
    icon: "🔔",
    action: "subscribe",
    timer: 10,
  },
];

const FAKE_SPONSOR_URL = "https://youtube.com";
const FAKE_AD_URL = "https://youtube.com/watch?v=dQw4w9WgXcQ";
const FAKE_SUB_URL = "https://youtube.com";

function CountdownTimer({
  seconds,
  onDone,
}: {
  seconds: number;
  onDone: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const doneRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onDone]);

  const pct = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - pct}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
          {timeLeft}
        </span>
      </div>
      <p className="text-slate-400 text-sm">Please wait…</p>
    </div>
  );
}

function CheckpointCard({
  cp,
  status,
  isActive,
  onStart,
  onComplete,
}: {
  cp: Checkpoint;
  status: CheckpointStatus;
  isActive: boolean;
  onStart: () => void;
  onComplete: () => void;
}) {
  const [waiting, setWaiting] = useState(false);

  const handleClick = () => {
    let url = FAKE_SPONSOR_URL;
    if (cp.action === "watch") url = FAKE_AD_URL;
    if (cp.action === "subscribe") url = FAKE_SUB_URL;
    window.open(url, "_blank");
    setWaiting(true);
    onStart();
  };

  const handleDone = () => {
    setWaiting(false);
    onComplete();
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 transition-all duration-500 ${
        status === "done"
          ? "border-green-500 bg-green-950/40"
          : isActive
          ? "border-red-500 bg-slate-800/80 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          : "border-slate-700 bg-slate-800/40 opacity-50"
      }`}
    >
      {/* Badge */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black border-2 ${
            status === "done"
              ? "border-green-400 bg-green-900 text-green-300"
              : isActive
              ? "border-red-400 bg-red-900 text-white"
              : "border-slate-600 bg-slate-700 text-slate-400"
          }`}
        >
          {status === "done" ? "✓" : cp.id}
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Checkpoint {cp.id}</p>
          <h3 className={`font-bold text-base ${status === "done" ? "text-green-300" : "text-white"}`}>
            {cp.title}
          </h3>
        </div>
        <span className="ml-auto text-2xl">{cp.icon}</span>
      </div>

      <p className="text-slate-400 text-sm mb-4">{cp.description}</p>

      {status === "done" ? (
        <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
          <span className="text-lg">✅</span> Completed! Checkpoint unlocked.
        </div>
      ) : isActive ? (
        waiting ? (
          <CountdownTimer seconds={cp.timer} onDone={handleDone} />
        ) : (
          <button
            onClick={handleClick}
            className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 active:scale-95 transition-all shadow-lg shadow-red-900/50 text-sm flex items-center justify-center gap-2"
          >
            <span>{cp.icon}</span>
            {cp.buttonText}
          </button>
        )
      ) : (
        <div className="text-slate-500 text-sm flex items-center gap-2">
          🔒 Complete previous checkpoint first
        </div>
      )}
    </div>
  );
}

function ParticlesBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-pulse"
          style={{
            width: Math.random() * 6 + 2 + "px",
            height: Math.random() * 6 + 2 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            background: i % 2 === 0 ? "#f43f5e" : "#6366f1",
            animationDelay: Math.random() * 3 + "s",
            animationDuration: Math.random() * 4 + 2 + "s",
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [statuses, setStatuses] = useState<CheckpointStatus[]>(["idle", "idle", "idle"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleStart = (index: number) => {
    const next = [...statuses];
    next[index] = "pending";
    setStatuses(next);
  };

  const handleComplete = (index: number) => {
    const next = [...statuses];
    next[index] = "done";
    setStatuses(next);
    if (index + 1 < CHECKPOINTS.length) {
      setActiveIndex(index + 1);
    } else {
      setAllDone(true);
      setConfetti(true);
    }
  };

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)",
      }}
    >
      <ParticlesBg />

      {/* BG image overlay */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('/images/roblox-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Confetti overlay */}
      {confetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-center overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: Math.random() * 100 + "%",
                top: "-10px",
                background: ["#f43f5e", "#f59e0b", "#10b981", "#6366f1", "#ec4899"][i % 5],
                animation: `fall ${Math.random() * 2 + 2}s linear ${Math.random() * 2}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shine-text {
          background: linear-gradient(90deg, #f43f5e, #f59e0b, #10b981, #6366f1, #f43f5e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-anim { animation: float 3s ease-in-out infinite; }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(244,63,94,0.4); }
          50% { box-shadow: 0 0 40px rgba(244,63,94,0.8); }
        }
        .glow-btn { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo / badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4 text-red-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            Roblox File Hub
          </div>

          <div className="float-anim mb-4">
            <img
              src="/images/roblox-char.png"
              alt="Roblox Character"
              className="w-28 h-28 mx-auto object-contain drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]"
            />
          </div>

          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            <span className="shine-text">Steal a Brainrot</span>
            <br />
            <span className="text-white text-3xl md:text-4xl">File Uncopylock</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base mb-1">
            🎮 Complete <span className="text-red-400 font-bold">3 checkpoints</span> to unlock your download
          </p>
          <p className="text-slate-500 text-xs">
            File hosted on MediaFire · Free · Safe · Verified ✅
          </p>

          {/* Progress bar */}
          <div className="mt-5 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 transition-all duration-700 rounded-full"
              style={{
                width: `${(statuses.filter((s) => s === "done").length / CHECKPOINTS.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
            <span>{statuses.filter((s) => s === "done").length} / {CHECKPOINTS.length} completed</span>
            <span>{Math.round((statuses.filter((s) => s === "done").length / CHECKPOINTS.length) * 100)}%</span>
          </div>
        </div>

        {/* Checkpoint Cards */}
        {!allDone ? (
          <div className="flex flex-col gap-4">
            {CHECKPOINTS.map((cp, i) => (
              <CheckpointCard
                key={cp.id}
                cp={cp}
                status={statuses[i]}
                isActive={i === activeIndex && statuses[i] !== "done"}
                onStart={() => handleStart(i)}
                onComplete={() => handleComplete(i)}
              />
            ))}
          </div>
        ) : (
          /* Download Screen */
          <div className="rounded-2xl border-2 border-green-500 bg-green-950/30 p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <div className="text-6xl mb-4">🎉</div>
            <h2
              className="text-3xl font-black text-green-400 mb-2"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              All Checkpoints Done!
            </h2>
            <p className="text-slate-300 mb-6 text-sm">
              Your download is ready. Click the button below to get your file!
            </p>

            <a
              href={MEDIAFIRE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95 transition-all text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl"
            >
              <span className="text-2xl">⬇️</span>
              Download Steal a Brainrot Uncopylock
              <span className="text-2xl">📦</span>
            </a>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>🔒 Safe</span>
              <span>·</span>
              <span>✅ Verified</span>
              <span>·</span>
              <span>☁️ MediaFire</span>
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700 p-4 text-xs text-slate-400">
          <p className="font-bold text-slate-300 mb-1">📌 Why checkpoints?</p>
          <p>
            Checkpoints help support the creator and keep the file free for everyone. Just complete
            all 3 steps — it only takes a few seconds — and you'll get instant access to the download!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-xs">
          <p>© 2025 Roblox File Hub · Not affiliated with Roblox Corporation</p>
          <p className="mt-1">All files are user-uploaded and shared for free</p>
        </div>
      </div>
    </div>
  );
}
