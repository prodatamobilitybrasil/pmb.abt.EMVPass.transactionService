import { MongoDB } from "../infra/mongo_db/mongo_db";
import { OracleDB } from "../infra/oracle_db/oracle_db";
import { TransactionEMVRepository } from "../repository/collections/transaction_emv/transaction_emv_repository";
import { AbtInsertEMVCieloRepository } from "../repository/procedures/insert_emv_cielo/insert_emv_cielo_repository";
import { TransactionEMVUsecase } from "./transaction_emv_usecase";

const oracle_db = new OracleDB();
const mongo_db = new MongoDB();

const transaction_emv_repository = new TransactionEMVRepository(mongo_db);
const insert_emv_cielo_repository = new AbtInsertEMVCieloRepository(oracle_db);
const transaction_emv_usecase = new TransactionEMVUsecase(transaction_emv_repository, insert_emv_cielo_repository);

export default transaction_emv_usecase;
