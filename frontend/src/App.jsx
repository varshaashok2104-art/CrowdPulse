import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  BookOpen, 
  Coins, 
  Crown, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  Code, 
  Eye, 
  Download, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Target,
  Users,
  Compass,
  Cpu,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

// Character profile definitions
const CHARACTERS = {
  Harry: {
    name: "Harry Potter",
    role: "Visionary & CEO Co-Founder",
    house: "Gryffindor",
    color: "from-red-600 to-amber-600",
    borderColor: "border-red-500",
    avatarBg: "bg-red-950/40",
    glowColor: "shadow-red-500/30",
    avatarText: "⚡",
    desc: "Passionate, optimistic, driven by instinct. Wants to change the world, even if it means breaking some rules."
  },
  Hermione: {
    name: "Hermione Granger",
    role: "Product & Strategy Lead",
    house: "Gryffindor (Ravenclaw energy)",
    color: "from-indigo-600 to-blue-600",
    borderColor: "border-indigo-500",
    avatarBg: "bg-indigo-950/40",
    glowColor: "shadow-indigo-500/30",
    avatarText: "📚",
    desc: "Ultra-logical, data-driven, skeptical. Focuses on unit economics, user privacy, and scaling risks."
  },
  Ron: {
    name: "Ron Weasley",
    role: "Operations & CFO",
    house: "Gryffindor",
    color: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500",
    avatarBg: "bg-amber-950/40",
    glowColor: "shadow-amber-500/30",
    avatarText: "♟️",
    desc: "Common-sense realist. Asks the tough questions: 'Is it too hard to build?', 'Will broke students actually pay for this?'"
  },
  Dumbledore: {
    name: "Albus Dumbledore",
    role: "Chairman & Lead Advisor",
    house: "Headmaster Emeritus",
    color: "from-purple-600 to-fuchsia-600",
    borderColor: "border-purple-500",
    avatarBg: "bg-purple-950/40",
    glowColor: "shadow-purple-500/30",
    avatarText: "🧙‍♂️",
    desc: "Wise, calm, long-term strategist. Reconciles arguments, suggests clever licensing pivots, and provides ethical guardrails."
  }
};

const SUGGESTIONS = [
  "AI-powered study planner for engineering students",
  "Eco-friendly autonomous drone delivery for local pharmacies",
  "Tinder for finding local project co-founders & hackers",
  "Smart plant watering system using soil moisture sensors & AI"
];

