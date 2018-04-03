// Requires
const gdax = require('gdax')
const config = require('./configuration')

// Configurations

const key = config.get('GDAX_API_KEY')
const secret = config.get('GDAX_API_SECRET')
const passphrase = config.get('GDAX_API_PASSPHRASE')
const apiUrl = config.get('GDAX_API_URL')

const client = new gdax.PublicClient()
const authedClient = new gdax.AuthenticatedClient(key, secret,
                                                  passphrase, apiUrl)

const product = 'BTC-EUR'

async function historicalRates() {
  const results = await client.getProductHistoricRates(product, {
    granularity: (3600 * 24)
  })
  console.log(results[0])
}

historicalRates()
