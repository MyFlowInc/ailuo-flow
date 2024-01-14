import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Popover, Avatar } from "antd";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { selectCollapsed, setCollapsed, selectUser } from "../../store/globalSlice";
import { logout } from "../../api/user";
import MenuFoldFilled from "../../assets/icons/MenuFoldFilled";

interface NavHeadRootProps {
	collapsed: boolean;
}

const NavHeadRoot = styled.div<NavHeadRootProps>`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: ${({ collapsed }) => (collapsed ? "center" : "space-between")};
	padding: ${({ collapsed }) => (collapsed ? "5px 0px 5px 8px" : "5px 0px 5px 16px")};
	height: 34px;
	line-height: 34px;
	margin-bottom: 10px;

	.collapsed {
		display: ${props => (props.collapsed ? "none" : "block")};
	}

	& > div:first-child {
		cursor: pointer;
		margin: 0px 8px;
	}
`;

const PopContentDiv = styled.div`
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

interface HeaderPorps {
	children?: React.ReactNode;
}

const Header: React.FC<HeaderPorps> = () => {
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const collapsed = useAppSelector(selectCollapsed);
	const user = useAppSelector(selectUser);

	const logoutHandler = async () => {
		await logout();
		history.push("/login");
	};

	const content = (
		<PopContentDiv>
			<Button
				block
				type="text"
				rootClassName="btn-content"
				onClick={() => {
					history.push(`/setting?path=${location.pathname}`);
				}}>
				设置
			</Button>
			<Button block type="text" rootClassName="btn-content" onClick={logoutHandler}>
				登出
			</Button>
		</PopContentDiv>
	);

	return (
		<NavHeadRoot collapsed={collapsed}>
			<div className="collapsed">
				<Popover content={content} placement="right" arrow={false} overlayStyle={{ paddingTop: "50px" }} overlayInnerStyle={{ padding: "8px 4px" }}>
					<Avatar src={user.avatar} size={24} />
				</Popover>
			</div>
			<Button
				type="text"
				icon={collapsed ? <MenuFoldFilled style={{ color: "#707683", fontSize: "14px" }} /> : <MenuFoldFilled style={{ color: "#707683", fontSize: "12px" }} />}
				onClick={() => dispatch(setCollapsed(!collapsed))}
			/>
		</NavHeadRoot>
	);
};

export default Header;
