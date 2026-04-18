#!/usr/bin/env node

import c from "./Colours.js"
import console from "node:console"

(() => {
  const chars = []

  // Care Bears count down; 4-3-2-1!!!!
  for(let i = 0; i <= 2; i++) {
    for(let j = 0; j <= 5; j++) {
      for(let k = 0; k <= 11; k++) {
        const number = 16 + i * (6 * 12) + j + k * 6
        const code = String(number).padStart(3, "0")

        chars.push(c`{F${code}}${code}  `)
      }

      chars.push("\n")
    }
  }

  chars.push("\n")

  // By the POWER of GREYSCALE!
  for(let i = 0; i <= 1; i++) {
    for(let j = 0; j <= 11; j++) {
      const number = 232 + i * 12 + j
      const code = String(number).padStart(3, "0")

      chars.push(c`{F${code}}${code}  `)
    }

    chars.push("\n")
  }

  chars.push("\n")

  // I'm afraid of Americans
  // I'm afraid of the world
  // I'm afraid I can't help this
  // I'm afraid I can't
  for(let i = 0; i <= 1; i++) {
    for(let j = 0; j <= 7; j++) {
      const number = i * 8 + j
      const code = String(number).padStart(3, "0")

      chars.push(c`{F${code}}${code}  `)
    }

    chars.push("\n")
  }

  console.info(chars.join(""))
})()
