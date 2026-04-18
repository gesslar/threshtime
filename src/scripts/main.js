import {getTime} from "./threshtime.js"

const rlDateInput = document.getElementById("rldateinput")
const rlTimeInput = document.getElementById("rltimeinput")

const etDateTimeOuput = document.getElementById("etdatetimeoutput")
const icDateTimeOuput = document.getElementById("icdatetimeoutput")

const icMoreInfoOutput = document.getElementById("icmoreinfo")

const cpIc = document.getElementById("copyic")
const cpEt = document.getElementById("copyet")

const convertButton = document.getElementById("convert")

const formatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
}

const parseRLDate = (date = new Date(), timezone = null) => {
  const options = formatOptions

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

  updateTimes(rlDateInput.value, rlTimeInput.value)
}

const updateTimes = (dateValue, timeValue) => {
  const date = new Date(`${dateValue} ${timeValue}`)
  const {month, day, year, hour, minute} = parseRLDate(date, "America/Toronto")
  const rlEt = `${year}-${month}-${day} ${hour}:${minute}`
  etDateTimeOuput.value = rlEt

  const jsonified = getTime(date)
  icDateTimeOuput.value = `${jsonified.monthName} ${jsonified.day}, ${jsonified.year} ${jsonified.hour}:${padWithZeroes(jsonified.minute, 2)}`
  icMoreInfoOutput.innerText =
    `Weekday: ${jsonified.weekday}\n` +
    `Season: ${jsonified.stage.charAt(0).toUpperCase()}${jsonified.stage.slice(1)} ${jsonified.season.charAt(0).toUpperCase()}${jsonified.season.slice(1)}\n` +
    `Devotion: ${jsonified.devotion}`
}

const padWithZeroes = (given, padding) => {
  const result = given.toString()

  if(result.length >= padding)
    return result

  return `${"0".repeat(padding - result.length)}${result}`
}

const copyInformation = control => {
  control.select()
  control.setSelectionRange(0, 999999)
  console.log(control.parentElement)

  control.parentElement?.classList.add("copied")
  control.parentElement?.addEventListener("transitionend", evt => {
    console.info(evt)
    // console.info("hi")
    evt.target.classList.remove("copied")
  }, {once: true})

  document.execCommand("copy")
  control.blur()

  window.getSelection().removeAllRanges()
}

cpIc.addEventListener("click", () => copyInformation(icDateTimeOuput))
cpEt.addEventListener("click", () => copyInformation(etDateTimeOuput))
convertButton.addEventListener("click", () => updateTimes(rlDateInput.value, rlTimeInput.value))

document.addEventListener("DOMContentLoaded", setCurrentDateTime)
