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
	 * @param  {String} type - The "type" that initiated the sale, either `buy` or `sell`
	 */
	processSale(sell_order, buy_order, type){
		assert(type === "buy" || type === "sell", "Type must be either `buy` or `sell`!")

		// Make sure we can sell
		if (!this.canSell(sell_order, buy_order))
			throw new Error("Unable to sell from SellOrder to BuyOrder!")

		// Start creating the sale
		let sale = {
			quantity: sell_order.getQuantity(),
			price: 0
		}

		// Lower the quantity if the buy_order wants less
		if (buy_order.getQuantity() < sale.quantity)
			sale.quantity = buy_order.getQuantity()

		// Set the price based on the type
		// If we are originating from a "sell", we want to use the "buy" price (since it is likely higher)
		if (type === "sell")
			sale.price = buy_order.getPrice()
		// If we are originating from a "buy", we want to use the "sell" price (since it is likely lower)
		if (type === "buy")
			sale.price = sell_order.getPrice()

		// Sanity Check to make sure we really can process this sale
		assert(sale.price <= buy_order.getPrice(), "Sale Price must be < or = to the Buy Order price!")
		assert(sale.price >= sell_order.getPrice(), "Sale Price must be > or = to the Sell Order price!")
		assert(sale.quantity <= buy_order.getQuantity(), "Sale Quantity must be < or = to the Quantity available on the BuyOrder!")
		assert(sale.quantity <= sell_order.getQuantity(), "Sale Quantity must be < or = to the Quantity available on the SellOrder!")

		// Add the sales to each Order
		buy_order.addSale(sale)
		sell_order.addSale(sale)
	}
	/**
	 * Sort the Buy Orders in Descending order (greatest to lowest [2, 1, 0])
	 */
	sortBuys(){
		this.buy_orders.sort((a, b) => { return b.getPrice() - a.getPrice() })
	}
	/**
	 * Sort the Sell Orders in Ascending order (lowest to greatest [0, 1, 2])
	 */
	sortSells(){
		this.sell_orders.sort((a, b) => { return a.getPrice() - b.getPrice() })
	}
	/**
	 * @param  {BuyOrder} buy_order - The BuyOrder to process
	 */
	processBuy(buy_order){
		// Force a sort to make sure we are up to date
		this.sortSells()

		for (let sell_order of this.sell_orders){
			if (this.canSell(sell_order, buy_order)){
				this.processSale(sell_order, buy_order, "buy")

				// If we have finished buying everything, then hop out of the loop
				if (buy_order.getQuantity() === 0)
					break;
			}
		}

		if (buy_order.getQuantity() > 0)
			this.buy_orders.push(buy_order)
	}
	/**
	 * @param  {SellOrder} sell_order - the SellOrder to process
	 */
	processSell(sell_order){
		// Force a sort to make sure we are up to date
		this.sortBuys()

		for (let buy_order of this.buy_orders){
			if (this.canSell(sell_order, buy_order)){
				this.processSale(sell_order, buy_order, "sell")

				// If we have finished buying everything, then hop out of the loop
				if (sell_order.getQuantity() === 0)
					break;
			}
		}

		if (sell_order.getQuantity() > 0)
			this.sell_orders.push(sell_order)
	}

	}
}

export default OrderBook