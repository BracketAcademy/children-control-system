import { ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Table, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { toPersianDigit } from "../../utils/digits";
import KidDetailModal from "./KidDetailModal";
import { buildKidsTableColumns } from "./kidsTableColumns";
import "./DataTable.css";
import { useColumnSearch } from "./useColumnSearch";
import { useKidsTable } from "./useKidsTable";

export default function DataTable({ entryURL, deliverURL, title, icon }) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const {
    data,
    fetched,
    loading,
    error,
    setError,
    modal,
    setModal,
    selectedKid,
    setSelectedKid,
    getDataIndex,
    fetchData,
    entryHandler,
    deliverHandler,
    undoHandler,
    updateKidField,
    openKidModal,
  } = useKidsTable({ entryURL, deliverURL });

  const { getColumnSearchProps } = useColumnSearch({
    searchText,
    searchedColumn,
    setSearchText,
    setSearchedColumn,
  });

  const renderPhone = useCallback((text) => {
    if (!text || text === "ندارد") {
      return <span>{text || "ندارد"}</span>;
    }
    return <a href={"tel:" + text}>{toPersianDigit(text)}</a>;
  }, []);

  const columns = useMemo(
    () =>
      buildKidsTableColumns({
        data,
        getDataIndex,
        getColumnSearchProps,
        renderPhone,
        entryHandler,
        deliverHandler,
        undoHandler,
        updateKidField,
      }),
    [
      data,
      deliverHandler,
      entryHandler,
      getColumnSearchProps,
      getDataIndex,
      renderPhone,
      undoHandler,
      updateKidField,
    ]
  );

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
                bottom: "0.25rem",
              }}
            >
              {icon}
            </div>
            {title}
          </div>
        </Typography.Title>
        <Button onClick={fetchData} icon={<ReloadOutlined />}>
          بروزرسانی{" "}
        </Button>
      </div>
      <Table
        className="kids-table"
        loading={loading || !fetched}
        columns={columns}
        dataSource={data}
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
            openKidModal(record);
          },
          style: { cursor: "pointer" },
        })}
      />

      <Modal
        open={!!modal}
        title={modal ? modal.title : ""}
        onOk={modal ? modal.onOk : undefined}
        onCancel={() => setModal(null)}
        cancelText="خیر"
        okText="بله"
      >
        <p>{modal ? modal.message : ""}</p>
      </Modal>

      <KidDetailModal
        kid={selectedKid}
        onClose={() => setSelectedKid(null)}
        renderPhone={renderPhone}
      />

      {error ? (
        <div className="error-container">
          <Alert
            message={error.message}
            description={error.description}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
