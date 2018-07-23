const path = require('path')

const express = require('express')
const { Router } = express
const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback')

const makeDatabase = require('database')
const makeAdventureApi = require('adventure/api')


// Configure app

require('dotenv').config()

const { DB_URL, DB_NAME, PORT } = process.env

const app = express()
app.disable('x-powered-by')
app.use(bodyParser.json())

const database = makeDatabase(DB_URL, DB_NAME)


// Start app

console.log(`Starting connection to ${DB_URL}...`)
database()
	.then(db => {
		app.use('/api', makeAdventureApi({ Router, db }))
		
		app.listen(PORT,
			() => console.log(`Server listening on port ${PORT}.`)
		)
	})
	.catch(err => {
		console.error(err)
		process.exit(1)
	})


// Exit handler

const exitHandler = () => database.close()
	.then(() => {
		console.log('Bye.')
		process.exit()
	})

process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGTERM', exitHandler)
