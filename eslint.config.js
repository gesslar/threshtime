import uglify from "@gesslar/uglier"

export default [
  {ignores: ["**/vendor**"]},
  ...uglify({
    with: [
      "lints-js", // default files: ["src/**/*.{js,mjs,cjs}"]
      "lints-jsdoc", // default files: ["src/**/*.{js,mjs,cjs}"]
      "web", // default files: ["src/**/*.{js,mjs,cjs}"]
    ]
  })
]
