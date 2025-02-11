import { ITransactionEMV } from "../entities/transaction_emv";
import { CieloAuthGateway } from "../gateways/cielo_auth/cielo_auth_gateway";
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
        const objectId = await this.repository_transaction_emv.insert(data);
        console.log("Result from insert: ", objectId);
        const findData = await this.repository_transaction_emv.find(data);
        console.log("RESULT FIND: ", findData);
        const updateResult = await this.repository_transaction_emv.update(objectId!, {...data, pantoken: "new pantoken" });
        console.log("RESULT UPDATE: ", updateResult);
        const deleteData = await this.repository_transaction_emv.delete(objectId!);
        console.log("DELETE RESULT: ", deleteData);

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
        console.log("PROC RESULT: ", resultProc);

        const cieloAuth = new CieloAuthGateway();
        const token = await cieloAuth.execute();
        console.log("TOKEN: ", token);


        const cieloSale = new CieloSaleGateway(data);
        const chargeResult = await cieloSale.execute();
        console.log("CHARGE RESULT: ", chargeResult);

        const cieloConfirmation = new CieloConfirmationGateway(data);
        const confirmationResult = await cieloConfirmation.execute();
        console.log("CONFIRMATION RESULT: ", confirmationResult);

        const cieloCheck = new CieloCheckGateway(data);
        const checkResult = await cieloCheck.execute();
        console.log("CHECK RESULT: ", checkResult);


    }
}
