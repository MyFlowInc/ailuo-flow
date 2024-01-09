import styled from "styled-components";
import React from "react";
const TriangleRoot = styled.div`
	border-style: solid;
	border-width: 0px 0px 100px 100px;
	border-color: transparent transparent blue transparent;
	width: 0px;
	height: 0px;
`;
export const Triangle: React.FC<any> = props => {
	const { className } = props;
	return <TriangleRoot className={className} />;
};
