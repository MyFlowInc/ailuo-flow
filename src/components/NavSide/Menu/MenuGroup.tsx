import React, { useState } from "react";
import { CaretDownOutlined, MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";
import LineFilled from "../../../assets/icons/LineFilled";
import { Button, Popover } from "antd";
import { useHistory } from "react-router";

interface MenuGroupRootProps {
	open?: boolean;
	n: number;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

const MenuGroupRoot = styled.div<MenuGroupRootProps>`
	.group-title-collapse {
		overflow: hidden;

		.group-title {
			white-space: nowrap;
			/* margin: 10px 0px; */
			cursor: pointer;
			padding-left: 16px;

			.group-title-text {
				color: #4e5969;
				margin: 10px 8px;
				height: 10px;
				line-height: 10px;
			}

			.group-title-icon {
				color: #707683;
				transform: ${({ open }) => (open ? "rotate(0)" : "rotate(-90deg)")};
			}
		}

		.group-menu-items {
			width: 100%;
			height: ${({ open, n }) => (open ? `${n * 37}px` : 0)};
			opacity: ${({ open }) => (open ? 1 : 0)};
			transition-duration: 0.6s;
		}
	}

	.group-title-uncollapse {
		overflow: hidden;

		.group-title-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-left: 8px;
			margin-bottom: 20px;
		}
	}
`;

interface MenuGroupProps {
	title?: string;
	count?: number;
	style?: React.CSSProperties;
	collapsed?: boolean;
	children?: React.ReactNode;
}

const MenuGroup: React.FC<MenuGroupProps> = ({ title, children, collapsed, count, style }) => {
	const [open, setOpen] = useState<boolean>(true);

	const handleToggleOpen = () => {
		setOpen(pre => !pre);
	};

	return (
		<MenuGroupRoot open={open} n={count || 0} style={style}>
			{title && !collapsed ? (
				<div className="group-title-collapse">
					<div className="group-title">
						<div className="flex justify-between items-center">
							<div className="flex">
								<CaretDownOutlined onClick={handleToggleOpen} className="group-title-icon" />
								<span className="group-title-text">{title}</span>
							</div>
							<MenuExtraAction title={title} />
						</div>

					</div>
					<div className="group-menu-items">{children}</div>
				</div>
			) : title && collapsed ? (
				<div className="group-title-uncollapse">
					<div className="group-title-icon">
						<LineFilled style={{ fontSize: "24px", color: "#d8d8d8" }} />
					</div>
					<div>{children}</div>
				</div>
			) : (
				children
			)}
		</MenuGroupRoot>
	);
};

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
const MenuExtraAction: React.FC<any> = ({ title }) => {
	const history = useHistory();
	console.log(111, title)
	if (title !== 'PM') return null
	const content = (
		<ExtraActionDiv>
			<Button
				block
				type="text"
				rootClassName="btn-content"
				onClick={(e: any) => {
					e.stopPropagation();
					history.push('/dashboard/pre-product-manage/add')
				}}>
				新建项目
			</Button>
		</ExtraActionDiv>
	);

	return (
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
	);
};


export default MenuGroup;
