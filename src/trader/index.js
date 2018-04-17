const Runner = require('../runner')
const Ticker = require('../ticker')
const Candlestick = require('../models/candlestick')
const randomstring = require('randomstring')
const colors = require('colors/safe')

class Trader extends Runner {

  constructor(data) {
    super(data)
    this.ticker = new Ticker({
      product: this.product,
      onTick: async (tick) => { await this.onTick(tick) },
      onError: (error) => { this.onError(error) }
    })
  }

  async start() {
    this.currentCandle = null
    this.history = await this.historical.getData()
    this.ticker.start()
  }

  async onBuySignal({ price, time }) {
    console.log(`BUY BUY BUY  ${price}`)
    const id = randomstring.generate(20)
    this.strategy.positionOpened({
      price, time, size: 1.0, id
    })
  }

  async onSellSignal({ price, size, time, position }) {
    console.log(`SELL SELL SELL ${price}`)
    this.strategy.positionClosed({
      price, time, size, id: position.id
    })
  }

  async onTick(tick) {
    const parsed = Date.parse(tick.time)
    const time = isNaN(parsed) ? new Date() : new Date(parsed)
    const price = parseFloat(tick.price)
    const volume = parseFloat(tick.last_size)

    console.log(`Time: ${time}  Price: ${price.toFixed(2)}  Volume: ${volume}`)

    try {
      if (this.currentCandle) {
        this.currentCandle.onPrice({ price, volume, time })
      } else {
        this.currentCandle = new Candlestick({
          price: price,
          volume: volume,
          interval: this.interval,
          startTime: time
        })
      }

      const sticks = this.history.slice()
      sticks.push(this.currentCandle)

      await this.strategy.run({
        sticks: sticks,
        time: time
      })

      if (this.currentCandle.state === 'closed') {
        const candle = this.currentCandle
        this.currentCandle = null
        this.history.push(candle)

        this.printPositions()
        this.printProfit()
      }
    } catch (error) { console.log(error) }
  }

  onError(error) {
  }

}

module.exports = exports = Trader
