const SellOrder = require('../src/SellOrder').default

describe("Sales", () => {
	it("should be able to process with sale price > SellOrder price", () => {
		let sell_order = new SellOrder({prc: 10, qty: 10})

		sell_order.addSale({price: 100, quantity: 5})

		expect(sell_order.toJSON()).toEqual({prc: 10, qty: 5})
	})

	it("should be able to process with sale price = SellOrder price", () => {
		let sell_order = new SellOrder({prc: 10, qty: 10})

		sell_order.addSale({price: 10, quantity: 5})

		expect(sell_order.toJSON()).toEqual({prc: 10, qty: 5})
	})

	it("should refuse to process with sale price < SellOrder price", () => {
		let sell_order = new SellOrder({prc: 10, qty: 10})

		try {
			sell_order.addSale({price: 5, quantity: 5})
		} catch (e) {
			expect(e.message).toBe("Sale Price must be > or = to the Sell Order price!")
		}

		expect(sell_order.toJSON()).toEqual({prc: 10, qty: 10})
	})
})