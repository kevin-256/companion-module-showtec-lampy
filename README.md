# Showtec Lampy OSC Companion Module

A [Bitfocus Companion](https://bitfocus.io/companion) module for controlling a **Showtec Lampy** lighting console over OSC.

The module sends control messages to the console (faders, buttons, encoders) and listens for feedback from the console (fader positions, name labels, LED states) on a separate port, so button and variable states in Companion stay in sync with the console.

## Requirements

- Companion v3+ (uses the typed `@companion-module/base` schema API)
- The Lampy console and the Companion host on the same network, with OSC enabled on the console
- Two free UDP ports: one for Companion to listen on and one for the console to listen on

## Setup

1. On the Lampy console, go to **Menu → Show Settings → OSC** and enable OSC.
2. Note the console's incoming and outgoing OSC ports configured in the console settings.
3. In Companion, add an instance of this module and fill in:

| Field | Description |
|---|---|
| **Console Model** | Lampy 20 (10 multifunction faders) or Lampy 40 (30 multifunction faders) — sets how many MFF faders show up in the action/variable dropdowns |
| **Target IP** | IP address of the Lampy console |
| **Listen Port** | Local UDP port Companion listens on for feedback from Lampy (console's "outgoing" port) |
| **Send Port** | UDP port on the console that Companion sends commands to (console's "incoming" port) |

> Both Lampy models have 10 playback faders, 40 virtual executors, and 4 programmer encoders — only the multifunction fader count differs (10 vs 30).

> **Note:** changing the Console Model after you've already built buttons referencing MFF faders outside the new model's range (e.g. MFF 25 on a Lampy 20) does not retroactively fix those buttons — Companion won't warn you, so double-check any existing buttons after switching models.

> Note the console's own settings screen labels these the *opposite* way round from Companion's perspective — "outgoing" on Lampy is what Companion *listens* to, and "incoming" on Lampy is what Companion *sends* to.

## Actions

| Action | Description |
|---|---|
| Master: Set Value | Set the grand master fader (0–1000) |
| Master: Go | Trigger master Go |
| Master: Pause/Back | Trigger master Pause/Back |
| MFF: Set Value | Set a Multi-Functional Fader's value (1–10 on Lampy 20, 1–30 on Lampy 40, value 0–1000) |
| MFF: Flash | Momentary flash on a Multi-Functional Fader (1–10 on Lampy 20, 1–30 on Lampy 40) |
| PBF: Set Value | Set a Playback Fader's value (1–10, 0–1000) |
| PBF: Flash | Momentary flash on a Playback Fader (1–10) |
| PBF: Page Next / Previous | Change the Playback Fader page |
| Virtual Executor: Flash | Momentary flash on a Virtual Executor (1–40) |
| Programmer: Button | Triggers one of the programmer buttons (Blind, Highlight, Clear, Fan, Home, Copy, Delete, Edit, Record, Intensity, Color, Gobo, Position, Beam, Magic, Off, Special, Select Next/Previous, Fader Mode) |
| Programmer: Shift Toggle | Toggles Shift |
| Programmer: Pan/Tilt | Sets the XY pan/tilt pad (0–1 each axis) |
| Programmer Encoder: Increment | Sends a relative increment (-2 to 2) to one of the 4 programmer encoders |
| Programmer Encoder: Button | Presses one of the 4 programmer encoder buttons |
| Send Raw OSC Message | Sends an arbitrary OSC address with optional comma-separated float arguments, for anything not covered above |

## Feedbacks

| Feedback | Type | Description |
|---|---|---|
| Programmer LED State | Boolean | True when the selected programmer LED (Blind, Highlight, Clear, Fan) is reported on by the console |

## Variables

| Variable(s) | Description |
|---|---|
| `master_name` | Current master label text |
| `master_value` | Current master fader value (number) |
| `mff_1_name` … `mff_10_name` (Lampy 20) / `mff_1_name` … `mff_30_name` (Lampy 40) | MFF label text per fader |
| `mff_1_value` … `mff_10_value` (Lampy 20) / `mff_1_value` … `mff_30_value` (Lampy 40) | MFF fader value per fader (number) |
| `pbf_1_name` … `pbf_10_name` | PBF label text per fader |
| `pbf_1_value` … `pbf_10_value` | PBF fader value per fader (number) |
| `virtual_executor_1_name` … `virtual_executor_40_name` | Virtual executor label text |
| `encoder_1_text1` / `encoder_1_text2` … `encoder_4_text1` / `encoder_4_text2` | Programmer encoder display text (2 lines per encoder) |

## Developer Notes

### Build

```bash
npm install
npm run build
```
### How it works internally

- **Outgoing** messages use Companion's built-in `oscSend(host, port, address, args)` — no custom UDP transport is managed by the module.
- **Incoming** messages are received via Companion's `createSharedUdpSocket`, which allows multiple instances or modules to share the same listen port without separate socket bindings. Raw buffers are parsed into OSC messages using the [`osc`](https://www.npmjs.com/package/osc) npm package's `readMessage` function (used purely for parsing — not its socket/transport layer).
- Incoming addresses are matched with regex and routed to `setVariableValues` (labels and numeric values) or `checkFeedbacks` (LED states).

### Known caveats

- The Lampy OSC address map was derived from a TouchOSC layout file (`.touchosc`) and the official manual.
- Fader value feedback assumes the console echoes the current value back on the same address it's set with (e.g. `/lampy/mff/3/value`). This matches typical bidirectional OSC console behavior, but has not been confirmed in the official manual.
- If the console sends argument types other than float (`f`) — e.g. integers — the `type` tags in `actions.ts`'s outgoing messages and the parsing in `osc.ts` may need adjusting.

### Dependencies

- `@companion-module/base` — Companion module SDK
- `osc` — OSC message parsing (no published types; a minimal hand-written declaration lives in `types/osc.d.ts`)