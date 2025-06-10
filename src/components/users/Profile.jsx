// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, CircularProgress, Paper } from '@mui/material';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            axios.get(`http://localhost:8111/api/v1/users/${userId}`)
                .then(res => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi khi lấy thông tin người dùng:", err);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Typography sx={{ mt: 6, textAlign: 'center', color: 'text.secondary' }}>
                Không tìm thấy thông tin người dùng.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Avatar
                        src={user.avatarUrl || ''}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 100, height: 100, boxShadow: 3 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Username:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{user.username}</Typography>

                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Họ tên:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{user.firstName} {user.lastName}</Typography>

                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Email:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{user.email}</Typography>

                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Số điện thoại:
                    </Typography>
                    <Typography variant="body1">{user.phone}</Typography>
                </Box>
            </Paper>
        </Box>
    );
}
