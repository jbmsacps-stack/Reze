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
    .replace(/^reze,/i, "")
    .replace(/^hey reze,/i, "")
    .trim();
}

function splitTitleAndTime(content: string) {
  const splitWords = [
    " at ",
    " on ",
    " today ",
    " tomorrow ",
    " tonight ",
    " morning ",
    " evening ",
    " friday ",
    " monday ",
    " tuesday ",
    " wednesday ",
    " thursday ",
    " saturday ",
    " sunday ",
  ];

  const lowerContent = content.toLowerCase();

  for (const word of splitWords) {
    const index = lowerContent.indexOf(word);

    if (index !== -1) {
      const title = content.slice(0, index).trim();
      const dateTime = content.slice(index).trim();

      return {
        title: title || content,
        dateTime: dateTime || "No date/time set",
      };
    }
  }

  return {
    title: content,
    dateTime: "No date/time set",
  };
}

export function parseChatCommand(input: string): ChatCommand {
  const message = cleanCommandText(input);
  const lowerMessage = message.toLowerCase();

  const reminderStarters = [
    "remind me to",
    "remind me about",
    "remember to",
    "reminder to",
    "add reminder",
    "save reminder",
  ];

  const eventStarters = [
    "add event",
    "save event",
    "create event",
    "create an event",
    "schedule event",
    "schedule an event",
    "event",
  ];

  const reminderStarter = reminderStarters.find((starter) =>
    lowerMessage.startsWith(starter)
  );

  if (reminderStarter) {
    const content = message.slice(reminderStarter.length).trim();

    if (!content) {
      return {
        type: "reminder",
        title: "Untitled reminder",
        dateTime: "No date/time set",
      };
    }

    const result = splitTitleAndTime(content);

    return {
      type: "reminder",
      title: result.title,
      dateTime: result.dateTime,
    };
  }

  const eventStarter = eventStarters.find((starter) =>
    lowerMessage.startsWith(starter)
  );

  if (eventStarter) {
    const content = message.slice(eventStarter.length).trim();

    if (!content) {
      return {
        type: "event",
        title: "Untitled event",
        dateTime: "No date/time set",
      };
    }

    const result = splitTitleAndTime(content);

    return {
      type: "event",
      title: result.title,
      dateTime: result.dateTime,
    };
  }

  return {
    type: "none",
  };
}