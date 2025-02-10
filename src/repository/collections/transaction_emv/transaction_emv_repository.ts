import { Collection, ObjectId } from "mongodb";
import { ITransactionEMV } from "../../../entities/transaction_emv";
import { INoSQLRepository } from "../no_sql_repository";
import { MongoDB } from "../../../infra/mongo_db/mongo_db";


export class TransactionEMVRepository implements INoSQLRepository<ITransactionEMV> {
    private collection?: Collection<ITransactionEMV>;
    constructor(private readonly mongo: MongoDB) {}

    private async init(): Promise<void> {
        if (!this.collection) this.collection = await this.mongo.collection<ITransactionEMV>("transactionEMV");
    }

    async insert(data: ITransactionEMV): Promise<ObjectId | undefined> {
        try {
            await this.init();
            const result = await this.collection?.insertOne(data);
            return result?.insertedId;
        } catch(err) {
            console.log(`Error to insert data!\nData: ${data}\n${err}`);
        }
    }

    async find(data: ITransactionEMV): Promise<ITransactionEMV | ITransactionEMV[] | undefined> {
        try {
            await this.init();
            const result = await this.collection?.find(data).toArray();
            return result;
        } catch(err) {
            console.log(`Error to find data!\nData: ${data}\n${err}`);
        }
    }

    async update(id: ObjectId, toUpdate: ITransactionEMV): Promise<number | undefined> {
        try {
            await this.init();
            const result = await this.collection?.updateOne({ _id: id }, { $set: { ...toUpdate } });
            return result?.modifiedCount;
        } catch(err) {
            console.log(`Error to update data!\nID: ${JSON.stringify(id)}\nUpdate: ${JSON.stringify(toUpdate)}\n${err}`);
        }
    }
    
    async delete(id: ObjectId): Promise<number | undefined> {
        try {
            const result = await this.collection?.deleteOne({ _id: id });
            return result?.deletedCount;
        } catch(err) {
            console.log(`Error to delete data!\nID: ${id}\n${err}`);
        }
    }
}