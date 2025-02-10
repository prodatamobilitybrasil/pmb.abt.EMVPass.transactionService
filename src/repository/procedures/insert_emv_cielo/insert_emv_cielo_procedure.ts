import { ResultSet } from "oracledb";

export interface AbtInsEmvCieloProcedure <T> {
    p_proc_version: number;
    p_result: number;
    p_result_msg: string;
    p_etrn_id: number;
    p_wlt_id: number;
    p_wlt_reguser: string;
    p_wlt_hsmkey: number;
    p_wlt_walletsigin: string;
    p_ecrd_pantoken: string;
    p_ecrd_firstsixnumber: string;
    p_ecrd_lastfournumber: string;
    p_ecrd_cardholdername: string;
    p_ecrd_validtrhu: string;
    p_eacc_par: string;
    p_etrn_value: number;
    p_etrn_orderkey: string;
    p_etrn_requestdate: Date;
    p_etrn_merchant_id: string;
    p_etrn_terminal: string;
    p_etrn_stan: string;
    p_etrn_iti: string;
    p_etrn_tlvdata: string;
    p_etrn_status: string;
    p_etrn_authrsn: number;
    p_etrn_aid: string;
    p_etrn_retrytype: number;
    p_etrn_elapsed_process: number;
    p_etrn_elapsed_acquirer: number;
    p_etrn_device_pat: string;
    p_etrn_brand_card: string;
    p_etrn_soft_desc: string;
    p_cursor: ResultSet<T>;
}

export interface AbtInsEmvCieloProcedureResponse {
    etrn_retrydate?: Date;
	etrn_aid?: string;
	etrn_ksn?: string;
	etrn_lastretry?: Date;
	EPMS_code?: number;
	etrn_status?: string;
	etrn_reguser?: string;
	etrn_regdate?: Date;
	etrn_capturedvalue?: number;
	etrn_capturedresult?: string;
	etrn_authrsn?: number;
	etrn_tlvdata?: string;
	etrn_iti?: string;
	etrn_stan?: string;
	etrn_terminal?: string;
	etrn_merchant_id?: string;
	etrn_processdate?: Date;
	etrn_requestdate?: Date;
	etrn_orderkey?: string;
	etrn_chargeback?: Date;
	etrn_value?: number;
	ecrd_id?: number;
	etrn_id?: number;
	etrn_retrytype?: number;
	etrn_desc?: string;
	FARE_value?: number;
	etrn_elapsed_process?: number;
	etrn_elapsed_acquirer?: number;
	etrn_nsu?: string;
	acquirer_error?: number;
}
