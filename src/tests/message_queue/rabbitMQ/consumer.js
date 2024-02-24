const amqp = require('amqplib')

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqps://localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName , {
            durable: true
        })

        // send messages to consumer channel
        channel.consume(queueName, (messages) => {
            console.log(`Received ${messages.content.toString()}`);
        },{
            noAck: true
        }) 

        
    }catch(e) {
        console.error(e);
    }
}

runConsumer().catch(console.error)