import React from "react";
import styled from "styled-components";
import { Popover, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { IMenu } from "../../../../api/ailuo/menu";

const ExtraActionDiv = styled.div`
	display: flex;
	flex-direction: column;

	.btn-content {
		display: flex;
		align-items: center;
		justify-content: start;
		height: 24px;
		border-radius: 3px;
		padding: 12px 8px;
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
	}
`;

interface MenuExtraActionProps {
	menu: IMenu;
	children?: React.ReactNode;
	chooseMenu: any
}

const MenuExtraAction: React.FC<MenuExtraActionProps> = ({ menu, chooseMenu }) => {
	const content = (
		<ExtraActionDiv>
			<Button
				block
				type="text"
				rootClassName="btn-content"
				onClick={() => {
					chooseMenu(menu)
				}}>
				审批设置
			</Button>
		</ExtraActionDiv>
	);

	return (
		<React.Fragment>
			<Popover
				content={content}
				zIndex={999}
				placement="bottomLeft"
				trigger="hover"
				arrow={false}
				overlayStyle={{ padding: "5px" }}
				overlayInnerStyle={{ padding: "8px 4px" }}>
				<MoreOutlined style={{ marginRight: "8px", fontSize: "14px", fontWeight: 800 }} />
			</Popover>
		</React.Fragment>
	);
};

export default MenuExtraAction;
