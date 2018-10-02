class Order {
	constructor(options){
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