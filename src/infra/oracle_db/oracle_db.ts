import oracledb, { BindParameters, Connection, initOracleClient, Result, ResultSet } from "oracledb";

interface IOracleDB {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    exec<T>(query: string, params: BindParameters): Promise<Result<T> | undefined>;
    execProcedure<T>(procedure_name: string, bind_params: BindParameters): Promise<Result<T> | undefined>;
}

export class OracleDB implements IOracleDB {
    static connection?: Connection;

    async connect(): Promise<void> {
        const user = process.env.ORACLE_USER || "";
        const password = process.env.ORACLE_PASSWORD || "";
        const connectionString = process.env.ORACLE_CONN_STR || "";
        try {
            initOracleClient();
            OracleDB.connection = await oracledb.getConnection({user, password, connectionString });
            console.log("Connected to Oracle with Success!");
        } catch(err) {
            console.log("Error to connect OracleDB!\nERROR: ", err);
        }
    }
    
    async disconnect(): Promise<void> {
        try {
            await OracleDB.connection?.close();
            console.log("Disconnected to Oracle with Success!");
        } catch(err) {
            console.log("Error to disconnect OracleDB!\nERROR: ", err);
        }
    }

    async exec<T>(query: string, params: BindParameters): Promise<oracledb.Result<T> | undefined> {
        try {
            if (!OracleDB.connection) await this.connect();
            return OracleDB.connection?.execute<T>(query, params);
        } catch(err) {
            console.log(`Error to execute Query in OracleDB!\nQUERY: ${query}\nERROR: ${err}`);
        }
    }

    async execProcedure<T>(procedure_name: string, bind_params: BindParameters): Promise<Result<T> | undefined> {
        const paramKeys = Object.keys(bind_params);
        const formatedParams = paramKeys.map((_, i) => `:${paramKeys[i]}`).join(", ");

        return OracleDB.connection?.execute<T>(`BEGIN ${procedure_name}(${formatedParams}); END;`, bind_params);
    }
}
