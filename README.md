[![](https://travis-ci.org/OstlerDev/order-bot.svg?branch=master)](https://travis-ci.org/OstlerDev/order-bot)
# OrderBot

OrderBot is a simple dumbed down Order matching engine with a very basic REST api.

## How to Run
Please follow the instructions below in order to get the webserver started up.

### Prerequisites
In order to run OrderBot you must have Node.js v8.12.0 (LTS) or Node.js v10.11.0 (Current) installed. You can find the latest versions at: https://nodejs.org/en/

### Installation Instructions
To install all the required dependencies for OrderBot, please follow the following steps.

1. Clone the repository to your local computer using `git clone https://github.com/OstlerDev/order-bot.git`
2. `cd` into the folder that was just created by running `cd order-bot`
3. Install the required dependencies by running `npm install`
4. Edit `config.json` to set your desired `host` and `port` for the `WebServer` to run on.

### Running the WebServer
To startup the REST API server, please run `npm start`. 

Once it has started, you should see a message that says `OrderBot Webserver listening on 0.0.0.0:3000`

## About the API
GET `/book`
 
resulting JSON:
```js
{
    "buys": [ { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }, ... ],
    "sells":[ { "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }, ... ]
}
```
POST `/buy`

JSON payload format: 
```js
{ "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }
```
 
POST `/sell`
JSON payload format: 
```js
{ "qty":INTEGER_NUMBER, "prc":DECIMAL_NUMBER }
```