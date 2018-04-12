const Candlestick = require('../models/candlestick')
const Historical = require('../historical')
const { Factory } = require('../strategy')
const randomstring = require('randomstring')
const colors = require('colors/safe')

class Backtester {
  constructor({ start, end, interval, product, strategyType }) {
    this.startTime = start
    this.endTime = end
    this.interval
    this.product = product
    this.historical = new Historical({
      start, end, interval, product
    })
    this.strategyType = strategyType
  }

  async start() {
    try {
      const history = await this.historical.getData()

      this.strategy = Factory.create(this.strategyType, {
        onBuySignal: (x) => { this.onBuySignal(x) },
        onSellSignal: (x) => { this.onSellSignal(x) }
      })

      await Promise.all(history.map((stick, index) => {
        const sticks = history.slice(0, index + 1)
        return this.strategy.run({
          sticks, time: stick.startTime
        })
      }))

      const positions = this.strategy.getPositions()
      positions.forEach((p) => {
        p.print()
      })

      const total = positions.reduce((r, p) => {
        return r + p.profit()
      }, 0)

      const prof = `${total}`
      const colored = total > 0 ? colors.green(prof) : colors.red(prof)
      console.log(`Total: ${colored}`)
    } catch (error) {
      console.log(error)
    }
  }

  async onBuySignal({ price, time }) {
    const id = randomstring.generate(20)
    this.strategy.positionOpened({
      price, time, size: 1.0, id
    })
  }

  async onSellSignal({ price, size, time, position }) {
    this.strategy.positionClosed({
      price, time, size, id: position.id
    })
  }
}

module.exports = Backtester
