export interface IDBRecord {
    key: string;
}
export interface ITimestampedDBRecord extends IDBRecord {
    createdAt: number;
    updatedAt: number;
}