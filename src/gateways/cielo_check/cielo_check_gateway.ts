import { ITransactionEMV } from "../../entities/transaction_emv";
import { CieloAuthGateway } from "../cielo_auth/cielo_auth_gateway";
import { IGateway } from "../gateway";
import { ICieloCheckResponse } from "./cielo_check";

export type ITransactionEMVCieloCheck = Pick<ITransactionEMV, "paymentId" | "merchantOrderId" >;

export class CieloCheckGateway implements IGateway<ICieloCheckResponse> {
    private merchantOrderId?: string;
    private paymentId?: string;

    constructor(transaction: ITransactionEMVCieloCheck) {
        this.merchantOrderId = transaction.merchantOrderId;
        this.paymentId = transaction.paymentId;
    }
    
    async execute(): Promise<ICieloCheckResponse | undefined> {
        const baseUrl = process.env.CIELO_QUERY!;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${CieloAuthGateway.token}`);
            if (process.env.ENVIRONMENT !== "PROD") headers.append("Environment", "Homologacao");
            
            const url = this.merchantOrderId ? `${baseUrl}/MerchantOrderId/${this.merchantOrderId}` : `${baseUrl}/${this.paymentId}`;

            const response = await fetch(url, { method: "GET", headers });

            const result = await response.text();

            if(response.status !== 200) throw new Error(`Status: ${response.status} - ${response.statusText}\n ${result}`);

            const data = JSON.parse(result) as  ICieloCheckResponse[];
            return data[0];
        } catch(err) {
            console.log("Error check transaction status!\n", err);
        }
    }
}
