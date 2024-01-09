import styled from "styled-components";
import logoSvg from "../../assets/logo_1.png";
import logoLoginSvg from "../../assets/logo_login.svg";
import React from "react";
export const Logo: React.FC<any> = (props: any) => {
	const { className } = props;
	return <img src={logoSvg} className={className} />;
};

const LogoUIRoot = styled.div`
	display: flex;
	align-items: center;

	.logo_img {
		margin-left: 44px;
		height: 26px;
		width: 26px;
	}
	.title {
		margin-left: 16px;
		/* HIFLOW平台 */
		font-size: 20px;
		font-weight: normal;
		line-height: 34px;
		display: flex;
		align-items: center;
		letter-spacing: 0px;
		color: #343434;
	}
`;
export const LogoUI: React.FC = props => {
	return (
		<LogoUIRoot>
			<Logo className="logo_img" />
			<div className="title">HIFLOW平台</div>
		</LogoUIRoot>
	);
};

export const LogoUI2: React.FC<any> = (props: any) => {
	const { className } = props;
	return <img src={logoLoginSvg} className={className} />;
};
