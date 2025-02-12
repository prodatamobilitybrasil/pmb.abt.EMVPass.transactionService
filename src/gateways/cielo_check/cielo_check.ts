export interface ICieloCheckResponse {
    MerchantOrderId: string;
    Customer: {
        Name: string;
        Address: any;
    };
    Payment: {
        ServiceTaxAmount: number;
        Installments: number;
        Interest: string;
        Capture: boolean;
        Authenticate: boolean;
        ProofOfSale: string;
        ConfirmationStatus: number;
        ReceiptInformation: any;
        Receipt: any;
        PinPadInformation: {
            TerminalId: string;
        },
        PaymentId: string;
        Type: string;
        Amount: number;
        ReceivedDate: string;
        Currency: string;
        Country: string;
        Provider: string;
        ReturnCode: string;
        ReturnMessage: string;
        Status: number;
        Links: [
            {
                Method: string;
                Rel: string;
                Href: string;
            },
        ],
        PhysicalTransactionStatus: number;
    },
}