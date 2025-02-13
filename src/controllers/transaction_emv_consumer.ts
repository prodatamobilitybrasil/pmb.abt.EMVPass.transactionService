import transaction_emv_usecase from "../usecases";

export interface IConsumerController {
    handle(message: Buffer): Promise<void>;
}

export class TransactionEMVConsumerController implements IConsumerController {
    async handle(message: any): Promise<void> {
        try {
            const transaction = JSON.parse(message.content);
            const { pantoken, etrn_id, etrn_status, fare_value, brand, issuer, sequence, tlvData, paymentDeviceType } = transaction;
            if (!pantoken) throw new Error("Empty Pantoken!");
            if (!etrn_id) throw new Error("Empty etrn_id!");
            // if (!etrn_status) throw new Error("Empty etrn_status!");
            if (!fare_value) throw new Error("Empty fare_value!");
            // if (!brand) throw new Error("Empty Brand!");
            // if (!issuer) throw new Error("Empty Isuuer!");
            if (!sequence) throw new Error("Empty Sequence!");
            if (!tlvData) throw new Error("Empty tlvData!");
            // if (!paymentDeviceType) throw new Error("Empty PaymentDeviceType!");

            await transaction_emv_usecase.handle(transaction);
        } catch(err) {
            console.log(`Error to proccess message!\nMessage: ${message}\n${err}`);
        }
    }
}
