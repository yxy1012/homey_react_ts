import React from "react";
import { Button, Modal } from "antd";
import "./index.css";
import axios from "@/axios";
import { connect } from "react-redux";
import utils from "@/utils";

const uniqueProduct = {
  id: 2,
  src: `${utils.s3Image}uniqueProduct.e18fcd6c.png`,
  details: [
    "All frames constructed with hardwood solids and laminates",
    "Reinforced with wood dowels, glue, screw-nails corner blocks and machine nails",
    "Arms, backs and seats are structurally reinforced",
  ],
  name: "B&B Italian Sofa",
  price: 135,
};

type User = {
  id: string,
  email: string
}

interface IProps{
  user: User
}

const UniqueProduct: React.FC<IProps> = ({ user }) => {
  const [modal, contextHolder] = Modal.useModal();
  const shoppingCart = {
    user: { id: user.id },
    product: { id: uniqueProduct.id },
    quantity: 1,
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
    axios.post("/shoppingcarts/save", shoppingCart).then((resp) => {
      if (resp.data === "success") {
        modal.success(successConfig);
      } else {
        modal.warning(warningConfig);
      }
    });
  };
  return (
    <>
      <div className="unique-product">
        <img
          src={uniqueProduct.src}
          className="unique-product-image"
          alt="img"
        />
        <div className="unique-product-description">
          <h1>Unique Features of Latest & Trending Products</h1>
          <ul>
            {uniqueProduct.details.map((item, index) => (
              <li key={index} className="unique-product-description-item">
                {item}
              </li>
            ))}
          </ul>
          <div className="unique-product-detail">
            <Button type="primary" onClick={addToCart}>
              Add To Cart
            </Button>
            <ul className="unique-product-detail-ul">
              <li>{uniqueProduct.name}</li>
              <li>{utils.priceFilter(uniqueProduct.price)}</li>
            </ul>
          </div>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }))(UniqueProduct);
