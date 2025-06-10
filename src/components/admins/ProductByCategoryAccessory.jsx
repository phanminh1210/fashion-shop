import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import axios from 'axios';
import ProductHeaderBar from './ProductHeaderBar';

export default function ProductByCategoryAccessory() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // dùng để lưu bản gốc
    const [loading, setLoading] = useState(true);
    const categoryId = 3; // gán cứng danh mục "Quần"

    const fetchProductsByCategory = (catId) => {
        setLoading(true);
        axios
            .get(`http://localhost:8111/api/v1/categories/products/by-category/${catId}`)
            .then((res) => {
                const content = res.data?.content || [];
                setProducts(content);
                setAllProducts(content);
            })
            .catch((err) => {
                console.error('Lỗi khi gọi API:', err);
                setProducts([]);
                setAllProducts([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProductsByCategory(categoryId);
    }, []);

    const handleSearch = (term) => {
        if (!term) {
            setProducts(allProducts); // reset khi xóa ô tìm kiếm
        } else {
            const filtered = allProducts.filter((p) =>
                p.name.toLowerCase().includes(term.toLowerCase())
            );
            setProducts(filtered);
        }
    };

    const handleCategoryClick = (categoryId) => {
        fetchProductsByCategory(categoryId);
    };

    return (
        <Box p={3}>
            <ProductHeaderBar
                onSearch={handleSearch}
                onCategoryClick={handleCategoryClick}
            />


            <Typography variant="h5" gutterBottom>
                Sản phẩm theo danh mục (Phụ kiện)
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box mt={2}>
                    <Table sx={{ minWidth: 650 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Màu</TableCell> {/* Thêm cột màu */}
                                <TableCell>Giá</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.imageUrl && (
                                            <img
                                                src={`http://localhost:8111${product.imageUrl}`}
                                                alt={product.name}
                                                width={60}
                                                height={60}
                                                style={{ objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight={600}>
                                            {product.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{product.category?.name || '-'}</TableCell>

                                    {/* Màu sắc */}
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    bgcolor: product.color || 'gray',
                                                    border: '1px solid #ccc',
                                                }}
                                            />
                                            <Typography variant="body2">
                                                {product.color || 'Không rõ'}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>{product.price.toLocaleString()} VNĐ</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </Box>
            )}
        </Box>
    );
}
