import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OrderConfirmedList() {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConfirmedOrders();
    }, []);

    const fetchConfirmedOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:8111/api/v1/orders/detail/confirmed'
            );
            setOrderItems(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng đã duyệt:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            await axios.put(`http://localhost:8111/api/v1/orders/${orderId}/approve`);
            fetchConfirmedOrders();
        } catch (error) {
            console.error('Lỗi khi duyệt đơn hàng:', error);
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) return;

        try {
            await axios.delete(`http://localhost:8111/api/v1/orders/${orderId}`);
            fetchConfirmedOrders();
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h6" gutterBottom>
                Đơn hàng đã duyệt
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>Mã đơn</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Màu sắc</TableCell>
                                <TableCell>Kích thước</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Tổng tiền</TableCell>
                                <TableCell>Ghi chú</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.length > 0 ? (
                                orderItems.map((item, index) => (
                                    <TableRow key={`${item.orderId}-${index}`}>
                                        <TableCell>{item.orderId}</TableCell>
                                        <TableCell>{item.username}</TableCell>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell>{item.color}</TableCell>
                                        <TableCell>{item.size}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.address || '-'}</TableCell>
                                        <TableCell>{item.totalAmount.toLocaleString()}₫</TableCell>
                                        <TableCell>{item.note || '-'}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                onClick={() => handleApprove(item.orderId)}
                                                sx={{
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    minHeight: 'auto',
                                                    padding: '4px 8px',
                                                    '&:hover': { backgroundColor: '#333' },
                                                    fontSize: '0.75rem',
                                                    mr: 1,
                                                }}
                                            >
                                                Giao hàng
                                            </Button>
                                            <Tooltip title="Xóa đơn hàng">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(item.orderId)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} align="center">
                                        Không có đơn hàng nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
