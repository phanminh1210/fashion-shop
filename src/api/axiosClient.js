import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080", // Thay đổi nếu backend của bạn ở host khác
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;