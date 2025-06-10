// src/pages/ProductShirts.jsx
import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductAustria() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8111/api/v1/categories/products/by-category/1')
            .then(res => {
                setProducts(res.data.content);
            })
            .catch(err => {
                console.error("Lỗi khi lấy sản phẩm Áo:", err);
            });
    }, []);

    return (
        <Box sx={{ mx: '10%', paddingY: 4 }}>
            <Typography variant="h4" gutterBottom>
                Sản phẩm Áo
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 3,
                }}
            >
                {products.map(product => (
                    <Card
                        key={product.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: 4
                            }
                        }}
                        onClick={() => navigate(`/products/${product.id}`)}
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={`http://localhost:8111${product.imageUrl}`}
                            alt={product.name}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography color="text.secondary">
                                {product.price.toLocaleString()} VND
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Rating
                                    value={product.avgRating || 0}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                    sx={{ color: '#ffe3a1' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({product.avgRating || 0} sao)
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
