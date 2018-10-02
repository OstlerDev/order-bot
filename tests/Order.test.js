const Order = require('../src/Order').default

describe("Order Creation", () => {
	it("should be able to create an Order (int price)", () => {
		let my_order = new Order({ prc: 15, qty: 10 })

		expect(my_order.toJSON()).toEqual({ prc: 15, qty: 10 })
	})

	it("should be able to create an Order (float price)", () => {
		let my_order = new Order({ prc: 15.256, qty: 10 })

		expect(my_order.toJSON()).toEqual({ prc: 15.256, qty: 10 })
	})

	it("price must be number (test string)", () => {
		try {
			let my_order = new Order({ prc: "hi", qty: 10 })
		} catch (e) {
			expect(e.message).toEqual("`prc` (price) must be a number!")
		}
	})

	it("price must be number (test undefined)", () => {
		try {
			let my_order = new Order({ prc: undefined, qty: 10 })
		} catch (e) {
			expect(e.message).toEqual("`prc` (price) must be a number!")
		}
	})

	it("quantity must be an integer (test float)", () => {
		try {
			let my_order = new Order({ prc: 15, qty: 10.25 })
		} catch (e) {
			expect(e.message).toEqual("`qty` (quantity) must be an integer!")
		}
	})

	it("quantity must be an integer (test string)", () => {
		try {
			let my_order = new Order({ prc: 15, qty: "hi" })
		} catch (e) {
			expect(e.message).toEqual("`qty` (quantity) must be an integer!")
		}
	})

	it("quantity must be number (test undefined)", () => {
		try {
			let my_order = new Order({ prc: 15, qty: undefined })
		} catch (e) {
			expect(e.message).toEqual("`qty` (quantity) must be an integer!")
		}
	})
})

describe("Sale Processing", () => {
	it("Should be able to add a complete sale", () => {
		let my_order = new Order({prc: 10, qty: 10})

		my_order.addSale({price: 10, quantity: 10})

		expect(my_order.toJSON()).toEqual({prc: 10, qty: 0})
	})

	it("Should be able to add a partial sale", () => {
		let my_order = new Order({prc: 10, qty: 10})

		my_order.addSale({price: 10, quantity: 5})

		expect(my_order.toJSON()).toEqual({prc: 10, qty: 5})
	})

	it("Should be able to add multiple partial sales", () => {
		let my_order = new Order({prc: 10, qty: 10})

		my_order.addSale({price: 10, quantity: 5})
		my_order.addSale({price: 10, quantity: 3})

		expect(my_order.toJSON()).toEqual({prc: 10, qty: 2})

		my_order.addSale({price: 10, quantity: 2})

		expect(my_order.toJSON()).toEqual({prc: 10, qty: 0})
	})

	it("Should refuse to add a sale if not enough quantity", () => {
		let my_order = new Order({prc: 10, qty: 10})

		try {
			my_order.addSale({price: 10, quantity: 11})
		} catch (e) {
			expect(e.message).toBe("Sale Quantity must be < or = to the Quantity available on the Order!")
		}
	})

	it("Should refuse to add a sale if quantity is a float", () => {
		let my_order = new Order({prc: 10, qty: 10})

		try {
			my_order.addSale({price: 10, quantity: 9.9})
		} catch (e) {
			expect(e.message).toBe("Sale Quantity must be an Integer!")
		}
	})

	it("Should refuse to add a sale if price is not a number (test undefined)", () => {
		let my_order = new Order({prc: 10, qty: 10})

		try {
			my_order.addSale({price: undefined, quantity: 10})
		} catch (e) {
			expect(e.message).toBe("Sale Price must be a Number!")
		}
	})

	it("Should refuse to add a sale if price is not a number (test string)", () => {
		let my_order = new Order({prc: 10, qty: 10})

		try {
			my_order.addSale({price: "hi", quantity: 10})
		} catch (e) {
			expect(e.message).toBe("Sale Price must be a Number!")
		}
	})
})