import { Link, useNavigate } from "react-router-dom";
import s from "../styles/sign-in.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from '../assets/images/logo.png';

export default function SignIn() {
    const userStorage = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [msgError, setMsgError] = useState("");
    const [msgSuccess, setMsgSuccess] = useState("");
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        if (userStorage?.username) {
            navigate("/");
        }
    }, [navigate, userStorage]);

    const onSubmit = async () => {
        if (!user.username.trim() || !user.password.trim()) {
            setMsgError("Please fill required field!");
            return;
        }

        try {
            const [userRes, adminRes] = await Promise.all([
                axios.get("http://localhost:8111/api/v1/users"),
                axios.get("http://localhost:8111/api/v1/admins")
            ]);

            const users = userRes.data.content;
            const admins = adminRes.data.content;
            const allAccounts = [...users, ...admins];

            const foundAccount = allAccounts.find(
                (account) =>
                    account.username === user.username.trim() &&
                    account.password === user.password.trim()
            );

            if (!foundAccount) {
                setMsgError("Account incorrect!");
                return;
            }

            localStorage.setItem("user", JSON.stringify(foundAccount));
            setMsgSuccess("Sign in successfully");

            // Kiểm tra xem tài khoản có trong danh sách admin không
            const isAdmin = admins.some(
                (admin) =>
                    admin.username === foundAccount.username &&
                    admin.password === foundAccount.password
            );

            setTimeout(() => {
                if (isAdmin) {
                    navigate("/admin"); // Đường dẫn đến AdminLayout
                } else {
                    navigate("/"); // Đường dẫn cho user thường
                }
            }, 1000);
        } catch (error) {
            setMsgError("Server error. Please try again later.");
            console.error(error);
        }
    };



    return (
        <div className={s.login}>
            <div className={s.login__container}>
                <div className={s.login__top}>
                    <Link to="/" className={s.login__logoWrapper}>
                        <img src={Logo} alt="Logo" className={s.login__logoImg} />
                        <span className={s.login__logoText}>Management_system</span>
                    </Link>
                    <div className={s.login__heading}>Let's Get Started!</div>
                    <div className={s.login__subheading}>
                        Sign in to continue to Management_system.
                    </div>
                </div>

                <div className={s.login__form}>
                    {msgError && <div className={s.login__error}>{msgError}</div>}
                    {msgSuccess && (
                        <div className={`${s.login__error} ${s.login__success}`}>
                            {msgSuccess}
                        </div>
                    )}
                    <div>
                        <p className={s.login__label}>Username</p>
                        <input
                            placeholder="Enter username"
                            type="text"
                            value={user.username}
                            onChange={(e) => {
                                setMsgError("");
                                setUser({ ...user, username: e.target.value });
                            }}
                        />
                    </div>
                    <div>
                        <p className={s.login__label}>Password</p>
                        <input
                            placeholder="Enter password"
                            type="password"
                            value={user.password}
                            onChange={(e) => {
                                setMsgError("");
                                setUser({ ...user, password: e.target.value });
                            }}
                        />
                    </div>
                    <div className={s.login__actions}>
                        <button className={s.login__btn} onClick={onSubmit}>
                            Log In <span className={s.login__icon}></span>
                        </button>
                        <Link to="/sign-up" className={s.login__signupBtn}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
