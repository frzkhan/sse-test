const path = require('path')
const fastify = require('fastify')({
  logger: true
})
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})
// Declare a route
fastify.get('/', function (request, reply) {
  reply.sendFile('index.html')
})
function countdown(reply, count) {
  reply.raw.write("data: " + count + "\n\n")
  if (count)
    setTimeout(() => countdown(reply, count-1), 10000)
  else
  reply.raw.end()
}
fastify.get("/countdown",(request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  countdown(reply, 10)
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
