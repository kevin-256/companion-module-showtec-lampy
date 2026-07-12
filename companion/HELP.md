# Showtec Lampy OSC module

Controls the Showtec Lampy lighting console using OSC.

## Functions:

* Master fader level
* Master Go
* Master Pause/Back
* Multi-Functional Fader (MFF) level
* Multi-Functional Fader Flash
* Playback Fader (PBF) level
* Playback Fader Flash
* Playback Fader page next/previous
* Virtual Executor Flash
* Programmer buttons
* Programmer Shift toggle
* Programmer Pan/Tilt pad
* Programmer Encoder increment
* Programmer Encoder buttons
* Send custom OSC messages

## Special Functions:

* Current master value display variable
* Current master label display variable
* MFF label and value display variables
* Playback Fader label and value display variables
* Virtual Executor label display variables
* Programmer encoder display variables
* Programmer LED feedback

Created by referring to the Showtec Lampy OSC address map, TouchOSC layout files, and the Lampy manual.

Current version: 1.0.0

---

## Configuring:

### New instance

First step after adding a Lampy instance is setting it up:

* Name: the name you want
* Console Model: select your Lampy model
  * Lampy 20: 10 Multi-Functional Faders
  * Lampy 40: 30 Multi-Functional Faders
* Target IP: IP address of your Lampy console (needs to be on the same network)
* Listen Port: UDP port Companion receives OSC feedback from Lampy
* Send Port: UDP port Companion sends OSC commands to Lampy

### OSC configuration on Lampy

On the Lampy console:

1. Open **Menu → Show Settings → OSC**
2. Enable OSC
3. Configure the OSC ports

Important:

The Lampy console uses different terminology than Companion:

* Lampy **Outgoing Port** = Companion **Listen Port**
* Lampy **Incoming Port** = Companion **Send Port**

The port names are from the console's point of view.

### Console model selection

Both Lampy models provide:

* 10 Playback Faders
* 40 Virtual Executors
* 4 Programmer Encoders

The difference between Lampy 20 and Lampy 40 is the number of Multi-Functional Faders:

* Lampy 20: MFF 1–10
* Lampy 40: MFF 1–30

Changing the model after creating buttons does not automatically update existing actions. If a button references an MFF that is no longer available after changing models, check those buttons manually.

---

## How to:

### Displaying fader values

Lampy sends current fader values back to Companion as variables.

To display a value on a button:

Start typing:

```
$(
```

in the button text field and Companion will show the available Lampy variables.

Examples:

```
Master
$(Lampy:master_value)
```

or:

```
Executor 1
$(Lampy:virtual_executor_1_name)
```

Variables update when Lampy sends new feedback.

---

### Multi-Functional Faders (MFF)

MFF actions allow control of the multifunction faders on the Lampy console.

Available ranges:

* Lampy 20: MFF 1–10
* Lampy 40: MFF 1–30

Values use the Lampy internal scale:

```
0–1000
```

Use:

* **MFF: Set Value** for level control
* **MFF: Flash** for momentary flash operation

---

### Playback Faders (PBF)

Playback faders are always available:

```
PBF 1–10
```

Available actions:

* Set Value
* Flash
* Page Next
* Page Previous

Playback values use the Lampy internal scale:

```
0–1000
```

---

### Programmer controls

The Programmer section provides direct access to common Lampy programmer controls.

Available buttons:

* Blind
* Highlight
* Clear
* Fan
* Home
* Copy
* Delete
* Edit
* Record
* Intensity
* Color
* Gobo
* Position
* Beam
* Magic
* Off
* Special
* Select Next
* Select Previous
* Fader Mode

Shift can be controlled separately using:

```
Programmer: Shift Toggle
```

---

### Programmer Pan/Tilt control

The Pan/Tilt action controls the programmer XY pad.

Values are between:

```
0.0 – 1.0
```

Example:

```
X: 0.5
Y: 0.5
```

sets the pad position to the centre.

---

### Programmer Encoder control

Lampy provides four programmer encoders.

Each encoder supports:

* Relative increment control
* Encoder button press

Increment values are:

```
-2 to +2
```

---

### Programmer LED feedback

The Programmer LED feedback allows buttons to follow Lampy's LED state.

Currently supported LEDs:

* Blind
* Highlight
* Clear
* Fan

The feedback becomes active when Lampy reports the LED as enabled.

---

### Custom OSC messages

If a Lampy OSC function is not included in the module, use:

```
Send Raw OSC Message
```

Enter:

* OSC address
* Optional comma-separated float arguments

Example:

```
/lampy/example/value
0.5
```

This allows access to additional Lampy OSC commands without waiting for module updates.

---

## Variables:

### Master

```
$(Lampy:master_name)
$(Lampy:master_value)
```

Current master label and level.

### Multi-Functional Faders

Lampy 20:

```
$(Lampy:mff_1_name)
...
$(Lampy:mff_10_name)

$(Lampy:mff_1_value)
...
$(Lampy:mff_10_value)
```

Lampy 40:

```
$(Lampy:mff_1_name)
...
$(Lampy:mff_30_name)

$(Lampy:mff_1_value)
...
$(Lampy:mff_30_value)
```

### Playback Faders

```
$(Lampy:pbf_1_name)
...
$(Lampy:pbf_10_name)

$(Lampy:pbf_1_value)
...
$(Lampy:pbf_10_value)
```

### Virtual Executors

```
$(Lampy:virtual_executor_1_name)
...
$(Lampy:virtual_executor_40_name)
```

### Programmer Encoders

Each encoder has two display lines:

```
$(Lampy:encoder_1_text1)
$(Lampy:encoder_1_text2)

...

$(Lampy:encoder_4_text1)
$(Lampy:encoder_4_text2)
```

---

## Notes:

* Companion sends OSC using its built-in OSC transport.
* Feedback reception uses a shared UDP listener, allowing multiple Companion modules to share the same port.
* The OSC address map was created from Lampy OSC documentation, TouchOSC layouts, and manual references.
* Fader feedback relies on Lampy returning updated values on the same OSC addresses used for control.

If Lampy sends different OSC argument types than expected, OSC parsing or outgoing message definitions may need adjustment.

---

## Dependencies:

* Companion v3+
* `@companion-module/base`
* `osc` npm package for OSC message parsing
