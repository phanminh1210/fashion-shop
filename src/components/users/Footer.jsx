import { Box, Typography, Grid, Container, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, YouTube, TikTok } from "@mui/icons-material";
import Logo from '../../assets/images/logo.png';

export default function Footer() {
    return (
        <Box sx={{ backgroundColor: 'transparent', color: '#000', py: 4, mt: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Logo và thông tin liên hệ */}
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                component="img"
                                src={Logo}
                                alt="Logo"
                                sx={{ width: 40, height: 40, borderRadius: "50%", mr: 1 }}
                            />
                            <Typography variant="h6">Fashion Shop</Typography>
                        </Box>
                        <Typography variant="body2">Địa chỉ: Quận Hoàng Mai, Hà Nội</Typography>
                        <Typography variant="body2">SĐT: 0921 122 126</Typography>
                        <Typography variant="body2">Email: phanngocminhda3@gmail.com</Typography>
                        <Typography variant="body2">Giờ làm việc: 8:00 - 21:00 (T2 - CN)</Typography>
                    </Grid>

                    {/* Về cửa hàng */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" gutterBottom>Về cửa hàng</Typography>
                        <Typography variant="body2">Giới thiệu</Typography>
                        <Typography variant="body2">Tin tức / Blog</Typography>
                        <Typography variant="body2">Câu hỏi thường gặp</Typography>
                        <Typography variant="body2">Tuyển dụng</Typography>
                    </Grid>

                    {/* Chính sách */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" gutterBottom>Chính sách</Typography>
                        <Typography variant="body2">Chính sách đổi/trả hàng</Typography>
                        <Typography variant="body2">Chính sách bảo mật</Typography>
                        <Typography variant="body2">Chính sách vận chuyển</Typography>
                        <Typography variant="body2">Điều khoản dịch vụ</Typography>
                    </Grid>

                    {/* Hỗ trợ khách hàng */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" gutterBottom>Hỗ trợ</Typography>
                        <Typography variant="body2">Hướng dẫn mua hàng</Typography>
                        <Typography variant="body2">Hướng dẫn thanh toán</Typography>
                        <Typography variant="body2">Kiểm tra đơn hàng</Typography>
                        <Typography variant="body2">Liên hệ hỗ trợ: 0921122126</Typography>
                    </Grid>

                    {/* Đăng ký nhận tin & Mạng xã hội */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>Đăng ký nhận tin</Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Nhập email của bạn"
                            sx={{ backgroundColor: '#fff', borderRadius: 1, mb: 1 }}
                            fullWidth
                        />
                        <Button variant="contained" size="small" fullWidth sx={{ mb: 2 }}>
                            Đăng ký
                        </Button>

                        <Typography variant="h6" gutterBottom>Mạng xã hội</Typography>
                    </Grid>
                </Grid>

                {/* Phương thức thanh toán & Bản quyền */}
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2">
                            Hỗ trợ thanh toán: Visa, Momo, VNPay, COD...
                        </Typography>
                        <Typography variant="body2">
                            Đối tác vận chuyển: GHN, GHTK, J&T, VNPost
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                            © {new Date().getFullYear()} Fashion Shop. All rights reserved.
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                            Mã số thuế: 0101234567
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
