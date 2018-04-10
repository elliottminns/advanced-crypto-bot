const Trade = require('../models/trade')
const Position = require('../models/position')

class Strategy {

  constructor({ onBuySignal, onSellSignal }) {
    this.onBuySignal = onBuySignal
    this.onSellSignal = onSellSignal
    this.positions = {}
  }

  async run({ sticks, time }) {
  }

  getPositions() {
    return Object.keys(this.positions).map((k) => this.positions[k])
  }

  openPositions() {
    return this.getPositions().filter(p => p.state === 'open')
  }

  async positionOpened({ price, time, amount, id }) {
    const trade = new Trade({ price, time, amount })
    const position = new Position({ trade, id })
    this.positions[id] = position
  }

  async positionClosed({ price, time, amount, id }) {
    const trade = new Trade({ price, time, amount })
    const position = this.positions[id]

    if (position) {
      position.close({ trade })
    }
  }
}

module.exports = Strategy
