import { Button, Descriptions, Modal } from "antd";

export default function KidDetailModal({ kid, onClose, renderPhone }) {
  return (
    <Modal
      open={!!kid}
      title={kid ? `${kid.first_name} ${kid.last_name}` : ""}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          بستن
        </Button>,
      ]}
    >
      {kid ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="نسبت تحویل دهنده">
            {kid.caretaker || "ندارد"}
          </Descriptions.Item>
          <Descriptions.Item label="نام تحویل دهنده">
            {kid.caretaker_name || "ندارد"}
          </Descriptions.Item>
          <Descriptions.Item label="شماره تماس">
            {renderPhone(kid.caretaker_phone_number)}
          </Descriptions.Item>
          <Descriptions.Item label="شماره تماس اضطراری">
            {renderPhone(kid.emergancy_calls)}
          </Descriptions.Item>
          <Descriptions.Item label="تلفن منزل">
            {renderPhone(kid.caretaker_home_number)}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
    </Modal>
  );
}
