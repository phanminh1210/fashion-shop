import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Box, Typography, Button, IconButton,
    Menu, MenuItem, InputBase, Tooltip, Badge
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    ShoppingCart as ShoppingCartIcon,
    Assignment as AssignmentIcon,
    Search as SearchIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../../assets/images/logo.png';
import s from '../../styles/header.module.scss';
import { Forum as ForumIcon } from '@mui/icons-material';
import { DashboardCustomize as DashboardCustomizeIcon } from '@mui/icons-material';




export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0); // Đếm số thứ tự bản ghi cuối cùng
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8111/api/v1/carts')
            .then(res => {
                const items = res.data.content;
                setCartCount(items.length); // Số thứ tự bản ghi cuối
            })
            .catch(err => {
                console.error("Lỗi khi lấy giỏ hàng:", err);
                setCartCount(0);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/sign-in");
    };

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            axios.get(`http://localhost:8111/api/v1/categories/products/search?name=${searchTerm}&color=${searchTerm}`)
                .then(res => {
                    const results = res.data?.content || [];
                    navigate('/search-results', { state: { results, keyword: searchTerm } });
                })
                .catch(err => {
                    console.error("Lỗi tìm kiếm:", err);
                });
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={scrolled ? 2 : 0}
                sx={{
                    transition: 'background-color 0.3s ease',
                    backgroundColor: scrolled ? '#ffffff' : 'transparent',
                    color: '#000',
                    zIndex: 1100
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    {/* Logo + Trang chủ */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, minWidth: 250 }}>
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <Box
                                component="img"
                                src={Logo}
                                alt="Logo"
                                sx={{ width: 40, height: 40, borderRadius: "50%", mr: 1 }}
                            />
                            <Typography variant="h6" noWrap className={s.shopName}>
                                Maison M&H
                            </Typography>
                        </Box>
                        <Button component={Link} to="/" color="inherit" sx={{ textTransform: 'none' }}>
                            Trang chủ
                        </Button>
                    </Box>

                    {/* Các nút chức năng bên phải */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            sx={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            <MenuIcon fontSize="small" />
                            Danh mục
                        </Button>

                        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/category/ao">Áo</MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/category/quan">Quần</MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/category/phukien">Phụ kiện</MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/products">Tất cả</MenuItem>
                        </Menu>

                        {/* Tìm kiếm */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '999px',
                                px: 2, py: 0.5,
                                minWidth: 250,
                                maxWidth: 400,
                                ml: 2,
                                flexGrow: 1
                            }}
                        >
                            <SearchIcon sx={{ color: '#888', mr: 1 }} />
                            <InputBase
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyPress}
                                sx={{ flex: 1, color: '#333' }}
                                inputProps={{ 'aria-label': 'tìm kiếm' }}
                            />

                        </Box>


                        {/* Tài khoản */}
                        <Tooltip title="Tài khoản">
                            <IconButton color="inherit" component={Link} to="/accounts">
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Giỏ hàng có badge */}
                        <Tooltip title="Giỏ hàng">
                            <IconButton color="inherit" component={Link} to="/carts">
                                <Badge badgeContent={cartCount} color="error" max={99}>
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Đơn hàng */}
                        <Tooltip title="Đơn hàng">
                            <IconButton color="inherit" component={Link} to="/orders">
                                <AssignmentIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Tin nhắn */}
                        <Tooltip title="Tin nhắn">
                            <IconButton color="inherit" component={Link} to="/messages">
                                <ForumIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Hồ sơ cá nhân">
                            <IconButton color="inherit" component={Link} to="/profile">
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Đăng nhập / Đăng xuất */}
                        {isLoggedIn ? (
                            <Button
                                variant="outlined"
                                onClick={handleLogout}
                                sx={{
                                    color: '#000',
                                    borderColor: '#000',
                                    '&:hover': {
                                        borderColor: '#000',
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                Log Out
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/sign-in"
                                sx={{
                                    color: '#000',
                                    borderColor: '#000',
                                    '&:hover': {
                                        borderColor: '#000',
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Toolbar để tránh nội dung bị che */}
            <Toolbar />
        </>
    );
}
