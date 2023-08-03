import React from "react";
import { Navigate } from "react-router-dom";
import Home from "../components/Home";
import Checkout from "../pages/Checkout";
import MyAccount from "../pages/MyAccount";
import MyOrders from "../pages/MyOrders";
import OrderCompleted from "../pages/OrderCompleted";
import ProductDetails from "../pages/ProductDetails";
import ShopCatalog from "../pages/ShopCatalog";
import ShoppingCart from "../pages/ShoppingCart";
import WishList from "../pages/WishList";

const routes = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/myAccount",
    element: <MyAccount />,
  },
  {
    path: "/shopCatalog",
    element: <ShopCatalog />,
  },
  {
    path: "/productDetails",
    element: <ProductDetails />,
  },
  {
    path: "/wishlist",
    element: <WishList />,
  },
  {
    path: "/shoppingCart",
    element: <ShoppingCart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/orderCompleted",
    element: <OrderCompleted />,
  },
  {
    path: "/myOrders",
    element: <MyOrders />,
  },
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
];

export default routes;
