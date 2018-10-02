const axios = require('axios')
const WebServer = require('../src/WebServer').default

let server = new WebServer()

let my_axios = axios.create({baseURL: "http://0.0.0.0:5013"})

beforeAll((done) => {
	server.listen("0.0.0.0", 5013, () => {
		done()
	})
})

afterAll((done) => {
	server.close(done)
})

it("POST /buy", async () => {
	server.resetBook()

	let res = await my_axios.post("/buy", {prc: 10, qty: 10}, () => {})
	expect(res.data).toEqual({success: true})

	let book = await my_axios.get("/book")
	expect(book.data).toEqual({
		buys: [{prc: 10, qty: 10}],
		sells: []
	})
})

it("POST /sell", async () => {
	server.resetBook()

	let res = await my_axios.post("/sell", {prc: 10, qty: 10}, () => {})
	expect(res.data).toEqual({success: true})

	let book = await my_axios.get("/book")
	expect(book.data).toEqual({
		buys: [],
		sells: [{prc: 10, qty: 10}]
	})
})

it("GET /book", async () => {
	server.resetBook()

	let book = await my_axios.get("/book")
	expect(book.data).toEqual({
		buys: [],
		sells: []
	})

	let sell1 = await my_axios.post("/sell", {prc: 10, qty: 10}, () => {})
	expect(sell1.data).toEqual({success: true})

	let book2 = await my_axios.get("/book")
	expect(book2.data).toEqual({
		buys: [],
		sells: [{prc: 10, qty: 10}]
	})

	let sell2 = await my_axios.post("/sell", {prc: 10, qty: 10}, () => {})
	expect(sell2.data).toEqual({success: true})
	let buy1 = await my_axios.post("/buy", {prc: 5, qty: 10}, () => {})
	expect(buy1.data).toEqual({success: true})

	let book3 = await my_axios.get("/book")
	expect(book3.data).toEqual({
		buys: [{prc: 5, qty: 10}],
		sells: [{prc: 10, qty: 10}, {prc: 10, qty: 10}]
	})
})


it("Must pass Sample Session", async () => {
	server.resetBook()

	let sample_session = [
		{"/sell": {"qty":10, "prc":15}},
		{"/sell": {"qty":10, "prc":13}},
		{"/buy": {"qty":10, "prc":7}},
		{"/buy": {"qty":10, "prc":9.5}},
		{"/book": {
			"buys": [ { "qty":10, "prc":9.5 }, { "qty":10, "prc":7 } ],
			"sells":[ { "qty":10, "prc":13 },  { "qty":10, "prc":15 } ]
		}},
		{"/sell": {"qty":5, "prc":9.5}},
		{"/book": {
			"buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
			"sells":[ { "qty":10, "prc":13 },  { "qty":10, "prc":15 } ]
		}},
		{"/buy": {"qty":6, "prc":13}},
		{"/book": {
			"buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
			"sells":[ { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
		}},
		{"/sell": {"qty":7, "prc":7}},
		{"/book": {
			"buys": [ { "qty":8, "prc":7 } ],
			"sells":[ { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
		}},
		{"/sell": {"qty":12, "prc":6}},
		{"/book": {
			"buys": [ ],
			"sells":[ { "qty":4, "prc":6 }, { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
		}}
	]

	for (let query of sample_session){
		for (let path in query){
			console.log(path, query[path])
			if (path === "/buy" || path === "/sell"){
				let res = await my_axios.post(path, query[path], () => {})
				expect(res.data).toEqual({success: true})
			}
			else if (path === "/book"){
				let book_res = await my_axios.get(path)

				expect(book_res.data).toEqual(query[path])
			}
		}
	}
})