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
declare function c(strings: Array<string>, ...values: unknown[]): string;
declare namespace c {
    namespace alias {
        let aliases: Map<string, string>;
        function set(alias: string, replacement: string): void;
        function del(alias: string): void;
    }
}
export default c;
//# sourceMappingURL=Colours.d.ts.map