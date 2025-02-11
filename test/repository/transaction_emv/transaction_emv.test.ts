import { MongoDB } from "../../../src/infra/mongo_db/mongo_db.ts";
import { TransactionEMVRepository } from "../../../src/repository/collections/transaction_emv/transaction_emv_repository.ts";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { transaction_emv } from "../tranaction_emv_singleton.ts";

dotenv.config();

describe("Teste Repository TransactionEMV", () => {

    const mongo = new MongoDB();
    mongo.connect();
    const repository = new TransactionEMVRepository(mongo);
    var transaction_id : ObjectId | undefined = undefined;

    test("Teste Insert TransactionEMV", async () => {
        transaction_id = await repository.insert(transaction_emv);
        expect(transaction_id).toBeDefined();
    });

    test("Teste Find TransactionEMV", async () => {
        const result = await repository.find(transaction_emv);
        expect(result).toBeDefined();
    });

    test("Teste Update TransactionEMV", async () => {
        const result = await repository.update(transaction_id!, { ...transaction_emv, pantoken: "new pantoken" });
        expect(result).toBe(1);
    });

    test("Teste Delete TransactionEMV", async () => {
        const result = await repository.delete(transaction_id!);
        expect(result).toBe(1);
    });

    mongo.disconnect();
});
