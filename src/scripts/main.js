import {getTime} from "./threshtime.js"

const convertButton = document.getElementById("convert")

const rlDateInput = document.getElementById("rldateinput")
const rlTimeInput = document.getElementById("rltimeinput")

const rlDateTimeOutput = document.getElementById("etdatetimeoutput")
const icDateTimeOutput = document.getElementById("icdatetimeoutput")

const icMoreInfoOutput = document.getElementById("icmoreinfo")

const copyIcButton = document.getElementById("copyic")
const copyRlButton = document.getElementById("copyet")

const formatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
}

const parseRLDate = (date = new Date(), timezone = null) => {
  const options = structuredClone(formatOptions)

  if(timezone && typeof timezone === "string")
    options.timeZone = timezone

  const formatter = new Intl.DateTimeFormat("en-US", options)
  const dateParts = formatter
    .formatToParts(date)
    .filter(({type, value}) => type !== "literal" || value.match(/[0-9]+/))
    .map(({value}) => Number(value))
    .map(num => num < 10 ? `0${num}` : String(num))

  const [month, day, year, hour, minute] = dateParts

  return {month, day, year, hour, minute}
}

const setCurrentDateTime = () => {
  const {month, day, year, hour, minute} = parseRLDate(new Date())

  rlDateInput.value = `${year}-${month}-${day}`
  rlTimeInput.value = `${hour}:${minute}:00.000`

  updateTimes(rlDateInput, rlTimeInput)
}

const updateRlOutput = date => {
  const object = parseRLDate(date, "America/Toronto")
  const {month, day, year, hour, minute} = object

  rlDateTimeOutput.value = `${year}-${month}-${day} ${hour}:${minute}`
}

const updateIcOutput = date => {
  const object = getTime(date)
  const {monthName, day, year, hour, minute} = object

  icDateTimeOutput.value = `${monthName} ${day}, ${year} ${hour}:${padWithZeroes(minute, 2)}`

  const {weekday, stage, season, devotion} = object

  icMoreInfoOutput.innerText =
    `Weekday: ${weekday}\n` +
    `Season: ${stage.charAt(0).toUpperCase()}${stage.slice(1)} ${season.charAt(0).toUpperCase()}${season.slice(1)}\n` +
    `Devotion: ${devotion}`
}

const updateTimes = (date, time) => {
  const dateString = `${date.value}T${time.value}`
  const newDate = new Date(dateString)

  updateRlOutput(newDate)
  updateIcOutput(newDate)
}

const padWithZeroes = (given, padding) => {
  const result = given.toString()

  if(result.length >= padding)
    return result

  return `${"0".repeat(padding - result.length)}${result}`
}

const buttonClickEffect = event => {
  const control = event.target.closest("div.group")

  if(!control)
    return

  control.classList.add("clicked")
  control.addEventListener("transitionend",
    evt => evt.target.classList.remove("clicked"), {once: true}
  )
}

const copyInformation = async control => {
  await navigator.clipboard.writeText(control.value)
}

copyIcButton.addEventListener("click", () => copyInformation(icDateTimeOutput))
copyIcButton.addEventListener("click", buttonClickEffect)

copyRlButton.addEventListener("click", () => copyInformation(rlDateTimeOutput))
copyRlButton.addEventListener("click", buttonClickEffect)

convertButton.addEventListener("click", () => updateTimes(rlDateInput, rlTimeInput))
convertButton.addEventListener("click", buttonClickEffect)

document.addEventListener("DOMContentLoaded", setCurrentDateTime)
