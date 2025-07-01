// src/pages/SignUpPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Avatar, Modal, Row, Col, Alert } from "antd";
import "./SignUpPage.css";

// Pre-import your 5 avatar images from src/assets:
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";
import avatar5 from "../../assets/avatar5.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

const SignupPage = () => {
  const { setIsOnProfile, isLoggedIn } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(avatars[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
    if (isLoggedIn) nav("/profile");
  }, [isLoggedIn, nav, setIsOnProfile]);

  const onFinish = async ({ username, email, password, passwordRepeat }) => {
    if (password !== passwordRepeat) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    try {
      // send JSON with image URL string
      await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
        image: selectedImage,
      });
      nav("/login");
    } catch (err) {
      console.error(err);
      setError("Sign up failed. Try a different username or email.");
    }
  };

  return (
    <div id="signup-page">
      <Form
        name="signup"
        className="signup-form"
        layout="vertical"
        onFinish={onFinish}
      >
        {error && <Alert message={error} type="error" showIcon closable />}

        <Form.Item label="Avatar">
          <Avatar size={64} src={selectedImage} />
          <Button
            type="link"
            onClick={() => setModalVisible(true)}
            className="change-image-btn"
          >
            Change image
          </Button>
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="passwordRepeat"
          label="Repeat Password"
          rules={[{ required: true, message: "Please confirm your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Repeat Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign Up
          </Button>
          <div className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </Form.Item>
      </Form>

      <Modal
        title="Choose Your Avatar"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Row gutter={[16, 16]}>
          {avatars.map((img, idx) => (
            <Col key={idx} span={8} className="avatar-choice">
              <Avatar
                size={64}
                src={img}
                onClick={() => {
                  setSelectedImage(img);
                  setModalVisible(false);
                }}
                className="avatar-option"
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default SignupPage;
