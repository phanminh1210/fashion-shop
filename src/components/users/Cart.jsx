import styles from '../../styles/cart.module.scss';
import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Checkbox, Button, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Radio, RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import axios from 'axios';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [myCartItems, setMyCartItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedMyItems, setSelectedMyItems] = useState([]);

    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState([]);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [voucherList, setVoucherList] = useState([]);
    const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);

    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    // Fetch cart items with pagination
    const fetchCartItems = async () => {
        try {
            const res = await axios.get(`http://localhost:8111/api/v1/carts?page=${page}&size=${rowsPerPage}`);
            setCartItems(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Lỗi khi lấy tất cả giỏ hàng:", err);
        }
    };

    // Fetch user's own cart items
    const fetchMyCartItems = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:8111/api/v1/carts/${userId}`);
            setMyCartItems(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng của tôi:", err);
        }
    };

    // Fetch vouchers public list
    const fetchVouchers = async () => {
        try {
            const res = await axios.get('http://localhost:8111/api/v1/vouchers/public');
            setVoucherList(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy voucher:", err);
        }
    };

    useEffect(() => {
        if (!userId) {
            alert("Bạn chưa đăng nhập!");
            return;
        }
        fetchCartItems();
        fetchMyCartItems();
    }, [page, rowsPerPage]);

    // Selection handlers
    const handleSelect = (cartId) => {
        setSelectedItems(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]);
    };

    const handleSelectMy = (cartId) => {
        setSelectedMyItems(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]);
    };

    const handleSelectAll = () => {
        const allIds = cartItems.map(item => item.cartId);
        setSelectedItems(selectedItems.length === cartItems.length ? [] : allIds);
    };

    const handleSelectAllMy = () => {
        const allIds = myCartItems.map(item => item.cartId);
        setSelectedMyItems(selectedMyItems.length === myCartItems.length ? [] : allIds);
    };

    // Delete cart item
    const handleDelete = async (item, isMine = false) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await axios.delete(`http://localhost:8111/api/v1/carts/${item.cartId}`);
                if (isMine) {
                    setMyCartItems(prev => prev.filter(c => c.cartId !== item.cartId));
                    setSelectedMyItems(prev => prev.filter(id => id !== item.cartId));
                } else {
                    fetchCartItems();
                    setSelectedItems(prev => prev.filter(id => id !== item.cartId));
                }
            } catch (err) {
                alert("Lỗi khi xóa sản phẩm");
            }
        }
    };

    // Update quantity in cart
    const updateQuantity = async (item, delta, isMine = false) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        try {
            await axios.put(`http://localhost:8111/api/v1/carts/quantity/${item.cartId}`, { quantity: newQuantity });
            const updateFunc = isMine ? setMyCartItems : setCartItems;
            updateFunc(prev => prev.map(c => c.cartId === item.cartId ? { ...c, quantity: newQuantity } : c));
        } catch (err) {
            alert("Lỗi khi cập nhật số lượng");
        }
    };

    // Open checkout dialog
    const handleCheckout = (selectedIds, cartSource) => {
        if (!userId || selectedIds.length === 0) {
            alert("Vui lòng chọn sản phẩm");
            return;
        }

        const items = cartSource === 'all' ? cartItems : myCartItems;
        const selectedData = items.filter(i => selectedIds.includes(i.cartId));
        const totalAmount = selectedData.reduce((sum, i) => sum + i.price * i.quantity, 0);

        setCheckoutData(selectedData);
        setCheckoutTotal(totalAmount);
        setSelectedVoucher(null);
        setAddress('');
        setNote('');
        setCheckoutOpen(true);
    };

    // Confirm order
    const confirmCheckout = async () => {
        try {
            // Gửi từng item trong đơn hàng
            for (const item of checkoutData) {
                const payload = {
                    userId: userId,
                    productId: item.productId,
                    color: item.productColor,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity,
                    address: address,
                    note: note,
                    voucherId: selectedVoucher?.id || null, // Gửi voucher nếu có
                };

                await axios.post('http://localhost:8111/api/v1/orderItem', payload);
            }

            // Gọi API tạo đơn hàng tổng (addByCart)
            const orderPayload = {
                userId: userId,
                totalAmount: checkoutTotal - (selectedVoucher?.discountAmount || 0),
            };
            await axios.post('http://localhost:8111/api/v1/orders/addByCart', orderPayload);

            // Xoá các item trong cart sau khi đặt hàng thành công
            for (const item of checkoutData) {
                await axios.delete(`http://localhost:8111/api/v1/carts/${item.cartId}`);
            }

            // Hiển thị thông báo và reset lại trạng thái
            alert('Đơn hàng đã được xác nhận!');
            setCheckoutOpen(false);
            setSelectedItems([]);
            setSelectedMyItems([]);
            setSelectedVoucher(null);
            setAddress('');
            setNote('');
            setCheckoutData([]);
            setCheckoutTotal(0);
            fetchCartItems();
            fetchMyCartItems();

        } catch (err) {
            console.error(err);
            alert('Đã xảy ra lỗi khi xác nhận đơn hàng!');
        }
    };




    // Calculate total for selected items
    const totalSelected = (items, selected) =>
        items.filter(i => selected.includes(i.cartId))
            .reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Render cart tables
    const renderTable = (items, selected, handleSelectFunc, handleSelectAllFunc, handleDeleteFunc, isMine = false) => (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selected.length === items.length && items.length > 0}
                                indeterminate={selected.length > 0 && selected.length < items.length}
                                onChange={handleSelectAllFunc}
                            />
                        </TableCell>
                        <TableCell align="center">Ảnh</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell align="center">Màu</TableCell>
                        <TableCell align="center">Size</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="center">SL</TableCell>
                        <TableCell align="right">Tổng</TableCell>
                        <TableCell align="center">Xóa</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.cartId}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selected.includes(item.cartId)}
                                    onChange={() => handleSelectFunc(item.cartId)}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <img src={`http://localhost:8111${item.imageUrl}`} width={50} height={50} alt={item.productName} />
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="center">{item.productColor}</TableCell>
                            <TableCell align="center">{item.size}</TableCell>
                            <TableCell align="right">{item.price.toLocaleString()} đ</TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                    <Button variant="contained" size="small"
                                            sx={{ minWidth: 24, height: 24, bgcolor: 'black', color: 'white' }}
                                            onClick={() => updateQuantity(item, -1, isMine)}>-</Button>
                                    <Typography>{item.quantity}</Typography>
                                    <Button variant="contained" size="small"
                                            sx={{ minWidth: 24, height: 24, bgcolor: 'black', color: 'white' }}
                                            onClick={() => updateQuantity(item, 1, isMine)}>+</Button>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{(item.price * item.quantity).toLocaleString()} đ</TableCell>
                            <TableCell align="center">
                                <IconButton color="error" onClick={() => handleDeleteFunc(item, isMine)}>
                                    <CloseRounded />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box className={styles.cart_container} sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, px: 2 }}>

            <Typography variant="h5" mb={2} mt={5}>🛒 Giỏ hàng của tôi</Typography>
            {renderTable(myCartItems, selectedMyItems, handleSelectMy, handleSelectAllMy, handleDelete, true)}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography>Tổng tiền: {totalSelected(myCartItems, selectedMyItems).toLocaleString()} đ</Typography>
                <Button variant="contained" color="success" onClick={() => handleCheckout(selectedMyItems, 'mine')}
                        disabled={!selectedMyItems.length}>Mua hàng</Button>
            </Box>

            <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>🧾 Xác nhận đơn hàng</DialogTitle>
                <DialogContent dividers>
                    {checkoutData.map(item => (
                        <Box key={item.cartId} display="flex" flexDirection="column" alignItems="flex-start" mb={4}>
                            <Box display="flex" justifyContent="center" width="100%" mb={2}>
                                <img
                                    src={`http://localhost:8111${item.imageUrl}`}
                                    width={150}
                                    height={150}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                    alt={item.productName}
                                />
                            </Box>

                            <Typography><strong>Tên sản phẩm:</strong> {item.productName}</Typography>

                            <Typography><strong>Màu sắc:</strong> {item.productColor}</Typography>

                            <Typography><strong>Size:</strong> {item.size}</Typography>

                            <Typography><strong>Số lượng:</strong> {item.quantity}</Typography>

                            <Typography><strong>Giá:</strong>  {item.price.toLocaleString()}</Typography>

                            <Typography><strong>Tổng:</strong> {(item.price * item.quantity).toLocaleString()} đ</Typography>
                        </Box>
                    ))}

                    {/* Địa chỉ giao hàng */}
                    <Box mb={2}>
                        <Typography><strong>Địa chỉ giao hàng:</strong></Typography>
                        <TextField fullWidth value={address} onChange={e => setAddress(e.target.value)} />
                    </Box>

                    {/* Ghi chú */}
                    <Box mb={2}>
                        <Typography><strong>Ghi chú:</strong></Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </Box>

                    {/* Chọn voucher */}
                    <Box mb={2}>
                        <Typography><strong>Chọn voucher giảm giá:</strong>
                            <Button size="small" onClick={() => {
                                fetchVouchers();
                                setVoucherDialogOpen(true);
                            }}>Chọn voucher</Button>
                        </Typography>

                        {selectedVoucher ? (
                            <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1, mt: 1 }}>
                                <Typography><strong>Mã Voucher:</strong>{selectedVoucher.id}</Typography>

                                <Typography><strong>Giảm:</strong>{selectedVoucher.discountAmount.toLocaleString()} đ</Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary" mt={1}>Chưa chọn voucher</Typography>
                        )}
                    </Box>

                    {/* Tổng tiền */}
                    <Box mb={2}>
                        <Typography><strong>Tổng tiền:</strong></Typography>
                        <Typography>{checkoutTotal.toLocaleString()} đ</Typography>

                        <Typography><strong>Giảm giá voucher:</strong></Typography>
                        <Typography>{(selectedVoucher?.discountAmount || 0).toLocaleString()} đ</Typography>

                        <Typography><strong>Thanh toán:</strong></Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {(checkoutTotal - (selectedVoucher?.discountAmount || 0)).toLocaleString()} đ
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setCheckoutOpen(false)}>Hủy</Button>
                    <Button variant="contained" color="primary" onClick={confirmCheckout}>Xác nhận</Button>
                </DialogActions>
            </Dialog>




            {/* Dialog chọn voucher */}
            <Dialog open={voucherDialogOpen} onClose={() => setVoucherDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chọn voucher</DialogTitle>
                <DialogContent dividers>
                    {voucherList.length === 0 && <Typography>Không có voucher nào</Typography>}
                    <RadioGroup
                        value={selectedVoucher?.id || ''}
                        onChange={e => {
                            const selectedId = e.target.value;
                            const voucher = voucherList.find(v => v.id === selectedId);
                            setSelectedVoucher(voucher);
                            setVoucherDialogOpen(false);
                        }}
                    >
                        {voucherList.map(v => (
                            <FormControlLabel
                                key={v.id}
                                value={v.id}
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography><strong>Mã:</strong> {v.code}</Typography>
                                        <Typography><strong>Mô tả:</strong> {v.description}</Typography>
                                        <Typography><strong>Giảm:</strong> {v.discountAmount.toLocaleString()} đ</Typography>
                                        <Typography><strong>Hết hạn:</strong> {new Date(v.expiryDate).toLocaleDateString()}</Typography>
                                    </Box>
                                }
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVoucherDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
