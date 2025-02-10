import { ObjectId } from "mongodb";

export interface ITransactionEMV extends Document {
    _id?: ObjectId;
    etrn_id: number
    etrn_status?: string
    fare_value?: number
    brand?: string
    issuer?: string
    sequence: number
    tlvData: string
    pantoken?: string
    merchantId?: string
    paymentId?: string
    merchantOrderId?: string
    paymentDeviceType?: string
    walletId: number;
    deviceId: number;
    deviceType: number;
    terminalId?: string;
    ern_iti: string;
    etrn_aid?: string;
    etrn_soft_desc?: string;
    date?: Date;
};
