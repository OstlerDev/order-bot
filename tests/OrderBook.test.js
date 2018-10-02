const OrderBook = require('../src/OrderBook').default
const BuyOrder = require('../src/BuyOrder').default
const SellOrder = require('../src/SellOrder').default

it("Must pass Sample Session", () => {
	let my_book = new OrderBook()

	// POST /sell {"qty":10, "prc":15}
	my_book.processSell(new SellOrder({"qty":10, "prc":15}))
	// POST /sell {"qty":10, "prc":13}
	my_book.processSell(new SellOrder({"qty":10, "prc":13}))

	// POST /buy  {"qty":10, "prc":7}
	my_book.processBuy(new BuyOrder({"qty":10, "prc":7}))
	// POST /buy  {"qty":10, "prc":9.5}
	my_book.processBuy(new BuyOrder({"qty":10, "prc":9.5}))

	// GET  /book
	expect(my_book.toJSON()).toEqual({
		"buys": [ { "qty":10, "prc":9.5 }, { "qty":10, "prc":7 } ],
		"sells":[ { "qty":10, "prc":13 }, { "qty":10, "prc":15 } ]
	})

	// POST /sell {"qty":5, "prc":9.5}
	my_book.processSell(new SellOrder({"qty":5, "prc":9.5}))

	// GET  /book
	expect(my_book.toJSON()).toEqual({
		"buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
		"sells":[ { "qty":10, "prc":13 }, { "qty":10, "prc":15 } ]
	})

	// POST /buy  {"qty":6, "prc":13}
	my_book.processBuy(new BuyOrder({"qty":6, "prc":13}))

	// GET  /book
	expect(my_book.toJSON()).toEqual({
		"buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
		"sells":[ { "qty":4, "prc":13 }, { "qty":10, "prc":15 } ]
	})

	// POST /sell {"qty":7, "prc":7}
	my_book.processSell(new SellOrder({"qty":7, "prc":7}))

	// GET  /book
	expect(my_book.toJSON()).toEqual({
		"buys": [ { "qty":8, "prc":7 } ],
		"sells":[ { "qty":4, "prc":13 }, { "qty":10, "prc":15 } ]
	})

	// POST /sell {"qty":12, "prc":6}
	my_book.processSell(new SellOrder({"qty":12, "prc":6}))

	// GET  /book
	expect(my_book.toJSON()).toEqual({
		"buys": [ ],
		"sells":[ { "qty":4, "prc":6 }, { "qty":4, "prc":13 }, { "qty":10, "prc":15 } ]
	})
})

it("should be able to process a full sale", () => {
	let my_book = new OrderBook()

	my_book.processBuy(new BuyOrder({ prc: 15, qty: 10 }))
	my_book.processSell(new SellOrder({ prc: 15, qty: 10 }))

	expect(my_book.toJSON()).toEqual({
		"buys": [],
		"sells": []
	})
})

it("should be able to process a smaller BuyOrder quantity than our SellOrder quantity", () => {
	let my_book = new OrderBook()

	my_book.processBuy(new BuyOrder({ prc: 15, qty: 5 }))
	my_book.processSell(new SellOrder({ prc: 15, qty: 10 }))

	expect(my_book.toJSON()).toEqual({
		"buys": [],
		"sells": [ { prc: 15, qty: 5 } ]
	})
})

it("should be able to process a larger BuyOrder quantity than our SellOrder quantity", () => {
	let my_book = new OrderBook()

	my_book.processBuy(new BuyOrder({ prc: 15, qty: 15 }))
	my_book.processSell(new SellOrder({ prc: 15, qty: 10 }))

	expect(my_book.toJSON()).toEqual({
		"buys": [ { prc: 15, qty: 5 } ],
		"sells": []
	})
})

it("should refuse to sell if the buy price is less than the sell price", () => {
	let my_book = new OrderBook()

	my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))
	my_book.processSell(new SellOrder({ prc: 15, qty: 10 }))

	expect(sell_order.canSell(buy_order)).toBe(false)

	expect(my_book.toJSON()).toEqual({
		"buys": [ { prc: 10, qty: 10 } ],
		"sells": [ { prc: 15, qty: 10 } ]
	})
})