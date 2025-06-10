import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Button,
    Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8111/api/v1/vouchers');
            setVouchers(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy voucher:', error);
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    // Xử lý khi nhấn nút sửa
    const handleEdit = (voucher) => {
        // Ví dụ: chuyển sang trang sửa hoặc mở modal
        alert(`Sửa voucher: ${voucher.id.trim()}`);
    };

    // Xử lý khi nhấn nút xóa
    const handleDelete = async (voucherId) => {
        if (!window.confirm('Bạn có chắc muốn xóa voucher này không?')) return;

        try {
            await axios.delete(`http://localhost:8111/api/v1/vouchers/${encodeURIComponent(voucherId.trim())}`);
            alert('Xóa voucher thành công!');
            fetchVouchers(); // tải lại danh sách sau khi xóa
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            alert('Xóa voucher thất bại!');
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" mb={3}>
                Danh sách Voucher
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : vouchers.length === 0 ? (
                <Typography>Không có voucher nào.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {vouchers.map((v) => (
                        <Grid item xs={12} sm={6} md={4} key={v.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {v.id.trim() || 'Mã voucher'}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {v.voucherName}
                                    </Typography>

                                    <Typography>
                                        <strong>Số lượng:</strong> {v.quantity}
                                    </Typography>
                                    <Typography>
                                        <strong>Giảm giá:</strong> {Number(v.discountAmount).toLocaleString()} VNĐ
                                    </Typography>
                                    <Typography>
                                        <strong>Đối tượng:</strong> {v.object}
                                    </Typography>
                                    <Typography>
                                        <strong>Ngày tạo:</strong> {formatDate(v.createdAt)}
                                    </Typography>
                                    <Typography>
                                        <strong>Ngày hết hạn:</strong> {formatDate(v.expirationDate)}
                                    </Typography>

                                    <Stack direction="row" spacing={2} mt={2}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(v)}
                                            color="primary"
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(v.id)}
                                            color="error"
                                        >
                                            Xóa
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
