import dotenv from "dotenv";
import { MongoDB } from "./infra/mongo_db/mongo_db";
import { OracleDB } from "./infra/oracle_db/oracle_db";
import { RabbitMQ } from "./infra/rabbit_mq/rabbit_mq";
import { TransactionEMVConsumerController } from "./controllers/transaction_emv_consumer";

dotenv.config();

const mongoDB = new MongoDB();
mongoDB.connect();

const oracleDB = new OracleDB();
oracleDB.connect();

const initRabbit = async () => {
    const user = process.env.RABBIT_MQ_USER || "";
    const password = process.env.RABBIT_MQ_PASSWORD || "";
    const hostname = process.env.RABBIT_MQ_HOSTNAME || "";
    const port = parseInt(process.env.RABBIT_MQ_PORT || "");
    const vhost = process.env.RABBIT_MQ_VHOST || "";
    const queueConsumer = process.env.RABBIT_MQ_QUEUE_CONSUMER || "";

    const rabbitMQ = new RabbitMQ();
    await rabbitMQ.connect(user, password, hostname, port, vhost);
    const consumerController = new TransactionEMVConsumerController();
    await rabbitMQ.consumeQueue(queueConsumer, consumerController.handle);
    
    const transactionEMV = {
        "_id": {
          "$oid": "675c251aa9722955c69e2354"
        },
        "sequence": 5383,
        "date": new Date(),
        "algorithm": 0,
        "latitude": -1666601,
        "longitude": -4924313,
        "panTokenSize": 20,
        "pantoken": "5090972FB27BCC306713",
        "pan": "5090978454376713",
        "panSn": 2,
        "track2": "5090978454376713=28126002311010000000",
        "tlvData": "82021900950500000000005F2A0209869C01009F02060000000004309F0607A00000049410109F100A0115101000001E0100009F1A0200769F2608A84E2946B635F73D9F2701409F3501259F360201CB9F3704565896359A032412139F33030008089F3403000000",
        "ksnSize": 0,
        "ksn": null,
        "panHashSize": 0,
        "panHash": null,
        "tpId": 1,
        "tpDesc": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "lineId": 187,
        "lineDesc": "263-1\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "serviceOperator": "00000000f3f3e45d",
        "serviceTime": new Date(),
        "direction": 1,
        "merchantId": "30",
        "terminalId": "949T369774",
        "terminalVersion": "Kiosk IV V1.20.143",
        "transactionState": "E",
        "carNbr": 50330,
        "insertDate": new Date(),
        "transactionErrorCode": 5,
        "deviceId": 56499,
        "deviceType": 3,
        "modelType": 0,
        "validatorState": 1,
        "acquirer": "cielo",
        "brand": "ELO Crédito",
        "paymentDeviceType": null,
        "objElapseTime": {
          "totalProcessET": 9269,
          "totalProcessInitET": 0,
          "totalETCielo": 0,
          "ETAuthCielo": 2264,
          "ETQueryCielo": 0,
          "ETConfirmCielo": 0,
          "ETUndoCielo": 0
        },
        "walletId": 1328770,
        "firstTravelDate": "2024-12-13T12:14:15.828Z",
        "etrn_id": 17602459,
        "fare_value": 90205,
        "acquirerError": false,
        "originalLogId": "675c2517a9722955c69e2332",
        "wasUndone": false,
        "etrn_status": "E",
        "retryQty": 0,
        "summary": [],
        "nextRetry": new Date(),
        "retry": true,
        "transactionPush": null,
        "pushArray": [],
        "itk": null,
        "atk": null,
        "authRsn": null,
        "value": 902.0500000000001,
        "token": "1dc35a0b-cf1f-46bb-ae7e-5982428330ac",
        "paymentId": "ab146a38-462c-4c09-b202-e310a16ffc66",
        "lastProcessDate": null
    }

    setTimeout(async () => {
        await rabbitMQ.produceQueue(queueConsumer, transactionEMV);
    }, 2000);
}

initRabbit();
