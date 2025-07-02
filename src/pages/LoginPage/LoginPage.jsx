// src/pages/LoginPage.jsx
import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import "./LoginPage.css";

const LoginPage = () => {
  const { storeToken, authenticateUser, setIsOnProfile, isLoggedIn } =
    useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, [setIsOnProfile]);

  if (isLoggedIn) {
    nav("/profile");
    return null;
  }

  const onFinish = ({ username, password }) => {
    axios
      .post(`${API_URL}/auth/login`, { username, password })
      .then(({ data }) => {
        storeToken(data.authToken);
        return authenticateUser();
      })
      .then(() => {
        nav("/");
      })
      .catch((err) => console.log("error logging in", err));
  };

  return (
    <div id="login-page">
      <div id="login-container">
        <h2 className="login-title">Spätify Login</h2>
        <Form
          layout="vertical"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Bitte Username eingeben" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Passwort"
            rules={[
              { required: true, message: "Bitte Passwort eingeben" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Passwort"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Einloggen
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          Noch kein Account? <Link to="/signup">Jetzt registrieren!</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
