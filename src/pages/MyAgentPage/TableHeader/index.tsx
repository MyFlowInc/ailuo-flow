import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DefaultHeader from "./DefaultHeader";
import BatchHeader from "./BatchHeader";

const HeaderRoot = styled.div`
	display: flex;
	width: 100%;
	height: 52px;
	font-size: 12px;
	font-family: "Harmony_Regular", sans-serif;
	padding: 12px 0px;
	margin-bottom: 16px;
`;

interface DefaultHeaderGroupProps {
	toggle: boolean;
	children?: React.ReactNode;
}

const DefaultHeaderGroup = styled(({ children, ...rest }) => <div {...rest}>{children}</div>) <DefaultHeaderGroupProps>`
	display: flex;
	overflow: hidden;
	opacity: ${({ toggle }) => (toggle ? 0 : 1)};
	width: ${({ toggle }) => (toggle ? 0 : "100%")};
	height: ${({ toggle }) => (toggle ? 0 : "100%")};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface HeaderProps {
	selectedRows: any[];
	setSelectedRows: (v: any[]) => void;
	fetchAgentList: () => void; // 获取技术反馈列表
	children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ selectedRows, setSelectedRows, ...rest }) => {
	const isArchiveView = false;
	const [hasSelected, setHasSelected] = useState<boolean>(false);

	useEffect(() => {
		setHasSelected(selectedRows.length > 0);
	}, [selectedRows]);

	return (
		<HeaderRoot>
			<DefaultHeaderGroup toggle={Number(isArchiveView)}>
				<DefaultHeader hasSelected={hasSelected} {...rest} />
				<BatchHeader hasSelected={hasSelected} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
			</DefaultHeaderGroup>
		</HeaderRoot>
	);
};

export default Header;
