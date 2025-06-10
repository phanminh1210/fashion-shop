import React from 'react';
import { Box, Button, Stack, Typography, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';

const adminOptions = [
    { label: 'Đơn hàng', icon: <ShoppingCartIcon fontSize="small" />, path: '/admin/orders' },
    { label: 'Sản phẩm', icon: <InventoryIcon fontSize="small" />, path: '/admin/products/all' },
    { label: 'Khách hàng', icon: <PeopleIcon fontSize="small" />, path: '/admin/user' },
    { label: 'Admin', icon: <AccountCircleIcon fontSize="small" />, path: '/admin/accounts' },
    { label: 'Voucher', icon: <LocalOfferIcon fontSize="small" />, path: '/admin/vouchers' },
    { label: 'Giao diện khách hàng', icon: <StorefrontIcon fontSize="small" />, path: '/home' },

];

const orderSubOptions = [
    { label: 'Chờ xác nhận', path: '/admin/orders/pending' },
    { label: 'Đã xác nhận', path: '/admin/orders/confirmed' },
    { label: 'Vận chuyển', path: '/admin/orders/shipping' },
    { label: 'Đã giao', path: '/admin/orders/completed' },
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 200,
                height: 'calc(100vh - 60px)',
                bgcolor: '#f8f9fa',
                p: 2,
                borderRight: '1px solid #ddd',
                position: 'fixed',
                top: 60,
                left: 0,
                overflowY: 'auto',
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Quản trị
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
                {adminOptions.map(({ label, icon, path }) => {
                    const isOrderSection = label === 'Đơn hàng';
                    const active = location.pathname === path;

                    return (
                        <Box key={path}>
                            <Button
                                variant={active ? 'contained' : 'text'}
                                size="small"
                                startIcon={icon}
                                onClick={() => navigate(path)}
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    pl: 1.5,
                                    bgcolor: active ? 'primary.main' : 'transparent',
                                    color: active ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: active ? 'primary.dark' : 'action.hover',
                                    },
                                }}
                            >
                                {label}
                            </Button>

                            {/* Sub-menu cho Đơn hàng */}
                            {isOrderSection && (
                                <Stack spacing={0.5} pl={1.5} mt={0.5}>
                                    {orderSubOptions.map((sub) => {
                                        const subActive = location.pathname === sub.path;
                                        return (
                                            <Button
                                                key={sub.path}
                                                size="small"
                                                startIcon={<ArrowRightIcon fontSize="small" />}
                                                onClick={() => navigate(sub.path)}
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    color: subActive ? 'primary.main' : 'text.secondary',
                                                    fontSize: '0.875rem',
                                                    pl: 0.5,
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                    },
                                                }}
                                            >
                                                {sub.label}
                                            </Button>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
