import amqp, { Connection, Channel } from 'amqplib';

interface IRabbitMQ {
    connect(username: string, password: string, hostname: string, port: number, vhost: string): Promise<void>;
    disconnect(): Promise<void>;
    consumeQueue(queue: string, handler: Function): Promise<void>
}

export class RabbitMQ implements IRabbitMQ {
    private static instance: Connection;

    async connect(username: string, password: string, hostname: string, port: number, vhost: string): Promise<void> {
        try {
            RabbitMQ.instance = await amqp.connect({
                protocol: "amqp",
                hostname,
                port,
                username,
                password,
                vhost,
            });
            console.log("Connected to RabbitMQ with Success!");
        } catch(err) {
            console.log("Error to connect RabbitMQ!\n", err);
        }
    }

    async disconnect(): Promise<void> {
        try {
            await RabbitMQ.instance.close();
            console.log("Disconnected to RabbitMQ with Success!");
        } catch(err) {
            console.log("Error to disconnect RabbitMQ!\n", err);
        }
    }

    async consumeQueue(queue: string, handler: Function): Promise<void> {
        try {
            const channel = await RabbitMQ.instance.createChannel();
            await channel.assertQueue(queue, { durable: true });
            channel.consume(queue, (message) => {
                if (message) {
                    handler(message);
                    channel.ack(message);
                } else {
                    console.log("Message Invalid!");
                }
            });
        } catch(err) {
            console.log("Error to consume Queue!\n", err);
        }
    }

    async produceQueue<T>(queue: string, message: T): Promise<boolean | undefined> {
        try {
            const channel = await RabbitMQ.instance.createChannel();
            const messageBuffer = Buffer.from(JSON.stringify(message));
            const result = channel.sendToQueue(queue, messageBuffer);
            if (result) console.log("Success to send message to RabbitMQ!");
            else throw new Error(`Result to send message ${result}`);
            return result;
        } catch(err) {
            console.log("Error to send message to RabbitMQ!\n", err);
        }
    }
}
