import React from "react";
import { ConfigProvider, Button } from "antd";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { blueButtonTheme } from "../../../theme/theme";
import EditFilled from "../../../assets/icons/EditFilled";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import {
	selectIsShowSaleModal,
	setIsShowSaleModal,
} from "../../../store/globalSlice";
import { useLocation } from "react-router";

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
	const { pathname } = location;

	const isShowSaleModal = useAppSelector(selectIsShowSaleModal);
	const setOpen = (value: boolean) => {
		dispatch(setIsShowSaleModal(value));
	};
	const HeaderButtonView = () => {
		if (pathname === "/dashboard/quote-manage") {
			return (
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						type="primary"
						icon={<EditFilled style={{ fontSize: "10px", color: "#ffffff" }} />}
						onClick={() => setOpen(true)}
					>
						新建报价
					</Button>
				</ConfigProvider>
			);
		}
		return <div></div>;
	};
	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			{HeaderButtonView()}
			<div className="default-header-right">
				<HeaderToolBar />
			</div>
			<AddRecordModal open={isShowSaleModal} setOpen={setOpen} />
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
