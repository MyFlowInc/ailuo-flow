import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import {
	selectIsAddOrderModalOpen,
	setIsAddOrderModalOpen,
} from "../../../store/globalSlice";
import { Button, ConfigProvider } from "antd";
import { blueButtonTheme } from "../../../theme/theme";
import { EditFilled } from "@ant-design/icons";

interface DefaultHeaderRootProps {
	isShow: boolean;
}

const DefaultHeaderRoot = styled.div<DefaultHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 0 : 1)};
	width: ${({ isShow }) => (isShow ? 0 : "100%")};
	height: ${({ isShow }) => (isShow ? 0 : "100%")};
	transition-property: height, opacity;
	transition-duration: 1s;

	.default-header-right {
		/* flex: 1; */
		display: flex;
		justify-content: space-between;
		margin-left: 12px;
	}
`;

interface DefaultHeaderProps {
	hasSelected: boolean;
	children?: React.ReactNode;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ hasSelected }) => {
	const dispatch = useAppDispatch();

	const isAddTableModalOpen = useAppSelector(selectIsAddOrderModalOpen);
	const setOpen = (value: boolean) => {
		dispatch(setIsAddOrderModalOpen(value));
	};
	const HeaderButtonView = () => {
		return (
			<ConfigProvider theme={blueButtonTheme}>
				<Button
					type="primary"
					icon={<EditFilled style={{ fontSize: "10px", color: "#ffffff" }} />}
					onClick={() => setOpen(true)}
				>
					新建合同
				</Button>
			</ConfigProvider>
		);
	};
	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			{HeaderButtonView()}
			<div className="default-header-right">
				<HeaderToolBar />
			</div>
			<AddRecordModal open={isAddTableModalOpen} setOpen={setOpen} />
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
