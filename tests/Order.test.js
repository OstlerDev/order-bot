const Order = require('../src/Order').default

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