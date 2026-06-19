import { useCallback, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { toEnglishDigit } from "../../utils/digits";

export function useColumnSearch({ searchText, searchedColumn, setSearchText, setSearchedColumn }) {
  const searchInput = useRef(null);

  const handleSearch = useCallback(
    (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(toEnglishDigit(selectedKeys[0]));
      setSearchedColumn(dataIndex);
    },
    [setSearchText, setSearchedColumn]
  );

  const handleReset = useCallback(
    (clearFilters) => {
      clearFilters();
      setSearchText("");
    },
    [setSearchText]
  );

  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`جستجو ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [toEnglishDigit(e.target.value)] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              جستوجو
            </Button>
            <Button
              onClick={() => {
                clearFilters && handleReset(clearFilters);
                handleSearch("", confirm, dataIndex);
              }}
              size="small"
              style={{ width: 90 }}
            >
              ریست
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(toEnglishDigit(selectedKeys[0]));
                setSearchedColumn(dataIndex);
              }}
            >
              فیلتر
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        toEnglishDigit(record[dataIndex].toString())
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    }),
    [handleReset, handleSearch, searchText, searchedColumn, setSearchText, setSearchedColumn]
  );

  return { getColumnSearchProps };
}
