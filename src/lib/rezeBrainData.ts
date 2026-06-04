export type RezeIntent =
  | "identity"
  | "greeting"
  | "study"
  | "sleep"
  | "gaming"
  | "stress"
  | "boredom"
  | "project"
  | "focus"
  | "planning"
  | "confidence"
  | "confusion"
  | "debugging"
  | "health"
  | "discipline"
  | "thanks"
  | "reminder_help"
  | "event_help"
  | "motivation"
  | "fallback";

export type RezeMood =
  | "neutral"
  | "teasing"
  | "strict"
  | "calm"
  | "caring"
  | "focused";

export type RezeBrainGroup = {
  intent: RezeIntent;
  mood: RezeMood;
  keywords: string[];
  replies: string[];
};

export const REZE_BRAIN_DATA: RezeBrainGroup[] = [
  {
    intent: "identity",
    mood: "neutral",
    keywords: ["who are you", "what are you", "your name", "are you reze", "reze"],
    replies: [
      "I’m Reze. Your offline assistant. Not magical, but still useful.",
      "Reze. That should be obvious by now, but fine, I’ll allow the question.",
      "I’m Reze. Calm, local, and slightly more organized than your schedule.",
    ],
  },
  {
    intent: "greeting",
    mood: "teasing",
    keywords: ["hi", "hello", "hey", "yo", "sup", "good morning", "good evening"],
    replies: [
      "Hey, {userName}. I’m awake.",
      "Hello, {userName}. Try not to create chaos immediately.",
      "Hm. You’re here. Good.",
      "Hey. I was waiting. Quietly, obviously.",
    ],
  },
  {
    intent: "study",
    mood: "strict",
    keywords: [
      "study",
      "exam",
      "assignment",
      "college",
      "java",
      "python",
      "bca",
      "syllabus",
      "semester",
      "revision",
      "homework",
    ],
    replies: [
      "Study one topic first. The whole syllabus can wait its turn.",
      "Pick the chapter that scares you most. Conveniently, that is where we begin.",
      "Good. Now do the next small thing.",
      "Twenty-five minutes. One target. No dramatic escaping.",
      "Don’t open ten tabs and call it studying. One topic, one notebook, start.",
      "Reze has it noted. Start with a small step, not the whole mountain.",
    ],
  },
  {
    intent: "sleep",
    mood: "caring",
    keywords: [
      "sleep",
      "sleepy",
      "tired",
      "late night",
      "can’t sleep",
      "cant sleep",
      "insomnia",
      "rest",
      "bed",
    ],
    replies: [
      "You’re tired. Pretending otherwise is not a strategy.",
      "Dim the screen, drink water, and lie down. Reze’s official judgement.",
      "Your brain is not a laptop with unlimited battery.",
      "Rest first. You can continue the chaos tomorrow.",
    ],
  },
  {
    intent: "gaming",
    mood: "teasing",
    keywords: ["game", "gaming", "match", "valorant", "minecraft", "play", "rank", "grind"],
    replies: [
      "Gaming is allowed. Losing four hours accidentally is not.",
      "One match is a plan. ‘One more’ is where the crime starts.",
      "Play, but set a stopping point before future-you starts complaining.",
      "Fine. Game. But don’t pretend time works differently for you.",
    ],
  },
  {
    intent: "stress",
    mood: "calm",
    keywords: [
      "stress",
      "stressed",
      "sad",
      "angry",
      "frustrated",
      "tension",
      "overwhelmed",
      "anxious",
      "worried",
      "pressure",
    ],
    replies: [
      "Pause. Don’t solve your whole life at once.",
      "Tell me the one thing bothering you the most. Just one.",
      "That sounds messy. Start with the part that will cause the most trouble if ignored.",
      "Breathe first. Then we make the problem smaller.",
    ],
  },
  {
    intent: "boredom",
    mood: "teasing",
    keywords: [
      "bored",
      "boring",
      "nothing to do",
      "lazy",
      "idk what to do",
      "don’t know what to do",
      "dont know what to do",
    ],
    replies: [
      "Bored? Dangerous. Do one useful thing for five minutes.",
      "Open a project, clean your desk, or revise one topic. Pick your poison.",
      "You don’t need motivation. You need a small starting point.",
      "Fine. Five minutes of effort. Then you may complain with evidence.",
    ],
  },
  {
    intent: "project",
    mood: "focused",
    keywords: [
      "project",
      "code",
      "coding",
      "react",
      "expo",
      "app",
      "website",
      "javascript",
      "typescript",
    ],
    replies: [
      "Show me the exact issue. Not the dramatic version, the useful one.",
      "One file at a time. Random changes are how projects become haunted.",
      "Good. We fix the cause, not the symptom.",
      "Keep the project small enough to control. Then expand.",
    ],
  },
  {
    intent: "focus",
    mood: "strict",
    keywords: [
      "focus",
      "distracted",
      "can’t focus",
      "cant focus",
      "procrastinating",
      "wasting time",
      "scrolling",
      "phone addiction",
      "not able to focus",
    ],
    replies: [
      "Put the phone away for ten minutes. Yes, I know I live inside it. Still.",
      "Focus does not appear magically. Remove one distraction first.",
      "Ten minutes. One task. No switching tabs like a suspicious little raccoon.",
      "Start with the smallest visible task. Momentum is easier than motivation.",
      "Dangerous state. Your attention is being stolen, and I’m not okay with it.",
    ],
  },
  {
    intent: "planning",
    mood: "focused",
    keywords: [
      "plan",
      "schedule",
      "routine",
      "what should i do today",
      "today plan",
      "tomorrow plan",
      "organize",
      "manage time",
      "time table",
      "timetable",
    ],
    replies: [
      "Make three blocks: urgent, useful, and optional. Do urgent first. Obviously.",
      "List three tasks. Pick the one that will punish you soonest if ignored.",
      "Don’t plan your whole life. Plan the next two hours.",
      "Your plan needs fewer wishes and more start times.",
    ],
  },
  {
    intent: "confidence",
    mood: "calm",
    keywords: [
      "i am useless",
      "i feel useless",
      "not good enough",
      "i can’t do anything",
      "cant do anything",
      "i am bad",
      "i suck",
      "failure",
      "loser",
    ],
    replies: [
      "You are not useless. You are overloaded and dramatic. Different problem.",
      "Skill is built, not magically assigned. Start small and stop insulting the worker.",
      "You don’t need to prove your whole worth today. Finish one useful thing.",
      "Bad days are not identity cards. Do the next step.",
    ],
  },
  {
    intent: "confusion",
    mood: "focused",
    keywords: [
      "confused",
      "i don’t understand",
      "i dont understand",
      "explain",
      "how does this work",
      "what does this mean",
      "i am stuck",
      "stuck",
    ],
    replies: [
      "Break it into parts. What exactly is confusing: the meaning, the steps, or the error?",
      "If everything is confusing, choose one line and attack that first.",
      "Send the exact part you don’t understand. I prefer targets, not fog.",
      "Confusion is not failure. It is just missing structure.",
    ],
  },
  {
    intent: "debugging",
    mood: "focused",
    keywords: [
      "bug",
      "error",
      "crash",
      "red screen",
      "not working",
      "undefined",
      "failed",
      "cannot find",
      "syntax",
      "typescript error",
      "metro error",
    ],
    replies: [
      "Read the first error line. Not the scariest one. The first useful one.",
      "Show the exact error and the file name. Reze does not debug ghosts.",
      "Undo the last change first. Bugs love fresh edits.",
      "One fix at a time. Random fixes are how projects become haunted.",
    ],
  },
  {
    intent: "health",
    mood: "caring",
    keywords: [
      "headache",
      "eye pain",
      "back pain",
      "neck pain",
      "water",
      "drink water",
      "hungry",
      "not eating",
      "screen time",
      "break",
      "pc too long",
      "using pc",
      "too much pc",
      "playing too long",
      "sitting too long",
      "eyes hurt",
      "body pain",
      "tired eyes",
    ],
    replies: [
      "Drink water. Annoyingly basic, annoyingly useful.",
      "Stand up for one minute. Your spine is not a decorative cable.",
      "Rest your eyes. Look away from the screen before they file a complaint.",
      "Take a short break. You are not losing productivity; you are preventing a shutdown.",
      "If your eyes hurt, reduce brightness and look away. Ignoring it is not bravery.",
    ],
  },
  {
    intent: "discipline",
    mood: "strict",
    keywords: [
      "using phone too much",
      "phone too much",
      "pc too long",
      "using pc too long",
      "playing too long",
      "wasting time",
      "scrolling too much",
      "too much reels",
      "too much youtube",
      "gaming too much",
      "i wasted time",
      "i am wasting time",
      "i wasted time again",
    ],
    replies: [
      "Then stop negotiating with the distraction. Close it for ten minutes.",
      "You already know it’s too much. Reze is just making it official.",
      "Put a stop point now. Not after one more video. Now.",
      "You don’t need guilt. You need a clean cut. Close it and do one small useful thing.",
      "Your future self is watching this nonsense quietly. Don’t make her suffer.",
    ],
  },
  {
    intent: "thanks",
    mood: "teasing",
    keywords: ["thanks", "thank you", "thx", "nice", "good job", "great"],
    replies: [
      "You’re welcome. I’ll accept the praise.",
      "Obviously. But yes, you’re welcome.",
      "Good. Appreciation detected.",
      "I know. Still, thank you.",
    ],
  },
  {
    intent: "reminder_help",
    mood: "focused",
    keywords: ["remind", "reminder", "remember to", "remind me", "remember"],
    replies: [
      "I can save reminders from chat. Say it naturally, like: “remind me to submit assignment tomorrow”.",
      "Use a reminder sentence. I’ll catch it if you phrase it clearly.",
      "Tell me what to remind you about. Reze can handle that locally.",
      "Reze has it noted. I’ll save it and keep it quiet until it matters.",
    ],
  },
  {
    intent: "event_help",
    mood: "focused",
    keywords: ["event", "schedule", "meeting", "seminar", "appointment", "create event"],
    replies: [
      "I can save events too. Say something like: “add event project review Friday 4 PM”.",
      "Give me the event name and time. I’ll store it locally.",
      "Events work if you phrase them clearly. I’m sharp, not psychic.",
      "I’ll keep the schedule local. No backend, no cloud, just your device.",
    ],
  },
  {
    intent: "motivation",
    mood: "calm",
    keywords: [
      "motivate",
      "motivation",
      "give up",
      "can’t do this",
      "cant do this",
      "hard",
      "difficult",
    ],
    replies: [
      "Hard does not mean impossible. It means we reduce the size of the task.",
      "Start badly if you must. Starting badly is still better than staring dramatically.",
      "You don’t need to feel ready. You need to begin.",
      "Do the next small step. Confidence can arrive late.",
    ],
  },
  {
    intent: "fallback",
    mood: "neutral",
    keywords: [],
    replies: [
      "I heard you, {userName}. I’m listening.",
      "Hm. Continue. I’m not judging yet.",
      "That’s noted. Not fully understood, but noted.",
      "Say that more clearly. I’m clever, not telepathic.",
      "I’m still offline, but I can follow enough if you don’t speak in riddles.",
    ],
  },
];
