import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import React from "react";
interface NoStatusDataProps {
	dstId: string;
	clickHandler: (id: string) => void;
}

export const NoStatusData: React.FC<NoStatusDataProps> = props => {
	const { dstId, clickHandler } = props;
	return (
		<Result
			icon={<SmileOutlined />}
			title="您还没有添加状态，请前往添加~"
			extra={
				<Button
					type="primary"
					onClick={() => {
						clickHandler(dstId);
					}}>
					添加状态
				</Button>
			}
		/>
	);
};
