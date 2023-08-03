import React, { useEffect, useState } from "react";
import { Table, InputNumber, Button, Card, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import tip from "@/assets/tip.png";
import axios from "@/axios";
import { connect } from "react-redux";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
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

type ShoppingCartItem = {
  id: number;
  product: Product;
  quantity: number;
  user: UserInfo;
};

const ShoppingCart: React.FC<IProps> = ({ user }) => {
  const [data, setData] = useState([] as ShoppingCartItem[]);
  const [subtotals, setSubTotals] = useState(0);
  const [totals, setTotals] = useState(0);

  const [messageApi, contextHolderMessage] = message.useMessage();

  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();

  const successConfig = {
    title: "Success",
    content: <p>Update Successfully!</p>,
  };
  const warningConfig = {
    title: "Warning",
    content: <p>Fail to Update!</p>,
  };

  const removeItem = (id: number) => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to remove this item ?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        axios.delete(`/shoppingcarts/deleteById/${id}`).then(() => {
          setData(data.filter((item) => item.id !== id));
          messageApi.open({
            type: "success",
            content: "Remove Successfully",
          });
        });
      },
      onCancel: () => {
        messageApi.open({
          type: "warning",
          content: "Cancel Removing",
        });
      },
    });
  };

  const updateCart = () => {
    axios.put("/shoppingcarts/update", data).then((resp) => {
      if (resp.data === "success") {
        modal.success(successConfig);
      } else {
        modal.warning(warningConfig);
      }
    });
  };

  const clearCart = () => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to remove all items ?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        axios.put("/shoppingcarts/deleteAll", data).then(() => {
          setData([]);
          messageApi.open({
            type: "success",
            content: "Successfully Remove All Items",
          });
        });
      },
      onCancel: () => {
        messageApi.open({
          type: "warning",
          content: "Cancel Removing All Items",
        });
      },
    });
  };

  useEffect(() => {
    if (user.id) {
      axios.get("/shoppingcarts/findByUserId/" + user.id).then((resp) => {
        setData(resp.data);
      });
    }
  }, [user]);

  useEffect(() => {
    const newTotal = data.reduce(
      (pre, cur) => pre + cur.quantity * cur.product.price,
      0
    );
    setSubTotals(newTotal);
    setTotals(newTotal);
  }, [data]);

  const columns = [
    {
      title: <h2>Product</h2>,
      dataIndex: "product",
      key: "name",
      render: (
        { image, name }: { image: string; name: string },
        { id }: { id: number }
      ) => (
        <div className="shopping-cart-product">
          <img
            className="shopping-cart-product-image"
            src={image}
            alt="product"
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            className="shopping-cart-product-delete"
            onClick={() => removeItem(id)}
          ></Button>
          <h4>{name}</h4>
        </div>
      ),
    },
    {
      title: <h2>Price</h2>,
      dataIndex: "product",
      key: "price",
      render: ({ price }: { price: number }) => <>{utils.priceFilter(price)}</>,
    },
    {
      title: <h2>Quantity</h2>,
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, { id }: { id: number }) => (
        <InputNumber
          min={1}
          max={10}
          defaultValue={quantity}
          onChange={(value) => changeQuantity(value, id)}
        />
      ),
    },
    {
      title: <h2>Total</h2>,
      dataIndex: "product",
      key: "total",
      render: (
        { price }: { price: number },
        { quantity }: { quantity: number }
      ) => <>{utils.priceFilter(price * quantity)}</>,
    },
  ];

  const changeQuantity = (value: number | null, id: number) => {
    let newData = data.map((item) => {
      if (item.id === id && value != null) item.quantity = value;
      return item;
    });
    setData(newData);
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <img
        className="shoppingCart"
        src={`${utils.s3Image}shoppingCartImage.2b896a28.png`}
        alt="shoppingCart"
      />
      <div className="shopping-cart-content">
        <div className="shopping-cart-table-container">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
          />
          <div className="shopping-cart-table-buttons">
            <Button type="primary" onClick={updateCart}>
              Update Cart
            </Button>
            <Button type="primary" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
        <div className="shopping-cart-totals">
          <h2>Cart Totals</h2>
          <Card className="shopping-cart-totals-table">
            <div className="shopping-cart-totals-table-subtotals">
              <h3 style={{ textAlign: "left", margin: "0 0 0 0.5rem" }}>
                Subtotals:
              </h3>
              <span>{utils.priceFilter(subtotals)}</span>
            </div>
            <div className="shopping-cart-bottom-line"></div>
            <div className="shopping-cart-totals-table-totals">
              <h3 style={{ textAlign: "left", margin: "0 0 0 0.5rem" }}>
                Totals:
              </h3>
              <span>{utils.priceFilter(totals)}</span>
            </div>
            <div className="shopping-cart-bottom-line"></div>
            <div style={{ display: "flex" }}>
              <div style={{ margin: "0.3rem" }}>
                <img
                  className="tip"
                  src={tip}
                  alt="tip"
                  style={{ width: "2rem" }}
                />
              </div>
              <div>Shipping & taxes calculated at checkout</div>
            </div>
            <Button
              style={{
                backgroundColor: " rgb(98, 206, 121)",
                color: "#FFFFFF",
                width: "100%",
                marginTop: "1rem",
              }}
              onClick={goToCheckout}
            >
              Proceed To Checkout
            </Button>
          </Card>
        </div>
      </div>
      {contextHolder}
      {contextHolderMessage}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }))(ShoppingCart);
