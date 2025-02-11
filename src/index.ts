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
      "_id":"67a3124dacd6613b68b6ae26",
      "sequence": 5002,
      "date": "2025-02-02T20:48:53.000Z",
      "latitude": -2319265,
      "longitude": -4699117,
      "pan": "5460695117673557",
      "panSn": 0,
      "track2": "5460695117673557=28032010000000000000",
      "tlvData": "82021B80950500200080015F2A0209869C01009F02060000000005509F0607A00000000410109F10120314A541000200000002001C008B197300FF9F1A0200769F241D3530303130424C545234303136455241564545364651555A4A30524B4A9F26088942C8B6C151B8D19F2701809F3501259F360200019F37046E950D0D9A032502029F33030008089F34033F00029F6E0700760000323100",
      "tpId": 2,
      "tpDesc": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
      "lineId": 400,
      "lineDesc": "10\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
      "serviceOperator": "00000000659a0f59",
      "direction": 0,
      "merchantId": "30",
      "terminalId": "336H502306",
      "terminalVersion": "Kiosk IV V1.20.143",
      "transactionState": "E",
      "carNbr": 3528,
      "deviceId": 72430,
      "deviceType": 3,
      "modelType": 0,
      "validatorState": 16,
      "acquirer": "cielo",
      "objElapseTime": {
        "totalProcessET": 1380,
        "totalProcessInitET": 0,
        "totalETCielo": 0,
        "ETAuthCielo": 1020,
        "ETQueryCielo": 0,
        "ETConfirmCielo": 0,
        "ETUndoCielo": 0
      },
      "walletId": 403481,
      "etrn_id": 3810226,
      "fare_value": 550,
      "acquirerError": false,
      "originalLogId": "67a3124bacd6613b68b6ae23",
      "wasUndone": false,
      "transactionErrorCode": 78,
      "retryQty": 2,
      "summary": [
        {
          "summaryId": "67a06970acd6613b68a5bebe",
          "transactionState": "D",
        },
        {
          "summaryId": "67a30c70acd6613b68b6968f",
          "transactionState": "D",
          
        }
      ],
      "nubankDebitRetried": true,
      "nextRetry": {
        "$date": "2025-02-17T03:00:00.000Z"
      },
      "retry": true,
      "pantoken": "546069D109FD45523557",
      "transactionPush": null,
      "pushArray": [],
      "itk": null,
      "atk": null,
      "authRsn": null,
      "value": 5.5,
      "token": "3350c26f-a805-4ebc-a6c3-002b16848f9e",
      "paymentId": "d60dfd0f-39e5-4027-828f-552bc437beb5",
      "firstTravelDate": "2025-02-02T20:48:57.66Z",
      "lastProcessDate": null,
      "updateDate": "2025-02-05T07:00:10.661Z",
    }

    setTimeout(async () => {
        await rabbitMQ.produceQueue(queueConsumer, transactionEMV);
    }, 2000);
}

initRabbit();
