import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button
} from '@mui/material';

export default function OrderList() {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        fetchOrderItems();
    }, []);

    const fetchOrderItems = async () => {
        try {
            const response = await axios.get('http://localhost:8111/api/v1/orders/detail');
            setOrderItems(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            // Gửi yêu cầu duyệt đơn (giả định bạn có API này)
            await axios.put(`http://localhost:8111/api/v1/orders/${orderId}/approve`);
            // Cập nhật lại danh sách
            fetchOrderItems();
        } catch (error) {
            console.error('Lỗi khi duyệt đơn:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Danh sách tất cả đơn hàng
            </Typography>

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
        </Box>
    );
}
