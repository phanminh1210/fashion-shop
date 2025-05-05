import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Order() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8111/api/v1/orders')
            .then(res => setOrders(res.data.content))
            .catch(err => console.error('Lỗi lấy danh sách đơn hàng:', err));
    }, []);

    const handleView = (id) => {
        console.log('Xem đơn hàng', id);
        // navigate(`/orders/${id}`); nếu có trang chi tiết
    };

    const handleEdit = (id) => {
        console.log('Sửa đơn hàng', id);
        // navigate(`/orders/edit/${id}`); nếu có trang edit
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
            // Gửi request xóa tới backend (nếu có API delete)
            console.log('Xóa đơn hàng', id);
        }
    };

    return (
        <Box sx={{ px: '10%', py: 4 }}>
            <Typography variant="h4" gutterBottom>Danh sách đơn hàng</Typography>

            {orders.length === 0 ? (
                <Typography>Không có đơn hàng nào.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>#</strong></TableCell>
                                <TableCell><strong>Họ tên khách</strong></TableCell>
                                <TableCell><strong>Số điện thoại</strong></TableCell>
                                <TableCell><strong>Địa chỉ</strong></TableCell>
                                <TableCell><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Tổng tiền</strong></TableCell>
                                <TableCell><strong>Ngày tạo</strong></TableCell>
                                <TableCell><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={order.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{order.user.firstName} {order.user.lastName}</TableCell>
                                    <TableCell>{order.user.phone}</TableCell>
                                    <TableCell>{order.user.address}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.totalAmount.toLocaleString('vi-VN')} ₫</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleView(order.id)}><VisibilityIcon /></IconButton>
                                        <IconButton onClick={() => handleEdit(order.id)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(order.id)}><DeleteIcon color="error" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
