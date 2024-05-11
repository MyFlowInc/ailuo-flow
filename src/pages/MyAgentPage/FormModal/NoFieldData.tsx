import { SmileOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React from "react";
export const NoFieldData: React.FC = () => {
	return <Result icon={<SmileOutlined />} title="您未拥有字段，请点击添加~" />;
};
