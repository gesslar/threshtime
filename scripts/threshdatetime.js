class ThreshDateTime {
    constructor(dateObject) {
        const now = dateObject !== undefined ? this._convertDateObject(dateObject) : this.getTime()
        let remaining = now 

        // Find the current year
        this.year = config.start.year
        while( remaining > config.yearLength ) {
            remaining -= config.yearLength
            this.year ++
        }
        
        // Find the current month
        this.month = config.start.month
        while( remaining > config.monthLength ) {
            remaining -= config.monthLength
            this.month ++
        }
        
        // find the current day
        this.day = ( Math.floor ( remaining / config.dayLength ) ) + 1
        
        // find the current hour/minute
        remaining = now 
        remaining = remaining % config.dayLength
        remaining = remaining * 86400 / config.dayLength 
        
        this.hour = Math.floor( remaining / 3600 )
        this.minute = Math.floor( ( remaining - this.hour * 3600 ) / 60 )
    }

    _convertDateObject(dateObject) {
        return Math.ceil( dateObject.getTime() / config.factor ) - config.epochStart
    }

    getTime() {
        return Math.ceil( new Date().getTime() / config.factor ) - ( config.epochStart )
    }

    getDisplayValue() {
        if(this.minute < 10) {
            return `${config.months[this.month]} ${this.day}, ${this.year} - ${this.hour}:0${this.minute}`
        } else {
            return `${config.months[this.month]} ${this.day}, ${this.year} - ${this.hour}:${this.minute}`
        }
    }
}

const tdt = new ThreshDateTime( new Date() );

console.log( tdt.getDisplayValue() )
