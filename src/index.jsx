import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./stores";

// Components
import UserLayout from "./components/layout/UserLayout";
import HomePage from "./components/users/HomePage";
import SignIn from "./components/SignIn";
import Products from "./components/products/Products";
import ProductDetail from "./components/products/ProductDetail";
import Cart from "./components/users/Cart";
import Order from "./components/users/Order";
import Account from "./components/users/Account";
import AdminMessagePage from "./components/AdminMessagePage";
import Profile from "./components/users/Profile";
import ProductTrousers from "./components/products/ProductTrousers";
import ProductsAustria from "./components/products/ProductsAustria";
import ProductAccessory from "./components/products/ProductAccessory";
import AdminLayout from "./components/layout/AdminLayout";
import OrderList from "./components/admins/OrderList";
import OrderPendingList from "./components/admins/OrderPendingList";
import OrderShippingList from "./components/admins/OrderShippingList";
import OrderCompletedList from "./components/admins/OrderCompletedList";
import OrderConfirmedList from "./components/admins/OrderConfirmedList";
import ProductHeaderBar from "./components/admins/ProductHeaderBar";
import ProductAllData from "./components/admins/ProductAllData";
import ProductByCategoryShirt from "./components/admins/ProductByCategoryShirt";
import ProductByCategoryTrouser from "./components/admins/ProductByCategoryTrouser";
import ProductByCategoryAccessory from "./components/admins/ProductByCategoryAccessory";
import ProductAllNew from "./components/admins/ProductAllNew";
import ProductOutOfStock from "./components/admins/ProductOutOfStock";
import ProductTopSelling from "./components/admins/ProductTopSelling";
import UserList from "./components/admins/UserList";
import AdminList from "./components/admins/AdminList";
import VoucherList from "./components/admins/VoucherList";

// import OrderManagement from "./components/admin/OrderManagement";
// import ProductManagement from "./components/admin/ProductManagement";
// import AccountManagement from "./components/admin/AccountManagement";
// import VoucherManagement from "./components/admin/VoucherManagement";


// Router setup
const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />, // Có Header
        children: [
            { index: true, element: <SignIn /> },
            { path: "home", element: <HomePage /> },
            { path: "products", element: <Products /> },
            { path: "products/:id", element: <ProductDetail /> },
            { path: "carts", element: <Cart /> },
            { path: "orders", element: <Order /> },
            { path: "accounts", element: <Account /> },
            { path: "messages", element: <AdminMessagePage /> },
            { path: "profile", element: <Profile /> },
            { path: "category/quan", element: <ProductTrousers /> },
            { path: "category/ao", element: <ProductsAustria /> },
            { path: "category/phukien", element: <ProductAccessory /> },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [

            { path: "/admin/orders", element: <OrderList /> },
            { path: "/admin/orders/pending", element: <OrderPendingList /> },
            { path: "/admin/orders/shipping", element: <OrderShippingList /> },
            { path: "/admin/orders/confirmed", element: <OrderConfirmedList /> },
            { path: "/admin/orders/completed", element: <OrderCompletedList /> },
            { path: "/admin/products", element: <ProductHeaderBar /> },
            { path: "/admin/products/all", element: <ProductAllData /> },
            { path: "/admin/products/shirt", element: <ProductByCategoryShirt /> },
            { path: "/admin/products/trouser", element: <ProductByCategoryTrouser /> },
            { path: "/admin/products/accessory", element: <ProductByCategoryAccessory /> },
            { path: "/admin/products/new", element: <ProductAllNew /> },
            { path: "/admin/products/outOfStock", element: <ProductOutOfStock /> },
            { path: "/admin/products/top-selling", element: <ProductTopSelling /> },
            { path: "/admin/user", element: <UserList /> },
            { path: "/admin/accounts", element: <AdminList /> },
            { path: "/admin/vouchers", element: <VoucherList /> },

        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "*",
        element: (
            <div style={{ padding: 20 }}>
                <h2>404 - Không tìm thấy trang</h2>
            </div>
        ),
    },
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();


