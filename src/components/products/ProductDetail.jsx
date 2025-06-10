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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRef } from 'react';

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
    const [feedbackImage, setFeedbackImage] = useState(null);

    // Đánh giá
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewColor, setReviewColor] = useState("");

    const sizes = ["S", "M", "L", "XL"];
    const formData = new FormData();
    formData.append("file", feedbackImage);

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



    const handleSubmitReview = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            alert("Bạn cần đăng nhập để gửi đánh giá.");
            return;
        }

        if (rating === 0 || comment.trim() === "") {
            alert("Vui lòng đánh giá sao và nhập bình luận.");
            return;
        }

        let imageUrl = "";

        // Nếu có ảnh thì upload lên trước
        if (feedbackImage) {
            const formData = new FormData();
            formData.append("file", feedbackImage);

            try {
                const uploadRes = await axios.post("http://localhost:8111/api/v1/reviews/upload-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                imageUrl = uploadRes.data.imageUrl; // lấy url ảnh trả về
            } catch (err) {
                console.error("Upload ảnh thất bại:", err);
                alert("Tải ảnh thất bại. Vui lòng thử lại.");
                return;
            }
        }


        const reviewData = {
            user: user.id,
            product: productDetail.id,
            rating,
            comment,
            imageUrlFeedback: imageUrl
        };

        try {
            await axios.post("http://localhost:8111/api/v1/reviews", reviewData);
            alert("Gửi đánh giá thành công!");
            setRating(0);
            setComment("");
            setFeedbackImage(null);
            fetchReviews();
        } catch (err) {
            console.error("Lỗi khi gửi đánh giá:", err);
            alert("Không thể gửi đánh giá.");
        }
    };


    const imageScrollRef = useRef(null); // khai báo ref

    const scrollThumbnails = (direction) => {
        if (imageScrollRef.current) {
            const scrollAmount = 100; // px mỗi lần cuộn
            imageScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
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
                    <Box sx={{ position: 'relative', width: 500, mt: 2 }}>
                        {/* Nút trái */}
                        <IconButton
                            onClick={() => scrollThumbnails('left')}
                            sx={{
                                position: 'absolute',
                                left: -30,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                backgroundColor: 'white',
                                boxShadow: 1,
                                '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>

                        {/* Vùng chứa ảnh cuộn được */}
                        <Box
                            ref={imageScrollRef}
                            sx={{
                                overflowX: 'hidden',
                                display: 'flex',
                                gap: 2,
                                pb: 1,
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {images.map((img, index) => (
                                <CardMedia
                                    key={index}
                                    component="img"
                                    image={`http://localhost:8111${img}`}
                                    alt={`Ảnh ${index + 1}`}
                                    onClick={() => setSelectedImage(img)}
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        border: selectedImage === img ? '2px solid #1976d2' : '1px solid #ccc',
                                        boxShadow: selectedImage === img ? 3 : 1,
                                        flexShrink: 0
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Nút phải */}
                        <IconButton
                            onClick={() => scrollThumbnails('right')}
                            sx={{
                                position: 'absolute',
                                right: -30,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                backgroundColor: 'white',
                                boxShadow: 1,
                                '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </Box>

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
                                    variant="contained"
                                    onClick={() => setShowModal(true)}
                                    sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
                                >
                                    Thêm vào giỏ hàng
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
                                {review.imageUrlFeedback && (
                                    <Box sx={{ mt: 1 }}>
                                        <img
                                            src={`http://localhost:8111${review.imageUrlFeedback}`}
                                            alt="Ảnh phản hồi"
                                            style={{
                                                maxWidth: '80px',
                                                maxHeight: '80px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                border: '1px solid #ddd',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </Box>
                                )}
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
                            precision={0.5} // Thêm dòng này
                            onChange={(e, newValue) => setRating(newValue)}
                            sx={{ ml: 2 }}
                        />

                    </Box>
                    <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                        Tải ảnh feedback
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => setFeedbackImage(e.target.files[0])}
                        />
                    </Button>

                    {feedbackImage && (
                        <Typography variant="body2" color="text.secondary">
                            Ảnh đã chọn: {feedbackImage.name}
                        </Typography>
                    )}

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
            {/* Sản phẩm liên quan */}
            <Box sx={{ mt: 6, mx: '10%', py: 4 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" gutterBottom>Sản phẩm tương tự</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: 3,
                    }}
                >
                    {relatedProducts.map((product) => (
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
                                    boxShadow: 4,
                                }
                            }}
                            onClick={() => window.location.href = `/products/${product.id}`}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={`http://localhost:8111${product.imageUrl}`}
                                alt={product.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" noWrap>{product.name}</Typography>
                                <Typography color="text.secondary">
                                    {product.price.toLocaleString('vi-VN')} ₫
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Rating
                                        value={product.avgRating}
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

        </Box>
    );
}
