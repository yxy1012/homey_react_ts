import React, { useState } from "react";
import { Card, Form, Input, Button, Modal } from "antd";
import axios from "@/axios";
import "./index.css";
import { connect } from "react-redux";
import { createStoreUserAction } from "@/redux/actions/user";
import { useNavigate } from "react-router-dom";
import utils from "@/utils";

type LoginInfo = {
  email: string,
  password: string
}

type User = {
  id: string;
  email: string;
};

interface IProps {
  storeUser: (userObj: User) => { type: string; data: User };
}

const MyAccount: React.FC<IProps> = ({ storeUser }) => {
  const [status, setStatus] = useState(1);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();

  const config = {
    title: "Warning",
    content: <p>Uncorrected password or email address</p>,
  };

  const login = ({ email, password }: LoginInfo) => {
    axios.get("/user/login/" + email + "/" + password).then((resp) => {
      const { login, email, id } = resp.data;
      if (login) {
        storeUser({ id, email });
        navigate("/home");
      } else {
        modal.warning(config);
      }
    });
  };

  return (
    <>
      <img
        className="my-account"
        src={`${utils.s3Image}myAccount.2c8d83a5.png`}
        alt="logo"
      />
      <Card className="my-account-card">
        {status ? (
          <>
            <h2>Login</h2>
            <p className="my-account-hint">
              Please login using account detail below.
            </p>
            <Form
              name="basic"
              className="my-account-form"
              autoComplete="off"
              form={loginForm}
              onFinish={login}
            >
              <Form.Item
                name="email"
                className="my-account-input"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your Email address!",
                  },
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
              <Form.Item
                name="password"
                className="my-account-input"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item className="my-account-button">
                <Button type="primary" htmlType="submit">
                  Sign in
                </Button>
              </Form.Item>
              <Form.Item>
                <span className="my-account-switch">
                  Don't have an account?
                </span>
                <Button
                  type="link"
                  style={{ color: "darkgray" }}
                  onClick={() => {
                    setStatus(0);
                  }}
                >
                  Create account
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <h2>Register</h2>
            <p className="my-account-hint">
              Please register by creating account below.
            </p>
            <Form
              name="basic"
              className="my-account-form"
              autoComplete="off"
              form={registerForm}
            >
              <Form.Item
                name="email"
                className="my-account-input"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email address!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
              <Form.Item
                name="password"
                className="my-account-input"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 8,
                    message: "The length of the password should be at least 8!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item
                name="repassword"
                className="my-account-input"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your password again!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item className="my-account-button">
                <Button type="primary"> Sign up </Button>
              </Form.Item>
              <Form.Item>
                <span className="my-account-switch">
                  Already have an account?
                </span>
                <Button
                  type="link"
                  style={{ color: "darkgray" }}
                  onClick={() => {
                    setStatus(1);
                  }}
                >
                  Go to sign in
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
      {contextHolder}
    </>
  );
};

export default connect((state: any) => ({ user: state.user }), {
  storeUser: createStoreUserAction,
})(MyAccount);
