import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import ManagmentModal from "./components/ManagmentModal";
import { itemAPI } from "./services/itemsAPI";

interface DataType {
  id: string;
  name: string;
  price: number;
  description: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [selectedData, setSelectedData] = useState<DataType[] | null>(null);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [type, setType] = useState("");

  const getAllItem = async () => {
    const response = await itemAPI.getAllItems();
    setData(response.data);
  };

  useEffect(() => {
    getAllItem();
  }, []);

  const filteredData = data.filter((item) => {
    const textMatches = filterText
      ? item?.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item?.price.toString().includes(filterText.toLowerCase()) || 
        item?.description.toLowerCase().includes(filterText.toLowerCase())
      : true;

    return textMatches;
  });

  const addModal = () => {
    setModal(true);
    setType("add");
  };

  const viewModal = (data) => {
    setModal(true);
    setType("view");
    setSelectedData(data);
  };

  const editModal = (data) => {
    setModal(true);
    setType("edit");
    setSelectedData(data);
  };

  const deleteModal = (data) => {
    setModal(true);
    setType("delete");
    setSelectedData(data);
  };

  const closeModal = () => {
    setModal(false);
    setType("");
    setSelectedData(null);
  };

  const truncateTextByWords = (text: any, wordLimit: any) => {
    const words = text.split(" ").map((word: any) => word.trim());

    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }

    return text;
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => `${truncateTextByWords(text, 5)}`, // Corrected this line
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            title="View"
            onClick={() => viewModal(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => editModal(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            title="Delete"
            onClick={() => deleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}>
      <div style={{ width: "80%" }}>
        <h1>Items Management System</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Input.Search
            placeholder="Search by name"
            allowClear
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginBottom: "2rem", width: "30%" }}
          />
          <Button onClick={() => addModal()}>
            Add More <PlusOutlined />
          </Button>
        </div>

        <Table<DataType> columns={columns} dataSource={filteredData} />
      </div>

      <ManagmentModal
        type={type}
        selectedData={selectedData ?? []}
        showDialog={modal}
        onCloseDialog={() => {
          closeModal();
          setSelectedData(null);
        }}
        onSubmitForm={() => {
          closeModal();
          setSelectedData(null);
          getAllItem();
        }}
      />
    </div>
  );
};

export default App;
