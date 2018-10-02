const Order = require('../src/Order').default

it("should be able to create an Order", () => {
	let my_order = new Order({
		prc: 15,
		qty: 10
	})

	expect(my_order.toJSON()).toEqual({
		prc: 15,
		qty: 10
	})
})