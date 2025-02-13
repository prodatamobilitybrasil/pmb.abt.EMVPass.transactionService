import { ITransactionEMV } from "../../entities/transaction_emv";

export type ITransactionEMVCielo = Pick<ITransactionEMV, "fare_value" | "merchantOrderId" | "etrn_soft_desc"| "date" | "paymentId" | "merchantId">;

export interface ICieloSale {
    MerchantOrderId?: string;
    Payment: {
        SoftDescriptor: string;
        Amount?: number;
        PaymentDateTime?: Date;
        ProductId: number;
        Type: string;
        PinPadInformation: {
            TerminalId: string;
            SerialNumber: string;
            PhysicalCharacteristics: string;
            ReturnDataInfo: string;
        };
        CreditCard: {
            ExpirationDate: string;
            BrandId: number;
            IssuerId: number;
            InputMode: string;
            AuthenticationMethod: string;
            SaveCard: boolean;
        };
    };
};

export interface ICieloSaleResponse {
    MerchantOrderId: string;
    Customer: {
        Name: string;
    };
    Payment: {
        Installments: number;
        Interest: string;
        Capture: boolean;
        CreditCard: {
            ExpirationDate: string;
            BrandId: number;
            IssuerId: number;
            TruncateCardNumberWhenPrinting: boolean;
            InputMode: string;
            AuthenticationMethod: string;
            IsFallback: boolean;
            SaveCard: boolean;
        };
        Amount: number;
        ReceivedDate: string;
        Provider: string;
        Status: number;
        PhysicalTransactionStatus: number;
        IsSplitted: boolean;
        ReturnMessage: string;
        ReturnCode: string;
        ExtendedMessage: string;
        PaymentId: string;
        Type: string;
        Currency: string;
        Country: string;
        Links: [
            {
                Method: string;
                Rel: string;
                Href: string;
            }
        ];
        PaymentDateTime: string;
        ServiceTaxAmount: number;
        SoftDescriptor: string;
        ProductId: number;
        PinPadInformation: {
            TerminalId: string;
            SerialNumber: string;
            PhysicalCharacteristics: string;
            ReturnDataInfo: string;
        },
        PrintMessage: [],
        ReceiptInformation: [],
        Receipt: {},
        ProofOfSale: string;
        InitializationVersion: number;
        ConfirmationStatus: number;
        SubordinatedMerchantId: string;
        OfflinePaymentType: string;
    };
};
