import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
	selectCollapsed,
	selectUser,
	setIsOpenDrawer,
	setUserMenus,
} from "../../../store/globalSlice";
import MenuItem from "./MenuItem";
import BellFilled from "../../../assets/icons/BellFilled";
import AtFilled from "../../../assets/icons/AtFilled";
import MenuGroup from "./MenuGroup";
import { getUserMenu } from "../../../api/ailuo/menu";
import MenuGroupContext from "./MenuGroupContext";
import { useHistory, useLocation } from "react-router";
import { saleProjectList } from "../../../api/ailuo/sale";
import { ContractStatusMap, MainStatus } from "../../../api/ailuo/dict";
import _ from "lodash";
import { noticeListFetch } from "../../../api/ailuo/notice";
import { contractList } from "../../../api/ailuo/contract";

const MenuRoot = styled.div<{ collapsed: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 100%;
	height: calc(100%);

	.menu-content {
		display: flex;
		flex-direction: column;
		overflow: hidden auto;
		scrollbar-gutter: stable;

		::-webkit-scrollbar {
			width: 0px;
		}

		::-webkit-scrollbar-thumb {
			background: rgba(207, 207, 207, 0.3);
		}
	}

	.menu-extra {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding-left: ${({ collapsed }) => (collapsed ? "8px" : "16px")};
	}
	.menu-bottom {
		font-family: HarmonyOS Sans;
		font-size: 10px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: #cdcdcd;
	}

	.menu-item {
		display: flex;
		align-items: center;
		margin-bottom: 10px;

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
	}
`;

export const MenuContext = React.createContext<any>({});

const Menu: React.FC = () => {
	const dispatch = useAppDispatch();
	const collapsed = useAppSelector(selectCollapsed);
	const history = useHistory();
	const location = useLocation();
	const user = useAppSelector(selectUser);
	const [menus, setMenus] = useState<any[]>([]);
	// 轮训获取次数
	const [totalInfo, setTotalInfo] = useState<{}>({
		myQuote: 0,
		notice: 0,
		myContract: 0,
	});
	// 我的报价审核
	const handleQuote = async () => {
		try {
			const res = await saleProjectList({
				pageNum: 1,
				pageSize: 50,
				status: MainStatus.QuotationReview,
			});
			const list = _.get(res, "data.record") || [];
			return list.length;
		} catch (error) { }
	};
	// 我的合同审核
	const handleContract = async () => {
		try {
			const res = await contractList({
				pageNum: 1,
				pageSize: 50,
				status: ContractStatusMap.Reviewing,
			});
			const list = _.get(res, "data.record") || [];
			return list.length;
		} catch (error) { }
	};
	const handleNotice = async () => {
		try {
			const res = await noticeListFetch(user.id);
			const record = _.get(res, "data.record");
			const unRead = record.filter((item: any) => !item.isRead);
			return unRead.length;
		} catch (error) { }
	};

	useEffect(() => {
		window.addEventListener("fersh-total-info", immediatelyPolling);
		return () => {
			window.removeEventListener("fersh-total-info", immediatelyPolling);
		};
	});
	const immediatelyPolling = async () => {
		const myQuote = (await handleQuote()) || 0;
		const notice = (await handleNotice()) || 0;
		const myContract = (await handleContract()) || 0;
		setTotalInfo({
			myQuote,
			notice,
			myContract,
		});
	};
	// TODO: 调试可以关闭
	const handlePolling = async () => {
		const myQuote = (await handleQuote()) || 0;
		const notice = (await handleNotice()) || 0;
		const myContract = (await handleContract()) || 0;

		setTotalInfo({
			myQuote,
			notice,
			myContract,
		});
	};

	useEffect(() => {
		if (!_.isEmpty(user)) {
			setTimeout(() => {
				handlePolling();
			}, 500);
			const timer = setInterval(async () => {
				// 访问的API地址部分，按你实际情况编写
				await handlePolling();
			}, 20 * 1000);
			return () => clearInterval(timer);
		}
	}, [user]);

	const showDrawer = () => {
		dispatch(setIsOpenDrawer(true));
	};
	// TODO 菜单列表
	const fetchMenu = async () => {
		try {
			const res = await getUserMenu();
			const menus: any = _.get(res, "data.0.children") || [];
			menus.sort((a: any, b: any) => a.sort - b.sort);
			// 菜单列表
			setMenus(menus);
			dispatch(setUserMenus(menus));
			if (menus && menus.length > 0 && location.pathname === '/dashboard') {
				history.push(`/dashboard` + menus[0].path); // 默认打开第一个路由
			}
		} catch (error) {
			console.log("error", error);
		}
	};
	useEffect(() => {
		fetchMenu();
	}, []);

	return (
		<MenuContext.Provider value={{ totalInfo }}>
			<MenuRoot collapsed={collapsed}>
				<div className="menu-content">
					<MenuGroupContext
						menuList={menus}
						title="销售部"
						groupStyle={{ paddingBottom: "18px" }}
					/>
				</div>
				<div className="menu-extra">
					<MenuGroup>
						<MenuItem
							collapsed={collapsed}
							menuKey="notification"
							menuName="通知"
							onClick={showDrawer}
							isSelected={false}
							icon={
								<BellFilled
									style={{
										color: "#707683",
										fontSize: `${collapsed ? "16px" : "14px"}`,
									}}
								/>
							}
							style={{ marginBottom: "10px" }}
						/>
						<MenuItem
							collapsed={collapsed}
							menuName="帮助与支持"
							menuKey="help"
							isSelected={false}
							icon={
								<AtFilled
									style={{
										color: "#707683",
										fontSize: `${collapsed ? "16px" : "14px"}`,
									}}
								/>
							}
							style={{ marginBottom: "10px" }}
						/>
					</MenuGroup>
					{!collapsed && (
						<div className="menu-bottom flex align-middle justify-center">
							由弗络科技技术驱动
						</div>
					)}
				</div>
			</MenuRoot>
		</MenuContext.Provider>
	);
};

export default Menu;
