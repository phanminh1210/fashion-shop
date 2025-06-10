import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    IconButton,
    Tooltip,
    TextField,
    Button,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import ProductHeaderBar from './ProductHeaderBar';

export default function ProductAllData() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [mode, setMode] = useState(null); // 'view' hoặc 'edit'
    const [productDetail, setProductDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Lấy tất cả sản phẩm (API trả về List<Product>)
    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8111/api/v1/categories/products/all');
            setProducts(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách categories để chọn trong form
    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8111/api/v1/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            setCategories([]);
        }
    };

    // Lấy chi tiết sản phẩm theo id (API trả về Product, có trường category)
    const fetchProductDetail = async (id) => {
        if (!id) {
            console.warn("ID sản phẩm không hợp lệ:", id);
            return;
        }
        setDetailLoading(true);
        try {
            const res = await axios.get(`http://localhost:8111/api/v1/categories/products/${id}`);
            setProductDetail(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            setProductDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };


    useEffect(() => {
        fetchAllProducts();
        fetchCategories();
    }, []);

    // Xử lý xem chi tiết sản phẩm
    const handleView = (id) => {
        if (!id) return; // hoặc hiển thị cảnh báo
        setSelectedProductId(id);
        setMode('view');
        fetchProductDetail(id);
    };

    const handleEdit = (id) => {
        if (!id) return;
        setSelectedProductId(id);
        setMode('edit');
        fetchProductDetail(id);
    };



    // Đóng dialog xem/sửa
    const handleClose = () => {
        setSelectedProductId(null);
        setProductDetail(null);
        setMode(null);
    };

    // Thêm hàm handleDelete:
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

        try {
            await axios.delete(`http://localhost:8111/api/v1/categories/products/${id}`);
            alert('Xóa sản phẩm thành công!');
            fetchAllProducts(); // load lại danh sách sản phẩm
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data); // sẽ hiện thông báo "Sản phẩm này hiện đang có người mua..."
            } else {
                alert('Lỗi khi xóa sản phẩm!');
            }
            console.error(error);
        }
    };


    // Cập nhật form khi thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetail((prev) => ({
            ...prev,
            [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    // Xử lý chọn danh mục trong select
    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find((c) => c.id === Number(e.target.value));
        setProductDetail((prev) => ({
            ...prev,
            category: selectedCategory || null,
        }));
    };

    // Gửi cập nhật sản phẩm lên backend
    const handleSave = async () => {
        if (!productDetail) return;

        // Chuẩn bị payload đúng với DTO UpdateProductReq backend yêu cầu
        const payload = {
            name: productDetail.name,
            description: productDetail.description,
            color: productDetail.color,
            price: productDetail.price,
            categoriesId: productDetail.category?.id || null,
        };

        try {
            await axios.put(`http://localhost:8111/api/v1/categories/products/${productDetail.id}`, payload);
            alert('Cập nhật sản phẩm thành công!');
            fetchAllProducts();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            alert('Cập nhật sản phẩm thất bại!');
        }
    };


    return (
        <Box p={3}>
            <ProductHeaderBar />

            <Typography variant="h5" gutterBottom>
                Danh sách tất cả sản phẩm
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Màu</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    {/* Giả sử API trả về trường imageUrl là đường dẫn ảnh */}
                                    <img
                                        src={`http://localhost:8111${p.imageUrl}`}
                                        alt={p.name}
                                        width={60}
                                        height={60}
                                        style={{ objectFit: 'cover', borderRadius: 4 }}
                                    />
                                </TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.category?.name || '-'}</TableCell>
                                <TableCell>{p.color || '-'}</TableCell>
                                <TableCell>{p.price?.toLocaleString()} VNĐ</TableCell>
                                <TableCell>
                                    <Tooltip title="Xem">
                                        <IconButton onClick={() => handleView(p.id)} size="small">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <IconButton onClick={() => handleEdit(p.id)} size="small">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton
                                            onClick={() => handleDelete(p.id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Dialog xem/sửa chi tiết sản phẩm */}
            <Dialog open={!!selectedProductId} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{mode === 'view' ? 'Chi tiết sản phẩm' : 'Sửa sản phẩm'}</DialogTitle>
                <DialogContent dividers>
                    {detailLoading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : productDetail ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="ID sản phẩm"
                                name="id"
                                value={productDetail.id || ''}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />

                            <TextField
                                label="Tên sản phẩm"
                                name="name"
                                value={productDetail.name || ''}
                                onChange={handleChange}
                                InputProps={{ readOnly: mode === 'view' }}
                                fullWidth
                            />
                            <TextField
                                label="Mô tả"
                                name="description"
                                multiline
                                rows={3}
                                value={productDetail.description || ''}
                                onChange={handleChange}
                                InputProps={{ readOnly: mode === 'view' }}
                                fullWidth
                            />
                            <TextField
                                label="Giá"
                                name="price"
                                type="number"
                                value={productDetail.price || ''}
                                onChange={handleChange}
                                InputProps={{ readOnly: mode === 'view' }}
                                fullWidth
                            />
                            <TextField
                                label="Màu"
                                name="color"
                                value={productDetail.color || ''}
                                onChange={handleChange}
                                InputProps={{ readOnly: mode === 'view' }}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Danh mục"
                                value={productDetail.category?.id || ''}
                                onChange={handleCategoryChange}
                                disabled={mode === 'view'}
                                fullWidth
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    ) : (
                        <Typography>Không tìm thấy thông tin sản phẩm.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Đóng</Button>
                    {mode === 'edit' && (
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Lưu
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
