import "./App.css";
import MenPanel from "./Containers/MenPanel/MenPanel";
import {
  PlusCircleFilled,
  HomeFilled,
  LogoutOutlined
} from "@ant-design/icons";

import { Layout, Menu, Result, Button } from "antd";
import "antd/dist/reset.css";
import React, { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import WomenPanel from "./Containers/WomenPanel/WomenPanel";
import NewKid from "./Containers/NewKid/NewKid";
import Dad from "./Components/Icons/Dad";
import Mom from "./Components/Icons/Mom";
import Logo from "./Components/Logo/Logo";
import { useAuth } from "./providers/auth"; // new import
import Login from "./Containers/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

const { Sider, Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const defaultSelector = () => {
    if (location.pathname === '/WomenPanel') {
      return '3'
    }
    else if (location.pathname === '/NewKid') {
      return '1'
    }
    else {
      return '2'
    }
  }
  const { logout } = useAuth()
  return (
  
      <Routes>
        <Route path="/signUp" element={
          <div style={{ padding: '1rem', backgroundColor: '#0A2139' }}><NewKid /></div>
        } caseSensitive={false} />
        <Route
          path="/login"
          element={
            <Login />
          }
          caseSensitive={false}
        />
        <Route caseSensitive={false} path="*" element={
          <ProtectedRoute>
            <Layout>
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={() => { setCollapsed(!collapsed) }}
              >
                <div className="logo" style={{ marginTop: '-16px', marginRight: '0px' }}><Logo /> </div>
                <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={defaultSelector()}
                  items={[
                    {
                      key: "0",
                      icon: <a href="https://api.javaaneha.ir/api"><HomeFilled /></a>
                      ,
                      label: "خانه",

                    },
                    {
                      key: "1",
                      icon: <PlusCircleFilled />
                      ,
                      label: "کودک جدید",
                      onClick: () => { navigate('/NewKid') }
                    },
                    {
                      key: "2",
                      icon: (
                        <Link className="man-icon" to="/"><Dad /></Link>
                      ),
                      label: "پذیرش پدران",
                      onClick: () => { navigate('/') }

                    },
                    {
                      key: "3",
                      icon: (
                        <Link className="woman-icon" to="/WomenPanel" ><Mom /></Link>
                      ),
                      label: "پذیرش مادران",
                      onClick: () => { navigate('/WomenPanel') }
                    },
                    {
                      key: "4",
                      icon: (
                        <LogoutOutlined />
                      ),
                      label: "خروج",
                      onClick: () => {
                        logout?.()
                      }
                    },
                  ]}
                />
              </Sider>
              <Layout className="site-layout">
                <Content
                  className="site-layout-background"
                  style={{
                    padding: location.pathname === '/NewKid' ? '0' : "1rem",
                    minHeight: "100vh",
                  }}
                >
                  <Routes>
                    <Route path="/" element={<MenPanel />} />
                    <Route
                      path="/WomenPanel"
                      element={<WomenPanel />}
                      caseSensitive={false}
                    />
                    <Route path="/NewKid" element={<div style={{ padding: '1rem', backgroundColor: '#0A2139' }}><NewKid /></div>} caseSensitive={false} />
                    <Route path="*"
                      element={
                        <Result
                          status="404"
                          title="404"
                          subTitle="صفحه پیدا نشد!"
                          extra={<Link to='/'><Button type="primary">بازگشت به صفحه اصلی</Button></Link>}
                        />
                      }
                    />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>

  );
}

export default App;
