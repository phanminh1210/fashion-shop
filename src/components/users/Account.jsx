import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TextField, Grid, IconButton, Tooltip
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Account = () => {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [adminSearch, setAdminSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        fetchAdmins();
        fetchUsers();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get("http://localhost:8111/api/v1/admins");
            setAdmins(response.data.content);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách admin:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8111/api/v1/users");
            setUsers(response.data.content);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
        }
    };

    const handleAdd = (item, isAdmin) => {
        console.log("Thêm bản ghi giống:", item, isAdmin ? 'Admin' : 'User');
    };

    const handleEdit = (id, isAdmin) => {
        console.log("Chỉnh sửa ID:", id, isAdmin ? 'Admin' : 'User');
    };

    const handleDelete = (id, isAdmin) => {
        console.log("Xoá ID:", id, isAdmin ? 'Admin' : 'User');
    };

    const renderTable = (title, data, isAdmin = false, searchValue, onSearchChange) => {
        const filteredData = data.filter(item =>
            item.username.toLowerCase().includes(searchValue.toLowerCase())
        );

        return (
            <Box sx={{ mt: 4 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">{title}</Typography>
                    <TextField
                        size="small"
                        label="Tìm theo Username"
                        variant="outlined"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                {isAdmin ? (
                                    <>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Họ tên</TableCell>
                                        <TableCell>SĐT</TableCell>
                                        <TableCell>Địa chỉ</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                    </>
                                )}
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={`${isAdmin ? 'admin' : 'user'}-${item.id}`}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    {isAdmin ? (
                                        <>
                                            <TableCell>{item.role}</TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.firstName} {item.lastName}</TableCell>
                                            <TableCell>{item.phone}</TableCell>
                                            <TableCell>{item.address}</TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                        </>
                                    )}
                                    <TableCell align="center">
                                        <Tooltip title="Thêm">
                                            <IconButton onClick={() => handleAdd(item, isAdmin)} color="primary">
                                                <AddCircleOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sửa">
                                            <IconButton onClick={() => handleEdit(item.id, isAdmin)} color="warning">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton onClick={() => handleDelete(item.id, isAdmin)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Quản lý tài khoản</Typography>
            {renderTable("Tài khoản Admin", admins, true, adminSearch, setAdminSearch)}
            {renderTable("Tài khoản Người dùng", users, false, userSearch, setUserSearch)}
        </Box>
    );
};

export default Account;
