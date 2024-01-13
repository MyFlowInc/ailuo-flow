import React from "react";
import { ConfigProvider, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setIsArchiveView } from "../../../store/globalSlice";
import styled from "styled-components";
import { greyButtonTheme } from "../../../theme/theme";

const ArchiveHeaderRoot = styled.div<{ isShow: boolean }>`
	display: flex;
	// width: 100%;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
	font-size: 16px;
	font-family: "Harmony_Regular";
	font-weight: 600;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 1 : 0)};
	width: ${({ isShow }) => (isShow ? "100%" : 0)};
	height: ${({ isShow }) => (isShow ? "100%" : 0)};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface ArchiveHeaderProps {
	isArchiveView: boolean;
	children?: React.ReactNode;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({ isArchiveView }) => {
	const dispatch = useDispatch();

	const handleExitArchiveView = () => {
		dispatch(setIsArchiveView(false));
	};
	return (
		<ArchiveHeaderRoot isShow={isArchiveView}>
			<div>已归档工单</div>
			<div>
				<ConfigProvider theme={greyButtonTheme}>
					<Button type="primary" icon={<LeftOutlined style={{ fontSize: "12px", color: "#707683" }} />} onClick={handleExitArchiveView}>
						退出
					</Button>
				</ConfigProvider>
			</div>
		</ArchiveHeaderRoot>
	);
};

export default ArchiveHeader;
