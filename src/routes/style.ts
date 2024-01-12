import styled from "styled-components";

export const LoadingRoot = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.loading-title {
		font-family: HarmonyOS Sans;
		font-size: 16px;
		font-weight: normal;
		line-height: 19.2px;
		text-align: center;
		letter-spacing: 0px;
		color: #b6bece;
		margin-top: 12px;
	}
`;

export const RouterContainer = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	position: relative;
	overflow: auto;
	overflow-x: hidden;
	transition: all;
	transition-duration: 0.5s;
	// background: #edeff3;
	background: #ffffff;

	.router-content {
		flex: 1;
		position: relative;
		overflow: auto;
		transition: all;
		transition-duration: 0.5s;
		// background: #edeff3;
		background: #ffffff;
	}

	.sider-collapsed {
		padding: 16px 8px 16px 0px;
		overflow: hidden;
		background: #e8ecf1;
	}
	.sider-uncollapsed {
		padding: 16px 16px 16px 0px;
		overflow: hidden;
		background: #e8ecf1;
	}
	.site-layout {
		padding: 16px;
		background: #ffffff;
		position: relative;
		overflow: hidden;
	}

	.trigger {
		margin-left: 8px;
	}
	//cover
	.ant-menu-light {
		// background: #edeff3;
		background: #ffffff;
	}
	.ant-menu-root.ant-menu-inline {
		border: unset !important;
	}

	.drawer-body {
		padding: 0px;
	}
`;

export const ResponsiveMenu = styled.div`
	.hide-mobile-menu {
		display: none;
	}
	.show-mobile-menu {
		display: block;
	}
`;
