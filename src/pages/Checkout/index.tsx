import React, { useEffect, useState } from "react";
import { Input, Checkbox, Button, Card, Modal, Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import axios from "@/axios";
import { connect } from "react-redux";
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

type EditUserInfo = {
  address: string;
  apartment: string;
  city: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  postal_code: string;
};

type CheckoutItem = {
  id: number;
  product: Product;
  quantity: number;
  user: UserInfo;
};

type FinalItem = {
  quantity: number;
  total_amount: number;
  status: string;
  date: string;
  user: {
    id: string;
  };
  product: {
    id: number;
  };
};

const Checkout: React.FC<IProps> = ({ user }) => {
  const [checkoutItems, setCheckoutItems] = useState([] as CheckoutItem[]);
  const [subtotals, setSubTotals] = useState(0);
  const [totals, setTotals] = useState(0);
  const [shippingAndTax, setShippingAndTax] = useState(0);
  const [userInfo, setUserInfo] = useState({} as UserInfo);

  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();

  const location = useLocation();

  const successConfig = {
    title: "Success",
    content: <p>Update Successfully!</p>,
  };

  const warningUpdateConfig = {
    title: "Warning",
    content: <p>Fail to Update!</p>,
  };

  const warningCheckoutConfig = {
    title: "Warning",
    content: <p>Fail to Checkout!</p>,
  };

  const warningCalculateConfig = {
    title: "Warning",
    content: <p>Please Calculate Shipping!</p>,
  };

  const calculate = () => {
    setShippingAndTax(subtotals * 0.08 + 5);
  };

  const proceedToCheckout = () => {
    if (shippingAndTax !== 0) {
      const finalItems: FinalItem[] = [];
      checkoutItems.forEach((item) => {
        const date = new Date();
        const finalItem: FinalItem = {
          quantity: item.quantity,
          total_amount: item.product.price * item.quantity,
          status: "Completed",
          date: date.toDateString().split(" ")[1] + " " + date.getDate(),
          user: {
            id: user.id,
          },
          product: {
            id: item.product.id,
          },
        };
        finalItems.push(finalItem);
      });
      axios.post("/orders/saveAll", finalItems).then((resp) => {
        if (resp.data === "success") {
          if (!location.state) {
            axios.put("/shoppingcarts/deleteAll", checkoutItems).then(() => {
              navigate("/orderCompleted");
            });
          } else {
            navigate("/orderCompleted");
          }
        } else {
          modal.warning(warningCheckoutConfig);
        }
      });
    } else {
      modal.warning(warningCalculateConfig);
    }
  };

  const onFinish = (values: EditUserInfo) => {
    let key: keyof EditUserInfo;
    for (key in values) {
      userInfo[key] = values[key];
    }
    axios.put("/user/update", userInfo).then((resp) => {
      if (resp.data === "success") {
        setUserInfo(userInfo);
        modal.success(successConfig);
      } else {
        modal.warning(warningUpdateConfig);
      }
    });
  };

  useEffect(() => {
    if (user.id) {
      axios.get(`/user/findById/${user.id}`).then((resp) => {
        setUserInfo(resp.data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.item) {
      setCheckoutItems([location.state.item]);
    } else if (user.id) {
      axios.get("/shoppingcarts/findByUserId/" + user.id).then((resp) => {
        setCheckoutItems(resp.data);
      });
    }
  }, [user, location]);

  useEffect(() => {
    const newSubTotals = checkoutItems.reduce(
      (pre, cur) => pre + cur.quantity * cur.product.price,
      0
    );
    setSubTotals(newSubTotals);
  }, [checkoutItems]);

  useEffect(() => {
    setTotals(subtotals + shippingAndTax);
  }, [subtotals, shippingAndTax]);

  return (
    <>
      <img
        className="checkout"
        src={`${utils.s3Image}checkout.ce625668.png`}
        alt="checkout"
      />
      <div className="checkout-header">
        <h3 style={{ margin: 0 }}>Shipping Details</h3>
        <p className="checkout-tips">Enter Your Shipping Address Here!</p>
      </div>
      <div className="shipping-details-content">
        <Form
          key={userInfo.phone_number}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={userInfo}
        >
          <div className="shipping-details-info">
            <div className="shipping-details-contact-info">
              <h4 style={{ margin: "1rem 0 1rem 0" }}>Contact Information</h4>
              <Form.Item
                name="phone_number"
                className="shipping-details-form-item"
              >
                <Input
                  className="shipping-details-input"
                  placeholder="Mobile phone number"
                />
              </Form.Item>
              <Checkbox>
                Keep me up to date on news and exclusive offers
              </Checkbox>
            </div>
            <div className="shipping-details-shipping-address">
              <h4 style={{ margin: "1rem 0 1rem 0" }}>Shipping Address</h4>
              <div className="shipping-details-inputs-container">
                <Form.Item
                  name="first_name"
                  className="shipping-details-form-item"
                >
                  <Input
                    style={{ width: "19rem" }}
                    className="shipping-details-input"
                    placeholder="First name(optional)"
                  />
                </Form.Item>
                <Form.Item
                  name="last_name"
                  className="shipping-details-form-item"
                  style={{ paddingLeft: "5rem" }}
                >
                  <Input
                    style={{ width: "19rem" }}
                    className="shipping-details-input"
                    placeholder="Last name"
                  />
                </Form.Item>
              </div>
              <div className="shipping-details-inputs-container">
                <Form.Item
                  name="address"
                  className="shipping-details-form-item"
                >
                  <Input
                    className="shipping-details-input"
                    placeholder="Address"
                  />
                </Form.Item>
              </div>
              <div className="shipping-details-inputs-container">
                <Form.Item
                  name="apartment"
                  className="shipping-details-form-item"
                >
                  <Input
                    className="shipping-details-input"
                    placeholder="Apartment, suit, etc(optional)"
                  />
                </Form.Item>
              </div>
              <div className="shipping-details-inputs-container">
                <Form.Item name="city" className="shipping-details-form-item">
                  <Input
                    className="shipping-details-input"
                    placeholder="City"
                  />
                </Form.Item>
              </div>
              <div className="shipping-details-inputs-container">
                <div className="shipping-details-form-item">
                  <Input
                    style={{ width: "19rem" }}
                    className="shipping-details-input"
                    placeholder="United States"
                    disabled
                  />
                </div>
                <Form.Item
                  name="postal_code"
                  className="shipping-details-form-item"
                  style={{ paddingLeft: "5rem" }}
                >
                  <Input
                    style={{ width: "19rem" }}
                    className="shipping-details-input"
                    placeholder="Postal Code"
                  />
                </Form.Item>
              </div>
              <div className="shipping-details-info-buttons-container">
                <div className="shipping-details-form-item">
                  <Button type="primary" onClick={calculate}>
                    Calculate Shipping
                  </Button>
                </div>
                <Form.Item
                  className="shipping-details-form-item"
                  style={{ paddingLeft: "5rem" }}
                >
                  <Button type="primary" htmlType="submit">
                    Update Information
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
        <div className="checkout-items-side-container">
          {checkoutItems.map((item) => (
            <div key={item.id}>
              <div className="checkout-item">
                <img
                  className="checkout-item-image"
                  src={item.product.image}
                  alt="checkout"
                />
                <div>
                  <h5 style={{ marginBottom: 0 }}>{item.product.name}</h5>
                  <span style={{ color: "darkgray", fontSize: "small" }}>
                    {utils.priceFilter(item.product.price)}
                  </span>
                  <span
                    style={{
                      color: "darkgray",
                      fontSize: "small",
                      marginLeft: "2rem",
                    }}
                  >
                    *{item.quantity}
                  </span>
                </div>
                <div style={{ margin: "2rem 0 0 3rem" }}>
                  {utils.priceFilter(item.product.price * item.quantity)}
                </div>
              </div>
              <div className="checkout-bottom-line"></div>
            </div>
          ))}
          <Card className="checkout-totals-table">
            <div className="checkout-totals-table-items">
              <h3 style={{ textAlign: "left", margin: "0 0 0 0.5rem" }}>
                Subtotals:
              </h3>
              <span>{utils.priceFilter(subtotals)}</span>
            </div>
            <div className="checkout-bottom-line"></div>
            <div className="checkout-totals-table-items">
              <h3 style={{ textAlign: "left", margin: "0 0 0 0.5rem" }}>
                Shipping & Tax:
              </h3>
              <span>{utils.priceFilter(shippingAndTax)}</span>
            </div>
            <div className="checkout-bottom-line"></div>
            <div className="checkout-totals-table-items">
              <h3 style={{ textAlign: "left", margin: "0 0 0 0.5rem" }}>
                Totals:
              </h3>
              <span>{utils.priceFilter(totals)}</span>
            </div>
            <div className="checkout-bottom-line"></div>
            <Button
              style={{
                backgroundColor: " rgb(98, 206, 121)",
                color: "#FFFFFF",
                width: "100%",
                marginTop: "1rem",
              }}
              onClick={proceedToCheckout}
            >
              Proceed To Checkout
            </Button>
          </Card>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }))(Checkout);
