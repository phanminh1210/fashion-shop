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
    IconButton,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OrderCompletedList() {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCompletedOrders();
    }, []);

    const fetchCompletedOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:8111/api/v1/orders/detail/completed'
            );
            setOrderItems(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng đã hoàn thành:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) return;

        try {
            await axios.delete(`http://localhost:8111/api/v1/orders/${orderId}`);
            fetchCompletedOrders();
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h6" gutterBottom>
                Đơn hàng đã hoàn thành
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
