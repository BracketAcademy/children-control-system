import "./App.css";
import { Result, Button } from "antd";
import "antd/dist/reset.css";
import { Routes, Route, Link } from "react-router-dom";
import NewKid from "./Containers/NewKid/NewKid";
import Login from "./Containers/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AdmissionPanel from "./Containers/AdmissionPanel/AdmissionPanel";
import Dad from "./Components/Icons/Dad";
import Mom from "./Components/Icons/Mom";

const newKidWrapper = (
  <div style={{ padding: "1rem", backgroundColor: "#0A2139" }}>
    <NewKid />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/signUp" element={newKidWrapper} caseSensitive={false} />
      <Route path="/login" element={<Login />} caseSensitive={false} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <AdmissionPanel
              entryURL="/boys-entry"
              deliverURL="/father-delivery"
              title="پذیرش پدران"
              icon={<Dad fill="black" />}
            />
          }
        />
        <Route
          path="/WomenPanel"
          element={
            <AdmissionPanel
              entryURL="/girls-entry"
              deliverURL="/mother-delivery"
              title="پذیرش مادران"
              icon={<Mom fill="black" />}
            />
          }
          caseSensitive={false}
        />
        <Route path="/NewKid" element={newKidWrapper} caseSensitive={false} />
        <Route
          path="*"
          element={
            <Result
              status="404"
              title="404"
              subTitle="صفحه پیدا نشد!"
              extra={
                <Link to="/">
                  <Button type="primary">بازگشت به صفحه اصلی</Button>
                </Link>
              }
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
