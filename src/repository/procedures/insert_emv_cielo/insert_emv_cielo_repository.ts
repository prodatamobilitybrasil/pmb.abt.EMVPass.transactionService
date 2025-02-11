import { BIND_INOUT, BIND_OUT, BindParameters, CURSOR, NUMBER, STRING } from "oracledb";
import { OracleDB } from "../../../infra/oracle_db/oracle_db";
import { IProcedure } from "../procedure";
import { InsertEMVCieloParams } from "./insert_emv_cielo_params";
import { AbtInsEmvCieloProcedureResponse, AbtInsEmvCieloProcedure } from "./insert_emv_cielo_procedure";

export class AbtInsertEMVCieloRepository implements IProcedure<AbtInsEmvCieloProcedureResponse> {
    constructor(private readonly oracle: OracleDB) {}

    async execute(data: InsertEMVCieloParams): Promise<AbtInsEmvCieloProcedureResponse | undefined> {
        try {
            const bindParams = await this.handleParams(data);

            const result = await this.oracle.execProcedure<AbtInsEmvCieloProcedure<AbtInsEmvCieloProcedureResponse>>("ABT_INS_EMV_CIELO", bindParams);
            
            if (result?.outBinds?.p_cursor) {
                const cursor = result.outBinds.p_cursor;
                const resultData = await cursor.getRow();
                await cursor.close();
                return resultData;
            } else return undefined;
        } catch(err) {
            console.log(`Error to execute Procedure!\nData${JSON.stringify(data)}\n${err}`);
        }
    }

    async handleParams(params: InsertEMVCieloParams): Promise<BindParameters> {
        var bindParameters = {
            p_proc_version: params.proc_version || 25001,
            p_result: { dir: BIND_OUT, type: NUMBER },
            p_result_msg: { dir: BIND_OUT, type: STRING, maxSize: 500 },
            p_etrn_id: { dir: BIND_INOUT, type: NUMBER, val: params.etrn_id },
            p_wlt_id: { dir: BIND_INOUT, type: NUMBER, val: params.wlt_id || 1 },
            p_wlt_reguser: params.wlt_reguser || "teste",
            p_wlt_hsmkey: params.wlt_hsmkey || 10,
            p_wlt_walletsigin: params.wlt_walletsign || "teste",
            p_ecrd_pantoken: params.ecrd_pantoken || "teste",
            p_ecrd_firstsixnumber: params.ecrd_firstsixnumber || "123456",
            p_ecrd_lastfournumber: params.ecrd_lastfournumber || "7890",
            p_ecrd_cardholdername: params.ecrd_cardholdername || "teste",
            p_ecrd_validtruh: params.ecrd_validthru || "2028-09",
            p_eacc_par: params.eacc_par || "par123",
            p_etrn_value: params.etrn_value || 500,
            p_etrn_orderkey: params.etrn_orderkey || "liyhqdc",
            p_etrn_requestdate: params.etrn_requestdate || new Date(),
            p_etrn_merchant_id: params.etrn_merchant_id || "",
            p_etrn_terminal: params.etrn_terminal || "terminal",
            p_etrn_stan: params.etrn_stan || "stan",
            p_etrn_iti: params.etrn_iti || "iti",
            p_etrn_tlvdata: params.etrn_tlvdata,
            p_etrn_status: params.etrn_status || "status",
            p_etrn_authrsn: params.etrn_authrsn || 10,
            p_etrn_aid: params.etrn_aid || "aid",
            p_etrn_retrytype: params.etrn_retrytype || 10,
            p_etrn_elapsed_process: params.etrn_elapsed_process || 10,
            p_etrn_elapsed_acquirer: params.etrn_elapsed_acquirer || 10,
            p_etrn_device_pay: params.etrn_device_pay || "too",
            p_etrn_brand_card: params.etrn_brand_card || "teste",
            p_etrn_soft_desc: params.etrn_soft_description || "teste",
            p_cursor: { dir: BIND_OUT, type: CURSOR },
        } as BindParameters;

        return bindParameters;
    }
}
