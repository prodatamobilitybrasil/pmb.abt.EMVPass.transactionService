import { RabbitMQ } from "../../../src/infra/rabbit_mq/rabbit_mq.ts";
import dotenv from "dotenv";

dotenv.config();

test("Teste conexão RabbitMQ", async () => {
    if (process.env.ENVIRONMENT == "DEV") {
        var result: boolean | undefined = false;
        const user = process.env.RABBIT_MQ_USER || "";
        const password = process.env.RABBIT_MQ_PASSWORD || "";
        const hostname = process.env.RABBIT_MQ_HOSTNAME || "";
        const port = parseInt(process.env.RABBIT_MQ_PORT || "");
        const vhost = process.env.RABBIT_MQ_VHOST || "";
        const queueConsumer = process.env.RABBIT_MQ_QUEUE_CONSUMER || "";

        const rabbit = new RabbitMQ();
        await rabbit.connect(user, password, hostname, port, vhost);
        const rabbitMQ = new RabbitMQ();
        await rabbitMQ.connect(user, password, hostname, port, vhost);

        result = await rabbitMQ.produceQueue(queueConsumer, "test");

        await rabbit.disconnect();

        expect(result).toBe(true);
    }
});
