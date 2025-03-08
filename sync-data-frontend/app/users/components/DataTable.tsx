import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { User } from "../types"; // Assuming User type is defined

const columns: GridColDef<User>[] = [
    {
        field: "first_name",
        headerName: "First Name",
        width: 150,
    },
    {
        field: "last_name",
        headerName: "Last Name",
        width: 150,
    },
    {
        field: "email",
        headerName: "Email",
        width: 200,
    },
    {
        field: "phone",
        headerName: "Phone",
        width: 150,
    },
    {
        field: "gender",
        headerName: "Gender",
        width: 150,
    },
    {
        field: "dob",
        headerName: "DOB",
        width: 150,
        renderCell: (params) =>
            params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
    {
        field: "role",
        headerName: "Role",
        width: 150,
    },
    {
        field: "is_active",
        headerName: "Status",
        width: 120,
        renderCell: (params) =>
            params.value ? (
                <span className="text-green-600 font-medium">Active</span>
            ) : (
                <span className="text-red-500 font-medium">In Active</span>
            ),
    },
    {
        field: "source",
        headerName: "Sync Status",
        width: 150,
        renderCell: (params) =>
            params.value === "server" ? (
                <span className="text-green-600 font-medium">Synced</span>
            ) : (
                <span className="text-red-500 font-medium">Unsynced</span>
            ),
    },
];

export default function DataTable({ data }: { data: User[] }) {
    return (
        <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.id || crypto.randomUUID()}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
