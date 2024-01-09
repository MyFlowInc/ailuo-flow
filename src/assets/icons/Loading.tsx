import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import logo2 from "../loading/logo.svg";
import styled, { keyframes } from "styled-components";
const rotateStyle = keyframes`
      0% {
        opacity: 0.25;
        transform: scale(1);
      }

      50% {
        opacity: 1;
        transform: scale(1.25);

      }

      100% {
        opacity: 0;
        transform: scale(1.5);
      }
`;
const LoadingRoot = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.bd {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 60px;
		height: 60px;
		position: relative;
		border-radius: 50%;
		border: 1px solid #d9dfec;
		animation: ${rotateStyle} 2s linear infinite;
	}
	.img {
		position: absolute;
	}
`;

const LoadingSvg = () => {
	return (
		<LoadingRoot>
			<div className="bd"></div>
			<img className="img" src={logo2} />
		</LoadingRoot>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const Loading: React.FC<Partial<IconComponentProps>> = props => <Icon component={LoadingSvg} spin={true} {...props} />;

export default Loading;
