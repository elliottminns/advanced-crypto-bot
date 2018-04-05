class Candlestick {
  constructor({
    low, high, close, open, interval, startTime = new Date(), volume
  }) {
    this.startTime = startTime
    this.interval = interval
    this.open = open
    this.close = close
    this.high = high
    this.low = low
    this.volume = volume
  }

  average() {
    return (this.close + this.high + this.low) / 3
  }
}

module.exports = exports = Candlestick
