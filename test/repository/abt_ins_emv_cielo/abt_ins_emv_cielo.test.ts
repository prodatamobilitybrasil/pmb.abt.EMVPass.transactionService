import dotenv from "dotenv";
import { OracleDB } from "../../../src/infra/oracle_db/oracle_db.ts";
import { AbtInsertEMVCieloRepository } from "../../../src/repository/procedures/insert_emv_cielo/insert_emv_cielo_repository.ts";
import { transaction_emv } from "../tranaction_emv_singleton.ts";

dotenv.config();

test("Teste Repository Procedure ABT_INS_EMV_CIELO", async () => {
    const oracle = new OracleDB();
    await oracle.connect();

    const repository = new AbtInsertEMVCieloRepository(oracle);

    const result = await repository.execute(transaction_emv);
    expect(result).toBeDefined();

    await oracle.disconnect();
});
