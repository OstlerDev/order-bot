import assert from 'assert'

class Order {
	constructor(options){
		assert(!Number.isNaN(options.prc), "`prc` (price) must be a number!")
		assert(Number.isInteger(options.qty), "`qty` (quantity) must be an integer!")

		this.price = options.prc
		this.quantity = options.qty
	}
	getQuantity(){
		return this.quantity
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

export default Order;