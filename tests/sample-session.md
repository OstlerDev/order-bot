Sample session:
 
POST /sell {"qty":10, "prc":15}
POST /sell {"qty":10, "prc":13}
POST /buy  {"qty":10, "prc":7}
POST /buy  {"qty":10, "prc":9.5}
GET  /book
... returns:
  {
    "buys": [ { "qty":10, "prc":9.5 }, { "qty":10, "prc":7 } ],
    "sells":[ { "qty":10, "prc":13 },  { "qty":10, "prc":15 } ]
  }
POST /sell {"qty":5, "prc":9.5}
GET  /book
... returns:
  {
    "buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
    "sells":[ { "qty":10, "prc":13 },  { "qty":10, "prc":15 } ]
  }
POST /buy  {"qty":6, "prc":13}
GET  /book
... returns:
  {
    "buys": [ { "qty":5,  "prc":9.5 }, { "qty":10, "prc":7 } ],
    "sells":[ { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
  }
POST /sell {"qty":7, "prc":7}
GET  /book
... returns:
  {
    "buys": [ { "qty":8, "prc":7 } ],
    "sells":[ { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
  }
POST /sell {"qty":12, "prc":6}
GET  /book
... returns:
  {
    "buys": [ ],
    "sells":[ { "qty":4, "prc":6 }, { "qty":4, "prc":13 },  { "qty":10, "prc":15 } ]
  }
 
 
Curl commands to execute that sample session:
 
curl localhost:3000/book
curl localhost:3000/sell --data '{"qty":10,"prc":15}' -H "Content-Type: application/json"
curl localhost:3000/sell --data '{"qty":10,"prc":13}' -H "Content-Type: application/json"
curl localhost:3000/buy  --data '{"qty":10,"prc":7}' -H "Content-Type: application/json"
curl localhost:3000/buy  --data '{"qty":10,"prc":9.5}' -H "Content-Type: application/json"
curl localhost:3000/book
curl localhost:3000/sell --data '{"qty":5, "prc":9.5}' -H "Content-Type: application/json"
curl localhost:3000/book
curl localhost:3000/buy  --data '{"qty":6, "prc":13}' -H "Content-Type: application/json"
curl localhost:3000/book
curl localhost:3000/sell --data '{"qty":7, "prc":7}' -H "Content-Type: application/json"
curl localhost:3000/book
curl localhost:3000/sell --data '{"qty":12, "prc":6}' -H "Content-Type: application/json"
curl localhost:3000/book
