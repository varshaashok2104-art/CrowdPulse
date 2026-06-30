import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Groq SDK if key is present
let groq = null;
const apiKey = process.env.GROQ_API_KEY;
if (apiKey && !apiKey.startsWith('your_') && apiKey.trim() !== '') {
  try {
    groq = new Groq({ apiKey });
    console.log('[StartupOS] Groq SDK successfully initialized.');
  } catch (error) {
    console.error('[StartupOS] Failed to initialize Groq SDK:', error.message);
  }
} else {
  console.log('[StartupOS] No Groq API Key found. Server will run in Dynamic Mock Mode.');
}

// Helper to generate dynamic mock response when API key is missing or calls fail
function generateMockResponse(idea) {
  const sanitizedIdea = idea.trim() || "AI-powered study planner for engineering students";
  
  // Extract a potential name or use default
  const words = sanitizedIdea.split(' ').filter(w => w.length > 3);
  const keyword = words[0] || "Study";
  const startupName = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}Vibe`;
  
  return {
    isMock: true,
    startupName: startupName,
    ideaScore: 68,
    realityCheck: {
      score: 68,
      problems: [
        "High Customer Acquisition Cost (CAC) since students are notoriously hard to monetize.",
        "Saturated study tools market with giants like Notion, Quizlet, and Forest.",
        "Low initial customer lifetime value (LTV) due to churn when students graduate or finish semesters."
      ],
      recommendations: [
        "Pivot from direct student sales (B2C) to institutional licensing (B2B2C) through university departments.",
        "Integrate peer-to-peer accountability groups to leverage network effects and lower CAC.",
        "Introduce a freemium model with heavy viral hooks (e.g., sharing beautiful schedules on social media)."
      ]
    },
    buildability: {
      score: 8,
      canBuild: true,
      estimatedWeeks: 3,
      difficultyText: "Easy-to-Medium",
      studentAdvice: [
        "Focus 100% on the core scheduling algorithm first. Don't waste time building custom authentication or chat rooms.",
        "Use Supabase or Firebase for rapid backend deployment to keep your database setup under an hour.",
        "Build the initial frontend using a clean component library like shadcn/ui or simple Tailwind CSS to save styling time."
      ]
    },
    executiveReports: {
      ceo: {
        title: "CEO Strategy",
        summary: "Focus on capturing early adopters in high-stress engineering majors (Electrical, Computer Science) before scaling to humanities.",
        points: [
          "Target niche student groups where study intensity is maximum.",
          "Form strategic alliances with student clubs and engineering fraternities.",
          "Adopt a founder-led growth strategy on TikTok and Reddit."
        ]
      },
      marketResearch: {
        title: "Market Size & Trends",
        summary: "The global EdTech market is projected to reach $605B by 2027. Personalization and AI-driven curriculum mapping are the fastest-growing sub-sectors.",
        points: [
          "Total Addressable Market (TAM): 20M+ engineering students globally (~$2B annual market size).",
          "Serviceable Addressable Market (SAM): 5M English-speaking engineering students in North America and India.",
          "Trends: Growing demand for bite-sized micro-learning and automated time-blocking tools."
        ]
      },
      competitorAnalysis: {
        title: "Competitive Landscape",
        summary: "Direct competitors include Notion (very manual), Quizlet (flashcard focused), and general calendar apps (Google Calendar, Outlook).",
        points: [
          "Notion requires high setup time; students want plug-and-play templates.",
          "Google Calendar lacks specialized study intervals or curriculum templates.",
          "Competitive Advantage: Out-of-the-box template library tuned specifically to engineering syllabi (e.g. Calculus, Physics, Data Structures)."
        ]
      },
      product: {
        title: "Product Specs & Tech Stack",
        summary: "A mobile-first web app using React, Tailwind CSS, and a serverless backend. Core features: Syllabus Import, AI Calendar Scheduler, and Study Streak Tracker.",
        points: [
          "Phase 1 MVP: PDF syllabus parser to automatically generate study plans.",
          "Core Tech: React + Tailwind, Node.js + Express backend, Supabase database.",
          "Integration: Google Calendar and Outlook API synchronization."
        ]
      },
      cfo: {
        title: "Revenue & Financials",
        summary: "Three-tier monetization model: Free, Student Pro ($4.99/mo), and University Sponsored (bulk licenses). Target break-even at 5,000 monthly active subscribers.",
        points: [
          "CAC Target: <$10 per user using campus rep programs.",
          "LTV Target: ~$40 per user (8 months average retention).",
          "Projected Year 1 Revenue: $120,000 ARR with 2.5% free-to-paid conversion rate."
        ]
      },
      marketing: {
        title: "Go-to-Market Strategy",
        summary: "Leverage grass-roots viral campaigns. Hire Campus Ambassadors at top-tier engineering universities and offer incentives for referral shares.",
        points: [
          "Campus Reps: Pay commission on referrals and give them exclusive branded swag.",
          "TikTok/Instagram Reels: Visual demonstrations showing 'How I plan my 80-hour engineering week in 10 seconds'.",
          "SEO Optimization: Target long-tail search terms like 'how to pass engineering thermodynamics study plan'."
        ]
      }
    },
    boardroomDebate: [
      {
        character: "Harry",
        text: `I absolutely love this idea! As a student who has to balance saving the wizarding world with potion-making homework, I know first-hand how chaotic school schedules are. An AI study planner that understands our workload and schedules study blocks dynamically? That's a golden snitch!`,
        emotion: "excited"
      },
      {
        character: "Hermione",
        text: `Hold on, Harry. While the concept sounds appealing, we have to look at the practicality. Engineering students already have very structured syllabi, and their problem sets are highly unpredictable in terms of study time. How will the AI accurately predict if a student needs 2 hours or 10 hours for a Electromagnetism lab report? If the AI is wrong, students will lose trust immediately.`,
        emotion: "skeptical"
      },
      {
        character: "Ron",
        text: `Blimey, Hermione, you're always overthinking! If it saves me from spending three hours making a color-coded schedule that I'll ignore anyway, I'd pay for it. But wait, how do we make money? Students are flat broke! I wouldn't spend my last galleon on a planner app when I could buy butterbeer instead.`,
        emotion: "roasting"
      },
      {
        character: "Dumbledore",
        text: `It is our choices, Harry, that show what we truly are, far more than our abilities. The key here is not merely building a planner, but building accountability. Perhaps we should license this directly to universities. If the department funds it, the students get it for free, and professors can see aggregated data on which topics students struggle with.`,
        emotion: "thoughtful"
      },
      {
        character: "Harry",
        text: `Exactly, Dumbledore! If Hogwarts licensed it, I wouldn't have failed Divination! And Hermione, the AI learns from user feedback. If a student marks a lab as 'hard', next week's block expands automatically. It adapts to the student!`,
        emotion: "supportive"
      },
      {
        character: "Hermione",
        text: `A feedback loop! Yes, that does resolve the calibration issue. However, we must ensure strict privacy. Students will not want their study habits or performance metrics shared directly with professors in a way that affects their grading. We must anonymize all data.`,
        emotion: "thoughtful"
      },
      {
        character: "Ron",
        text: `If it means I can get Harry to remind me about our Herbology exam, I'm in. Let's build a prototype and test it on the Gryffindors!`,
        emotion: "excited"
      },
      {
        character: "Dumbledore",
        text: `Then it is decided. We shall proceed with the prototype, prioritizing student privacy and institutional licensing as our primary monetization path. Let the work begin.`,
        emotion: "supportive"
      }
    ],
    investorPitch: {
      elevatorPitch: `StartupOS presents ${startupName}, the first adaptive study assistant designed specifically for engineering students. We translate complex syllabi into customized, dynamic calendars that adapt to how fast a student actually learns.`,
      problem: "Engineering students face intense workloads, leading to high burnout rates. Traditional planners are static, requiring manual updating and failing to account for varying difficulty of engineering subjects.",
      solution: `An intelligent platform that parses syllabi PDFs, generates optimized weekly study allocations, adapts based on actual study duration, and prevents student burnout.`,
      marketOpportunity: "With over 20 million engineering students worldwide spending average $1,200/year on academic assistance, the serviceable addressable market is $2.4B.",
      revenueModel: "Freemium model with $4.99/month student premium tier, alongside institutional SaaS licenses for universities starting at $5,000/year.",
      fundingAsk: "Seeking $250k pre-seed funding to finalize our AI syllabus parser, run a pilot with 3 universities, and achieve 10,000 active users."
    },
    landingPageHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${startupName} - Master Your Engineering Schedule</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#0b0f19] text-gray-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">

  <!-- Header -->
  <header class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
    <div class="flex items-center space-x-2">
      <span class="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">${startupName}</span>
    </div>
    <a href="#features" class="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-colors">Features</a>
    <a href="#pricing" class="text-sm font-medium text-gray-400 hover:text-indigo-400 transition-colors">Pricing</a>
    <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30">Get Started Free</button>
  </header>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-6 pt-12 pb-24 text-center relative">
    <div class="absolute inset-0 -z-10 flex items-center justify-center">
      <div class="w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div class="w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -translate-x-20"></div>
    </div>
    
    <div class="inline-flex items-center space-x-2 bg-indigo-950/50 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-8 shadow-sm">
      <span>✨ Built for Engineering Students</span>
    </div>
    
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-8">
      Syllabus to study schedule in <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">one click</span>
    </h1>
    
    <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      Stop wasting hours color-coding calendars. Upload your syllabi, and let ${startupName}'s AI plan your study blocks, predict difficulty, and keep you on track.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <button class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-indigo-600/30 scale-100 hover:scale-[1.02] active:scale-[0.98]">
        Upload Syllabus PDF
      </button>
      <button class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300 px-8 py-4 rounded-xl font-bold text-base transition-all">
        Watch Demo Video
      </button>
    </div>

    <!-- Dashboard Mockup -->
    <div class="max-w-5xl mx-auto border border-gray-800 bg-slate-950/80 rounded-2xl p-4 md:p-6 shadow-2xl relative">
      <div class="flex items-center space-x-2 border-b border-gray-900 pb-4 mb-4">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-xs text-gray-500 pl-4">dashboard.${startupName.toLowerCase()}.com</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div class="bg-slate-900/50 border border-gray-900 p-5 rounded-xl">
          <p class="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Upcoming Exam</p>
          <h3 class="text-lg font-bold text-white mb-1">Calculus III: Triple Integrals</h3>
          <p class="text-sm text-indigo-400 font-medium mb-3">Schedules: 4 hrs allocated</p>
          <div class="w-full bg-slate-800 rounded-full h-2">
            <div class="bg-indigo-500 h-2 rounded-full" style="width: 75%"></div>
          </div>
        </div>
        <div class="bg-slate-900/50 border border-gray-900 p-5 rounded-xl">
          <p class="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">AI Focus Assistant</p>
          <h3 class="text-lg font-bold text-white mb-1">Thermodynamics</h3>
          <p class="text-sm text-yellow-400 font-medium mb-3">Requires 3 hours today (High Difficulty)</p>
          <button class="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg font-bold">Start Study Session</button>
        </div>
        <div class="bg-slate-900/50 border border-gray-900 p-5 rounded-xl">
          <p class="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Weekly Mastery</p>
          <h3 class="text-4xl font-extrabold text-white mb-1">92%</h3>
          <p class="text-xs text-green-400 font-semibold">↑ 8% from last week</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="max-w-7xl mx-auto px-6 py-24 border-t border-gray-950">
    <h2 class="text-3xl md:text-5xl font-extrabold text-center mb-16">Features built for high performance</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-950 border border-gray-900 p-8 rounded-2xl">
        <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-xl mb-6">📄</div>
        <h3 class="text-xl font-bold text-white mb-3">Syllabus PDF Parser</h3>
        <p class="text-gray-400 text-sm leading-relaxed">Drag and drop your syllabus. Our parser identifies exam dates, homework schedules, and project timelines automatically.</p>
      </div>
      <div class="bg-slate-950 border border-gray-900 p-8 rounded-2xl">
        <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-extrabold text-xl mb-6">🧠</div>
        <h3 class="text-xl font-bold text-white mb-3">Adaptive Scheduling</h3>
        <p class="text-gray-400 text-sm leading-relaxed">AI detects when you finish early or need extra time, automatically updating downstream schedules to ensure zero cramming.</p>
      </div>
      <div class="bg-slate-950 border border-gray-900 p-8 rounded-2xl">
        <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-extrabold text-xl mb-6">📈</div>
        <h3 class="text-xl font-bold text-white mb-3">Student Stats & Insights</h3>
        <p class="text-gray-400 text-sm leading-relaxed">See detailed insights on study efficiency, subjects that take the most time, and predictive grading trends before exams arrive.</p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="max-w-5xl mx-auto my-24 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
    <div class="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px]"></div>
    <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to ace your semesters?</h2>
    <p class="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed text-sm md:text-base">Join thousands of engineering students at Stanford, MIT, and IIT who have upgraded their study systems.</p>
    <button class="bg-white hover:bg-gray-100 text-slate-950 px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-white/10">Start Planning For Free</button>
  </section>

  <!-- Footer -->
  <footer class="max-w-7xl mx-auto px-6 py-12 border-t border-gray-950 text-center text-gray-600 text-xs">
    <p>&copy; ${new Date().getFullYear()} ${startupName}. All rights reserved.</p>
  </footer>

