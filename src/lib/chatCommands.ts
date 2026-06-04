export type ChatCommand =
  | {
      type: "reminder";
      title: string;
      dateTime: string;
    }
  | {
      type: "event";
      title: string;
      dateTime: string;
      note?: string;
    }
  | {
      type: "none";
    };

function cleanCommandText(text: string) {
  return text
    .replace(/^reze[\s,]+/i, "")
    .replace(/^hey reze[\s,]+/i, "")
    .trim();
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

type DateTimeMatch = {
  dateTime: string;
  index: number;
  length: number;
};

function findDateTimeMatch(text: string): DateTimeMatch | null {
  const patterns = [
    /\b(?:after|in)\s+\d+\s+minutes?\b/i,
    /\b(?:after|in)\s+\d+\s+hours?\b/i,
    /\b(?:today|tomorrow)\s+(?:morning|afternoon|evening|night)\b/i,
    /\b(?:tomorrow|today)\b/i,
    /\b(?:on\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?\b/i,
    /\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      return {
        dateTime: normalizeText(match[0]),
        index: match.index,
        length: match[0].length,
      };
    }
  }

  return null;
}

function extractTitleAndDateTime(content: string) {
  const normalized = normalizeText(content);
  const match = findDateTimeMatch(normalized);

  if (!match) {
    return {
      title: normalized || "Untitled reminder",
      dateTime: "No date/time set",
    };
  }

  const before = normalized.slice(0, match.index).trim();
  const after = normalized.slice(match.index + match.length).trim();
  let title = normalizeText(`${before} ${after}`);

  title = title.replace(/^(?:to|for|a|an)\s+/i, "").trim();
  title = title.replace(/\s+to\s*$/i, "").trim();
  title = title.replace(/\s+at\s*$/i, "").trim();
  title = title.replace(/\s+on\s*$/i, "").trim();

  if (!title) {
    title = "Untitled reminder";
  }

  return {
    title,
    dateTime: match.dateTime,
  };
}

export function parseChatCommand(input: string): ChatCommand {
  const message = cleanCommandText(input);
  const normalized = message.toLowerCase();

  const reminderMatch = normalized.match(
    /^(?:remind me to|remind me about|remember to|add reminder(?: to)?|save reminder(?: to)?|reminder to)\s+(.+)$/i
  );

  if (reminderMatch) {
    const content = message.slice(reminderMatch[0].length - reminderMatch[1].length).trim();
    const result = extractTitleAndDateTime(content || reminderMatch[1]);

    return {
      type: "reminder",
      title: result.title || "Untitled reminder",
      dateTime: result.dateTime || "No date/time set",
    };
  }

  const eventMatch = normalized.match(
    /^(?:add event|save event|create event|create an event|schedule event|schedule an event|event)\s+(.+)$/i
  );

  if (eventMatch) {
    const content = message.slice(eventMatch[0].length - eventMatch[1].length).trim();
    const result = extractTitleAndDateTime(content || eventMatch[1]);

    return {
      type: "event",
      title: result.title || "Untitled event",
      dateTime: result.dateTime || "No date/time set",
      note: undefined,
    };
  }

  return {
    type: "none",
  };
}
