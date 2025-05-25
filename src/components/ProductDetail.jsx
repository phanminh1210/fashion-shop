import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, CardMedia, Grid, Button,
    ToggleButtonGroup, ToggleButton, Divider, Modal,
    IconButton, TextField, Card, CardContent, Rating
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
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Đánh giá
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewColor, setReviewColor] = useState("");

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

        fetchReviews();

        axios.get(`http://localhost:8111/api/v1/categories/products/by-category/1`)
            .then(res => setRelatedProducts(res.data.content))
            .catch(err => console.error("Related products fetch error:", err));

    }, [id]);

    const fetchReviews = () => {
        axios.get(`http://localhost:8111/api/v1/categories/products/review/${id}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Review fetch error:", err));
    };

    const handleSizeChange = (event, newSize) => {
        if (newSize !== null) setSelectedSize(newSize);
    };

    const increaseQuantity = () => setQuantity(q => q + 1);
    const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleAddToCart = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        let user = null;
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            alert("Định dạng user trong localStorage không hợp lệ.");
            return;
        }

        if (!user?.id) {
            alert("Thông tin người dùng không đầy đủ.");
            return;
        }

        if (!selectedSize || quantity <= 0) {
            alert("Vui lòng chọn size và số lượng hợp lệ.");
            return;
        }

        const cartData = {
            userId: user.id,
            productId: productDetail.id,
            color: productDetail.color,
            size: selectedSize,
            quantity: quantity,
        };

        try {
            const response = await axios.post('http://localhost:8111/api/v1/carts', cartData);
            alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
        } catch (error) {
            alert("Thêm vào giỏ hàng thất bại!");
            console.error(error);
        }
    };



    const handleSubmitReview = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            alert("Bạn cần đăng nhập để gửi đánh giá.");
            return;
        }

        if (rating === 0 || comment.trim() === "") {
            alert("Vui lòng đánh giá sao và nhập bình luận.");
            return;
        }

        const reviewData = {
            userId: user.id,
            productId: parseInt(id),
            rating,
            comment,
            color: reviewColor
        };

        axios.post("http://localhost:8111/api/v1/categories/products/review", reviewData)
            .then(() => {
                alert("Gửi đánh giá thành công!");
                setRating(0);
                setComment("");
                setReviewColor("");
                fetchReviews();
            })
            .catch(err => {
                console.error("Lỗi khi gửi đánh giá:", err);
                alert("Không thể gửi đánh giá.");
            });
    };

    return (
        <Box sx={{ px: '10%', py: 4 }}>
            <Typography variant="h4" gutterBottom>Chi tiết sản phẩm</Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Hình ảnh sản phẩm */}
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
                        {images.map((img, index) => (
                            <Grid item xs={3} key={index}>
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:8111${img}`}
                                    alt={`Ảnh ${index + 1}`}
                                    onClick={() => setSelectedImage(img)}
                                    sx={{
                                        width: '100%', height: 100, objectFit: 'cover', cursor: 'pointer',
                                        borderRadius: 1,
                                        border: selectedImage === img ? '2px solid #1976d2' : '1px solid #ccc',
                                        boxShadow: selectedImage === img ? 3 : 1
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Thông tin sản phẩm */}
                <Box sx={{ flex: 1 }}>
                    {productDetail && (
                        <>
                            <Typography variant="h5">{productDetail.name}</Typography>
                            {/* Thêm hiển thị ID sản phẩm */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                                ID sản phẩm: {productDetail.id}
                            </Typography>
                            {/* Thêm hiển thị màu sắc sản phẩm */}
                            {productDetail.color && (
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Màu sắc: {productDetail.color}
                                </Typography>
                            )}

                            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
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
                                    sx={{ borderColor: 'black', color: 'black' }}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button variant="contained" sx={{ backgroundColor: 'black' }}>
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

            {/* Đánh giá */}
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
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating
                                        value={review.rating}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                    />
                                    <Typography sx={{ ml: 1, color: 'gray' }}>
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Box>
                                {/*{review.color && (*/}
                                {/*    <Typography sx={{ fontStyle: 'italic', color: 'gray' }}>*/}
                                {/*        Màu: {review.color}*/}
                                {/*    </Typography>*/}
                                {/*)}*/}
                                <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
                                {index < reviews.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Form đánh giá */}
                <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Viết đánh giá của bạn</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography>Số sao: </Typography>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(e, newValue) => setRating(newValue)}
                            sx={{ ml: 2 }}
                        />
                    </Box>
                    {/*<TextField*/}
                    {/*    label="Màu sắc (tùy chọn)"*/}
                    {/*    fullWidth*/}
                    {/*    value={reviewColor}*/}
                    {/*    onChange={(e) => setReviewColor(e.target.value)}*/}
                    {/*    sx={{ mb: 2 }}*/}
                    {/*/>*/}
                    <TextField
                        label="Nội dung đánh giá"
                        fullWidth
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleSubmitReview}>
                        Gửi đánh giá
                    </Button>
                </Box>
            </Box>

            {/* Modal chọn size & số lượng */}
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Typography variant="h6" gutterBottom>Chọn size và số lượng</Typography>

                    <ToggleButtonGroup
                        value={selectedSize}
                        exclusive
                        onChange={handleSizeChange}
                        aria-label="size"
                        sx={{ mb: 3 }}
                    >
                        {sizes.map(size => (
                            <ToggleButton key={size} value={size} aria-label={size}>
                                {size}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <IconButton onClick={decreaseQuantity}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                        <IconButton onClick={increaseQuantity}>
                            <AddIcon />
                        </IconButton>
                    </Box>

                    <Button variant="contained" fullWidth onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
