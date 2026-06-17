import {
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import "./DataTable.css";
const URL = "https://api.javaaneha.ir/api2";

// Add axios interceptor to attach auth token to every request.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
  }
  state = {
    data: null,
    searchText: "",
    searchedColumn: "",
    fetched: false,
    loading: false,
    error: null,
    modal: null,
    selectedKid: null,
  };
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate() {
    if (this.state.error) {
      const timeout = setTimeout(() => {
        this.setState({ error: null });
        clearTimeout(timeout);
      }, 5000);
    }
  }
  getDataIndex = (record) => {
    return this.state.data.findIndex((item) => item.id === record.id);
  };
  fetchData = () => {
    this.setState({ loading: true });
    axios
      .get(URL + "/kids")
      .then((res) => {
        this.setState({ loading: false });
        if (JSON.stringify(this.state.data) !== JSON.stringify(res.data)) {
          this.setState({ data: res.data, fetched: true });

        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: {
            message: "خطا در دریافت اطلاعات",
            description:
              "اطلاعات به درستی دریافت نشدند، لطفا دوباره تلاش کنید.",
          },
        });
      });
  };
  updateKidsList = () => {
    this.setState({ loading: true });
    axios
      .get(URL + "/porsline")
      .then(() => {
        this.fetchData();
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: { message: err.message, description: "" },
        });
      });
  };
  entryHandler = (record) => {
    const index = this.getDataIndex(record);
    if (index === -1) return;

    const kid = this.state.data[index];
    const gender =
      kid.gender && kid.gender !== "NO"
        ? kid.gender
        : record.gender && record.gender !== "NO"
          ? record.gender
          : kid.gender || "";
    const number = kid.number || "";

    const payLoad = {
      id: record.id,
      number,
      gender,
    };

    const postData = () => {
      axios
        .post(URL + this.props.entryURL, payLoad)
        .then((res) => {
          const dataArray = this.state.data;
          dataArray[index].status = "IN";
          this.setState({ data: dataArray, loading: false, error: null });
          this.fetchData();
        })
        .catch((err) => {
          this.setState({
            loading: false,
            error: { message: err.message, description: "" },
          });
        });
    };

    if (
      number.trim() === "000" ||
      gender.trim() === "NO" ||
      number.trim() === "" ||
      gender.trim() === ""
    ) {
      this.setState({
        error: {
          message: "اطلاعات ناقص است",
          description: "جنسیت یا شماره وارد نشده است.",
        },
      });
    } else {
      let isUnique = true;
      for (let i = 0; i < this.state.data.length; i++) {
        const element = this.state.data[i];
        if (element.number === number && i !== index) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        this.setState({ loading: true });
        postData();
      } else {
        this.setState({
          modal: {
            title: "فرد دیگر با همین شماره وجود دارد.",
            onOk: () => {
              postData();
              this.setState({ modal: null, loading: true });
            },
            message: "آیا می‌خواهید این فرد را با شماره تکراری ثبت کنید؟",
          },
        });
      }
    }
  };
  deliverHandler = (record) => {
    const index = this.getDataIndex(record);
    this.setState({ loading: true });
    axios
      .post(URL + this.props.deliverURL, { id: record.id })
      .then((res) => {
        const dataArray = this.state.data;
        if (index !== -1) {
          dataArray[index].status = "RE";
        }
        this.setState({ data: dataArray, loading: false, error: null });
        this.fetchData();
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: {
            message: err.message ? err.message : "خطا",
            description: "",
          },
        });
      });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({ searchText: selectedKeys[0].toEnglishDigit() });
    this.setState({ searchedColumn: dataIndex });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  renderPhone = (text) => {
    if (!text || text === "ندارد") {
      return <span>{text || "ندارد"}</span>;
    }
    return <a href={"tel:" + text}>{text.toPersianDigit()}</a>;
  };

  openKidModal = (record) => {
    this.setState({ selectedKid: record });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={this.searchInput}
          placeholder={`جستجو ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(
              e.target.value ? [e.target.value.toEnglishDigit()] : []
            )
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,

            }}
          >
            جستوجو
          </Button>
          <Button
            onClick={() => {
              clearFilters && this.handleReset(clearFilters)
              this.handleSearch('', confirm, dataIndex)
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            ریست
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              this.setState({ searchText: selectedKeys[0].toEnglishDigit() });
              this.setState({ searchedColumn: dataIndex });
            }}
          >
            فیلتر
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toEnglishDigit()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  render() {
    const columns = [
      {
        title: "نام",
        dataIndex: "first_name",
        key: "first_name",
        align: "right",
        width: 130,
        ellipsis: true,
        ...this.getColumnSearchProps("first_name"),
      },
      {
        title: "نام‌خانوادگی",
        dataIndex: "last_name",
        key: "last_name",
        align: "right",
        width: 140,
        ellipsis: true,
        ...this.getColumnSearchProps("last_name"),
      },
      {
        title: "جنسیت",
        dataIndex: "gender",
        key: "gender",
        align: "center",
        width: 110,
        filters: [
          {
            text: "دختر",
            value: "FE",
          },
          {
            text: "پسر",
            value: "MA",
          },
          {
            text: "نامشخص",
            value: "NO",
          },
        ],
        onFilter: (value, record) => record.gender.indexOf(value) === 0,
        sorter: (a, b) => a.gender.localeCompare(b.gender),

        render: (text, record) => {
          const gender = record.gender;
          const dataIndex = this.getDataIndex(record);
          const dataArray = this.state.data;
          if (gender === "MA") {
            return <Tag color="geekblue">پسر</Tag>;
          } else if (gender === "FE") {
            return <Tag color="magenta">دختر</Tag>;
          }

          else {
            return (
              <Select
                style={{
                  width: "100%",
                }}
                value={
                  dataIndex !== -1 && dataArray[dataIndex].gender === "NO"
                    ? ""
                    : dataArray[dataIndex]?.gender
                }
                onChange={(value) => {
                  if (dataIndex === -1) return;
                  dataArray[dataIndex].gender = value ? value.toString() : "";
                  this.setState({ data: dataArray });
                }}
              >
                <Select.Option value="FE">دختر</Select.Option>
                <Select.Option value="MA">پسر</Select.Option>
              </Select>
            );
          }
        },
      },
      {
        title: "شماره",
        dataIndex: "number",
        align: "center",
        width: 100,
        ...this.getColumnSearchProps("number"),
        sorter: (a, b) =>
          +a.number.toEnglishDigit() - +b.number.toEnglishDigit(),
        render: (text, record) => {
          const dataIndex = this.getDataIndex(record);
          if (record.status === "NO") {
            return (
              <Input
                className="number-input"
                onChange={(event) => {
                  if (dataIndex === -1) return;
                  const dataArray = this.state.data;
                  dataArray[dataIndex].number = event.target.value
                    ? event.target.value.toString().toEnglishDigit()
                    : "0";
                  this.setState({ data: dataArray });
                }}
                value={
                  dataIndex !== -1 &&
                  this.state.data[dataIndex].number === "000"
                    ? ""
                    : dataIndex !== -1
                      ? this.state.data[dataIndex].number
                      : text
                }
              />
            );
          } else {
            return <span>{text.toPersianDigit()}</span>;
          }
        },
      },
      {
        title: "سن",
        dataIndex: "age",
        key: "age",
        align: "center",
        width: 70,
        ...this.getColumnSearchProps("age"),
        sorter: (a, b) =>
          +a.age - +b.age,
        render: (text, record, index) => {
          // var years = moment().diff(text, 'years');
          return (
            <span>{text}</span>
          )
        },
      },

      {
        title: "WC",
        dataIndex: "wc",
        key: "wc",
        align: "center",
        width: 70,
        filters: [
          {
            text: "بله",
            value: true,
          },
          {
            text: "خیر",
            value: false,
          },
        ],
        onFilter: (value, record) => record.wc === value,
        render: (text, record, index) => (
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
        ...this.getColumnSearchProps("caretaker_name"),
      },
      {
        title: "شماره تماس",
        dataIndex: "caretaker_phone_number",
        key: "caretaker_phone_number",
        align: "center",
        width: 150,
        className: "phone-cell",
        render: (text) => this.renderPhone(text),
      },
      {
        title: "ورود",
        dataIndex: "gate_in",
        key: "gate_in",
        align: "center",
        width: 110,
        filters: [
          {
            text: "پدران",
            value: "MA",
          },
          {
            text: "مادران",
            value: "FE",
          },
          {
            text: "نامشخص",
            value: "NO",
          },
        ],
        onFilter: (value, record) => record.gate_in.indexOf(value) === 0,
        render: (text, record, index) => {
          switch (record.gate_in) {
            case "NO":
              return <Tag>نامشخص</Tag>;
            case "FE":
              return <Tag color="pink">مادران</Tag>;
            case "MA":
              return <Tag color="blue">پدران</Tag>;
            default:
              break;
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
          {
            text: "پدران",
            value: "MA",
          },
          {
            text: "مادران",
            value: "FE",
          },
          {
            text: "نامشخص",
            value: "NO",
          },
        ],
        onFilter: (value, record) => record.gate_out.indexOf(value) === 0,
        render: (text, record, index) => {
          switch (record.gate_out) {
            case "NO":
              return <Tag>نامشخص</Tag>;
            case "FE":
              return <Tag color="pink">مادران</Tag>;
            case "MA":
              return <Tag color="blue">پدران</Tag>;
            default:
              break;
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
          {
            text: "ورود",
            value: "NO",
          },
          {
            text: "درخواست تحویل",
            value: "IN",
          },
          {
            text: "درخواست تحویل داده شد",
            value: "RE",
          },
          {
            text: "فرستاده شد",
            value: "SE",
          },
          {
            text: "تحویل داده شد",
            value: "DE",
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (text, record, index) => {
          switch (text) {
            case "NO":
              return (
                <Button
                  className="action-button"
                  onClick={() => {
                    this.entryHandler(record);
                  }}
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
                  onClick={() => {
                    this.deliverHandler(record);
                  }}
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
        render: (text, record) => {
          return (
            <Button
              disabled={record.status === "NO"}
              className="edit-button"
              onClick={() => {
                const dataIndex = this.getDataIndex(record);
                if (dataIndex === -1) return;

                this.setState({ loading: true });
                const dataArray = this.state.data;
                let NewStatus = "";
                let NewGateIN = null;
                let NewGateOut = null;

                switch (record.status) {
                  case "IN":
                    NewStatus = "NO";
                    NewGateIN = "NO";
                    break;
                  case "RE":
                    NewStatus = "IN";
                    NewGateOut = "NO";
                    break;
                  case "SE":
                    NewStatus = "IN";
                    NewGateOut = "NO";

                    break;
                  case "DE":
                    NewStatus = "IN";
                    NewGateOut = "NO";

                    break;
                  default:
                    break;
                }
                dataArray[dataIndex].status = NewStatus;
                dataArray[dataIndex].gate_in = NewGateIN
                  ? NewGateIN
                  : dataArray[dataIndex].gate_in;
                dataArray[dataIndex].gate_out = NewGateOut
                  ? NewGateOut
                  : dataArray[dataIndex].gate_out;
                axios
                  .post(URL + "/undo", { id: record.id, status: NewStatus })
                  .then(() => {
                    this.setState({ data: dataArray, loading: false });
                    record.status = NewStatus;
                    record.gate_in = NewGateIN ? NewGateIN : record.gate_in;
                    record.gate_out = NewGateOut ? NewGateOut : record.gate_out;
                  })
                  .catch((err) => {
                    this.setState({
                      loading: false,
                      error: { message: err.message, description: "" },
                    });
                  });
              }}
              block
              type="link"
              size="middle"
            >
              بازگشت
            </Button>
          );
        },
      },
    ];

    return (
      <div className="DataTable">
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  position: "relative",
                  marginLeft: "0.5rem",
                  bottom: '0.25rem'
                }}
              >
                {this.props.icon}
              </div>
              {this.props.title}
            </div>
          </Typography.Title>
          <Button onClick={this.fetchData} icon={<ReloadOutlined />}>
            بروزرسانی{" "}
          </Button>
        </div>
        <Table
          className="kids-table"
          loading={this.state.loading || !this.state.fetched}
          columns={columns}
          dataSource={this.state.data}
          pagination={{ showTitle: false, pageSize: 10 }}
          rowKey={(record) => record.id}
          scroll={{ x: 1520 }}
          size="middle"
          tableLayout="fixed"
          onRow={(record) => ({
            onClick: (e) => {
              if (
                e.target.closest(
                  "button, a, input, textarea, .ant-select, .ant-select-selector"
                )
              ) {
                return;
              }
              this.openKidModal(record);
            },
            style: { cursor: "pointer" },
          })}
        />

        <Modal
          open={this.state.modal ? true : false}
          title={this.state.modal ? this.state.modal.title : ""}
          onOk={this.state.modal ? this.state.modal.onOk : null}
          onCancel={() => {
            this.setState({ modal: null });
          }}
          cancelText="خیر"
          okText="بله"
        >
          <p>{this.state.modal ? this.state.modal.message : ""}</p>
        </Modal>
        <Modal
          open={!!this.state.selectedKid}
          title={
            this.state.selectedKid
              ? `${this.state.selectedKid.first_name} ${this.state.selectedKid.last_name}`
              : ""
          }
          onCancel={() => {
            this.setState({ selectedKid: null });
          }}
          footer={[
            <Button
              key="close"
              type="primary"
              onClick={() => {
                this.setState({ selectedKid: null });
              }}
            >
              بستن
            </Button>,
          ]}
        >
          {this.state.selectedKid ? (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="نسبت تحویل دهنده">
                {this.state.selectedKid.caretaker || "ندارد"}
              </Descriptions.Item>
              <Descriptions.Item label="نام تحویل دهنده">
                {this.state.selectedKid.caretaker_name || "ندارد"}
              </Descriptions.Item>
              <Descriptions.Item label="شماره تماس">
                {this.renderPhone(this.state.selectedKid.caretaker_phone_number)}
              </Descriptions.Item>
              <Descriptions.Item label="شماره تماس اضطراری">
                {this.renderPhone(this.state.selectedKid.emergancy_calls)}
              </Descriptions.Item>
              <Descriptions.Item label="تلفن منزل">
                {this.renderPhone(this.state.selectedKid.caretaker_home_number)}
              </Descriptions.Item>
            </Descriptions>
          ) : null}
        </Modal>
        {this.state.error ? (
          <div className="error-container">
            <Alert
              message={this.state.error.message}
              description={this.state.error.description}
              type="error"
              showIcon
              closable
              onClose={() => {
                this.setState({ error: null });
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default DataTable;
