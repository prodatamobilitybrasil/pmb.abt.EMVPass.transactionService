import { CieloAuthGateway } from "../cielo_auth/cielo_auth_gateway";
import { IGateway } from "../gateway";
import { ICieloSale, ICieloSaleResponse, ITransactionEMVCielo } from "./cielo_sale";

export class CieloSaleGateway implements IGateway<ICieloSaleResponse> {
    private cieloSaleBody: ICieloSale;

    constructor(transaction: ITransactionEMVCielo) {
        this.cieloSaleBody = {
            MerchantOrderId: transaction.merchantOrderId || transaction.merchantId,
            Payment: {
                SoftDescriptor: transaction.etrn_soft_desc || "Description",
                Amount: transaction.fare_value,
                PaymentDateTime: transaction.date,
                ProductId: 80,
                Type: "PhysicalCreditCard",
                PinPadInformation: {
                    TerminalId: "00000001",
                    SerialNumber: "Kiosk IV V1.20.126",
                    PhysicalCharacteristics: "WithoutPinPad",
                    ReturnDataInfo: "00",
                },
                CreditCard: {
                    ExpirationDate: "09/2021",
                    BrandId: 2,
                    IssuerId: 8080,
                    InputMode: "ContactlessEmv",
                    AuthenticationMethod: "NoPassword",
                    SaveCard: true,
                }
            },
        }
    }

    async execute(): Promise<ICieloSaleResponse | undefined> {
        const url = process.env.CIELO_PHYSICAL_SALES!;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${CieloAuthGateway.token}`);
            if (process.env.ENVIRONMENT !== "PROD") headers.append("Environment", "Homologacao");

            const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(this.cieloSaleBody) });
            const result = await response.text();

            if(response.status !== 201) throw new Error(`Status: ${response.status} - ${response.statusText}\n ${result}`);

            return JSON.parse(result);
        } catch(err) {
            console.log("Error when making payment!\n", err);
        }
    }
}
