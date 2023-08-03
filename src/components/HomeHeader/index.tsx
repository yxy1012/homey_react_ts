import React, { Fragment } from "react";
import { useState } from "react";
import { Button, Menu, Input, Popover } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./index.css";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createRemoveUserAction } from "@/redux/actions/user";
import utils from "@/utils";

const { Search } = Input;

type User = {
  id: string;
  email: string;
};

interface IProps {
  user: User;
  removeUser: () => { type: string };
};

const HomeHeader: React.FC<IProps> = ({ user, removeUser }) => {
  const [current, setCurrent] = useState("logo");
  const onClick = (e: any) => {
    setCurrent(e.key);
  };

  const navigate = useNavigate();

  const content = () => (
    <Button type="primary" className="pageHeader-item" onClick={logOut}>
      Log Out
    </Button>
  );

  const logOut = () => {
    removeUser();
  };

  const goToWishlist = () => {
    if (user.id) {
      navigate("/wishlist");
    } else {
      navigate("/myAccount");
    }
  };

  const goToShoppingCart = () => {
    if (user.id) {
      navigate("/shoppingCart");
    } else {
      navigate("/myAccount");
    }
  };

  const items = [
    {
      label: (
        <Link to="/home">
          <img
            className="menuItem logo"
            src={`${utils.s3Image}logo.964fb4aa.png`}
            alt="logo"
          />
        </Link>
      ),
      key: "logo",
    },
    {
      label: (
        <Link to="/home">
          <div className="menuItem">Home</div>
        </Link>
      ),
      key: "home",
    },
    {
      label: (
        <Link to="/shopCatalog">
          <div className="menuItem">Shop</div>
        </Link>
      ),
      key: "shop",
    },
    {
      label: user.id ? (
        <Link to="/myOrders">
          <div className="menuItem">My Orders</div>
        </Link>
      ) : (
        <Link to="/myAccount">
          <div className="menuItem">My Orders</div>
        </Link>
      ),
      key: "order",
    },
  ];

  return (
    <Fragment>
      <div className="pageHeader">
        <Button type="link" className="pageHeader-item" onClick={goToWishlist}>
          Wishlist
          <HeartOutlined />
        </Button>
        <Button
          type="link"
          className="pageHeader-item"
          onClick={goToShoppingCart}
        >
          Shopping Cart
          <ShoppingCartOutlined />
        </Button>
        {user.id ? (
          <Popover content={content} placement="bottom">
            <Button type="link" className="pageHeader-item">
              {user.email}
              <UserOutlined />
            </Button>
          </Popover>
        ) : (
          <Button type="link" className="pageHeader-item">
            <Link to="/myAccount">
              Login
              <UserOutlined />
            </Link>
          </Button>
        )}
      </div>
      <div className="topMenu">
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
        <Search
          style={{ width: "15rem" }}
          placeholder="input search text"
          enterButton
        />
      </div>
    </Fragment>
  );
};

export default connect((state: any) => ({ user: state.user }), {
  removeUser: createRemoveUserAction,
})(HomeHeader);
