import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useAppSelector } from "../../store/hooks";
import styled from "styled-components";
import { selectUserMenus } from "../../store/globalSlice";
import { useLocation } from "react-router";
import { IMenu } from "../../api/ailuo/menu";
import { getImgByName } from "../NavSide/Menu/MenuIconMap";
import _ from "lodash";
import { MenuIcons } from "./icons";

interface AppHeaderProps {}

const { Header } = Layout;

const UIContent = styled.div`
	display: flex;
	align-items: center;
	width: 50%;
	height: 24px;
	.title {
		display: flex;
		align-items: center;
		height: 34px;
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 0em;
		font-family: "Harmony_Sans_Bold";
		color: #000000;

		& > div:nth-child(1) {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-right: 10px;
		}
	}
`;
const SpecialUIContent = styled.div`
	display: flex;
	align-items: center;
	height: 24px;
	.title {
		display: flex;
		align-items: center;
		height: 34px;
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 0em;
		font-family: "Harmony_Sans_Bold";
		color: #000000;

		& > div:nth-child(1) {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-right: 10px;
		}
	}
`;

const AppHeader: React.FC<AppHeaderProps> = (props) => {
	const menus = useAppSelector(selectUserMenus);
	const location = useLocation();
	const [menu, setMenu] = useState<{ icon?: any; name?: string }>({});
	useEffect(() => {
		const { pathname } = location;
		const arr = pathname.split("/");
		const menuPath = arr[arr.length - 1];
		const menu = _.find(menus, { path: "/" + menuPath });
		if (menu) {
			setMenu({ icon: getIcon(menu), name: menu.title });
		}
		if (pathname.includes("spl-db")) {
			setMenu({
				icon: <img src={MenuIcons.SPL_DB} />,
				name: "艾罗标准件资料库",
			});
		}
	}, [location, menus]);

	const getIcon = (menu: IMenu) => {
		const { component } = menu;
		const imgPath = getImgByName(component);
		return <img src={imgPath} />;
	};
	if (location.pathname.includes("pre-product-manage")) {
		return null;
	}
	return (
		<Header
			style={{
				height: "34px",
				lineHeight: "24px",
				padding: "5px 16px",
				background: "#ffffff",
			}}
		>
			<UIContent>
				<div className="title">
					<div>{menu.icon}</div>
					<div>{menu.name}</div>
				</div>
			</UIContent>
		</Header>
	);
};

export const SpecialHeader = (props: any) => {
	const { menu } = props;
	return (
		<Header
			style={{
				height: "34px",
				lineHeight: "24px",
				padding: "5px 16px",
				background: "#ffffff",
			}}
		>
			<SpecialUIContent>
				<div className="title">
					<div>{menu.icon}</div>
					<div>{menu.name}</div>
				</div>
			</SpecialUIContent>
		</Header>
	);
};
export default AppHeader;
