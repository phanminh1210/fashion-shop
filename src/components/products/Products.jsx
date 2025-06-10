import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8111/api/v1/categories/products')
            .then(res => {
                if (res.data?.content && Array.isArray(res.data.content)) {
                    setProducts(res.data.content);
                }
            })
            .catch(err => {
                console.error("Error fetching products:", err);
            });
    }, []);

    return (
        <Box sx={{ mx: '10%', paddingY: 4 }}>
            <Typography variant="h4" gutterBottom>
                Tất cả sản phẩm
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 3,
                }}
            >
                {products.map(([imageUrl, id, name, price, rating]) => (
                    <Card
                        key={id}
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
                        onClick={() => navigate(`/products/${id}`)}
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={`http://localhost:8111${imageUrl}`}
                            alt={name}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{name}</Typography>
                            <Typography color="text.secondary">
                                {price.toLocaleString()} VND
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Rating
                                    value={rating}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                    sx={{ color: '#ffe3a1' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({rating || 0} sao)
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
