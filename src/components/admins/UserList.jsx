import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    Box,
    Container,
    IconButton,
    Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1); // Bắt đầu từ 1

    const fetchUsers = async (currentPage) => {
        try {
            const response = await axios.get(
                `http://localhost:8111/api/v1/users?page=${currentPage}&size=10`
            );
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Handler các chức năng
    const handleView = (user) => {
        alert(`Xem thông tin của: ${user.firstName} ${user.lastName}`);
        // Có thể chuyển đến trang chi tiết nếu muốn
    };

    const handleEdit = (user) => {
        alert(`Chỉnh sửa người dùng: ${user.username}`);
        // Có thể chuyển đến form cập nhật
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await axios.delete(`http://localhost:8111/api/v1/users/${id}`);
                fetchUsers(page); // Cập nhật lại danh sách
            } catch (error) {
                console.error("Lỗi khi xoá người dùng:", error);
                alert("Xoá thất bại!");
            }
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Danh sách khách hàng
            </Typography>

            <TableContainer component={Paper} sx={{ backgroundColor: "#fff" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>STT</strong></TableCell>
                            <TableCell><strong>Họ tên</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>SĐT</strong></TableCell>
                            <TableCell><strong>Địa chỉ</strong></TableCell>
                            <TableCell><strong>Ngày tạo</strong></TableCell>
                            <TableCell><strong>Thao tác</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Tooltip title="Xem">
                                        <IconButton onClick={() => handleView(user)} color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton onClick={() => handleDelete(user.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default UserList;
