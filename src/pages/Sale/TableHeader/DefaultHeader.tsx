import React, { useState } from "react";
import { ConfigProvider, Button } from "antd";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateCurShowMode } from "../../../store/workflowSlice";
import { blueButtonTheme } from "../../../theme/theme";
import EditFilled from "../../../assets/icons/EditFilled";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import type { SegmentedValue } from "antd/es/segmented";
import { selectIsAddOrderModalOpen, setIsAddOrderModalOpen } from "../../../store/globalSlice";

interface DefaultHeaderRootProps {
	isShow: boolean;
}

const DefaultHeaderRoot = styled.div<DefaultHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: end;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 0 : 1)};
	width: ${({ isShow }) => (isShow ? 0 : "100%")};
	height: ${({ isShow }) => (isShow ? 0 : "100%")};
	transition-property: height, opacity;
	transition-duration: 1s;

	.default-header-right {
		flex: 1;
		display: flex;
		justify-content: space-between;
		margin-left: 12px;
	}
`;

interface DefaultHeaderProps {
	hasSelected: boolean;
	freshFlowItem: () => void;
	children?: React.ReactNode;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ hasSelected, freshFlowItem }) => {
	const dispatch = useAppDispatch();

	const isAddTableModalOpen = useAppSelector(selectIsAddOrderModalOpen);
	const setOpen = (value: boolean) => {
		dispatch(setIsAddOrderModalOpen(value));
	};

	const [value, setValue] = useState<SegmentedValue>("list");

	const onChangeHandler = (newValue: SegmentedValue) => {
		dispatch(updateCurShowMode(newValue));
		setValue(newValue);
	};

	const segOptions = [
		{
			label: <span style={{ padding: "0px 5px" }}>列表视图</span>,
			value: "list"
		},
		{
			label: <span style={{ padding: "0px 5px" }}>状态视图</span>,
			value: "status"
		}
	];

	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			<ConfigProvider theme={blueButtonTheme}>
				<Button type="primary" icon={<EditFilled style={{ fontSize: "10px", color: "#ffffff" }} />} onClick={() => setOpen(true)}>
					新建报价
				</Button>
			</ConfigProvider>
			<div className="default-header-right">
				{/* <Segmented options={segOptions} defaultValue={value} onChange={onChangeHandler} /> */}
				<HeaderToolBar />
			</div>
			<AddRecordModal open={isAddTableModalOpen} setOpen={setOpen} freshFlowItem={freshFlowItem} />
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
