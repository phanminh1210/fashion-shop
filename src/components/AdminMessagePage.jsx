import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, List, ListItem, ListItemText,
    Divider, TextField, IconButton, Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function AdminMessagePage() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [errorUsers, setErrorUsers] = useState('');

    const userJson = localStorage.getItem('user');
    const adminId = userJson ? JSON.parse(userJson).id : null;

    useEffect(() => {
        axios.get("http://localhost:8111/api/v1/users")
            .then(res => {
                setUsers(res.data.content || []);
                if (res.data.content && res.data.content.length > 0) {
                    setSelectedUser(res.data.content[0]);
                }
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error(err);
                setErrorUsers('Lấy danh sách người dùng thất bại');
                setLoadingUsers(false);
            });
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        axios.get(`http://localhost:8111/api/v1/messages/${selectedUser.id}`)
            .then(res => {
                setMessages(res.data || []);
            })
            .catch(err => {
                console.error(err);
                setMessages([]);
            });
    }, [selectedUser]);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await axios.post('http://localhost:8111/api/v1/messages', {
                userId: selectedUser.id,
                adminId: adminId,
                content: newMessage,
                sender: adminId
            });

            setMessages(prev => [...prev, {
                ...res.data,
                content: newMessage,
                sender: adminId,
                createdAt: new Date().toISOString()
            }]);

            setNewMessage('');
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', p: 2 }}>
            {/* Danh sách người dùng */}
            <Paper elevation={3} sx={{ width: 300, mr: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Người dùng
                </Typography>
                {loadingUsers && <Typography>Đang tải...</Typography>}
                {errorUsers && <Typography color="error">{errorUsers}</Typography>}
                <List>
                    {users.map(user => {
                        const fullName = `${user.firstName} ${user.lastName}`;
                        return (
                            <ListItem
                                key={user.id}
                                button
                                selected={selectedUser?.id === user.id}
                                onClick={() => setSelectedUser(user)}
                            >
                                <ListItemText primary={fullName} />
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>

            {/* Vùng chat */}
            <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Trò chuyện với: {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Chọn người dùng'}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                    {messages.map((msg, index) => {
                        const isAdminMsg = String(msg.sender) === String(adminId);
                        const isUserMsg = String(msg.sender) === String(selectedUser?.id);

                        if (!isAdminMsg && !isUserMsg) return null;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isAdminMsg ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        maxWidth: '60%',
                                        backgroundColor: isAdminMsg ? '#000' : '#fff',
                                        color: isAdminMsg ? '#fff' : '#000',
                                        border: isAdminMsg ? 'none' : '1px solid #ccc',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {msg.content}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={!selectedUser}
                    />
                    <IconButton color="primary" onClick={handleSend} disabled={!selectedUser}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}
