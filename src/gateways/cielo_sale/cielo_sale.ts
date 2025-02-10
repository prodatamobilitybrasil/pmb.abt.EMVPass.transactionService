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
