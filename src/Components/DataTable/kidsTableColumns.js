import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Tag } from "antd";
import { toEnglishDigit, toPersianDigit } from "../../utils/digits";

export function buildKidsTableColumns({
  data,
  getDataIndex,
  getColumnSearchProps,
  renderPhone,
  entryHandler,
  deliverHandler,
  undoHandler,
  updateKidField,
}) {
  return [
    {
      title: "نام",
      dataIndex: "first_name",
      key: "first_name",
      align: "right",
      width: 130,
      ellipsis: true,
      ...getColumnSearchProps("first_name"),
    },
    {
      title: "نام‌خانوادگی",
      dataIndex: "last_name",
      key: "last_name",
      align: "right",
      width: 140,
      ellipsis: true,
      ...getColumnSearchProps("last_name"),
    },
    {
      title: "جنسیت",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 110,
      filters: [
        { text: "دختر", value: "FE" },
        { text: "پسر", value: "MA" },
        { text: "نامشخص", value: "NO" },
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (text, record) => {
        const gender = record.gender;
        const dataIndex = getDataIndex(record);
        const dataArray = data || [];
        if (gender === "MA") {
          return <Tag color="geekblue">پسر</Tag>;
        }
        if (gender === "FE") {
          return <Tag color="magenta">دختر</Tag>;
        }
        return (
          <Select
            style={{ width: "100%" }}
            value={
              dataIndex !== -1 && dataArray[dataIndex].gender === "NO"
                ? ""
                : dataArray[dataIndex]?.gender
            }
            onChange={(value) => {
              if (dataIndex === -1) return;
              updateKidField(dataIndex, "gender", value ? value.toString() : "");
            }}
          >
            <Select.Option value="FE">دختر</Select.Option>
            <Select.Option value="MA">پسر</Select.Option>
          </Select>
        );
      },
    },
    {
      title: "شماره",
      dataIndex: "number",
      align: "center",
      width: 100,
      ...getColumnSearchProps("number"),
      sorter: (a, b) =>
        +toEnglishDigit(a.number) - +toEnglishDigit(b.number),
      render: (text, record) => {
        const dataIndex = getDataIndex(record);
        const dataArray = data || [];
        if (record.status === "NO") {
          return (
            <Input
              className="number-input"
              onChange={(event) => {
                if (dataIndex === -1) return;
                updateKidField(
                  dataIndex,
                  "number",
                  event.target.value
                    ? toEnglishDigit(event.target.value.toString())
                    : "0"
                );
              }}
              value={
                dataIndex !== -1 && dataArray[dataIndex].number === "000"
                  ? ""
                  : dataIndex !== -1
                    ? dataArray[dataIndex].number
                    : text
              }
            />
          );
        }
        return <span>{toPersianDigit(text)}</span>;
      },
    },
    {
      title: "سن",
      dataIndex: "age",
      key: "age",
      align: "center",
      width: 70,
      ...getColumnSearchProps("age"),
      sorter: (a, b) => +a.age - +b.age,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "WC",
      dataIndex: "wc",
      key: "wc",
      align: "center",
      width: 70,
      filters: [
        { text: "بله", value: true },
        { text: "خیر", value: false },
      ],
      onFilter: (value, record) => record.wc === value,
      render: (text, record) => (
        <span>{record.wc === true ? "بله" : "خیر"}</span>
      ),
    },
    {
      title: "نام تحویل دهنده",
      dataIndex: "caretaker_name",
      key: "caretaker_name",
      align: "right",
      width: 170,
      ellipsis: true,
      ...getColumnSearchProps("caretaker_name"),
    },
    {
      title: "شماره تماس",
      dataIndex: "caretaker_phone_number",
      key: "caretaker_phone_number",
      align: "center",
      width: 150,
      className: "phone-cell",
      render: (text) => renderPhone(text),
    },
    {
      title: "ورود",
      dataIndex: "gate_in",
      key: "gate_in",
      align: "center",
      width: 110,
      filters: [
        { text: "پدران", value: "MA" },
        { text: "مادران", value: "FE" },
        { text: "نامشخص", value: "NO" },
      ],
      onFilter: (value, record) => record.gate_in.indexOf(value) === 0,
      render: (text, record) => {
        switch (record.gate_in) {
          case "NO":
            return <Tag>نامشخص</Tag>;
          case "FE":
            return <Tag color="pink">مادران</Tag>;
          case "MA":
            return <Tag color="blue">پدران</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: "خروج",
      dataIndex: "gate_out",
      key: "gate_out",
      align: "center",
      width: 110,
      filters: [
        { text: "پدران", value: "MA" },
        { text: "مادران", value: "FE" },
        { text: "نامشخص", value: "NO" },
      ],
      onFilter: (value, record) => record.gate_out.indexOf(value) === 0,
      render: (text, record) => {
        switch (record.gate_out) {
          case "NO":
            return <Tag>نامشخص</Tag>;
          case "FE":
            return <Tag color="pink">مادران</Tag>;
          case "MA":
            return <Tag color="blue">پدران</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: "عملیات",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 160,
      fixed: "left",
      filters: [
        { text: "ورود", value: "NO" },
        { text: "درخواست تحویل", value: "IN" },
        { text: "درخواست تحویل داده شد", value: "RE" },
        { text: "فرستاده شد", value: "SE" },
        { text: "تحویل داده شد", value: "DE" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, record) => {
        switch (text) {
          case "NO":
            return (
              <Button
                className="action-button"
                onClick={() => entryHandler(record)}
                block
                type="primary"
                size="middle"
              >
                ورود
              </Button>
            );
          case "IN":
            return (
              <Button
                className="action-button"
                onClick={() => deliverHandler(record)}
                block
                type="primary"
                size="middle"
              >
                درخواست تحویل
              </Button>
            );
          case "DE":
            return (
              <Tag icon={<CheckCircleOutlined />} color="success">
                تحویل داده شد
              </Tag>
            );
          case "RE":
            return (
              <Tag icon={<SyncOutlined spin />} color="processing">
                درخواست تحویل داده شد
              </Tag>
            );
          case "SE":
            return (
              <Tag icon={<ExclamationCircleOutlined />} color="warning">
                فرستاده شد
              </Tag>
            );
          default:
            return <Tag style={{ width: "100%" }}>اکشنی وجود ندارد.</Tag>;
        }
      },
    },
    {
      title: "بازگشت",
      align: "center",
      width: 90,
      fixed: "left",
      render: (text, record) => (
        <Button
          disabled={record.status === "NO"}
          className="edit-button"
          onClick={() => undoHandler(record)}
          block
          type="link"
          size="middle"
        >
          بازگشت
        </Button>
      ),
    },
  ];
}
