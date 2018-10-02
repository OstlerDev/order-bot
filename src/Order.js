import assert from 'assert'

class Order {
	constructor(options){
		assert(!Number.isNaN(options.prc), "`prc` (price) must be a number!")
		assert(Number.isInteger(options.qty), "`qty` (quantity) must be an integer!")

		this.price = options.prc
		this.quantity = options.qty

		this.sales = []
	}
	addSale(sale){
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