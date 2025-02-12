import { ITransactionEMV } from "../../entities/transaction_emv";

export type ITransactionEMVCieloConfirmation = Pick<ITransactionEMV, "paymentId" | "merchantOrderId" | "tlvData">

export interface ICieloConfirmation {
    EmvData: string;
    IssuerScriptResults: string;
};

export interface ICieloConfirmationResponse {
    ConfirmationStatus: number;
    Status: number;
    PhysicalTransactionStatus: number;
    ReasonCode: number;
    ReasonMessage: string;
    ReturnCode: string;
    ReturnMessage: string;
    Links: [
        {
            Method: string;
            Rel: string;
            Href: string;
        }
    ];
}