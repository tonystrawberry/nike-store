import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'

// get reference to the client build directory
const staticFiles = express.static(path.join(__dirname, '../../client/build'))

const app = express()
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)
app.use(staticFiles) // pass the static files (react app) to the express app. 

router.get('/api/ping', (req, res) => {
  res.send('pong')
})

app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}...`)
})
