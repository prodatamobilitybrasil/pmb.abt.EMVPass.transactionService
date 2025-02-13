import { OracleDB } from "../../../src/infra/oracle_db/oracle_db.ts";
import dotenv from "dotenv";

dotenv.config()

class OracleDBTest extends OracleDB {
    constructor() { super() }

    static async test() {
        if (this.connection) {
            await this.connection?.ping();
            console.log("Ping Oracle With Sucess!");
        } else {
            throw new Error("Connection Error!");
        }
    }
}

test("Teste de conexão com OracleDB", async () => {
    if (process.env.ENVIRONMENT == "DEV") {
        let error = null;
        try {
            const oracle = new OracleDB();
            await oracle.connect();
            await OracleDBTest.test();
            await oracle.exec("SELECT * FROM LOG_TEMP", {});
            await oracle.disconnect();
        } catch(err) {
            error = err;
        } finally {
            expect(error).toBe(null);
        }
    }
});
