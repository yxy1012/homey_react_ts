import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import "./index.css";
import { connect } from "react-redux";
import axios from "@/axios";
import { useNavigate } from "react-router-dom";
import utils from "@/utils";

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

type OrderItem = {
  date: string,
  id: number;
  product: Product;
  quantity: number;
  status: string;
  total_amount: number;
  user: UserInfo;
}

const MyOrders: React.FC<IProps> = ({ user }) => {
  const [orderItems, setOrderItems] = useState([] as OrderItem[]);

  const navigate = useNavigate();

  const reorder = (item: any) => {
    navigate("/checkout", { state: {item} });
  };

  useEffect(() => {
    axios.get(`/orders/findByUserId/${user.id}`).then((resp) => {
      setOrderItems(resp.data);
    });
  }, [user]);
  return (
    <div>
      <img
        className="myOrders"
        src={`${utils.s3Image}myOrder.bb3e736d.png`}
        alt="myOrders"
      />
      <div className="my-orders-header">
        <h3 style={{ margin: 0 }}>Your Order History</h3>
        <p className="my-orders-results">About {orderItems.length} results</p>
      </div>
      {orderItems.map((item) => (
        <Card key={item.id} className="my-orders-card">
          <div className="my-orders-container">
            <img
              className="my-order-item-image"
              src={item.product.image}
              alt="my-order-item"
            />
            <div className="my-order-item-info">
              <h3 style={{ marginBottom: "1rem" }}>Order# {item.id}</h3>
              <div style={{ marginBottom: "0.5rem" }}>
                {utils.priceFilter(item.total_amount)}
              </div>
              <div style={{ marginBottom: "0.5rem", color: "darkgray" }}>
                {item.quantity} items
              </div>
              <div style={{ marginBottom: "0.5rem", color: "darkgray" }}>
                {item.date} - {item.status}
              </div>
              <Button type="primary" onClick={() => reorder(item)}>
                Reorder
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default connect((state: any) => ({ user: state.user }))(MyOrders);
