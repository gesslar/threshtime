const rlDateInput = document.getElementById( "rldateinput" )
const rlTimeInput = document.getElementById( "rltimeinput" )
const icDateTimeOuput = document.getElementById( "icdatetimeoutput" )
const etDateTimeOuput = document.getElementById( "etdatetimeoutput" )
const icMoreInfoOutput = document.getElementById( "icmoreinfo" )
const cpIc = document.getElementById( "copyic" )
const cpEt = document.getElementById( "copyet" )
const copiedIc = document.getElementById( "copiedic" )
const copiedEt = document.getElementById( "copiedet" )
const convertButton = document.getElementById( "convert" )
const workingBadge = document.getElementById( "working" )

const getCurrentTimeET = (timestamp) => {
    let currentDate, currentTime;
    
    if(timestamp === undefined) {
        currentDate = moment.tz( "America/Toronto" )
        currentTime = moment.tz( "America/Toronto" )
    } else {
        currentDate = moment.tz( timestamp, "America/Toronto" )
        currentTime = moment.tz( timestamp, "America/Toronto" )
    }
    
    return `${currentDate.format("yyyy-MM-DD")} ${currentTime.format("LT")}`
}

const setCurrentDateTime = () => {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat( "en-US", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    })

    const dateParts = formatter.formatToParts(now)
    const dateString = dateParts.filter( ({ type, value }) => {
        if(type === "literal") return false
        return true 
    }).map( ({ type, value }) => {
        if(value.match(/[0-9]+/)) {
            const num = parseInt(value)
            if(num < 10) return `0${num}`
        }
        return value 
    })

    rlDateInput.value = `${dateString[2]}-${dateString[0]}-${dateString[1]}`
    rlTimeInput.value = `${dateString[3]}:${dateString[4]}:00.000`

    updateTimes(rlDateInput.value, rlTimeInput.value)
}

const updateTimes = async (dateValue, timeValue) => {
    // grey out the screen and show the working badge
    const div = document.createElement("div")
    div.className += "overlay"
    document.body.appendChild(div)
    workingBadge.classList.remove("working-hide")

    const date = new Date(`${dateValue} ${timeValue}`)
    const unixTime = date.getTime()
    const uri = `https://fern-ahead-jelly.glitch.me/time/${unixTime}`
    const response = await fetch(uri)
    const jsonified = await response.json()
    const threshDate = jsonified.ic
    const etDateTime = getCurrentTimeET( date.getTime() )

    etDateTimeOuput.value = etDateTime
    icDateTimeOuput.value = `${jsonified.monthName} ${jsonified.day}, ${jsonified.year} ${jsonified.hour}:${padWithZeroes(jsonified.minute, 2)}`
    icMoreInfoOutput.innerText =
    `Weekday: ${jsonified.weekday}\n` +
    `Season: ${jsonified.stage.charAt(0).toUpperCase()}${jsonified.stage.slice(1)} ${jsonified.season.charAt(0).toUpperCase()}${jsonified.season.slice(1)}\n` +
    `Devotion: ${jsonified.devotion}`

    // remove the greyed out and hide the working badge
    document.body.removeChild(div)
    workingBadge.classList.add("working-hide")
}

const padWithZeroes = (given, padding) => {
    let result = given.toString() 

    if(result.length >= padding) return result 
    return `${"0".repeat(padding - result.length)}${result}`
}

const copyInformation = (control, statuscontrol) => {
    control.select()
    control.setSelectionRange(0, 999999)
    document.execCommand("copy")
    control.blur()
    window.getSelection().removeAllRanges()
    statuscontrol.classList.remove("copied-hide")
    setTimeout( control => {
        control.classList.add("copied-hide")
    }, 1000, statuscontrol)
}

cpIc.addEventListener("click", event => copyInformation(icDateTimeOuput, copiedIc))
cpEt.addEventListener("click", event => copyInformation(etDateTimeOuput, copiedEt))
convertButton.addEventListener("click", event => updateTimes( rlDateInput.value, rlTimeInput.value ))
