// src/pages/SpaetiCreatePage.jsx
import React, { useContext, useState, useEffect } from "react";
import { Form, Input, Button, Switch, Upload, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { useSpaetiContext } from "../../context/spaeti.context";
import { API_URL } from "../../config";
import BackButton from "../../components/BackButton/BackButton";
import "./SpaetiCreatePage.css";

const SpaetiCreatePage = () => {
  const { currentUser, setIsOnProfile } = useContext(AuthContext);
  const { addSpaeti, refreshSpaetis } = useSpaetiContext();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setIsOnProfile(false);
  }, [setIsOnProfile]);

  const geocodeAddress = async (address) => {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await resp.json();
    if (data.length) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  const handleFileChange = (info) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj) {
        setFile(fileObj);
        setPreview(URL.createObjectURL(fileObj));
      }
    } else {
      // wenn gelöscht oder leer
      setFile(null);
      setPreview(null);
    }
  };

  const onFinish = async (values) => {
    const { name, street, zip, city, sterni, wc, seats } = values;
    const coords = await geocodeAddress(`${street}, ${zip} ${city}`);
    if (!coords) {
      message.error("Adresse konnte nicht gefunden werden");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("image", file, file.name);
    formData.append("street", street);
    formData.append("zip", zip);
    formData.append("city", city);
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);
    formData.append("sterni", sterni);
    formData.append("wc", wc);
    formData.append("seats", seats);
    formData.append("creator", currentUser._id);
    formData.append("approved", false);

    try {
      const response = await axios.post(`${API_URL}/spaetis`, formData);
      addSpaeti(response.data.data); // Add the new Späti to context
      setIsModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Fehler beim Erstellen des Spätis");
    }
  };

  return (
    <div id="add-container">
      <BackButton to="/spaeti/list">Zurück zur Liste</BackButton>

      <Modal
        title="Späti erfolgreich erstellt!"
        open={isModalVisible}
        maskClosable={false}
        closable={false}
        footer={[
          <Button type="primary" key="continue" onClick={() => nav("/")}>
            Continue
          </Button>,
        ]}
      >
        <p>
          Danke für das hinzufügen! Sobald dein Späti freigeschaltet ist,
          erscheint er auf der Karte.
        </p>
      </Modal>

      <BackButton />

      <Form 
        layout="vertical" 
        onFinish={onFinish} 
        className="spaeti-form"
        initialValues={{
          wc: false,
          seats: false
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Bitte Name eingeben" }]}
        >
          <Input placeholder="Späti Name" />
        </Form.Item>

        <Form.Item label="Bild (optional)">
          <Upload
            name="image"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            accept="image/jpeg,image/png"
          >
            <Button icon={<UploadOutlined />}>Bild auswählen</Button>
          </Upload>

          {preview && (
            <img src={preview} alt="Preview" className="image-preview" />
          )}
        </Form.Item>

        <Form.Item label="Adresse" required>
          <Input.Group compact>
            <Form.Item
              name="street"
              noStyle
              rules={[{ required: true, message: "Straße eingeben" }]}
              style={{ width: "60%" }}
            >
              <Input placeholder="Straße + Nr." />
            </Form.Item>
            <Form.Item
              name="zip"
              noStyle
              rules={[
                { required: true, message: "PLZ eingeben" },
                { len: 5, message: "PLZ muss 5 Stellen haben" },
              ]}
              style={{ width: "20%", marginLeft: 8 }}
            >
              <Input placeholder="PLZ" maxLength={5} />
            </Form.Item>
            <Form.Item
              name="city"
              noStyle
              rules={[{ required: true, message: "Stadt eingeben" }]}
              style={{ width: "20%", marginLeft: 8 }}
            >
              <Input placeholder="Stadt" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          name="sterni"
          label="Sterni-Index (€)"
          rules={[{ required: true, message: "Preis eingeben" }]}
        >
          <Input type="number" step="0.1" placeholder="z.B. 1.20" />
        </Form.Item>

        <Form.Item name="wc" label="Toilette" valuePropName="checked">
          <Switch checkedChildren="Ja" unCheckedChildren="Nein" />
        </Form.Item>

        <Form.Item
          name="seats"
          label="Sitzmöglichkeiten"
          valuePropName="checked"
        >
          <Switch checkedChildren="Ja" unCheckedChildren="Nein" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Späti hinzufügen
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SpaetiCreatePage;
