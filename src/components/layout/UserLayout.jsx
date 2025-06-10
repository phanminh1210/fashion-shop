import { Outlet, useNavigate } from "react-router-dom";
import Header from "../users/Header";
import Footer from "../users/Footer";
import { useEffect } from "react";

export default function UserLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Bỏ qua phần kiểm tra đăng nhập, nếu không yêu cầu đăng nhập
        // const userStorage = localStorage.getItem("user");
        // if (!userStorage) {
        //     navigate("/sign-in");
        // }
    }, [navigate]); // Chỉ chạy khi component được render

    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
