import React, { Children, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import { selectCollapsed, selectIsManager } from "../../../store/globalSlice";
import MenuItem from "./MenuItem";
import MenuExtraAction from "./MenuExtraAction";
import { useHistory, useLocation } from "react-router";
import { IMenu } from "../../../api/ailuo/menu";
import { getImgByName } from "./MenuIconMap";
import ApproveSetting from "../ApproveSetting";
import MenuGroup from "./MenuGroup";
import { splFolderFileTree } from "../../../api/ailuo/spl-pre-product";
import { Tree } from "antd";
import _ from "lodash";

interface MenuItemWrapProps {
	collapsed: boolean;
	children?: React.ReactNode;
}

const MenuItemWrap = styled.div<MenuItemWrapProps>`
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	padding-left: 12px;

	.menu-drag-icon {
		position: relative;
		z-index: 2;
		opacity: 0;
		left: ${({ collapsed }) => (collapsed ? "2px" : "0px")};
		width: ${({ collapsed }) => (collapsed ? "8px" : "16px")};

		:hover {
			cursor: move;
		}
	}

	:hover .menu-drag-icon {
		opacity: 1;
	}
`;

interface MenuGroupContextProps {
	title: string;
	menuList: IMenu[];
	groupStyle?: React.CSSProperties;
	children?: React.ReactNode;
}

const PMList = (props: any) => {
	const { title, groupStyle, collapsed, preProductList, menuList } = props;
	const history = useHistory();
	const [treeData, setTreeData] = useState([]) as any;
	const [treeDefaultExpandedKeys, setTreeDefaultExpandedKeys] = useState(
		[],
	) as any;
	useEffect(() => {
		if (!_.isEmpty(preProductList)) {
			const keys = Object.keys(preProductList);
			const expandKeys = [];
			expandKeys.push(...keys);
			const data = keys.map((key: string) => {
				const children = preProductList[key];
				// 给children子元素添加key
				children.forEach((child: any) => {
					child.key = "product_root_" + child.id;
					child.title = child.name;

					if (!_.isEmpty(child.children)) {
						child.children = child.children.map((item: any) => {
							item.key = "product_pre_" + item.id;
							if (item.type === "pre_product") {
								item.title = "预生产管理";
								item.path = "/dashboard/pre-product-manage/" + item.id;
							}
							if (item.type === "work_shop") {
								item.title = "车间管理";
								item.path = "/dashboard/work-shop-manage/" + item.id;
							}
							if (item.type === "deliver") {
								item.title = "交付管理";
								item.path = "/dashboard/deliver-manage/" + item.id;
							}
							return item;
						});
					}
				});
				return {
					title: key,
					key: key,
					children,
				};
			});
			setTreeData(data);

			setTreeDefaultExpandedKeys(expandKeys);
		} else {
			setTreeData([
				{
					key: "暂无数据,请添加",
					title: "暂无数据,请添加",
					children: [],
				},
			]);
		}
	}, [preProductList]);
	const selectHandler = (selectedKeys: any, e: any) => {
		const path = _.get(e, "node.path");
		if (path) {
			history.push(path);
		}
	};
	const getIcon = (menu: IMenu) => {
		const { component } = menu;
		const imgPath = getImgByName(component);
		return <img src={imgPath} />;
	};
	if (_.isEmpty(treeData)) return null;
	return (
		<MenuGroup
			title={title}
			collapsed={collapsed}
			count={treeData || treeData.length || 0}
			style={groupStyle}
		>
			{menuList.map((item: any, index: number) => {
				const isSelected = "/dashboard" + item.path === location.pathname;
				return (
					<MenuItemWrap collapsed={collapsed} key={"MenuItemWrap_" + index}>
						<div className="menu-drag-icon">{/* <HolderOutlined /> */}</div>
						<MenuItem
							collapsed={collapsed}
							menuKey={`${item.path}`}
							menuName={item.title}
							icon={<div> {getIcon(item)} </div>}
							isExtraShow
							isSelected={isSelected}
						/>
					</MenuItemWrap>
				);
			})}
			<Tree
				className="ml-8"
				rootStyle={{ background: "rgb(232, 236, 241)" }}
				onSelect={selectHandler}
				defaultExpandedKeys={treeDefaultExpandedKeys}
				treeData={treeData}
			/>
		</MenuGroup>
	);
};

const MenuGroupContext: React.FC<MenuGroupContextProps> = (props: any) => {
	const { menuList, title, groupStyle } = props;
	const collapsed = useAppSelector(selectCollapsed);
	const isManager = useAppSelector(selectIsManager);
	const location = useLocation();
	const [approveModalVisible, setApproveModalVisible] =
		useState<boolean>(false);
	const [approveMenuItem, setApproveMenuItem] = useState<any>({});
	const [preProductList, setPreProductList] = useState<any>([]);
	const fetchPreProductList = async () => {
		try {
			const res = await splFolderFileTree({
				pageNum: 1,
				pageSize: 10,
			});
			setPreProductList(res.data);
		} catch (err) {}
	};
	useEffect(() => {
		if (title === "PM") {
			fetchPreProductList();
		}
	}, [title]);

	useEffect(() => {
		if (title === "PM") {
			window.addEventListener("fresh-pre-product-list", fetchPreProductList);
		}
		return () => {
			window.removeEventListener("fresh-pre-product-list", fetchPreProductList);
		};
	}, []);

	const getIcon = (menu: IMenu) => {
		const { component } = menu;
		const imgPath = getImgByName(component);
		return <img src={imgPath} />;
	};
	const chooseMenu = (menu: IMenu) => {
		setApproveMenuItem(menu);
		setApproveModalVisible(true);
	};
	const extra = (menu: IMenu) => {
		const { path } = menu;
		const isShow =
			isManager && ["/quote-manage", "/contract-manage"].includes(path);
		return isShow ? <MenuExtraAction {...{ menu, chooseMenu }} /> : null;
	};

	if (title === "PM") {
		return (
			<PMList {...{ menuList, title, groupStyle, collapsed, preProductList }} />
		);
	}
	return (
		<div>
			<MenuGroup
				title={title}
				collapsed={collapsed}
				count={menuList || menuList.length || 0}
				style={groupStyle}
			>
				{menuList.map((item: any, index: number) => {
					const isSelected = "/dashboard" + item.path === location.pathname;
					return (
						<MenuItemWrap collapsed={collapsed} key={"MenuItemWrap_" + index}>
							<div className="menu-drag-icon">{/* <HolderOutlined /> */}</div>
							<MenuItem
								collapsed={collapsed}
								menuKey={`${item.path}`}
								menuName={item.title}
								icon={<div> {getIcon(item)} </div>}
								isExtraShow
								isSelected={isSelected}
								extra={extra(item)}
							/>
						</MenuItemWrap>
					);
				})}
				{isManager && (
					<ApproveSetting
						{...{
							approveModalVisible,
							setApproveModalVisible,
							curMenu: approveMenuItem,
						}}
					/>
				)}
			</MenuGroup>
		</div>
	);
};

export default MenuGroupContext;
