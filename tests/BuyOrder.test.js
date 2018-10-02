const BuyOrder = require('../src/BuyOrder').default

describe("Sales", () => {
	it("should be able to process with sale price < BuyOrder price", () => {
		let buy_order = new BuyOrder({prc: 10, qty: 10})

		buy_order.addSale({price: 5, quantity: 5})

		expect(buy_order.toJSON()).toEqual({prc: 10, qty: 5})
	})

	it("should be able to process with sale price = BuyOrder price", () => {
		let buy_order = new BuyOrder({prc: 10, qty: 10})

		buy_order.addSale({price: 10, quantity: 5})

		expect(buy_order.toJSON()).toEqual({prc: 10, qty: 5})
	})

	it("should refuse to process with sale price > BuyOrder price", () => {
		let buy_order = new BuyOrder({prc: 10, qty: 10})

		try {
			buy_order.addSale({price: 15, quantity: 5})
		} catch (e) {
			expect(e.message).toBe("Sale Price must be < or = to the Buy Order price!")
		}

		expect(buy_order.toJSON()).toEqual({prc: 10, qty: 10})
	})
})