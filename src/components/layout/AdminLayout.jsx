import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminHeader from "../admins/AdminHeader";
import AdminSidebar from "../admins/AdminSidebar";

export default function AdminLayout() {
    const sidebarWidth = 160;
    const headerHeight = 60;

    return (
        <>
            <AdminHeader />

            <Box sx={{ display: 'flex', pt: `${headerHeight}px` }}>
                <Box sx={{
                    width: `${sidebarWidth}px`,
                    flexShrink: 0,
                }}>
                    <AdminSidebar />
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        ml: '70px', p: 0 ,
                        minHeight: `calc(100vh - ${headerHeight}px)`,
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
