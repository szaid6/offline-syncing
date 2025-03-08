"use client";
import { useState } from "react";
import { db } from "../db";
import { User } from "../types";
import api from "@/utils/api";

export default function UserForm({
    closeModal,
    refreshUsers,
}: {
    closeModal: () => void
    refreshUsers: () => void
}) {
    const [user, setUser] = useState<User>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        role: "user",
        is_active: true,
    });

    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function to check if the server is available
    const checkServerAvailability = async () => {
        try {
            const response = await api.get("/ping");
            console.log("Server is reachable.");
            return response.data === "pong";
        } catch (error) {
            console.log("Server is unreachable, saving locally.");
            return false;
        }
    };

    // Save user to IndexedDB
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        // Simple validation
        if (!user.first_name || !user.email || !user.phone) {
            setError("First Name, Email, and Phone are required.");
            setIsSaving(false);
            return;
        }

        // Check if the server is available
        const isServerAvailable = await checkServerAvailability();

        // If server is available, save to server
        if (isServerAvailable) {
            try {
                await api.post("/v1/users/add", user);
            } catch (error) {
                console.log("Error saving to server, saving locally.");
                console.log(error);
            }
        }

        // Save to IndexedDB
        try {
            await db.users.add(user);
        } catch (error) {
            console.log("Error saving to IndexedDB.");
            setError("Error saving user.");
            setIsSaving(false);
            return;
        }

        closeModal();
        refreshUsers();
        setIsSaving(false);
    };

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-xl font-semibold text-center">Add User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                <input type="hidden" name="role" value={user.role} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-600" >*</span> </label>
                    <input
                        type="text"
                        name="first_name"
                        value={user.first_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-600" >*</span></label>
                    <input
                        type="text"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-600" >*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-600" >*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={user.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="flex flex-nowrap gap-4">
                    <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={user.dob}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className={` bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                >
                    Save
                </button>
            </form>
        </div>
    );
}
