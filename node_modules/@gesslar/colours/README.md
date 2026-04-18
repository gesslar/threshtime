# @gesslar/colours

256 colours for your terminal expressions. Template literal-based ANSI colour
library with precise colour selection, granular styles, and semantic aliases.

## Installation

```bash
npm install @gesslar/colours
```

## Quick Start

```javascript
import c from '@gesslar/colours'

console.log(c`{F045}Running:{/} {F213}${testName}{/}`)
console.log(c`{F034}[OK]{/} Build completed {F240}(${time}ms){/}`)
console.log(c`{F196}[ERR]{/} {<B}Error:{/} ${message}`)
```

## Core Features

### 256 Colour Palette

Use any colour from the 256-colour terminal palette:

```javascript
// Foreground colours
c`{F045}Bright green text{/}`
c`{F196}Red text{/}`
c`{F033}Blue text{/}`

// Background colours
c`{B196}Red background{/}`
c`{B045}Green background{/}`

// Combined
c`{F255}{B196}White text on red background{/}`
```

### Granular Style Control

Turn styles on and off individually:

```javascript
// Turn on styles
c`{<BU}Bold and underlined{/}`
c`{<I}Italic text{/}`
c`{<S}Strikethrough{/}`

// Turn off specific styles
c`{<BIU}All three{B>}italic and underlined{I>}just underlined{/}`

// Available styles:
// - B(old)
// - D(im)
// - F(lash)
// - I(talic)
// - O(verline)
// - R(everse),
// - S(trikethrough)
// - U(nderline)
```

### Semantic Aliases

Create meaningful names for your colours:

```javascript
// Set up aliases
c.alias.set("success", "{F034}")
c.alias.set("error", "{F196}")
c.alias.set("warning", "{F214}")
c.alias.set("muted", "{F240}")

// Use them in your code
console.log(c`{success}[OK]{/} Operation completed`)
console.log(c`{error}[ERR]{/} Something went wrong`)
console.log(c`{warning}!{/} Check this out {muted}(optional){/}`)

// Complex aliases with styles
c.alias.set("header", "{F045}{<BU}")
console.log(c`{header}IMPORTANT SECTION{/}`)
```

## Advanced Usage

### CLI Tool Styling

```javascript
import c from '@gesslar/colours'

// Status messages
const success = (msg) => console.log(c`{F034}[OK]{/} ${msg}`)
const error = (msg) => console.log(c`{F196}[ERR]{/} ${msg}`)
const info = (msg) => console.log(c`{F045}[INFO]{/} ${msg}`)

success("Build completed successfully")
error("Failed to load configuration")
info(`Processing ${count} files...`)
```

### Test Output Enhancement

```javascript
// Before: boring
console.log(`Running: ${testName}`)
console.log(`[OK] ${testName} passed (${time}ms)`)

// After: beautiful
console.log(c`{F045}Running:{/} {F213}${testName}{/}`)
console.log(c`{F034}[OK]{/} {F085}${testName}{/} passed {F240}(${time}ms){/}`)
```

### Debug Levels

```javascript
const debug = {
  error: (msg) => console.log(c`{F196}{<B}[ERROR]{/} ${msg}`),
  warn: (msg) => console.log(c`{F214}[WARN]{/} ${msg}`),
  info: (msg) => console.log(c`{F045}[INFO]{/} ${msg}`),
  debug: (msg) => console.log(c`{F240}[DEBUG]{/} ${msg}`)
}
```

## Syntax Reference

### Colour Codes

- `{F###}` - Foreground colour (0-255)
- `{B###}` - Background colour (0-255)
- `{/}` - Reset all formatting

### Style Codes

- `{<STYLES}` - Turn on styles (e.g., `{<BU}` for bold+underline)
- `{STYLES>}` - Turn off styles (e.g., `{B>}` to turn off bold)

### Style Letters

- `B` - Bold/Bright
- `D` - Dim
- `F` - Flash/Blink
- `I` - Italic
- `O` - Overline
- `R` - Reverse
- `S` - Strikethrough
- `U` - Underline

### Aliases

- `{aliasName}` - Any alias you've created
- Built-in: none (you define what you need)

## Colour Selection Workflow

1. Run `colours` command to see the colour chart (if CLI installed)
2. Pick the colour number you want
3. Use it in your code: ``c`{F045}text{/}``

## API Reference

### Main Function

- ``c`template`` - Process template literal with colour codes

### Alias Management

- `c.alias.set(name, replacement)` - Create an alias
- `c.alias.del(name)` - Remove an alias

## Why @gesslar/colours?

**vs ansi-colours:**

- Precise colour selection with visual picker
- Cleaner syntax: ``c`{F045}text{/}`` vs `ansiColors.rgb(255,100,50)('text')`
- No guessing what `.yellowBright` actually looks like
- Granular style control

**vs chalk:**

- 256-colour palette support
- Template literal syntax
- Semantic aliases you define
- Lighter weight, focused scope

---

_"I want green here, but which green?" -> colours -> "oooo ok that one"_

The workflow that just works.

---
## License

`@gesslar/colours` is released into the public domain under the [0BSD](LICENSE.txt).
