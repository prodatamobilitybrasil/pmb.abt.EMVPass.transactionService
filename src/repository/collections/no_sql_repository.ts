import { ObjectId } from "mongodb";

export interface INoSQLRepository<T> {
    insert(data: T): Promise<ObjectId | undefined>;
    find(data: T): Promise<T | T[] | undefined>;
    update(id: ObjectId, toUpdate: T): Promise<number | undefined>;
    delete(id: ObjectId): Promise<number | undefined>;
}
