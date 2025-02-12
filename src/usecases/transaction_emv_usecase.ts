import { ITransactionEMV } from "../entities/transaction_emv";
import { CieloCheckGateway } from "../gateways/cielo_check/cielo_check_gateway";
import { CieloConfirmationGateway } from "../gateways/cielo_confirmation/cielo_confirmation_gateway";
import { CieloSaleGateway } from "../gateways/cielo_sale/cielo_sale_gateway";
import { TransactionEMVRepository } from "../repository/collections/transaction_emv/transaction_emv_repository";
import { AbtInsertEMVCieloRepository } from "../repository/procedures/insert_emv_cielo/insert_emv_cielo_repository";

interface IUsecase<T> {
    handle(data: T): Promise<void>;
}

export class TransactionEMVUsecase implements IUsecase<ITransactionEMV> {
    constructor(
        private readonly repository_transaction_emv: TransactionEMVRepository,
        private readonly repository_insert_emv_cielo: AbtInsertEMVCieloRepository,
    ) {}

    async handle(data: ITransactionEMV): Promise<void> {
        delete data._id;
        
        const cieloCheck = new CieloCheckGateway(data);
        const checkResult = await cieloCheck.execute();
        if(checkResult) {
            const message = { message: "Transaction Alreadly Executed: ", data: checkResult };
            throw new Error(JSON.stringify(message));
        }

        const cieloSale = new CieloSaleGateway(data);
        const saleResult = await cieloSale.execute();
        if(saleResult) {
            const message = { message: "Transaction Sale Error: ", data: saleResult };
            throw new Error(JSON.stringify(message));
        }

        const objectId = await this.repository_transaction_emv.insert(data);
        if (!objectId) {
            const message = { message: "Error to insert transaction in MongoDB: ", data };
            throw new Error(JSON.stringify(message));
        }
        console.log("Transaction Inserted on MongoDB - _id: ", objectId);

        const { tlvData, brand, etrn_id, etrn_status, fare_value, merchantId, paymentDeviceType } = data;
        const resultProc = await this.repository_insert_emv_cielo.execute({
            proc_version: 25001,
            etrn_id,
            etrn_brand_card: brand,
            etrn_device_pay: paymentDeviceType,
            etrn_merchant_id: merchantId,
            etrn_status,
            etrn_value: fare_value,
            etrn_aid: "",
            etrn_tlvdata: tlvData,

        });

        if (!resultProc) {
            const message = { message: "Error to insert transaction in OracleDB: ", data };
            throw new Error(JSON.stringify(message));
        }
        console.log("Transaction Inserted on OracleDB - ecrd_id: ", resultProc.ecrd_id);        

        const cieloConfirmation = new CieloConfirmationGateway(data);
        const confirmationResult = await cieloConfirmation.execute();
        if (!confirmationResult) {
            const message = { message: "Error to confirme transaction in CieloAPI: ", data };
            throw new Error(JSON.stringify(message));
        }
        console.log("Transaction Confirmed in CieloAPI - ReturnMessage: ", confirmationResult.ReturnMessage); 
    }
}
