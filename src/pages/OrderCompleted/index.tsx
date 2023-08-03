import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import utils from "@/utils";

const OrderCompleted: React.FC = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/home");
  };
  return (
    <div>
      <img
        className="order-completed"
        src={`${utils.s3Image}orderCompleted.ffbcda52.png`}
        alt="order-completed"
      />
      <div className="order-completed-content">
        <img
          className="order-completed-content-image"
          src={`${utils.s3Image}oderIsCompleted.9312ef4a.png`}
          alt="order-completed-content"
        />
        <Button
          onClick={backHome}
          type="primary"
          className="order-completed-continue-button"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderCompleted;
