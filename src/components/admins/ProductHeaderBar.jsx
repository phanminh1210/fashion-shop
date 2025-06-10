import React from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Typography,
    useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const categories = ['Tất cả', 'Áo', 'Quần', 'Phụ Kiện', 'Mới', 'Hết hàng', 'Bán chạy'];

export default function ProductHeaderBar({ onCategoryClick, onSearch }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm.trim());
        }
    };

    const handleCategoryClick = (category) => {
        if (category === 'Tất cả') {
            navigate('/admin/products/all');
        } else if (category === 'Áo') {
            navigate('/admin/products/shirt');
        } else if (category === 'Quần') {
            navigate('/admin/products/trouser');
        } else if (category === 'Phụ Kiện') {
            navigate('/admin/products/accessory');
        } else if (category === 'Mới') {
            navigate('/admin/products/new');
        } else if (category === 'Hết hàng') {
            navigate('/admin/products/outOfStock');
        } else if (category === 'Bán chạy') {
            navigate('/admin/products/top-selling');
        } else {
            onCategoryClick?.(category);
        }
    };


    return (

        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
            }}
        >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {categories.map((cat) => (
                    <Typography
                        key={cat}
                        variant="body1"
                        onClick={() => handleCategoryClick(cat)}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 500,
                            color: cat === 'Mới' ? 'red' : cat === 'Hết hàng' ? 'red' : 'black',
                            textDecoration: cat === 'Hết hàng' ? 'line-through' : 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {cat}
                    </Typography>
                ))}
            </Box>

            <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ width: isMobile ? '100%' : '250px' }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
}
