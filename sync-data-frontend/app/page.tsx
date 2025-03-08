"use client";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const goToUsersPage = () => {
    router.push("/users"); // Redirects to /users page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Zaid's Demo Project</h1>
      <p className="text-lg text-gray-600 mb-8">This is a simple This project is a User Management System with offline support, built using Next.js (TypeScript) for the frontend and Laravel for the backend. It allows users to be added efficiently, even when offline. Data is stored locally using IndexedDB and synced to the server when a the client interacts with the "Sync" button. The system features sortable, customizable tables, a column selection popup, and a clear distinction between synced and unsynced users. Designed for seamless performance, it ensures data integrity and smooth user interactions</p>
      <button
        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
        onClick={goToUsersPage}
      >
        Go to Users
      </button>
    </div>
  );
};

export default Home;
