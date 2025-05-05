import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, CardMedia, Grid, Button,
    ToggleButtonGroup, ToggleButton, Divider, Modal,
    IconButton, TextField, Card, CardContent
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function ProductDetail() {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [description, setDescription] = useState("");
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm tương tự

    const sizes = ["S", "M", "L", "XL"];

    useEffect(() => {
        axios.get(`http://localhost:8111/api/v1/categories/products/images/${id}`)
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setImages(res.data);
                    setSelectedImage(res.data[0]);
                }
            }).catch(err => console.error("Image fetch error:", err));

        axios.get(`http://localhost:8111/api/v1/categories/products/detail/${id}`)
            .then(res => setProductDetail(res.data))
            .catch(err => console.error("Detail fetch error:", err));

        axios.get(`http://localhost:8111/api/v1/categories/products/description/${id}`)
            .then(res => setDescription(res.data))
            .catch(err => console.error("Description fetch error:", err));

        axios.get(`http://localhost:8111/api/v1/categories/products/review/${id}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Review fetch error:", err));

        // Gọi API sản phẩm tương tự
        axios.get(`http://localhost:8111/api/v1/categories/products/by-category/1`)
            .then(res => setRelatedProducts(res.data.content))
            .catch(err => console.error("Related products fetch error:", err));

    }, [id]);

    const handleSizeChange = (event, newSize) => {
        if (newSize !== null) setSelectedSize(newSize);
    };

    const increaseQuantity = () => setQuantity(q => q + 1);
    const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Vui lòng chọn size.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user || !user.id) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        const cartData = {
            userId: user.id,
            productId: parseInt(id),
            color: productDetail?.color || "Trắng",
            size: selectedSize,
            quantity: quantity
        };

        axios.post("http://localhost:8111/api/v1/carts", cartData)
            .then(res => {
                alert("Thêm vào giỏ hàng thành công!");
                setShowModal(false);
            })
            .catch(err => {
                console.error("Lỗi khi thêm vào giỏ hàng:", err);
                alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
            });
    };

    return (
        <Box sx={{ px: '10%', py: 4 }}>
            <Typography variant="h4" gutterBottom>Chi tiết sản phẩm</Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box>
                    {selectedImage && (
                        <CardMedia
                            component="img"
                            image={`http://localhost:8111${selectedImage}`}
                            alt="Ảnh sản phẩm"
                            sx={{
                                width: 500, height: 400, objectFit: 'cover',
                                borderRadius: 2, boxShadow: 3
                            }}
                        />
                    )}
                    <Grid container spacing={2} sx={{ marginTop: 2, width: 500 }}>
                        {images.map((imageUrl, index) => (
                            <Grid item xs={3} key={index}>
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:8111${imageUrl}`}
                                    alt={`Ảnh ${index + 1}`}
                                    onClick={() => setSelectedImage(imageUrl)}
                                    sx={{
                                        width: '100%', height: 100, objectFit: 'cover', cursor: 'pointer',
                                        borderRadius: 1,
                                        border: selectedImage === imageUrl ? '2px solid #1976d2' : '1px solid #ccc',
                                        boxShadow: selectedImage === imageUrl ? 3 : 1
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ flex: 1 }}>
                    {productDetail && (
                        <>
                            <Typography variant="h5">{productDetail.name}</Typography>
                            <Typography variant="h6" color="text.secondary">
                                {productDetail.price.toLocaleString('vi-VN')} ₫
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                <StarIcon sx={{ color: '#fbc02d', verticalAlign: 'middle' }} />
                                {productDetail.avgRating.toFixed(1)} / 5 ({productDetail.countRating} đánh giá)
                            </Typography>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowModal(true)}
                                    sx={{
                                        borderColor: 'black',
                                        color: 'black',
                                        backgroundColor: 'white',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            borderColor: 'black'
                                        }
                                    }}
                                >
                                    Thêm vào giỏ hàng
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#333'
                                        }
                                    }}
                                >
                                    Mua ngay
                                </Button>
                            </Box>

                            {description && (
                                <Typography sx={{ mt: 4 }} variant="body1">
                                    {description}
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" gutterBottom>Đánh giá của người mua</Typography>

                {reviews.length === 0 ? (
                    <Typography>Chưa có đánh giá nào.</Typography>
                ) : (
                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        {reviews.map((review, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    {review.firstName} {review.lastName}
                                </Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            sx={{ color: i < review.rating ? '#fbc02d' : '#ccc', fontSize: 18 }}
                                        />
                                    ))}
                                    <Typography sx={{ ml: 1, color: 'gray' }}>
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Typography>
                                {review.color && (
                                    <Typography sx={{ fontStyle: 'italic', color: 'gray' }}>
                                        Màu: {review.color}
                                    </Typography>
                                )}
                                <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
                                {index < reviews.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Sản phẩm tương tự */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>Sản phẩm tương tự</Typography>
                <Grid container spacing={2}>
                    {relatedProducts.map(product => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:8111${product.imageUrl}`}
                                    alt={product.name}
                                    sx={{ height: 200, objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        <StarIcon sx={{ color: '#fbc02d', verticalAlign: 'middle' }} />
                                        {product.avgRating.toFixed(1)} / 5
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, width: 400,
                }}>
                    <Typography variant="h6" gutterBottom>Chọn size và số lượng</Typography>

                    <Typography variant="subtitle2" gutterBottom>Size:</Typography>
                    <ToggleButtonGroup
                        value={selectedSize}
                        exclusive
                        onChange={handleSizeChange}
                        sx={{ mb: 2 }}
                    >
                        {sizes.map((size) => (
                            <ToggleButton
                                key={size}
                                value={size}
                                sx={{
                                    width: 60, height: 60, fontWeight: 'bold',
                                    '&.Mui-selected': {
                                        backgroundColor: 'black', color: 'white'
                                    },
                                }}
                            >
                                {size}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Typography>Số lượng:</Typography>
                        <IconButton onClick={decreaseQuantity}><RemoveIcon /></IconButton>
                        <TextField
                            size="small"
                            value={quantity}
                            inputProps={{ readOnly: true, style: { width: 40, textAlign: 'center' } }}
                        />
                        <IconButton onClick={increaseQuantity}><AddIcon /></IconButton>
                    </Box>

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handleAddToCart}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
