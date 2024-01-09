import React from "react";
import styled from "styled-components";

interface CompleteButtonRootProps {
	color?: string;
	bgcolor?: string;
}

const CompleteButtonRoot = styled.div<CompleteButtonRootProps>`
	display: flex;
	align-items: center;
	background-color: ${({ bgcolor }) => bgcolor || "#ffffff"};
	color: ${({ color }) => color || "#000000"};
	padding: 4px 20px;
	cursor: pointer;
	border-radius: 5px;
	font-size: 12px;
	letter-spacing: 0.2rem;
	font-family: "Harmony_Regular", sans-serif;
`;

interface CompleteButtonProps {
	color?: string;
	bgcolor?: string;
	text: string;
	onClick?: () => void;
	children?: React.ReactNode;
}

const CompleteButton: React.FC<CompleteButtonProps> = ({ text, ...rest }) => {
	return <CompleteButtonRoot {...rest}>{text}</CompleteButtonRoot>;
};

export default CompleteButton;
