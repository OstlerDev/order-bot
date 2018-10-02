import assert from 'assert'

import BuyOrder from './BuyOrder'
import SellOrder from './SellOrder'

/**
 * An OrderBook contains information about active buy/sell orders
 */
class OrderBook {
	constructor(){
		this.buy_orders = []
		this.sell_orders = []
	}
	/**
	 * Test if a SellOrder can be sell to a BuyOrder
	 * @param {SellOrder} sell_order - The SellOrder you wish to test
	 * @param {BuyOrder} buy_order - The BuyOrder you wish to test
	 * @return {Boolean} Returns `true` if the sale can process, or `false` if the sale can't process
	 */
	canSell(sell_order, buy_order){
		assert(sell_order instanceof SellOrder)
		assert(buy_order instanceof BuyOrder)
		// If the desired BuyOrder Price is less than our Sell price, then we can't sell to it
		if (buy_order.getPrice() < sell_order.getPrice())
			return false

		// As long as the price is ok, then we can process the sale further
		return true
	}
	/**
	 * Process buy & create a sale of a portion of our quantity for the price
	 * @param  {SellOrder} sell_order - The SellOrder you wish to sell from
	 * @param  {BuyOrder} buy_order - The BuyOrder you wish to sell to
	 */
	processSale(sell_order, buy_order){
		if (!canSell(sell_order, buy_order))
			throw new Error("Unable to sell from SellOrder to BuyOrder!")

		let quantity_to_sell
	}
	/**
	 * @param  {BuyOrder} buy_order - The BuyOrder to process
	 */
	processBuy(buy_order){
		for (let sell_order of this.sell_orders){
			if (canSell(sell_order))
		}
	}
	/**
	 * @param  {SellOrder} sell_order - the SellOrder to process
	 */
	processSell(sell_order){

	}
}

export default OrderBook;