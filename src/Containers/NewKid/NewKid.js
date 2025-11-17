import { Button, Form, Input, Modal, Select } from "antd";
import { DatePicker } from "antd-jalali";
import { useForm } from "antd/lib/form/Form";
import Logo from "../../Components/Logo/Logo";
import axios from "axios";
import { useState } from "react";

const NewKid = () => {
  const [loading, setLoading] = useState(false);
  const URL = "https://api.javaaneha.ir/api2";

  const addNewKid = (values) => {
    setLoading(true);
    const birth_date = new Date(values.birth_date).toISOString().substring(0, 10)
    console.log(birth_date)
    axios
      .post(URL + "/addkid", { ...values, birth_date })
      .then((res) => {
        Modal.success({ title: "ثبت نام با موفقیت انجام شد." });
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({ title: "ثبت نام با مشکل مواجه شد، مجددا اقدام کنید." });
        setLoading(false);
      });
  };

  const [form] = useForm();
  return (
    <div className="form">
      <Logo />
      <h2>فرم ثبت نام غرفه کودک</h2>
      <Form
        onFinish={(values) => {
          addNewKid(values)
        }}
        scrollToFirstError={true}
        layout="vertical"
        form={form} style={{ width: "100%" }}>
        <Form.Item
          label="نام کودک"
          name="first_name"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="نام خانوادگی کودک"
          name="last_name"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="تاريخ تولد کودک"
          name="birth_date"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="جنسیت کودک"
          name="gender"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Select placeholder="انتخاب کنید" dropdownClassName="form-select">
            <Select.Option value="FE"> دختر</Select.Option>
            <Select.Option value="MA">پسر</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="نام شما"
          name="caretaker_name"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="نسبت شما با کودک "
          name="caretaker"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="شماره تماس شما"
          name="caretaker_phone_number"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="شماره تماس اضطراری"
          name="emergancy_calls"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="آیا کودک شما به تنهایی به دستشویی می رود؟"
          name="wc"
          rules={[
            {
              required: true,
              message: "پر کردن این فیلد اجباری است.",
            },
          ]}
        >
          <Select placeholder="انتخاب کنید" dropdownClassName="form-select">
            <Select.Option value={true}> بله</Select.Option>
            <Select.Option value={false}>خیر</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className="submit-button-container">
          <Button
            loading={loading}
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            className="submit-button"
          >
            ثبت نام
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewKid;
