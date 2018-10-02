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

describe("Process Sales", () => {
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

		expect(my_book.toJSON()).toEqual({
			"buys": [ { prc: 10, qty: 10 } ],
			"sells": [ { prc: 15, qty: 10 } ]
		})
	})
})

describe("OrderBook should Sort Return Arrays", () => {
	// descending = largest to smallest
	it("should list buys in descending order by price", () => {
		let my_book = new OrderBook()

		my_book.processBuy(new BuyOrder({ prc: 8, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 7, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 6, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 9, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [
				{ prc: 10, qty: 10 },
				{ prc: 9, qty: 10 },
				{ prc: 8, qty: 10 },
				{ prc: 7, qty: 10 },
				{ prc: 6, qty: 10 },
			],
			"sells": []
		})
	})

	// ascending = smallest to largest
	it("should list sells in ascending order by price", () => {
		let my_book = new OrderBook()

		my_book.processSell(new SellOrder({ prc: 8, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 10, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 9, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 6, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 7, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [],
			"sells": [
				{ prc: 6, qty: 10 }
				{ prc: 7, qty: 10 }
				{ prc: 8, qty: 10 }
				{ prc: 9, qty: 10 }
				{ prc: 10, qty: 10 }
			]
		})
	})
})

describe("Match Orders properly (buy w/ lowest sell, sell w/ highest buy)", () => {
	it("Each buy matches with the lowest sell first.", () => {
		let my_book = new OrderBook()

		my_book.processSell(new SellOrder({ prc: 10, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 5, qty: 10 }))

		my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [],
			"sells": [ { prc: 10, qty: 10 } ]
		})
	})

	it("Each sell matches with the highest buy first.", () => {
		let my_book = new OrderBook()

		my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 15, qty: 10 }))

		my_book.processSell(new SellOrder({ prc: 10, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [{ prc: 10, qty: 10 }],
			"sells": []
		})
	})

	it("Each buy matches with the lowest sell first even if that sell isn't for the exact amount", () => {
		let my_book = new OrderBook()

		my_book.processSell(new SellOrder({ prc: 10, qty: 10 }))
		my_book.processSell(new SellOrder({ prc: 5, qty: 5 }))

		my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [],
			"sells": [ { prc: 10, qty: 5 } ]
		})
	})

	it("Each sell matches with the highest buy first even if that buy isn't for the exact amount", () => {
		let my_book = new OrderBook()

		my_book.processBuy(new BuyOrder({ prc: 10, qty: 10 }))
		my_book.processBuy(new BuyOrder({ prc: 15, qty: 5 }))

		my_book.processSell(new SellOrder({ prc: 10, qty: 10 }))

		expect(my_book.toJSON()).toEqual({
			"buys": [{ prc: 10, qty: 5 }],
			"sells": []
		})
	})
})