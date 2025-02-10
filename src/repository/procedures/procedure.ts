export interface IProcedure <T>{
    execute(data: any): Promise<T | undefined>;
}


