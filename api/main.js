const path = require('path')

const express = require('express')
const { Router } = express
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback')

const {
	makeDatabase,
	makeIdGenerator,
} = require('database')
const { makeAuthenticate } = require('user/user.auth')
const makeAdventureApi = require('adventure')
const makeUserApi = require('user')


// Configure app

require('dotenv').config()

const { DB_URL, DB_NAME, PORT, SECRET } = process.env

const app = express()
app.disable('x-powered-by')
app.use(cookieParser())
app.use(bodyParser.json())

const database = makeDatabase(DB_URL, DB_NAME)
const authenticate = makeAuthenticate({ SECRET })


// Start app

console.log(`Starting connection to ${DB_URL}...`)
database()
	.then(db => {
		const idGenerator = makeIdGenerator({ db })

		app.use('/api', makeUserApi({ SECRET, Router, db, authenticate }))
		app.use('/api', makeAdventureApi({ Router, db, authenticate, idGenerator }))
		
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
