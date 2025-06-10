import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchAdmins = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8111/api/v1/admins?page=1&size=10');
            setAdmins(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách admin:', error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins(page);
    }, [page]);

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    return (
        <div>
            <h2>Danh sách Admin</h2>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : admins.length === 0 ? (
                <p>Không có dữ liệu admin</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {admins.map((admin) => (
                        <div
                            key={admin.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '12px',
                                borderRadius: '6px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                backgroundColor: '#fafafa',
                                maxWidth: '400px',
                            }}
                        >
                            <p><strong>ID:</strong> {admin.id}</p>
                            <p><strong>Username:</strong> {admin.username}</p>
                            <p><strong>Password:</strong> {admin.password}</p>
                            <p><strong>Role:</strong> {admin.role}</p>
                            <p><strong>Created At:</strong> {new Date(admin.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ marginTop: '1rem' }}>
                <button onClick={handlePrev} disabled={page === 0}>
                    Trang trước
                </button>
                <span style={{ margin: '0 1rem' }}>
          Trang {page + 1} / {totalPages}
        </span>
                <button onClick={handleNext} disabled={page >= totalPages - 1}>
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default AdminList;
