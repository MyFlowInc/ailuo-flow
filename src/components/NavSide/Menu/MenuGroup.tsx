import React, { useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import LineFilled from "../../../assets/icons/LineFilled";

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
			whitespace: nowrap;
			margin: 10px 0px;
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
					<div className="group-title" onClick={handleToggleOpen}>
						<span className="group-title-text">{title}</span>
						<CaretDownOutlined className="group-title-icon" />
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

export default MenuGroup;
