import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ZoomInOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import "./index.css";
import axios from "@/axios";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import utils from "@/utils";

type User = {
  id: string;
  email: string;
};

interface IProps {
  user: User;
}

type Product = {
  code: string;
  description: string;
  id: number;
  image: string;
  name: string;
  original_price: number;
  price: number;
  quantity: number;
  type: number;
};

type UserInfo = {
  address: string;
  apartment: string;
  city: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone_number: string;
  postal_code: string;
  username: string;
};

type WishListItem = {
  dateAdded: null;
  id: number;
  product: Product;
  user: UserInfo;
};

const Wishlist: React.FC<IProps> = ({ user }) => {
  const [wishlist, setWishlist] = useState([] as WishListItem[]);

  const [modal, contextHolder] = Modal.useModal();

  const [messageApi, contextHolderMessage] = message.useMessage();

  const navigate = useNavigate();

  const successConfig = {
    title: "Success",
    content: <p>Add Successfully!</p>,
  };
  const warningConfig = {
    title: "Warning",
    content: <p>Fail to Add!</p>,
  };

  const addToCart = (product: Product) => {
    const shoppingCarts = {
      quantity: 1,
      user: { id: user.id },
      product: { id: product.id },
    };
    axios.post("/shoppingcarts/save", shoppingCarts).then((resp) => {
      if (resp.data === "success") {
        modal.success(successConfig);
      } else {
        modal.warning(warningConfig);
      }
    });
  };

  const goToDetails = (product: Product) => {
    navigate("/productDetails", { state: { item: product } });
  };

  const removeItem = (id: number) => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to remove this item ?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        axios.delete(`/wishlist/deleteById/${id}`).then(() => {
          setWishlist(wishlist.filter((item) => item.id !== id));
          messageApi.open({
            type: "success",
            content: "Remove Successfully"
          });
        });
      },
      onCancel: () => {
        messageApi.open({
          type: 'warning',
          content: 'Cancel Removing',
        });
      }
    });
  };

  useEffect(() => {
    if (user.id) {
      axios.get(`/wishlist/findByUserId/${user.id}`).then((resp) => {
        setWishlist(resp.data);
      });
    }
  }, [user]);

  return (
    <>
      <img
        className="wishlist"
        src={`${utils.s3Image}wishlist.963180e6.png`}
        alt="wishlist"
      />
      <div className="wishlist-header">
        <h3 style={{ margin: 0 }}>My Wishlist</h3>
        <p className="wishlist-results">About {wishlist.length} results</p>
      </div>
      {wishlist.map((item) => (
        <Card className="wishlist-card" key={item.id}>
          <div className="wishlist-container">
            <div>
              <img
                className="wishlist-item-image"
                src={item.product.image}
                alt="wishlist-item"
              />
            </div>
            <div>
              <h3>{item.product.name}</h3>
              <span>{utils.priceFilter(item.product.price)}</span>
              <span
                style={{
                  color: "red",
                  textDecoration: "line-through",
                  marginLeft: "0.5rem",
                }}
              >
                {utils.priceFilter(item.product.original_price)}
              </span>
              <p style={{ color: "darkgray" }}>{item.product.description}</p>
              <Button
                shape="circle"
                style={{ marginRight: "0.5rem" }}
                icon={<ShoppingCartOutlined />}
                onClick={() => addToCart(item.product)}
              />
              <Button
                shape="circle"
                style={{ marginRight: "0.5rem" }}
                icon={<ZoomInOutlined />}
                onClick={() => goToDetails(item.product)}
              />
              <Button
                shape="circle"
                style={{ marginRight: "0.5rem" }}
                type="primary"
                icon={<HeartOutlined />}
                onClick={() => removeItem(item.id)}
              />
            </div>
          </div>
        </Card>
      ))}
      {contextHolder}
      {contextHolderMessage}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }))(Wishlist);
