import { ITransactionEMV } from "../../entities/transaction_emv";

export type ITransactionEMVCieloConfirmation = Pick<ITransactionEMV, "paymentId" | "merchantOrderId" | "tlvData">

export interface ICieloConfirmation {
    EmvData: string;
    IssuerScriptResults: string;
};
