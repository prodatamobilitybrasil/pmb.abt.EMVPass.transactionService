import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import { ITransactionEMV } from "../../../src/entities/transaction_emv.ts";
import dotenv from "dotenv";

dotenv.config()

test("Teste conexão com MongoDB", async () => {
    if (process.env.ENVIRONMENT == "DEV") {
        var result : number | undefined = undefined;
        const mongo = new MongoDB();
        await mongo.connect();
        const collection = await mongo.collection<ITransactionEMV>("transactionEMV");
        result = await collection.countDocuments();
        await mongo.disconnect();
        expect(result).toBeDefined();
    }
});
