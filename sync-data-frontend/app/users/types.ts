export interface User {
    id?: number; // Auto-incremented in IndexedDB
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    dob?: string;
    gender?: string;
    role?: "admin" | "user";
    is_active: boolean;
}
