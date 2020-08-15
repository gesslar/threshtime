const rlDateInput = document.getElementById( "rldateinput" )
const rlTimeInput = document.getElementById( "rltimeinput" )
const icDateTimeOuput = document.getElementById( "icdatetimeoutput" )

const setCurrentDateTime = _ => {
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

    updateICTime(rlDateInput.value, rlTimeInput.value)
}

const updateICTime = (dateValue, timeValue) => {
    console.log(dateValue, timeValue)
    const date = new Date(`${dateValue} ${timeValue}`)
    const threshDate = new ThreshDateTime( date )
    const value = threshDate.getDisplayValue()
    console.log(value)
    icDateTimeOuput.value = threshDate.getDisplayValue()

}

rlDateInput.addEventListener("change", event => updateICTime(rlDateInput.value, rlTimeInput.value))
rlTimeInput.addEventListener("change", event => updateICTime(rlDateInput.value, rlTimeInput.value))

