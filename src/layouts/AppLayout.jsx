import {
  PlusCircleFilled,
  HomeFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dad from "../Components/Icons/Dad";
import Mom from "../Components/Icons/Mom";
import Logo from "../Components/Logo/Logo";
import { useAuth } from "../providers/auth";

const { Sider, Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const defaultSelector = () => {
    if (location.pathname === "/WomenPanel") {
      return "3";
    }
    if (location.pathname === "/NewKid") {
      return "1";
    }
    return "2";
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      >
        <div className="logo" style={{ marginTop: "-16px", marginRight: "0px" }}>
          <Logo />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={defaultSelector()}
          items={[
            {
              key: "0",
              icon: (
                <a href="https://api.javaaneha.ir/api">
                  <HomeFilled />
                </a>
              ),
              label: "خانه",
            },
            {
              key: "1",
              icon: <PlusCircleFilled />,
              label: "کودک جدید",
              onClick: () => navigate("/NewKid"),
            },
            {
              key: "2",
              icon: (
                <Link className="man-icon" to="/">
                  <Dad />
                </Link>
              ),
              label: "پذیرش پدران",
              onClick: () => navigate("/"),
            },
            {
              key: "3",
              icon: (
                <Link className="woman-icon" to="/WomenPanel">
                  <Mom />
                </Link>
              ),
              label: "پذیرش مادران",
              onClick: () => navigate("/WomenPanel"),
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "خروج",
              onClick: () => logout?.(),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            padding: location.pathname === "/NewKid" ? "0" : "1rem",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
