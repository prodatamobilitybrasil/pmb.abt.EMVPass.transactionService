import { CieloAuthGateway } from "../cielo_auth/cielo_auth_gateway";
import { IGateway } from "../gateway";
import { ICieloConfirmation, ICieloConfirmationResponse, ITransactionEMVCieloConfirmation } from "./cielo_confirmations";


export class CieloConfirmationGateway implements IGateway<ICieloConfirmationResponse> {
    private cieloConfirmationBody: ICieloConfirmation;
    private param?: string;

    constructor(transaction: ITransactionEMVCieloConfirmation) {
        this.cieloConfirmationBody = {
            EmvData: transaction.tlvData,
            IssuerScriptResults: "0000",
        };

        this.param = transaction.paymentId || transaction.merchantOrderId;
    }
    
    async execute(): Promise<ICieloConfirmationResponse | undefined> {
        const url = process.env.CIELO_PHYSICAL_SALES!;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${CieloAuthGateway.token}`);
            if (process.env.ENVIRONMENT !== "PROD") headers.append("Environment", "Homologacao");

            const response = await fetch(`${url}/${this.param}/confirmation`, { method: "PUT", headers, body: JSON.stringify(this.cieloConfirmationBody) });
            const result = await response.text();

            if(response.status !== 200) throw new Error(`Status: ${response.status} - ${response.statusText}\n ${result}`);

            return JSON.parse(result);

        } catch(err) {
            console.log("Error confirming payment!\n", err);
        }
    }

}