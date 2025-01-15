import { Button, Form, Input, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { upperFirst } from "lodash";
import { itemAPI } from "../services/itemsAPI";

interface Props {
  type: string;
  showDialog: boolean;
  onCloseDialog: () => void;
  onSubmitForm: (data: never) => void;
  selectedData: FieldType | null; 
}

type FieldType = {
  id?: number;
  name?: string;
  price?: number;
  description?: string;
};

const ManagmentModal: React.FC<Props> = (props) => {
  const { showDialog, onCloseDialog, onSubmitForm, selectedData, type } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: selectedData?.id || null,
      name: selectedData?.name || "",
      price: selectedData?.price || 0,
      description: selectedData?.description || "",
    });
  }, [selectedData, form]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      console.log(values);

      const apiCalls = {
        add: itemAPI.createItem,
        edit: itemAPI.editItem,
        delete: itemAPI.deleteItem,
      };

      const apiCall = apiCalls[type];

      console.log(values);
      if (apiCall) {
        const data = {
          ...values,
          id: selectedData?.id || null,
        };

        const response = await apiCall({ ...data });

        if (response?.status === 200 || response?.status === 201) {
          onSubmitForm(response);
          handleDialogClose();
        } else {
          console.log(response?.statusText);
        }
      } else {
        console.log("Invalid type:", type);
      }
    } catch (error) {
      console.log("Validation or API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    onCloseDialog();
    setIsLoading(false);
  };

  console.log(selectedData);

  return (
    <Modal
      title={`${upperFirst(type)} Item`}
      centered
      open={showDialog}
      onOk={onSubmit}
      onCancel={handleDialogClose}
      footer={[
        type !== "view" && (
          <Button
            key="submit"
            type="primary"
            disabled={isLoading}
            loading={isLoading}
            onClick={onSubmit}>
            Submit
          </Button>
        ),
        <Button key="close" onClick={handleDialogClose} disabled={isLoading}>
          Close
        </Button>,
      ]}
      width="60%">
      <Spin spinning={isLoading}>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{
            name: selectedData?.name || "",
            price: selectedData?.price || 0,
            description: selectedData?.description || "",
          }}>
          <Form.Item
            label="Item Name"
            name="name"
            rules={[
              { required: true, message: "Please input the item name!" },
            ]}>
            {type === "view" || type === "delete" ? (
              <p>{selectedData?.name}</p>
            ) : (
              <Input disabled={type !== "edit" && type !== "add"} />
            )}
          </Form.Item>

          <Form.Item
            label="Item Price"
            name="price"
            rules={[
              { required: true, message: "Please input the item price!" },
            ]}>
            {type === "view" || type === "delete" ? (
              <p>RM {selectedData?.price}</p>
            ) : (
              <Input
                type="number"
                disabled={type !== "edit" && type !== "add"}
              />
            )}
          </Form.Item>

          <Form.Item label="Item Description" name="description">
            {type === "view" || type === "delete" ? (
              <p>{selectedData?.description}</p>
            ) : (
              <Input.TextArea
                maxLength={300}
                disabled={type !== "edit" && type !== "add"}
              />
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ManagmentModal;
