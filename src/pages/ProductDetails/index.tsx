import React, { useEffect, useState } from "react";
import { Card, InputNumber, Button, Modal } from "antd";
import {
  HeartOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import "./index.css";
import axios from "@/axios";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import utils from "@/utils";

const shareIcons = [
  <FacebookOutlined />,
  <InstagramOutlined />,
  <TwitterOutlined />,
];

type User = {
  id: string;
  email: string;
};

interface IProps{
  user: User
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
  detailImages: string[];
};

const ProductDetails: React.FC<IProps> = ({ user }) => {
  const location = useLocation();
  const product: Product = location.state.item;
  product.detailImages = [product.image, product.image, product.image];
  const [productDetails, setProductDetails] = useState(product);
  const [quantity, setQuantity] = useState(1);

  const [modal, contextHolder] = Modal.useModal();

  const onChange = (value: number | null) => {
    if(value != null) setQuantity(value);
  };
  const successConfig = {
    title: "Success",
    content: <p>Add Successfully!</p>,
  };
  const warningConfig = {
    title: "Warning",
    content: <p>Fail to Add!</p>,
  };
  const addToCart = () => {
    const shoppingCarts = {
      quantity: quantity,
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
  const addToWishlist = () => {
    const wishItem = {
      user: { id: user.id },
      product: { id: product.id },
    };
    axios.post("/wishlist/save", wishItem).then((resp) => {
      if (resp.data === "success") {
        modal.success(successConfig);
      } else {
        modal.warning(warningConfig);
      }
    });
  };
  useEffect(() => {
    setProductDetails(product);
  }, [product]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <img
        className="product-details"
        src={`${utils.s3Image}productDetailsImage.1548201d.png`}
        alt="product-details"
      />
      <Card className="product-details-card">
        <div className="product-details-container">
          <div className="product-details-side-images-container">
            {productDetails.detailImages.map((item, index) => (
              <div key={index}>
                <img
                  className="product-details-side-image"
                  src={item}
                  alt="sideImage"
                />
              </div>
            ))}
          </div>
          <div className="product-details-main-image-container">
            <img
              className="product-details-main-image"
              src={productDetails.image}
              alt="mainImage"
            />
          </div>
          <div className="product-details-info-container">
            <h1>{productDetails.name}</h1>
            <span style={{ fontSize: "1.5rem" }}>
              {utils.priceFilter(productDetails.price)}
            </span>
            <span
              style={{
                color: "red",
                textDecoration: "line-through",
                marginLeft: "0.5rem",
                fontSize: "1.5rem",
              }}
            >
              {utils.priceFilter(productDetails.original_price)}
            </span>
            <p style={{ color: "darkgray" }}>{productDetails.description}</p>
            <div className="product-details-icons">
              <InputNumber
                min={1}
                max={10}
                defaultValue={quantity}
                onChange={onChange}
              />
              <Button
                type="link"
                style={{ fontSize: "1rem" }}
                onClick={addToCart}
              >
                Add to Cart
              </Button>
              <Button
                type="link"
                style={{ fontSize: "1.5rem", paddingBottom: "2.5rem" }}
                icon={<HeartOutlined />}
                onClick={addToWishlist}
              ></Button>
            </div>
            <div className="product-details-share">
              <h3>Share</h3>
              {shareIcons.map((item, index) => (
                <Button
                  key={index}
                  type="link"
                  style={{ fontSize: "1.5rem", padding: "0" }}
                  icon={item}
                ></Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      {contextHolder}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }))(ProductDetails);
