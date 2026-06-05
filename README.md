# Reze — Personal Android Assistant 🤖✨

Reze is a **personal Android assistant app** built with **Expo**, **React Native**, and **TypeScript**.

It started as a simple reminder bot.

A very innocent plan.

> “Remind me to drink water.”  
> “Remind me to sleep.”  
> “Remind me to stop pretending I will sleep after one more YouTube video.”

Then, naturally, the project escaped containment.

Now Reze supports reminders, events, today’s schedule, local notifications, offline assistant replies, and an optional online Gemini-powered mode.

So yes — this project began as a reminder bot and slowly became a small personal assistant with offline/online switching.

Side projects do this sometimes. They act small, then suddenly ask for architecture.

---

## 📌 Project Status

Reze is **not a commercial product**.

It is currently a **personal project**, made mainly for my own use, my own workflow, and my own daily routine.

However, the project can still be useful for others as a reference.

Developers, students, and beginners can look at this codebase to understand how to build:

- A React Native assistant app
- A local reminder system
- Event storage using AsyncStorage
- Expo local notifications
- Offline chatbot-style responses
- Gemini integration using a local proxy
- Offline / online AI mode switching
- A simple Android-first productivity assistant

This is not marketed as a finished commercial AI assistant.

This is more like:

> “Here is how I built my own assistant because I wanted one, and because relying on expensive backend systems for every small idea is painful.”

---

## 🧠 Why Reze Exists

Most assistant apps try to become massive products.

Reze does not try to compete with Siri, Google Assistant, ChatGPT, or any futuristic AI assistant that probably has a server room breathing behind it.

Reze has a simpler purpose:

> Help me manage reminders, events, boredom, study, project work, and daily discipline in a personal way.

It is designed to be:

- Lightweight
- Personal
- Android-focused
- Offline-capable
- Beginner-readable
- Easy to modify
- Not dependent on paid backend hosting

Because let us be honest:

> These days, building “everything” without money is not impossible, but it is definitely not relaxing.

So Reze uses a practical approach.

It works offline using a built-in assistant brain, and when online mode is enabled, it can connect to Gemini through a local proxy.

---

## ✨ Features

### 💬 Chat Assistant

Reze includes a chat screen where the user can talk casually with the assistant.

The chat can respond to topics like:

- Greetings
- Study
- Sleep
- Gaming
- Stress
- Boredom
- Project work
- Focus
- Planning
- Debugging
- Health
- Motivation
- Reminder help
- Event help

It is not pretending to be a super-intelligent AI.

It is more like a small assistant that says:

> “I may not control your whole life, but I can at least remind you that you have one.”

---

### 📴 Offline Assistant Mode

Reze has an offline assistant brain.

This allows it to reply without internet access.

Offline mode is useful when:

- Internet is unavailable
- Gemini fails
- The proxy server is not running
- The user wants quick local replies
- The app is being used without cloud dependency

The offline brain uses local intent groups, keywords, moods, and predefined replies.

Basically:

> No internet? No problem. Reze still has opinions.

---

### 🌐 Online Gemini Mode

Reze also supports an online mode using Gemini.

The project includes a local Node.js proxy server that reads the Gemini API key from a `.env` file.

This keeps the API key away from the mobile app itself.

Online mode is useful when the assistant needs smarter or more flexible responses.

The idea is simple:

| Mode | Use Case |
|---|---|
| Offline | Fast local replies without internet |
| Online | Gemini-powered replies through proxy |

---

### 🔁 Offline / Online Switch

Reze supports switching between:

- Offline mode
- Online Gemini mode

This gives the user control over how the assistant behaves.

The app does not force online AI for everything.

Sometimes a simple local reply is enough.

Sometimes Gemini is useful.

Sometimes both fail and you realize software development is character development.

---

### ⏰ Reminders

Reze can create and manage reminders.

Reminder features include:

- Add reminders
- Store reminders locally
- Mark reminders as completed
- Delete reminders
- Schedule local phone notifications
- Cancel reminder notifications when needed

Example commands:

