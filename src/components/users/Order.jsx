import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activeStatus, setActiveStatus] = useState('pending');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.id) {
            setUserId(storedUser.id);
            loadOrders('pending', storedUser.id);
        }
    }, []);

    const loadOrders = (status, userId) => {
        setActiveStatus(status);
        const url = `http://localhost:8111/api/v1/orders/user/${userId}/${status}`;
        axios.get(url)
            .then(res => setOrders(res.data || []))
            .catch(err => console.error(`Lỗi lấy đơn hàng ${status}:`, err));
    };

    const handleDeleteClick = (id) => {
        setSelectedOrderId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8111/api/v1/orders/${selectedOrderId}`)
            .then(() => {
                setDeleteDialogOpen(false);
                setSelectedOrderId(null);
                setShowSuccessMessage(true);
                loadOrders(activeStatus, userId);
                setTimeout(() => setShowSuccessMessage(false), 1000);
            })
            .catch(err => {
                console.error("Lỗi khi xóa đơn hàng:", err);
                alert("Xóa đơn hàng thất bại.");
                setDeleteDialogOpen(false);
            });
    };

    const formatCurrency = (value) => {
        if (value == null) return 'N/A';
        const num = Number(value);
        return isNaN(num) ? 'N/A' : num.toLocaleString('vi-VN') + ' ₫';
    };

    const renderTableHeader = () => (
        <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Màu sắc</TableCell>
            <TableCell>Kích cỡ</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Hành động</TableCell>
        </TableRow>
    );

    const renderTableBody = () =>
        orders.map(([order, item], idx) => (
            <TableRow key={`${order.id}-${item.id}`}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{order?.id ?? 'N/A'}</TableCell>
                <TableCell>{item?.product?.name ?? 'N/A'}</TableCell>
                <TableCell>{item?.color ?? 'N/A'}</TableCell>
                <TableCell>{item?.size ?? 'N/A'}</TableCell>
                <TableCell>{formatCurrency(item?.price)}</TableCell>
                <TableCell>{item?.quantity ?? 'N/A'}</TableCell>
                <TableCell>{formatCurrency(order?.totalAmount)}</TableCell>
                <TableCell>
                    <IconButton onClick={() => alert(`Xem đơn hàng ${order.id}`)}>
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(order.id)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </TableCell>
            </TableRow>
        ));

    return (
        <Box sx={{ px: '10%', py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, maxWidth: 600, mx: 'auto', position: 'relative', px: 1 }}>
                <Box sx={{ position: 'absolute', top: '50%', left: 32, right: 32, height: 2, bgcolor: '#ccc', zIndex: 0, transform: 'translateY(-50%)' }} />
                {[
                    { icon: <AccessTimeIcon />, label: 'Chờ xác nhận', status: 'pending' },
                    { icon: <CheckCircleIcon color="success" />, label: 'Đơn hàng đã xác nhận', status: 'confirmed' },
                    { icon: <LocalShippingIcon color="primary" />, label: 'Đang vận chuyển', status: 'shipping' },
                    { icon: <HomeIcon />, label: 'Đã giao', status: 'completed' },
                ].map(({ icon, label, status }, i) => (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, px: 1, cursor: 'pointer', color: activeStatus === status ? 'primary.main' : 'text.primary', fontWeight: activeStatus === status ? 'bold' : 'normal' }} onClick={() => loadOrders(status, userId)}>
                        {icon}
                        <Typography variant="caption" mt={0.5} sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
                    </Box>
                ))}
            </Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {activeStatus === 'pending' && 'Đơn hàng chờ xác nhận của bạn'}
                {activeStatus === 'confirmed' && 'Đơn hàng đã xác nhận của bạn'}
                {activeStatus === 'shipping' && 'Đơn hàng đang vận chuyển của bạn'}
                {activeStatus === 'completed' && 'Đơn hàng đã giao thành công của bạn'}
            </Typography>
            {orders.length === 0 ? <Typography>Chưa có đơn hàng nào.</Typography> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#e3f2fd' }}>{renderTableHeader()}</TableHead>
                        <TableBody>{renderTableBody()}</TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc muốn xóa đơn hàng này không?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button color="error" onClick={confirmDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>
            {showSuccessMessage && (
                <Box sx={{ position: 'fixed', bottom: 16, right: 16, bgcolor: 'success.main', color: 'white', px: 3, py: 1.5, borderRadius: 1, boxShadow: 3 }}>Xóa đơn hàng thành công!</Box>
            )}
        </Box>
    );
}
