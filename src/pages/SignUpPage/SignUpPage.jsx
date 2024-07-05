import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import { useEffect, useContext, useState } from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "./SignUpPage.css";

const SignupPage = () => {
  const { setIsOnProfile, isLoggedIn } = useContext(AuthContext);

  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, []);

  if (isLoggedIn) nav("/profile");

  const onFinish = ({ username, email, password, passwordRepeat }) => {
    if (password !== passwordRepeat) {
      console.log("passwords are not equal");
      return;
    }
    const myFormData = new FormData();
    myFormData.append("username", username);
    myFormData.append("email", email);
    myFormData.append("password", password);

    axios
      .post(`${API_URL}/auth/signup`, myFormData)
      .then((res) => {
        nav("/login");
      })
      .catch((err) => console.log("error while creating new user", err));
  };

  return (
    <div id="signup-page">
      <Form name="normal_login" className="signup-form" onFinish={onFinish}>
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
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            tyoe="email"
            placeholder="Email"
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

        <Form.Item
          name="passwordRepeat"
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
          <Button
            type="primary"
            htmlType="submit"
            className="signup-form-button"
          >
            Sign up
          </Button>
          Signed up already? <Link to="/login">Log in!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SignupPage;
