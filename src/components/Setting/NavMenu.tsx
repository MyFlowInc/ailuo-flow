import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import styled from "styled-components";
import { LeftOutlined } from "@ant-design/icons";
import PersonalFilled from "../../assets/icons/PersonalFilled";
import SecurityFilled from "../../assets/icons/SecurityFilled";

const NavMenuRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	width: 100%;
	height: 100%;
`;

interface MenuItemProps {
	selected: boolean;
	width?: string;
}

const MenuItem = styled.div<MenuItemProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: ${({ width }) => width || "100%"};
	heigth: 27px;
	line-height: 27px;
	white-space: nowrap;
	margin-bottom: 10px;
	border-radius: 5px;
	cursor: pointer;
	background-color: ${({ selected }) => (selected ? "#ffffff" : "#e8ecf1")};

	:hover {
		background-color: #ffffff;
	}

	.menuitem-icon {
		display: flex;
		align-items: center;
		margin: 0px 8px;
	}

	.menuitem-text {
		display: flex;
		align-items: center;
		flex-grow: 1;
	}
`;

interface NavMenuProps {
	children?: React.ReactNode;
}

const NavMenu: React.FC<NavMenuProps> = () => {
	const history = useHistory();
	const { pathname } = useLocation();
	const pathKey = pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length);

	const [curMenuKey, setCurMenuKey] = useState<string>(pathKey);

	useEffect(() => {
		setCurMenuKey(pathKey);
	}, [pathKey]);

	return (
		<NavMenuRoot>
			<MenuItem
				width="50%"
				selected={false}
				onClick={() => {
					history.go(-1);
				}}>
				<div className="menuitem-icon">
					<LeftOutlined style={{ color: "#707683", fontSize: 14 }} />
				</div>
				<div className="menuitem-text">返回</div>
			</MenuItem>
			<MenuItem
				selected={curMenuKey === "personal"}
				onClick={() => {
					history.replace("/setting/personal");
				}}>
				<div className="menuitem-icon">
					<PersonalFilled style={{ color: "#707683", fontSize: 14 }} />
				</div>
				<div className="menuitem-text">个人信息</div>
			</MenuItem>
			<MenuItem
				selected={curMenuKey === "security"}
				onClick={() => {
					history.replace("/setting/security");
				}}>
				<div className="menuitem-icon">
					<SecurityFilled style={{ color: "#707683", fontSize: 14 }} />
				</div>
				<div className="menuitem-text">账号安全</div>
			</MenuItem>

			{/* <MenuItem
				selected={curMenuKey === "upgrade"}
				onClick={() => {
					history.replace("/setting/upgrade");
				}}>
				<div className="menuitem-icon">
					<UpgradeFilled style={{ color: "#707683", fontSize: 14 }} />
				</div>
				<div className="menuitem-text">升级</div>
			</MenuItem> */}
		</NavMenuRoot>
	);
};

export default NavMenu;
