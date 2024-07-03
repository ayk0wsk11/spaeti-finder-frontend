import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import "./LoginPage.css";

const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const nav = useNavigate();

  const onFinish = ({ username, password }) => {
    console.log("username: ", username);
    console.log("password: ", password);
    axios
      .post(`${API_URL}/auth/login`, { username, password })
      .then(({ data }) => {
        console.log("then 1");
        storeToken(data.authToken);
        return authenticateUser();
      })
      .then(() => {
        console.log("then 2");
        nav("/");
      })
      .catch((err) => console.log("error logging in", err));
  };

  return (
    <div id="login-page">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            
            Log in
          </Button>
          Or <Link to="/signup">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
