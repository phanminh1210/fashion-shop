import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8111/api/v1/carts')
            .then(res => setCartItems(res.data.content))
            .catch(err => console.error("Lỗi khi lấy giỏ hàng:", err));
    }, []);

    const handleAdd = (item) => {
        console.log("Thêm số lượng cho sản phẩm:", item);
        // Gọi API hoặc mở form thêm
    };

    const handleEdit = (item) => {
        console.log("Sửa sản phẩm:", item);
        // Gọi API hoặc mở form chỉnh sửa số lượng, size, màu...
    };

    const handleDelete = (item) => {
        console.log("Xóa sản phẩm:", item);
        // Gọi API xóa khỏi giỏ hàng
    };

    return (
        <Box sx={{ px: '10%', py: 4 }}>
            <Typography variant="h4" gutterBottom>Giỏ hàng của bạn</Typography>

            {cartItems.length === 0 ? (
                <Typography>Không có sản phẩm nào trong giỏ hàng.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>#</strong></TableCell>
                                <TableCell><strong>Tên sản phẩm</strong></TableCell>
                                <TableCell><strong>Màu</strong></TableCell>
                                <TableCell><strong>Size</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
                                <TableCell><strong>Số lượng</strong></TableCell>
                                <TableCell><strong>Tổng tiền</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item, index) => (
                                <TableRow key={item.cartId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.productColor}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleAdd(item)} color="primary">
                                            <Add />
                                        </IconButton>
                                        <IconButton onClick={() => handleEdit(item)} color="warning">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(item)} color="error">
                                            <Delete />
                                        </IconButton>
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
