import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import { Button, ConfigProvider } from "antd";
import { blueButtonTheme } from "../../../theme/theme";
import { EditFilled } from "@ant-design/icons";
import {
	selectIsShowContractModal,
	setIsShowContractModal,
} from "../../../store/globalSlice";
import { useLocation } from "react-router";
import _ from "lodash";

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
	const location = useLocation();
	const isAddTableModalOpen = useAppSelector(selectIsShowContractModal);
	const curSaleForm = useAppSelector(state => state.global.curSaleForm)

	const setOpen = (value: boolean) => {
		dispatch(setIsShowContractModal(value));
	};
	const isShowButton = location.pathname === '/dashboard/contract-manage'
	// new feature 从 sale 跳过来创建 合同
	useEffect(() => {
		if (location.search.includes('from=sale') && !_.isEmpty(curSaleForm)) {
			setOpen(true)
		}
	}, [curSaleForm])

	const HeaderButtonView = () => {
		return (
			<ConfigProvider theme={blueButtonTheme}>
				<Button
					style={{ visibility: !isShowButton ? 'hidden' : 'visible' }}
					type="primary"
					icon={<EditFilled style={{ fontSize: "10px", color: "#ffffff", }} />}
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
