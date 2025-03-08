"use client";
import { useEffect, useState, Dispatch, SetStateAction, } from "react";
import { User } from "./types";
import { db } from "./db";
import DataTable from "./components/DataTable";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import UserForm from "./components/Form";
import api from "@/utils/api";
import { ToastContainer, toast } from 'react-toastify';

export default function UserMasterPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchUsers = async () => {
        let serverUsers: User[] = users;

        try {
            // Fetch users from the server first
            const response = await api.get("/v1/users");
            serverUsers = response.data.map((user: any) => ({ ...user, source: "server" })); // Mark server users
        } catch (error) {
            console.log("Server fetch failed:", error);
        }

        // Fetch users from IndexedDB
        const localUsers = await db.users.toArray();
        const localUsersWithFlag = localUsers.map(user => ({ ...user, source: "local" })); // Mark local users

        // Merge both sets of users
        const allUsers = [...serverUsers, ...localUsersWithFlag];

        // Set the users state
        setUsers(allUsers);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to check if the server is available
    const checkServerAvailability = async () => {
        try {
            const response = await api.get("/ping");
            console.log("Server is reachable.");
            return response.data === "pong";
        } catch (error) {
            console.log("Server is unreachable");
            return false;
        }
    };

    async function syncUsers() {
        // Sync users with API
        setIsSyncing(true);

        // Fetch users from the local db
        const localUsers = await db.users.toArray();

        if (localUsers.length === 0) {
            toast.info("No users to sync.");
            setIsSyncing(false);
            return;
        }

        // Check if the server is available
        const isServerAvailable = await checkServerAvailability();

        if (!isServerAvailable) {
            toast.error("Server is unreachable. Please try again later.");
            setIsSyncing(false);
            return;
        } else {
            toast.info("Syncing users with the server...");
        }


        // Sync users with the server
        try {
            // loop through all local users and on success delete them from local db
            for (const user of localUsers) {
                await api.post("/v1/users/add", user);
                await db.users.delete(user.id);
            }
            fetchUsers();
            toast.success("Users synced successfully.");
        } catch (error) {
            console.log("Server sync failed:", error);
            toast.error("Server sync failed. Please try again later.");
        }

        setIsSyncing(false);
    }

    function refresh() {
        fetchUsers();
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ToastContainer />
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="">
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <p className="text-gray-500">Manage users</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={isSyncing ? undefined : syncUsers}
                            disabled={isSyncing}
                            className={` bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded  transition-opacity ${isSyncing ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                        >
                            Sync Users
                        </button>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
                        >Add User
                        </button>
                    </div>
                </div>

                <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} refreshUsers={refresh} />
                <DataTable data={users} />
            </div>
        </>
    );
}

const SpringModal = ({
    isOpen,
    setIsOpen,
    refreshUsers,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    refreshUsers: () => void;
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-black p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">

                            <UserForm closeModal={() => setIsOpen(false)} refreshUsers={refreshUsers} />

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};