```txt
Remind me to drink water at 8 PM
Remind me to study Java tomorrow
Remind me to sleep in 10 minutes
````

---

### 📅 Events

Reze can manage events.

Event features include:

* Add events
* Store event title
* Store date and time
* Add optional notes
* Delete events
* View events later

Example commands:

```txt
Add event project review tomorrow 5 PM
Add event Java exam Friday 10 AM
```

---

### 🗓️ Today Screen

The Today screen shows a simple daily overview.

It can display:

* Today’s reminders
* Today’s events
* Current schedule items

This makes Reze work like a small personal dashboard.

No corporate productivity nonsense.

Just:

> “Here is what you forgot you planned.”

---

### 🔔 Local Notifications

Reze uses Expo Notifications to schedule local reminder alerts.

This allows reminders to appear as actual phone notifications.

Because a reminder app that does not remind you is just a notes app with confidence.

---

### ⚙️ Settings

The app includes settings for:

* User name
* Notifications
* Dark mode
* AI mode
* Online configuration
* Data clearing

This makes the app easier to personalize and test.

---

## 🛠️ Tech Stack

| Area             | Technology              |
| ---------------- | ----------------------- |
| Mobile Framework | Expo                    |
| UI Framework     | React Native            |
| Language         | TypeScript              |
| Routing          | Expo Router             |
| Local Storage    | AsyncStorage            |
| Notifications    | Expo Notifications      |
| Icons            | Expo Vector Icons       |
| Online AI        | Gemini                  |
| Proxy Server     | Node.js + Express       |
| Styling          | React Native StyleSheet |
| Main Platform    | Android                 |

---

## 📁 Project Structure

```txt
reze_v1/
├── assets/
│   └── images/
├── scripts/
│   └── reset-project.js
├── server/
│   ├── .env.example
│   ├── package.json
│   └── reze-gemini-proxy.js
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   ├── reminders.tsx
│   │   │   ├── events.tsx
│   │   │   ├── today.tsx
│   │   │   └── settings.tsx
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   └── lib/
│       ├── chatCommands.ts
│       ├── notifications.ts
│       ├── onlineReze.ts
│       ├── rezeBrain.ts
│       ├── rezeBrainData.ts
│       └── storage.ts
├── app.json
├── eas.json
├── package.json
└── README.md
```

---

## 🧩 Important Files

### `src/app/(tabs)/index.tsx`

Main chat screen.

Handles:

* Chat messages
* Chat input
* Keyboard behavior
* Offline replies
* Online Gemini replies
* Reminder commands
* Event commands

---

### `src/lib/rezeBrain.ts`

Offline assistant logic.

Handles:

* Keyword matching
* Intent detection
* Mood-based replies
* Follow-up replies
* Local assistant behavior

---

### `src/lib/rezeBrainData.ts`

Offline brain data.

Contains:

* Intents
* Keywords
* Replies
* Assistant moods

This is where Reze’s personality is stored.

In technical terms, it is structured data.

In emotional terms, this is where the bot learned sarcasm legally.

---

### `src/lib/onlineReze.ts`

Online Gemini integration.

Handles:

* Gemini prompt building
* Local proxy requests
* Direct Gemini fallback logic
* Timeout handling
* Response validation
* Online assistant response parsing

---

### `src/lib/chatCommands.ts`

Parses user messages into commands.

Used for detecting reminders and events from chat input.

---

### `src/lib/notifications.ts`

Handles local notification setup, scheduling, and cancellation.

---

### `src/lib/storage.ts`

Handles local storage using AsyncStorage.

Stores:

* Reminders
* Events
* Settings
* AI mode
* User preferences

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/reze_v1.git
cd reze_v1
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Start the App

```bash
npx expo start
```

Then open it using:

* Android Emulator
* Expo Go
* Development Build
* Physical Android device

---

## 🌐 Optional Gemini Proxy Setup

Reze can work without Gemini.

But if you want online AI mode, set up the local proxy.

### 1. Open the server folder

```bash
cd server
```

### 2. Install server dependencies

```bash
npm install
```

### 3. Create `.env`

Copy the example file:

```bash
copy .env.example .env
```

Then add your Gemini API key:

```env
GEMINI_API_KEY=your_key_here
REZE_PROXY_PORT=5050
```

### 4. Start the proxy

```bash
npm start
```

---

## 📱 Android Device Note

On Android, do not use:

```env
http://localhost:5050
```

Because `localhost` means the phone itself, not your laptop.

Use your laptop IP address instead:

```env
EXPO_PUBLIC_REZE_PROXY_URL=http://192.168.x.x:5050
```

Example:

```env
EXPO_PUBLIC_REZE_PROXY_URL=http://192.168.1.5:5050
```

---

## 📦 Building APK

The project includes EAS build configuration for Android APK builds.

### Preview APK

```bash
eas build -p android --profile preview
```

### Production APK

```bash
eas build -p android --profile production
```

The `eas.json` file is configured for APK output.

---

## 🧪 Example Chat Commands

```txt
Remind me to drink water at 8 PM
Remind me to sleep in 10 minutes
Add event project review tomorrow 5 PM
Add event Java exam Friday 10 AM
What do I have today?
I am bored
I need to study
I played too long
Help me focus
I am tired
```

---

## 🔐 Privacy Direction

Reze is designed with a local-first mindset.

Most data is stored locally using AsyncStorage.

The Gemini API key is not meant to be placed directly inside the app. Instead, it should be stored in the local proxy server’s `.env` file.

This project does not currently use a commercial backend database.

Why?

Because servers cost money.

And because sometimes the most advanced architecture is:

> “Let me first make it work on my own phone.”

---

## 🧠 Future Vision

This version of Reze is only an early personal assistant experiment.

A more advanced and expert-level assistant bot can be built in the future with better technology exposure, stronger architecture, better AI integration, improved automation, and more resources.

Future versions could include:

* Better natural language understanding
* Voice input
* Voice replies
* Background assistant behavior
* Health reminders
* Sleep tracking nudges
* Gaming break alerts
* Calendar integration
* Smarter scheduling
* Better offline brain
* Cloud sync
* More secure user accounts
* More advanced AI memory
* Custom assistant personality modes
* APK-ready production polish
* Floating assistant overlay

But realistically:

> We cannot build every dream feature properly without time, money, infrastructure, APIs, testing devices, and some emotional damage.

This version is the foundation.

The future version can become much stronger as technology access improves.

---

## 🎯 Purpose of This Repository

This repository exists for:

* Personal learning
* Personal use
* Code reference
* React Native practice
* Expo notification testing
* Offline assistant experiments
* Gemini integration testing
* Android assistant development

It can help others understand how a small personal assistant app can be structured.

It is not presented as a complete commercial product.

It is a learning-first, personal-first project.

---

## 👤 Made For

Reze was made with my own routine in mind.

It was designed around:

* Studying
* Coding
* Project work
* Forgetting reminders
* Managing events
* Staying up too late
* Asking small questions
* Needing motivation
* Getting bored
* Wanting a small assistant that feels personal

Basically:

> Reze exists because my brain needed a notification system with personality.

---

## 🧭 Design Philosophy

```txt
Personal first.
Useful second.
Smart third.
Commercial later, maybe.
Budget: emotionally flexible.
```

Reze should remain:

* Simple
* Lightweight
* Personal
* Easy to understand
* Offline-capable
* Android-friendly
* Beginner-readable
* Expandable in the future

---

## ⚠️ Disclaimer

Reze is not a medical assistant, not a professional productivity coach, not a therapist, not a commercial AI platform, and not a replacement for real expert systems.

It is a personal assistant app made for learning, daily productivity, and experimentation.

In simple words:

> Use it, learn from it, improve it — but do not expect it to run your life while you sleep at 3 AM.

Although it may remind you to sleep.

That part is intentional.

---

## 📄 License

This project currently includes the default Expo MIT license file.

---

## 🏁 Final Note

Reze started as a reminder bot.

Then it got events.

Then it got notifications.

Then it got an offline brain.

Then Gemini entered the chat.

Then the project quietly became a personal assistant.

Not a commercial product.

Not a billion-dollar AI startup.

Just a personally built Android assistant that tries to be useful, slightly funny, and less expensive than running an entire backend empire.

That is Reze.