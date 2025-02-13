import dotenv from "dotenv";
import { MongoDB } from "./infra/mongo_db/mongo_db";
import { OracleDB } from "./infra/oracle_db/oracle_db";
import { RabbitMQ } from "./infra/rabbit_mq/rabbit_mq";
import { TransactionEMVConsumerController } from "./controllers/transaction_emv_consumer";
import { CieloAuthGateway } from "./gateways/cielo_auth/cielo_auth_gateway";

dotenv.config();

const mongoDB = new MongoDB();
mongoDB.connect();

const oracleDB = new OracleDB();
oracleDB.connect();

const cieloAuth = new CieloAuthGateway();
cieloAuth.execute();

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
      "_id": "677e8c479793fd01f02527ce",
      "sequence": 67687,
      "date": "2025-01-08T14:10:11.000Z",
      "algorithm": 0,
      "latitude": -1667515,
      "longitude": -4925866,
      "panTokenSize": 20,
      "pantoken": "58991657F5E841D51974",
      "pan": "5899162625141974",
      "panSn": 0,
      "track2": "5899162625141974=32086200400033500015",
      "tlvData": "82021980950500000080015F2A0209869C01009F02060000000004309F0607A00000000430609F10120310A04003220000000000000000000000FF9F1A0200769F26085E1EB171B162F4499F2701809F3501259F360201FA9F37044FE173299A032501089F33030008089F34031F03029F6E0700760000303000",
      "ksnSize": 0,
      "ksn": null,
      "panHashSize": 0,
      "panHash": null,
      "tpId": 6,
      "tpDesc": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
      "lineId": 1,
      "lineDesc": "1\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
      "serviceOperator": "00000000ffffffff",
      "direction": 0,
      "merchantId": "30",
      "terminalId": "949T370733",
      "terminalVersion": "Kiosk IV V1.20.143",
      "transactionState": "E",
      "carNbr": 99161,
      "transactionErrorCode": 57,
      "deviceId": 53175,
      "deviceType": 3,
      "modelType": 0,
      "validatorState": 16,
      "acquirer": "cielo",
      "brand": "Maestro",
      "objElapseTime": {
        "totalProcessET": 2855,
        "totalProcessInitET": 0,
        "totalETCielo": 0,
        "ETAuthCielo": 999,
        "ETQueryCielo": 0,
        "ETConfirmCielo": 0,
        "ETUndoCielo": 0
      },
      "paymentDeviceType": "Cartão físico",
      "firstTravelDate": "2025-01-08T14:31:34.3Z",
      "walletId": 1659522,
      "merchantOrderId": "634541122190824",
      "etrn_id": 17604109,
      "fare_value": 430,
      "paymentId": "730544f4-c6b3-4472-8187-73eb3af2a799",
      "acquirerError": false,
      "originalLogId": "677e8c469793fd01f02527cd",
      "wasUndone": false,
      "etrn_status": "E",
      "retryQty": 0,
      "summary": [],
      "retry": true,
      "transactionPush": null,
      "pushArray": [],
      "itk": null,
      "atk": null,
      "authRsn": null,
      "value": 4.3,
      "token": "b5478694-53b4-4535-a111-c6bece83db3a",
      "lastProcessDate": null
    }

    setTimeout(async () => {
        await rabbitMQ.produceQueue(queueConsumer, transactionEMV);
    }, 2000);
}

initRabbit();
