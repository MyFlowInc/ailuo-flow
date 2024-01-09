import React from "react";
import { Button, Popover } from "antd";
import { PlusCircleFilled, EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { selectCollapsed, selectIsAddTableModalOpen, selectIsArchive, setIsAddTableModalOpen, setIsArchive } from "../../store/globalSlice";
import AddFlowModal from "./AddFlowModal";

const NavActionRoot = styled.div<{ collapsed: boolean }>`
	display: flex;
	align-items: center;
	justify-content: ${collapsed => (collapsed ? "center" : "space - between")};
	padding-left: ${({ collapsed }) => (collapsed ? "8px" : "16px")};
	width: 100%;
	height: 51px;
	margin-bottom: 16px;

	.btn-add {
		display: flex;
		align-items: center;
		justify-content: start;
		flex-grow: 1;
		margin-right: 16px;
		height: 27px;
		line-height: 27px;
		background-color: #ffffff;
		border-radius: 5px;
		padding: 0px 8px;
		cursor: pointer;

		&:hover {
			background-color: rgba(0, 0, 0, 0.06);
		}

		&:active {
			background-color: rgba(0, 0, 0, 0.15);
		}

		.btn-text {
			white-space: nowrap;
			margin: 0px 8px;
			font-family: "Harmony_Regular", sans-serif;
			font-size: 12px;
		}
	}

	.btn-active {
		height: 27px;
		line-height: 27px;
		background-color: #ffffff;
		border-radius: 5px;
		padding: 0px 6.5px;
		cursor: pointer;

		&:hover {
			// outline: 1px solid rgba(0, 0, 0, 0.15);
			background-color: rgba(0, 0, 0, 0.06);
		}
		&:active {
			background-color: rgba(0, 0, 0, 0.15);
		}
	}
`;

interface NavActionProps {
	children?: React.ReactNode;
}

const NavAction: React.FC<NavActionProps> = () => {
	const dispatch = useDispatch();
	const collapsed = useAppSelector(selectCollapsed);
	const isArchive = useAppSelector(selectIsArchive);
	const isAddTableModalOpen = useAppSelector(selectIsAddTableModalOpen);

	const setIsModalOpen = (value: boolean) => {
		dispatch(setIsAddTableModalOpen(value));
	};

	const toggleArchive = async () => {
		dispatch(setIsArchive(!isArchive));
	};

	return (
		<NavActionRoot collapsed={collapsed}>
			{collapsed ? (
				<Button
					type="text"
					icon={<PlusCircleFilled style={{ color: "#707683", fontSize: "14px" }} />}
					onClick={() => {
						setIsModalOpen(true);
					}}
				/>
			) : (
				<>
					<div
						className="btn-add"
						onClick={() => {
							setIsModalOpen(true);
						}}>
						<PlusCircleFilled style={{ color: "#707683", fontSize: "12px" }} />
						<div className="btn-text">新建项目</div>
					</div>
					<Popover
						placement="bottom"
						content={() => {
							return <div>{isArchive ? "隐藏归档项目" : "显示归档项目"}</div>;
						}}>
						<div className="btn-active" onClick={toggleArchive}>
							{isArchive ? <EyeFilled style={{ color: "#707683", fontSize: "12px" }} /> : <EyeInvisibleFilled style={{ color: "#707683", fontSize: "12px" }} />}
						</div>
					</Popover>
				</>
			)}
			<AddFlowModal {...{ isModalOpen: isAddTableModalOpen, setIsModalOpen }} />
		</NavActionRoot>
	);
};

export default NavAction;
