import React from 'react';
import { Box, Typography } from '@mui/material';

export default function AdminHeader() {
    return (
        <Box
            sx={{
                height: 60,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Can chỉnh nếu muốn căn trái, căn giữa, căn phải
                borderBottom: '1px solid #ccc',
                backgroundColor: '#fff',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
            }}
        >
            <Typography variant="h6" fontWeight="bold" noWrap>
                Trang Quản Trị WebSite Maison M&H
            </Typography>
        </Box>
    );
}
