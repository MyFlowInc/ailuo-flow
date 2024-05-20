import React, { useContext } from "react";
import { ConfigProvider, Button } from "antd";
import styled from "styled-components";
import { blueButtonTheme } from "../../../theme/theme";
import EditFilled from "../../../assets/icons/EditFilled";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import { useLocation } from "react-router";
import { SplDatabaseContext } from "../SplDatabase";

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
	const location = useLocation();
	const { pathname } = location;
	const { isShowModal, setIsShowModal } = useContext(SplDatabaseContext) as any

	const setOpen = (value: boolean) => {
		setIsShowModal(value)
	};
	const HeaderButtonView = () => {
		if (pathname === "/dashboard/spl/file-data") {
			return (
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						type="primary"
						icon={<EditFilled style={{ fontSize: "10px", color: "#ffffff" }} />}
						onClick={() => setOpen(true)}
					>
						新建父级资料
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
			<AddRecordModal open={isShowModal} setOpen={setOpen} key={'add-modal'} />
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
