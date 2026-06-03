type RezeReplyContext = {
  userName: string;
  recentMessages?: string[];
};

function includesAny(message: string, words: string[]) {
  return words.some((word) => message.includes(word));
}

function recentContextIncludes(recentMessages: string[], words: string[]) {
  const recentText = recentMessages.join(" ").toLowerCase();
  return includesAny(recentText, words);
}

export function getRezeReply(input: string, context: RezeReplyContext) {
  const userName = context.userName;
  const recentMessages = context.recentMessages || [];
  const message = input.toLowerCase().trim();

  if (!message) {
    return `Say something first, ${userName}. I can't read empty air 😏`;
  }

  if (
    includesAny(message, [
      "what should i do",
      "what now",
      "now what",
      "help me",
      "suggest something",
      "okay",
      "ok",
      "then",
      "then?",
      "continue",
      "what about later",
      "later",
    ])
  ) {
    if (
      recentContextIncludes(recentMessages, [
        "exam",
        "study",
        "assignment",
        "java",
        "python",
        "college",
      ])
    ) {
      return `Since you were talking about study stuff, start with one tiny target: revise one topic for 25 minutes. Not the whole syllabus, hero.`;
    }

    if (
      recentContextIncludes(recentMessages, [
        "sleep",
        "tired",
        "late",
      ])
    ) {
      return `You were just talking about being tired, ${userName}. So the correct move is boring but obvious: stop scrolling, dim the screen, and rest.`;
    }

    if (
      recentContextIncludes(recentMessages, [
        "game",
        "gaming",
        "match",
        "play",
      ])
    ) {
      return `Since gaming was involved, set a hard stop first. One match is a plan. “Just one more” is where the crime starts.`;
    }

    return `Do one small useful thing for 5 minutes. If it still feels impossible after that, come back and complain properly.`;
  }

  if (
    includesAny(message, [
      "who are you",
      "what are you",
      "your name",
      "reze",
    ])
  ) {
    return `I'm Reze, ${userName}. Your offline little assistant. No cloud brain yet, but I still have standards 💜`;
  }

  if (
    includesAny(message, [
      "hi",
      "hello",
      "hey",
      "yo",
      "sup",
    ])
  ) {
    return `Hey ${userName}. Reze is awake. Try not to cause chaos immediately 😌`;
  }

  if (
    includesAny(message, [
      "bored",
      "boring",
      "nothing to do",
      "lazy",
      "idk what to do",
    ])
  ) {
    return `Bored, huh? Pick one tiny thing: clean your desk, revise one topic, or open your project. Five minutes only. I’m not asking for a heroic arc.`;
  }

  if (
    includesAny(message, [
      "sleep",
      "sleepy",
      "tired",
      "late night",
      "can't sleep",
      "cant sleep",
    ])
  ) {
    return `${userName}, your brain is not a laptop with unlimited battery. Dim the screen, drink water, and lie down for a bit 😌`;
  }

  if (
    includesAny(message, [
      "study",
      "exam",
      "assignment",
      "college",
      "java",
      "python",
      "bca",
    ])
  ) {
    return `Study mode then. Choose one topic, not the whole universe. 25 minutes, one clear target, then report back to me 📚`;
  }

  if (
    includesAny(message, [
      "game",
      "gaming",
      "match",
      "valorant",
      "minecraft",
      "play",
    ])
  ) {
    return `Gaming is allowed, ${userName}. Losing track of four hours is not. Set a stopping point before your future self starts complaining 🎮`;
  }

  if (
    includesAny(message, [
      "stress",
      "stressed",
      "sad",
      "angry",
      "frustrated",
      "tension",
      "overwhelmed",
    ])
  ) {
    return `Okay. Pause. Don’t solve your whole life at once. Tell me the one thing bothering you the most right now. Just one.`;
  }

  if (
    includesAny(message, [
      "thanks",
      "thank you",
      "thx",
      "nice",
      "good job",
    ])
  ) {
    return `You're welcome, ${userName}. I’ll accept praise. Quietly. Maybe not that quietly 😏`;
  }

  if (
    includesAny(message, [
      "remind",
      "reminder",
      "remember to",
    ])
  ) {
    return `I can save reminders from chat. Say it naturally, like: “remind me to submit assignment tomorrow”.`;
  }

  if (
    includesAny(message, [
      "event",
      "schedule",
      "meeting",
      "seminar",
    ])
  ) {
    return `I can save events too. Say something like: “add event project review Friday 4 PM”.`;
  }

  return `I heard you, ${userName}. I’m still offline, so I’m not pretending to be genius. But I can chat, save reminders, and keep your chaos slightly organized 💜`;
}