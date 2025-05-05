import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./stores";

// Components
import LayoutRoot from "./components/LayoutRoot";
import HomePage from "./components/HomePage";
import SignIn from "./components/SignIn";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Account from "./components/Account";

// Router setup
const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutRoot/>,
        children: [
            {index: true, element: <HomePage/>},
            {path: "products", element: <Products/>},
            {path: "products/:id", element: <ProductDetail/>},
            {path: "/carts", element: <Cart/>},
            {path: "/orders", element: <Order/>},
            {path: "/accounts", element: <Account/>}
        ],
    },
    {
        path: "/sign-in",
        element: <SignIn/>,
    },
    {
        path: "*",
        element: (
            <div style={{padding: 20}}>
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
