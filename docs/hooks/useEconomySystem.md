# useEconomySystem

## Manages
Dynamic market prices (fluctuating ±10%), player balance (credits, dark matter, reputation), trade offers (create/accept/cancel), and direct resource buy/sell at market rates.

## Returns
- `marketPrices` — current metal/crystal/deuterium prices
- `tradeOffers` — active P2P trade listings
- `playerBalance` — credits, dark matter, reputation
- `loading` — loading state
- `createTradeOffer`, `acceptTradeOffer`, `cancelTradeOffer` — trade lifecycle
- `sellResources`, `buyResources` — direct market trades
- `refreshOffers`, `refreshBalance` — data refreshers

## Used by
- Market/trading UI
- Resource conversion screens