</body>
</html>`
  };
}

// Main generation endpoint
app.post('/api/analyze', async (req, res) => {
  const { startupIdea } = req.body;
  
  if (!startupIdea || startupIdea.trim() === "") {
    return res.status(400).json({ error: "Startup idea is required" });
  }

  console.log(`[StartupOS] Received request for idea: "${startupIdea}"`);

  // Fallback if SDK not initialized
  if (!groq) {
    console.log(`[StartupOS] Groq API key not set. Generating fallback mockup...`);
    const mock = generateMockResponse(startupIdea);
    return res.json(mock);
  }

  try {
    const systemPrompt = `You are a high-level Startup Accelerator Board and AI Startup Co-founder suite.
You must output a highly detailed startup analysis based on the user's raw startup idea.
You MUST respond in strict JSON format matching the schema below. Do not wrap the JSON output in markdown blocks (like \`\`\`json). Return a direct raw JSON string.

JSON Schema:
{
  "startupName": "A catchy, relevant name for the startup",
  "ideaScore": 0-100 number (be realistic and brutal, hackathons are competitive),
  "realityCheck": {
    "score": 0-100 number,
    "problems": ["3 major bottlenecks, risks, or saturated markets reasons"],
    "recommendations": ["3 practical suggestions or pivots"]
  },
  "buildability": {
    "score": 1-10 difficulty rating,
    "canBuild": true/false (can 4 students build an MVP in a 3-day hackathon?),
    "estimatedWeeks": estimated weeks for full MVP,
    "difficultyText": "Easy" | "Medium" | "Hard" | "Extremely Hard",
    "studentAdvice": ["3 tactical tips for hackathon/student execution"]
  },
  "executiveReports": {
    "ceo": { "title": "CEO Strategy", "summary": "One sentence summary", "points": ["3 bullet points"] },
    "marketResearch": { "title": "Market Size & Trends", "summary": "One sentence summary", "points": ["3 bullet points"] },
    "competitorAnalysis": { "title": "Competitive Landscape", "summary": "One sentence summary", "points": ["3 bullet points"] },
    "product": { "title": "Product Specs & Tech Stack", "summary": "One sentence summary", "points": ["3 bullet points"] },
    "cfo": { "title": "Revenue & Financials", "summary": "One sentence summary", "points": ["3 bullet points"] },
    "marketing": { "title": "Go-to-Market Strategy", "summary": "One sentence summary", "points": ["3 bullet points"] }
  },
  "boardroomDebate": [
    {
      "character": "Harry",
      "text": "Dialogue line... (acts as the enthusiastic founder, eager and creative, uses wizarding analogies occasionally)",
      "emotion": "excited" | "supportive" | "thoughtful"
    },
    {
      "character": "Hermione",
      "text": "Dialogue line... (acts as the skeptical, logic-driven product manager, questions data, market size, and logical fallacies)",
      "emotion": "skeptical" | "thoughtful"
    },
    {
      "character": "Ron",
      "text": "Dialogue line... (acts as the common-sense cofounder, worries about execution simplicity, and costs: 'will students actually pay for this?', comments on ease or complexity)",
      "emotion": "roasting" | "skeptical" | "excited"
    },
    {
      "character": "Dumbledore",
      "text": "Dialogue line... (acts as the wise chairman/angel investor, guides them, reconciles differences, suggests high-level strategic compromises)",
      "emotion": "thoughtful" | "supportive"
    }
    // Repeat to create a detailed debate of exactly 8 turns total. Keep the banter lively, dramatic, and humorous.
  ],
  "investorPitch": {
    "elevatorPitch": "1-2 sentence compelling pitch",
    "problem": "Clear problem statement",
    "solution": "Clear solution statement",
    "marketOpportunity": "TAM/SAM figures & trends",
    "revenueModel": "Monetization details",
    "fundingAsk": "How much money and what is it for"
  },
  "landingPageHtml": "A beautiful, fully styled HTML structure utilizing Tailwind CSS via CDN. Include a clean hero section, features list, pricing cards, and a newsletter sign-up CTA. Use colors relevant to the startup concept (e.g. emerald/green for finance, indigo/violet for AI, amber for education). Make sure all text is tailored to this specific startup idea. Return the HTML as a clean single string without markdown formatting or code blocks."
}`;

    console.log(`[StartupOS] Calling Groq API...`);
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this startup idea: "${startupIdea}"` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const resultText = completion.choices[0].message.content;
    const parsedData = JSON.parse(resultText);
    parsedData.isMock = false;

    res.json(parsedData);
  } catch (error) {
    console.error(`[StartupOS] Groq API error:`, error.message);
    console.log(`[StartupOS] Falling back to Mock Mode...`);
    const mock = generateMockResponse(startupIdea);
    res.json(mock);
  }
});

// Health check / static
app.get('/', (req, res) => {
  res.send('StartupOS Backend Server is running.');
});

app.listen(PORT, () => {
  console.log(`[StartupOS] Server running on http://localhost:${PORT}`);
});
