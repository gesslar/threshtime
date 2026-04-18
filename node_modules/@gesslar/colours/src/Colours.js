/**
 * @file 256 colours for your terminal expressions. Template literal-based
 * ANSI color library.
 *
 * Supports 256-color palette, granular styles, aliases, and clean syntax for
 * terminal output.
 *
 * @author gesslar
 * @version 0.0.1
 */

/** Regex pattern for numbered color codes like {F045} or {B196} */
const numbered = /\{(?<kind>[FB])?(?<number>\d{1,3})\}/g

/** Regex pattern for reset codes like {/} */
const reset = /\{\/\}/g

/** Regex pattern for alias codes like {red} or {green} */
const aliases = /\{(?<alias>.+?)\}/g

/** Regex pattern for style codes like {<BU} (open) or {BU>} (close) */
const styles = /\{<(?<open>[BRDFIORSU]+)\}|\{(?<close>[BRDFIORSU]+)>}/g
/**
 * Template literal function for colorizing terminal output with ANSI escape codes.
 * Processes color codes, styles, aliases, and reset commands in a clean pipeline.
 *
 * @param {Array<string>} strings - Template literal string parts
 * @param {...unknown} values - Template literal interpolated values
 * @returns {string} Formatted string with ANSI escape codes
 * @example
 * c`{F045}Running:{/} {red}${testName}{/}`
 * c`{<BU}Bold underlined{B>} just underlined{/}`
 */
export default function c(strings, ...values) {
  return values
    .reduce((acc, curr, index) => `${acc}${curr}${strings[index+1]}`, strings[0])
    .replaceAll(aliases, convertAliases)
    .replaceAll(numbered, convertNumbered)
    .replaceAll(styles, convertStyles)
    .replaceAll(reset, convertResets)
}

/** PROPERTIES/SUB FUNCTIONS */

/**
 * Alias management system for creating semantic color names
 *
 * @namespace
 */
c.alias = {
  /** @type {Map<string, string>} Storage for alias mappings */
  aliases: new Map(),

  /**
   * Set an alias mapping
   *
   * @param {string} alias - The alias name (e.g., "red")
   * @param {string} replacement - The replacement code (e.g., "{F196}")
   */
  set: function(alias,replacement) {
    this.aliases.set(alias, replacement)
  },

  /**
   * Delete an alias mapping
   *
   * @param {string} alias - The alias name to remove
   */
  del: function(alias) {
    this.aliases.delete(alias)
  },
}

/**
 * Convert alias codes to their replacement values
 *
 * @param {string} code - The matched alias code (e.g., "{red}")
 * @param {...string} args - Regex match arguments, last element contains named groups
 * @returns {string} The replacement code or original if no alias found
 */
function convertAliases(code, ...args) {
  const {alias} = args.at(-1) ?? {}

  if(!alias)
    return code

  return c.alias.aliases.get(alias) ?? code
}

/** Map of style codes to their ANSI "off" sequences */
const offStyles = new Map([
  ["B", "\x1b[22m"], // bright off
  ["D", "\x1b[22m"], // dim off
  ["F", "\x1b[25m"], // flash off
  ["I", "\x1b[23m"], // italics off
  ["O", "\x1b[55m"], // overline off
  ["R", "\x1b[27m"], // reverse video off
  ["S", "\x1b[29m"], // strikethrough off
  ["U", "\x1b[24m"], // underline off
])

/** Map of style codes to their ANSI "on" sequences */
const onStyles = new Map([
  ["B",  "\x1b[1m"], // bright on
  ["D",  "\x1b[2m"], // dim on
  ["F",  "\x1b[5m"], // flash on
  ["I",  "\x1b[3m"], // italics on
  ["O", "\x1b[53m"], // overline on
  ["R",  "\x1b[7m"], // reverse video on
  ["S",  "\x1b[9m"], // strikethrough on
  ["U",  "\x1b[4m"], // underline on
])

/**
 * Convert style codes to ANSI escape sequences
 *
 * @param {string} _ - The matched style code (e.g., "{<BU}" or "{BU>}")
 * @param {...string} args - Regex match arguments, last element contains named groups
 * @returns {string} ANSI escape sequences for the requested styles
 */
function convertStyles(_, ...args) {
  const {open,close} = args.at(-1) ?? {}

  /** @type {string} Combined ANSI sequences for all requested styles */
  const codes =
    (open || close || "")
      .split("")
      .map((/** @type {string} */ style) =>
        (open && onStyles.get(style)) ||
      (close && offStyles.get(style)) ||
      style
      )
      .join("")

  return codes
}

/**
 * Convert numbered color codes to ANSI escape sequences
 *
 * @param {string} code - The matched color code (e.g., "{F045}" or "{B196}")
 * @param {...string} args - Regex match arguments, last element contains named groups
 * @returns {string} ANSI escape sequence for the color or original code if invalid
 */
function convertNumbered(code, ...args) {
  const {kind,number} = args.at(-1) ?? {}

  if(!kind || !number || Number.isNaN(number))
    return code

  /** @type {number} Parsed color number for validation */
  const colourNumber = Number(number)

  if(colourNumber < 0 || colourNumber > 255)
    return code

  return kind === "F" ? `\x1b[38;5;${number}m` : `\x1b[48;5;${number}m`
}

/**
 * Convert reset codes to ANSI reset sequence
 *
 * @returns {string} ANSI reset sequence
 */
function convertResets() {
  return "\x1b[0m"
}
