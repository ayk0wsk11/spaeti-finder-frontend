import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Switch, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { useSpaetiContext } from "../../context/spaeti.context";
import { awardXP, XP_REWARDS } from "../../utils/xpSystem";
import BackButton from "../../components/BackButton/BackButton";
import "./ChangeRequestForm.css";

const ChangeRequestForm = () => {
  const { spaetiId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { getSpaeti } = useSpaetiContext();
  const [changes, setChanges] = useState({
    name: "",
    proposedSterni: 0,
    seats: false,
    wc: false,
  });
  const [oneSpaeti, setOneSpaeti] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  // Get Späti from context instead of API call
  useEffect(() => {
    const spaetiFromContext = getSpaeti(spaetiId);
    if (spaetiFromContext) {
      setOneSpaeti(spaetiFromContext);
    } else {
      // Fallback: fetch from API if not in context yet
      const fetchSpaeti = async () => {
        const { data } = await axios.get(`${API_URL}/spaetis/${spaetiId}`);
        setOneSpaeti(data.data);
      };
      fetchSpaeti();
    }
  }, [spaetiId, getSpaeti]);

  // Initialize form values when oneSpaeti loads
  useEffect(() => {
    if (oneSpaeti) {
      setChanges({
        name: oneSpaeti.name || "",
        proposedSterni: oneSpaeti.sternAvg || 0,
        seats: oneSpaeti.seats || false,
        wc: oneSpaeti.wc || false,
      });
      
      // Set form values
      form.setFieldsValue({
        name: oneSpaeti.name || "",
        proposedSterni: oneSpaeti.sternAvg || 0,
        seats: oneSpaeti.seats || false,
        wc: oneSpaeti.wc || false,
      });
    }
  }, [oneSpaeti, form]);

  if (!currentUser) {
    return <p>Loading user info...</p>;
  }
  if (!oneSpaeti) {
    return <p>Loading spaeti data...</p>;
  }

  const handleFileChange = (info) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj) {
        setFile(fileObj);
        setPreview(URL.createObjectURL(fileObj));
      }
    } else {
      // when deleted or empty
      setFile(null);
      setPreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChanges((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("authToken");
      
      const formData = new FormData();
      formData.append("spaetiId", spaetiId);
      formData.append("userId", currentUser._id);
      formData.append("changes", JSON.stringify(values));
      
      if (file) {
        formData.append("image", file);
      }

      console.log("Submitting change request:", {
        spaetiId,
        userId: currentUser._id,
        changes: values,
        hasImage: !!file
      });

      await axios.post(`${API_URL}/tickets`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      // Note: XP will be awarded when the change request is approved, not when submitted
      message.success("Change request submitted successfully! XP will be awarded when approved.");
      form.resetFields();
      setPreview(null);
      setFile(null);
    } catch (err) {
      console.error("Error submitting change request:", err);
      message.error("Error submitting change request");
    }
  };

  return (
    <div className="change-request-form">
      <BackButton to={`/spaeti/details/${spaetiId}`}>Zurück zu Details</BackButton>
      
      <h2>Change Request for {oneSpaeti?.name}</h2>
      
      <Form 
        form={form}
        layout="vertical" 
        onFinish={onFinish} 
        className="spaeti-form"
      >
        <Form.Item
          name="name"
          label="Name of the Späti"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="Späti Name" />
        </Form.Item>

        <Form.Item label="New Image (optional)">
          <Upload
            name="image"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            accept="image/jpeg,image/png"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>

          {preview && (
            <img src={preview} alt="Preview" className="image-preview" />
          )}
        </Form.Item>

        <Form.Item
          name="proposedSterni"
          label="Proposed Sterni-Index (€)"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <Input type="number" step="0.1" placeholder="e.g. 1.20" />
        </Form.Item>

        <Form.Item name="wc" label="Toilet" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item name="seats" label="Seating" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Change Request
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeRequestForm;
