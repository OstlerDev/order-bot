import assert from 'assert'
import Order from './Order'

class BuyOrder extends Order {
	constructor(opts){
		super(opts)
	}
	addSale(sale){
		assert(sale.price <= this.getPrice(), "Sale Price must be < or = to the Buy Order price!")

		// Call the parent method
		Order.prototype.addSale.call(this, sale)
	}
}

export default BuyOrder