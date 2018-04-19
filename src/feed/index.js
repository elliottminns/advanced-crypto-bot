const gdax = require('gdax')
const config = require('../../configuration')

const key = config.get('GDAX_API_KEY')
const secret = config.get('GDAX_API_SECRET')
const passphrase = config.get('GDAX_API_PASSPHRASE')
const wsUrl = config.get('GDAX_WS_URL')

class Feed {
  constructor({ product, onUpdate, onError }) {
    this.product = product
    this.onUpdate = onUpdate
    this.onError = onError
    this.running = false
  }

  async start() {
    this.running = true
    this.socket = new gdax.WebsocketClient(
      [this.product],
      wsUrl,
      { key, secret, passphrase },
      { channels: ['user', 'heartbeat'] }
    )

    this.socket.on('message', data => {
      if (data.type === 'heartbeat') { return }
      this.onUpdate(data)
    })


    this.socket.on('error', error => {
      this.onError(error)
      this.socket.connect()
    })

    this.socket.on('close', () => {
      if (this.running) {
        this.socket.connect()
      }
    })
  }

  async stop() {
    this.running = false
    this.socket.close()
  }
}

module.exports = exports = Feed
