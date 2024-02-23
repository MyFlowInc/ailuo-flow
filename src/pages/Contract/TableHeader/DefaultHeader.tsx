import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import HeaderToolBar from "./HeaderToolBar";
import { AddRecordModal } from "../RecordModal";

import {
	selectIsAddOrderModalOpen,
	setIsAddOrderModalOpen,
} from "../../../store/globalSlice";

interface DefaultHeaderRootProps {
	isShow: boolean;
}

const DefaultHeaderRoot = styled.div<DefaultHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: flex-end;
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

const DefaultHeader: React.FC<DefaultHeaderProps> = ({
	hasSelected,
}) => {
	const dispatch = useAppDispatch();

	const isAddTableModalOpen = useAppSelector(selectIsAddOrderModalOpen);
	const setOpen = (value: boolean) => {
		dispatch(setIsAddOrderModalOpen(value));
	};

	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			<div className="default-header-right">
				<HeaderToolBar />
			</div>
			<AddRecordModal
				open={isAddTableModalOpen}
				setOpen={setOpen}
			/>
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
