import Dexie, { Table } from "dexie";
import { User } from "./types";

class UserDatabase extends Dexie {
    users!: Table<User>;

    constructor() {
        super("UserDB"); // Database name
        this.version(1).stores({
            users: "++id, first_name, last_name, email, phone, is_active", // Indexable fields
        });
    }
}

export const db = new UserDatabase();
