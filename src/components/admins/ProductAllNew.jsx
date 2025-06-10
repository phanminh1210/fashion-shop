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
} from '@mui/material';

import ProductHeaderBar from './ProductHeaderBar'; // đảm bảo đường dẫn đúng

export default function ProductAllNew() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllProducts = () => {
        setLoading(true);
        axios
            .get('http://localhost:8111/api/v1/categories/products/new')
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleSearch = (term) => {
        if (!term) {
            fetchAllProducts();
            return;
        }

        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(term.toLowerCase())
        );
        setProducts(filtered);
    };

    const handleCategoryClick = (category) => {
        setLoading(true);
        axios
            .get(`http://localhost:8111/api/v1/categories/products/category/${category}`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    return (
        <Box p={3}>
            <ProductHeaderBar
                onSearch={handleSearch}
                onCategoryClick={handleCategoryClick}
            />

            <Typography variant="h5" gutterBottom >
                Tất cả sản phẩm Mới
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
