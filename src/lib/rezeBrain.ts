import { REZE_BRAIN_DATA, RezeBrainGroup, RezeMood } from "./rezeBrainData";

type RezeReplyContext = {
  userName: string;
  recentMessages?: string[];
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function wordBoundaryMatch(message: string, keyword: string) {
  const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return regex.test(message);
}

function scoreBrainGroup(message: string, group: RezeBrainGroup) {
  let score = 0;
  const normalizedMessage = message.toLowerCase();
  const tokens = normalizedMessage.split(/\s+/).filter(Boolean);

  for (const keyword of group.keywords) {
    const normalizedKeyword = keyword.toLowerCase();

    if (normalizedMessage === normalizedKeyword) {
      score += 22;
      continue;
    }

    if (normalizedMessage.startsWith(normalizedKeyword)) {
      score += 16;
    }

    if (normalizedMessage.endsWith(normalizedKeyword)) {
      score += 14;
    }

    if (normalizedKeyword.includes(" ")) {
      if (normalizedMessage.includes(normalizedKeyword)) {
        score += 14;
      } else {
        const words = normalizedKeyword.split(" ");
        const matches = words.filter((word) => tokens.includes(word)).length;
        if (matches >= words.length - 1) {
          score += 8;
        }
      }
    } else if (wordBoundaryMatch(normalizedMessage, normalizedKeyword)) {
      score += 12;
    } else if (normalizedMessage.includes(normalizedKeyword)) {
      score += Math.max(2, Math.floor(normalizedKeyword.length / 4));
    }
  }

  return score;
}

function applyMoodStyle(reply: string, mood: RezeMood) {
  const rand = Math.random();

  switch (mood) {
    case "strict":
      if (rand > 0.8) {
        return `Dangerous state. ${reply}`;
      }
      if (rand > 0.5) {
        return `Hm. ${reply}`;
      }
      return reply;

    case "teasing":
      if (rand > 0.85) {
        return `Cute. But no. ${reply}`;
      }
      if (rand > 0.55) {
        return `${reply} Hm.`;
      }
      return reply;

    case "calm":
      if (rand > 0.75) {
        return `Annoying, but survivable. ${reply}`;
      }
      if (rand > 0.4) {
        return `${reply}`;
      }
      return reply;

    case "caring":
      if (rand > 0.65) {
        return `${reply} I noticed.`;
      }
      return reply;

    case "focused":
      if (rand > 0.7) {
        return `Don’t negotiate with the distraction. ${reply}`;
      }
      return reply;

    case "neutral":
    default:
      if (rand > 0.8) {
        return `Hm. ${reply}`;
      }
      return reply;
  }
}

function pickReply(group: RezeBrainGroup, userName: string, recentMessages: string[]) {
  const recentText = recentMessages.join(" ").toLowerCase();
  let reply = group.replies[Math.floor(Math.random() * group.replies.length)];

  for (let attempt = 0; attempt < 4; attempt++) {
    if (!recentText.includes(reply.toLowerCase())) {
      break;
    }
    reply = group.replies[Math.floor(Math.random() * group.replies.length)];
  }

  return applyMoodStyle(reply.replaceAll("{userName}", userName), group.mood);
}

function findBestBrainGroup(message: string) {
  const fallbackGroup = REZE_BRAIN_DATA.find((group) => group.intent === "fallback");
  let bestGroup = fallbackGroup;
  let bestScore = 0;

  for (const group of REZE_BRAIN_DATA) {
    if (group.intent === "fallback") continue;

    const score = scoreBrainGroup(message, group);

    if (score > bestScore) {
      bestScore = score;
      bestGroup = group;
    }
  }

  if (bestScore < 10 || !bestGroup) {
    return fallbackGroup;
  }

  return bestGroup;
}

function getFollowUpReply(
  message: string,
  recentMessages: string[],
  userName: string
) {
  const followUpWords = [
    "okay",
    "ok",
    "then",
    "what now",
    "now what",
    "what should i do",
    "continue",
    "later",
    "next",
    "what next",
    "now what",
    "and then",
  ];

  const normalizedMessage = message.toLowerCase();
  const isFollowUp = followUpWords.some((word) => normalizedMessage.includes(word));

  if (!isFollowUp || recentMessages.length === 0) {
    return null;
  }

  const recentText = recentMessages.join(" ").toLowerCase();

  if (
    recentText.includes("exam") ||
    recentText.includes("study") ||
    recentText.includes("assignment")
  ) {
    return `Since study is the problem, ${userName}, pick one topic and finish one small part first. Not the whole syllabus. Don’t make this dramatic.`;
  }

  if (
    recentText.includes("sleep") ||
    recentText.includes("tired") ||
    recentText.includes("late") ||
    recentText.includes("insomnia")
  ) {
    return "Then rest. Revolutionary idea, I know. Your brain is clearly asking for maintenance.";
  }

  if (
    recentText.includes("game") ||
    recentText.includes("gaming") ||
    recentText.includes("play") ||
    recentText.includes("scroll") ||
    recentText.includes("reels") ||
    recentText.includes("youtube")
  ) {
    return "Then set a stopping point before playing. One match is a plan. ‘One more’ is a trap.";
  }

  if (
    recentText.includes("phone") ||
    recentText.includes("scrolling") ||
    recentText.includes("reels")
  ) {
    return "If you’re still scrolling, put the phone down now. Don’t negotiate with the distraction.";
  }

  return "Then do the next small useful thing. Tiny step first, dramatic thoughts later.";
}

export function getRezeReply(input: string, context: RezeReplyContext) {
  const userName = context.userName;
  const recentMessages = context.recentMessages || [];
  const message = normalizeText(input);

  if (!message) {
    return `Say something first, ${userName}. I can't read empty air.`;
  }

  const followUpReply = getFollowUpReply(message, recentMessages, userName);

  if (followUpReply) {
    return followUpReply;
  }

  const bestGroup = findBestBrainGroup(message);

  if (!bestGroup) {
    return `I heard you, ${userName}. Say it more clearly.`;
  }

  return pickReply(bestGroup, userName, recentMessages);
}