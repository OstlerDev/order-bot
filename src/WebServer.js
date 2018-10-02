import express from 'express'
import bodyParser from 'body-parser'
import OrderBook from './OrderBook'
import BuyOrder from './BuyOrder'
import SellOrder from './SellOrder'

class WebServer {
	constructor(){
		this.server = express()
		this.order_book = new OrderBook()

		this.setup()
	}
	setup(){
		// Parse JSON POST body data
		this.server.use(bodyParser.json());

		/**
		 * GET /book 
		 * returns 
		 * 	{ 
		 * 		"buys": [ { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }, ... ], 
		 * 		"sells":[ { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }, ... ] 
		 * 	}
		 */
		this.server.get("/book", (req, res) => { 
			console.log("GET /book", this.order_book.toJSON())
			res.send(this.order_book.toJSON()) 
		})

		/**
		 * POST /buy 
		 * expects { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }
		 */
		this.server.post("/buy", (req, res) => { 
			let input = {qty: Number(req.body.qty), prc: Number(req.body.prc)}
			console.log(`POST /buy ${JSON.stringify(input)}`)
			try {
				let buy_order = new BuyOrder(input)

				this.order_book.processBuy(buy_order)

				res.send({success: true})
			} catch (e) {
				res.send({success: false, error: e.message, input})
			}
		})

		/**
		 * POST /sell 
		 * expects { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }
		 */
		this.server.post("/sell", (req, res) => { 
			let input = {qty: Number(req.body.qty), prc: Number(req.body.prc)}
			console.log(`POST /sell ${JSON.stringify(input)}`)
			try {
				let sell_order = new SellOrder(input)

				this.order_book.processSell(sell_order)

				res.send({success: true})
			} catch (e) {
				res.send({success: false, error: e.message, input, body: req.body})
			}
		})
	}
	resetBook(){
		this.order_book = new OrderBook()
	}
	listen(host, port, callback){
		this.http_server = this.server.listen(port, host, () => {
			console.log(`OrderBot Webserver listening on ${host}:${port}`)
			if (callback)
				callback()
		})
	}
	close(callback){
		this.http_server.close(callback)
	}
}

export default WebServer