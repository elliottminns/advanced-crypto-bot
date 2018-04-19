const program = require('commander')
const Backtester = require('./src/backtester')
const Trader = require('./src/trader')
const config = require('./configuration')
const Ticker = require('./src/ticker')

const now = new Date()
const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1e3))

function toDate(val) {
  return new Date(val * 1e3)
}

program.version('1.0.0')
  .option('-i, --interval [interval]', 'Interval in seconds for candlestick',
          parseInt)
  .option('-p, --product [product]', 'Product identifier', 'BTC-USD')
  .option('-s, --start [start]', 'Start time in unix seconds',
          toDate, yesterday)

  .option('-e, --end [end]', 'End time in unix seconds', toDate, now)
  .option('-t, --strategy [strategy]', 'Strategy Type')
  .option('-r, --type [type]', 'Run type')
  .option('-f, --funds [funds]', 'Amount of money to use', parseInt)
  .option('-l, --live', 'Run live')
  .parse(process.argv)

const main = async function() {
  const { interval, product, start, end, strategy, live, type, funds } = program

  if (type == 'trader') {
    const trader = new Trader({
      start, end, product, interval, strategyType: strategy, live, funds
    })

    await trader.start()
  } else {
    const tester = new Backtester({
      start, end, product, interval, strategyType: strategy
    })

    await tester.start()
  }
}

main()