function App() {
  const [startupIdea, setStartupIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("debate");

  // Debate Player State
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [debateLog, setDebateLog] = useState([]);
  
  // Landing Page Edit State
  const [landingHtml, setLandingHtml] = useState("");
  const [htmlEditMode, setHtmlEditMode] = useState(false);

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const debateEndRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Stop speech if tab changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [activeTab]);

  // Sync debate text list
  useEffect(() => {
    if (analysis && analysis.boardroomDebate) {
      setDebateLog(analysis.boardroomDebate.slice(0, currentLineIndex + 1));
    }
  }, [currentLineIndex, analysis]);

  // Scroll to bottom of debate log
  useEffect(() => {
    if (debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateLog]);

  // Handle TTS and player progression
  useEffect(() => {
    if (!analysis || !analysis.boardroomDebate || !isPlaying) return;

    const lineCount = analysis.boardroomDebate.length;
    if (currentLineIndex >= lineCount) {
      setIsPlaying(false);
      return;
    }

    const currentLine = analysis.boardroomDebate[currentLineIndex];
    if (voiceEnabled && synthRef.current) {
      synthRef.current.cancel(); // Cancel active speech

      const textToSpeak = `${currentLine.character} says: ${currentLine.text}`;
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utteranceRef.current = utterance;

      // Select voice based on character
      const voices = synthRef.current.getVoices();
      let selectedVoice = null;

      // Simple heuristic for English voices
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      if (currentLine.character === 'Hermione') {
        // High pitch, quick rate, female
        utterance.pitch = 1.25;
        utterance.rate = 1.05 * playbackSpeed;
        selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('susan')) || englishVoices[0];
      } else if (currentLine.character === 'Dumbledore') {
        // Lower pitch, slow rate
        utterance.pitch = 0.8;
        utterance.rate = 0.8 * playbackSpeed;
        selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male')) || englishVoices[0];
      } else if (currentLine.character === 'Ron') {
        // Standard rate, regular pitch, male
        utterance.pitch = 0.95;
        utterance.rate = 0.95 * playbackSpeed;
        selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('david')) || englishVoices[0];
      } else { // Harry
        // Passionate, slightly higher rate, male
        utterance.pitch = 1.05;
        utterance.rate = 1.0 * playbackSpeed;
        selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('david')) || englishVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        // Automatically proceed to next line after a small pause
        setTimeout(() => {
          if (isPlaying) {
            setCurrentLineIndex(prev => prev + 1);
          }
        }, 800);
      };

      utterance.onerror = (e) => {
        console.error("TTS error:", e);
        // On error, fall back to timer-based progression
        const textLength = currentLine.text.length;
        const delay = Math.max(2000, textLength * 55 / playbackSpeed);
        const timer = setTimeout(() => {
          if (isPlaying) {
            setCurrentLineIndex(prev => prev + 1);
          }
        }, delay);
        return () => clearTimeout(timer);
      };

      synthRef.current.speak(utterance);
    } else {
      // If voice is disabled, progress based on line length
      const textLength = currentLine.text.length;
      // roughly 15 characters per second
      const delay = Math.max(3000, (textLength * 50) / playbackSpeed);
      const timer = setTimeout(() => {
        if (isPlaying) {
          setCurrentLineIndex(prev => prev + 1);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentLineIndex, voiceEnabled, playbackSpeed, analysis]);

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!startupIdea.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setCurrentLineIndex(0);
    setIsPlaying(false);

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupIdea })
      });
      const data = await res.json();
      setAnalysis(data);
      setLandingHtml(data.landingPageHtml || "");
      setActiveTab("debate");
      
      // Auto play debate after a small delay
      setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze startup idea. Please verify backend is running on http://localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      if (synthRef.current) synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleResetDebate = () => {
    if (synthRef.current) synthRef.current.cancel();
    setCurrentLineIndex(0);
    setIsPlaying(false);
    setDebateLog([]);
  };

  const handleDownloadLandingPage = () => {
    const element = document.createElement("a");
    const file = new Blob([landingHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${analysis?.startupName || 'landing-page'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyLandingPage = () => {
    navigator.clipboard.writeText(landingHtml);
    alert("Landing page code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[110px] animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">StartupOS</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded ml-3 border border-indigo-900/40">AI Co-Founder</span>
            </div>
          </div>
          {analysis && (
            <button 
              onClick={() => {
                setAnalysis(null);
                setStartupIdea("");
                handleResetDebate();
              }}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              Analyze New Idea
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {!analysis ? (
          /* INPUT SCREEN */
          <div className="flex-1 flex flex-col justify-center items-center max-w-3xl mx-auto w-full py-12 md:py-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go from raw concept to live boardroom debate in seconds</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-none">
                Bring your startup to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">life</span>.
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Enter your startup idea. Our team of AI Hogwarts executors (Harry, Hermione, Ron, and Dumbledore) will debate, refine, and plan your product in real time.
              </p>
            </div>

            <form onSubmit={handleStartAnalysis} className="w-full mb-8 relative">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-25 blur-lg group-focus-within:opacity-40 transition duration-300"></div>
                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={startupIdea}
                    onChange={(e) => setStartupIdea(e.target.value)}
                    placeholder="e.g. AI-powered study planner for engineering students"
                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 focus:outline-none text-base"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !startupIdea.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Co-Founders Assembling...</span>
                      </>
                    ) : (
                      <>
                        <span>Activate Boardroom</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Suggestions */}
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Need inspiration? Try these suggestions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStartupIdea(s)}
                    className="text-left text-sm text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 hover:border-indigo-500/40 p-3.5 rounded-xl transition-all flex items-start space-x-2 cursor-pointer group"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="flex-1 flex flex-col space-y-6">
            {/* Dashboard Subheader Details */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Blueprint</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{analysis.startupName}</h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl italic">
                  &ldquo;{startupIdea}&rdquo;
                </p>
                {analysis.isMock && (
                  <span className="inline-flex items-center text-[10px] font-bold tracking-wider text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded mt-2.5">
                    ⚠️ MOCK MODE (Add GROQ_API_KEY to server .env for live AI)
                  </span>
                )}
              </div>
              
              {/* Score Ring Widget */}
              <div className="flex items-center space-x-4 bg-slate-950/60 border border-slate-900 rounded-xl p-4 shrink-0">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" strokeWidth="6" stroke="#0f172a" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      strokeWidth="6" 
                      stroke="url(#score-gradient)" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - analysis.ideaScore / 100)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-lg font-black text-white">{analysis.ideaScore}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Viability</p>
                  <p className="text-sm font-bold text-indigo-300">
                    {analysis.ideaScore >= 80 ? "Highly Promising" : analysis.ideaScore >= 60 ? "Viable (Needs Pivot)" : "High Risk / Pivot Required"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-900 overflow-x-auto pb-px custom-scrollbar">
              {[
                { id: "debate", label: "Boardroom Debate", icon: Wand2 },
                { id: "executives", label: "Executive Reports", icon: Users },
                { id: "reality", label: "Reality Check", icon: ShieldAlert },
                { id: "buildability", label: "Buildability Score", icon: Zap },
                { id: "pitch", label: "Investor Pitch", icon: Target },
                { id: "landing", label: "Landing Page", icon: Code }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-5 py-3.5 border-b-2 font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                      active 
                        ? "border-indigo-500 text-white bg-indigo-950/20" 
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 min-h-[450px]">
              
              {/* 1. BOARDROOM DEBATE PANEL */}
              {activeTab === "debate" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Boardroom Stage & Controls */}
                  <div className="lg:col-span-2 flex flex-col space-y-6">
                    {/* Visual Boardroom Table */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/90 via-slate-950 to-slate-950">
                      
                      {/* Times Square Neon Theme Overlay background */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1470&auto=format&fit=crop')" }}></div>
                      
                      <div className="relative z-10 flex flex-col h-[320px] justify-between">
                        
                        {/* Status bar */}
                        <div className="flex justify-between items-center bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-900 text-xs font-medium">
                          <span className="flex items-center space-x-2 text-indigo-400">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                            <span className="font-semibold uppercase tracking-wider">Times Square Boardroom Simulation</span>
                          </span>
                          <span className="text-slate-500">
                            Line {currentLineIndex + 1} of {analysis.boardroomDebate.length}
                          </span>
                        </div>

                        {/* Avatars Layout Around a Table */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
                          {Object.keys(CHARACTERS).map((key) => {
                            const char = CHARACTERS[key];
                            const currentSpeaker = analysis.boardroomDebate[currentLineIndex]?.character === key;
                            return (
                              <div 
                                key={key}
                                className={`glass-card p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center text-center relative ${
                                  currentSpeaker 
                                    ? `scale-105 border-indigo-500 bg-indigo-950/20 shadow-lg ${char.glowColor} animate-speak` 
                                    : "border-slate-800/80 opacity-60"
                                }`}
                              >
                                {/* Active Speaking Crown/Highlight */}
                                {currentSpeaker && (
                                  <div className={`absolute -top-3 px-2 py-0.5 bg-gradient-to-r ${char.color} text-[8px] font-black tracking-widest text-white uppercase rounded-full shadow-sm`}>
                                    Speaking
                                  </div>
                                )}
                                
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${char.color} flex items-center justify-center text-2xl shadow-inner mb-3`}>
                                  {char.avatarText}
                                </div>
                                <h4 className="font-extrabold text-sm text-white">{char.name}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">{char.role}</p>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-2 bg-slate-950/50 px-2 py-0.5 rounded">
                                  {char.house}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Speech Bubble Display */}
                        <div className="relative mt-2">
                          {analysis.boardroomDebate[currentLineIndex] ? (
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-start space-x-3">
                              <span className="text-2xl shrink-0">
                                {CHARACTERS[analysis.boardroomDebate[currentLineIndex].character]?.avatarText}
                              </span>
                              <div className="flex-1">
                                <p className="text-xs font-extrabold text-indigo-400">
                                  {CHARACTERS[analysis.boardroomDebate[currentLineIndex].character]?.name}
                                  <span className="ml-2 font-normal text-slate-500 text-[10px] uppercase tracking-wider">
                                    ({analysis.boardroomDebate[currentLineIndex].emotion})
                                  </span>
                                </p>
                                <p className="text-slate-200 text-sm mt-1 leading-relaxed">
                                  {analysis.boardroomDebate[currentLineIndex].text}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl text-center text-slate-500 text-sm">
                              Debate finished. Use the controls below to replay.
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleResetDebate}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Restart Debate"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={togglePlayback}
                          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-4 h-4" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>Play Debate</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Speed & Narration Options */}
                      <div className="flex items-center space-x-6">
                        {/* Speech Toggle */}
                        <button
                          onClick={() => {
                            if (voiceEnabled && synthRef.current) {
                              synthRef.current.cancel();
                            }
                            setVoiceEnabled(!voiceEnabled);
                          }}
                          className={`flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                            voiceEnabled 
                              ? "bg-indigo-950/40 border-indigo-900/60 text-indigo-400" 
                              : "bg-slate-900 border-slate-800 text-slate-500"
                          }`}
                        >
                          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          <span>{voiceEnabled ? "Voice Narration On" : "Muted"}</span>
                        </button>

                        {/* Speed Controls */}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-500 font-medium">Speed:</span>
                          {[0.75, 1, 1.25].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                                playbackSpeed === speed 
                                  ? "bg-indigo-600 text-white" 
                                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Running Debate Script Log */}
                  <div className="glass-panel rounded-2xl p-5 flex flex-col h-[480px]">
                    <h3 className="font-extrabold text-white text-base mb-4 flex items-center justify-between border-b border-slate-900 pb-3 shrink-0">
                      <span>Live Debate Transcript</span>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        Running Log
                      </span>
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                      {debateLog.map((log, index) => {
                        const char = CHARACTERS[log.character];
                        return (
                          <div 
                            key={index}
                            className={`p-3 rounded-xl border border-slate-900/60 bg-slate-950/30 transition-all ${
                              index === currentLineIndex ? "border-indigo-900 bg-indigo-950/5" : ""
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{char?.avatarText}</span>
                              <span className="text-xs font-bold text-white">{char?.name}</span>
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ml-2 text-slate-400 bg-slate-900`}>
                                {log.emotion}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                              {log.text}
                            </p>
                          </div>
                        );
                      })}
                      {debateLog.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-600 text-xs italic text-center p-6">
                          Debate has not started. Click 'Play Debate' to begin the team debate simulator.
                        </div>
                      )}
                      <div ref={debateEndRef} />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EXECUTIVE REPORTS PANEL */}
              {activeTab === "executives" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(analysis.executiveReports).map((key) => {
                    const agent = analysis.executiveReports[key];
                    
                    // Assign icon to agent
                    let Icon = Sparkles;
                    let colorClass = "text-indigo-400 bg-indigo-950/40 border-indigo-900/30";
                    if (key === 'ceo') { Icon = Target; colorClass = "text-red-400 bg-red-950/40 border-red-900/30"; }
                    if (key === 'marketResearch') { Icon = TrendingUp; colorClass = "text-blue-400 bg-blue-950/40 border-blue-900/30"; }
                    if (key === 'competitorAnalysis') { Icon = Compass; colorClass = "text-amber-400 bg-amber-950/40 border-amber-900/30"; }
                    if (key === 'product') { Icon = Cpu; colorClass = "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"; }
                    if (key === 'cfo') { Icon = Coins; colorClass = "text-yellow-400 bg-yellow-950/40 border-yellow-900/30"; }
                    if (key === 'marketing') { Icon = Wand2; colorClass = "text-purple-400 bg-purple-950/40 border-purple-900/30"; }

                    return (
                      <div key={key} className="glass-card p-6 rounded-2xl flex flex-col border border-slate-900 hover:border-slate-800 transition-all">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-white text-base leading-none">{agent.title}</h3>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                              {key === 'marketResearch' ? 'Market Analyst' : key === 'competitorAnalysis' ? 'Competitor Strategist' : key.toUpperCase()} Agent
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs italic mb-4 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-900/40">
                          &ldquo;{agent.summary}&rdquo;
                        </p>
                        <div className="space-y-3 mt-auto">
                          {agent.points.map((pt, index) => (
                            <div key={index} className="flex items-start space-x-2 text-xs">
                              <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                              <span className="text-slate-300 leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. REALITY CHECK PANEL */}
              {activeTab === "reality" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left panel: Scores */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-28 h-28 rounded-full bg-slate-900 border-4 border-red-500/40 flex flex-col items-center justify-center relative">
                      <span className="text-4xl font-black text-white">{analysis.realityCheck.score}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Reality Rating</span>
                      {/* Sub-label bubble */}
                      <div className="absolute -bottom-3 px-3 py-1 bg-red-600 text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
                        Brutally Honest
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg">Reality Check Summary</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs">
                        Most advisors flatter founders. StartupOS looks at cold, hard execution realities and competitive saturations.
                      </p>
                    </div>
                  </div>

                  {/* Problems Checklist */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="font-extrabold text-white text-base mb-4 flex items-center space-x-2 border-b border-slate-900 pb-3 shrink-0">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      <span>Bottlenecks & Execution Risks</span>
                    </h3>
                    <div className="space-y-4 flex-1">
                      {analysis.realityCheck.problems.map((prob, index) => (
                        <div key={index} className="flex items-start space-x-3 text-xs bg-red-950/10 border border-red-900/20 p-3.5 rounded-xl">
                          <span className="w-5 h-5 bg-red-500/10 text-red-400 font-bold flex items-center justify-center rounded shrink-0">
                            !
                          </span>
                          <p className="text-slate-300 leading-relaxed font-medium">
                            {prob}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="font-extrabold text-white text-base mb-4 flex items-center space-x-2 border-b border-slate-900 pb-3 shrink-0">
                      <Lightbulb className="w-5 h-5 text-indigo-400" />
                      <span>Recommended Action Items</span>
                    </h3>
                    <div className="space-y-4 flex-1">
                      {analysis.realityCheck.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 text-xs bg-indigo-950/10 border border-indigo-900/20 p-3.5 rounded-xl">
                          <span className="w-5 h-5 bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center rounded shrink-0">
                            ✓
                          </span>
                          <p className="text-slate-300 leading-relaxed font-medium">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. BUILDABILITY PANEL */}
              {activeTab === "buildability" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Card: Score Card */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-28 h-28 rounded-full bg-slate-900 border-4 border-indigo-500/40 flex flex-col items-center justify-center relative">
                      <span className="text-4xl font-black text-white">{analysis.buildability.score}/10</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Build Score</span>
                      <div className="absolute -bottom-3 px-3 py-1 bg-indigo-600 text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
                        {analysis.buildability.difficultyText}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg">Buildability Score</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs">
                        Reflects technical feasibility, setup dependencies, and baseline effort required. A score above 7 indicates high hackathon viability.
                      </p>
                    </div>
                  </div>

                  {/* Mid Card: Feasibility Overview */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base mb-4 border-b border-slate-900 pb-3">
                        MVP Execution Timeline
                      </h3>
                      <div className="space-y-6 my-4">
                        <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <div className="p-3 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-indigo-400">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Estimated MVP Time</span>
                            <span className="text-lg font-extrabold text-white">{analysis.buildability.estimatedWeeks} Weeks</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <div className="p-3 bg-emerald-950/60 border border-emerald-900/40 rounded-lg text-emerald-400">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Student Hackathon Fit</span>
                            <span className="text-lg font-extrabold text-white">
                              {analysis.buildability.canBuild ? "✅ Excellent Fit (Build in 48h)" : "⚠️ Complex (Recommend Scope Cut)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      *Feasibility rating assumes 3-4 engineering students with moderate web development experience.
                    </p>
                  </div>

                  {/* Right Card: Technical & Practical Tips */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="font-extrabold text-white text-base mb-4 flex items-center space-x-2 border-b border-slate-900 pb-3 shrink-0">
                      <Zap className="w-5 h-5 text-indigo-400" />
                      <span>Hackathon Implementation Tips</span>
                    </h3>
                    <div className="space-y-4 flex-1">
                      {analysis.buildability.studentAdvice.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 text-xs bg-indigo-950/10 border border-indigo-900/20 p-3.5 rounded-xl">
                          <span className="w-5 h-5 bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center rounded shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. INVESTOR PITCH PANEL */}
              {activeTab === "pitch" && (
                <div className="glass-panel rounded-2xl p-6 max-w-4xl mx-auto flex flex-col space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pre-Seed / Hackathon Pitch Deck</span>
                      <h3 className="font-extrabold text-white text-xl mt-1">One-Click Investor Pitch</h3>
                    </div>
                    <button 
                      onClick={() => {
                        const content = `Investor Pitch - ${analysis.startupName}\n\nElevator Pitch:\n${analysis.investorPitch.elevatorPitch}\n\nProblem:\n${analysis.investorPitch.problem}\n\nSolution:\n${analysis.investorPitch.solution}\n\nMarket Opportunity:\n${analysis.investorPitch.marketOpportunity}\n\nRevenue Model:\n${analysis.investorPitch.revenueModel}\n\nFunding Ask:\n${analysis.investorPitch.fundingAsk}`;
                        navigator.clipboard.writeText(content);
                        alert("Investor pitch deck copied to clipboard!");
                      }}
                      className="flex items-center space-x-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Pitch Text</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Elevator Pitch</h4>
                      <p className="text-sm font-semibold text-white leading-relaxed">{analysis.investorPitch.elevatorPitch}</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">The Problem</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{analysis.investorPitch.problem}</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Our Solution</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{analysis.investorPitch.solution}</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Market Opportunity</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{analysis.investorPitch.marketOpportunity}</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monetization Model</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{analysis.investorPitch.revenueModel}</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Capital / Funding Ask</h4>
                      <p className="text-sm font-semibold text-indigo-400 leading-relaxed">{analysis.investorPitch.fundingAsk}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. LANDING PAGE PANEL */}
              {activeTab === "landing" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
                  
                  {/* Left Panel: HTML Viewer / Editor (4 Cols) */}
                  <div className="lg:col-span-5 flex flex-col glass-panel rounded-2xl p-5 overflow-hidden">
                    <div className="flex justify-between items-center mb-3 shrink-0">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setHtmlEditMode(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            !htmlEditMode ? "bg-slate-950 text-white border border-slate-800" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                        </button>
                        <button
                          onClick={() => setHtmlEditMode(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            htmlEditMode ? "bg-slate-950 text-white border border-slate-800" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Code className="w-3.5 h-3.5 inline mr-1" /> HTML Code
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={handleCopyLandingPage}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Copy HTML"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={handleDownloadLandingPage}
                          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                          title="Download HTML"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative border border-slate-900 rounded-xl bg-slate-950">
                      {htmlEditMode ? (
                        <textarea
                          value={landingHtml}
                          onChange={(e) => setLandingHtml(e.target.value)}
                          className="w-full h-full p-4 bg-[#090d16] text-slate-300 font-mono text-[10px] resize-none focus:outline-none custom-scrollbar"
                        />
                      ) : (
                        <div className="p-5 flex flex-col justify-center h-full text-center text-slate-400 space-y-4">
                          <CheckCircle className="w-10 h-10 text-indigo-400 mx-auto" />
                          <div>
                            <h4 className="font-extrabold text-white text-sm">Landing Page Generated Successfully!</h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              We have compiled a complete single-file responsive landing page using Tailwind CSS via CDN.
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 max-w-[200px] mx-auto pt-2">
                            <button
                              onClick={() => setHtmlEditMode(true)}
                              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg cursor-pointer"
                            >
                              Inspect Source Code
                            </button>
                            <button
                              onClick={handleDownloadLandingPage}
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 border border-indigo-900/30 px-3 py-2 rounded-lg cursor-pointer"
                            >
                              Download Landing Page
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel: Live Preview iframe (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col glass-panel rounded-2xl p-5 overflow-hidden">
                    <h3 className="font-extrabold text-white text-base mb-3 shrink-0 flex items-center justify-between">
                      <span>Live Landing Page Mockup</span>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center">
                        HTML Iframe Preview <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </h3>
                    
                    <div className="flex-1 border border-slate-900 rounded-xl overflow-hidden bg-white">
                      <iframe
                        title="Landing Page Preview"
                        srcDoc={landingHtml}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} StartupOS. Created with ❤️ by Antigravity AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
