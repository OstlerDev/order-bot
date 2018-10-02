import assert from 'assert'

class Order {
	constructor(options){
		assert(!Number.isNaN(options.prc), "`prc` (price) must be a number!")
		assert(Number.isInteger(options.qty), "`qty` (quantity) must be an integer!")

		this.price = options.prc
		this.quantity = options.qty

		this.sales = []
	}
	/**
	 * Add a sale to the Order
	 * @param {Object} sale - The Sale to process
	 * @param {Number} sale.price - The purchase price of the sale
	 * @param {Integer} sale.quantity - The purchase quantity of the sale
	 */
	addSale(sale){
		assert(!Number.isNaN(sale.price), "Sale Price must be a Number!")
		assert(Number.isInteger(sale.quantity), "Sale Quantity must be an Integer!")
		assert(sale.quantity <= this.getQuantity(), "Sale Quantity must be < or = to the Quantity available on the Order!")

		this.sales.push(sale)
	}
	getQuantity(){
		let quantity = this.quantity

		for (let sale of this.sales){
			quantity -= sale.quantity
		}

		return quantity
	}
	getPrice(){
		return this.price
	}
	toJSON(){
		return {
			"qty": this.getQuantity(),
			"prc": this.getPrice()
		}
	}
}

export default Order