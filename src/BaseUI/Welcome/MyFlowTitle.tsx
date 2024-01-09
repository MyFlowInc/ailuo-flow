import styled from "styled-components";
import React from "react";

const Container = styled.div`
	height: 43px;
	opacity: 1;
	font-size: 30px;
	font-weight: bold;
	letter-spacing: 0em;
	color: #3b4faf;
`;

export const MyFlowTitle: React.FC<any> = () => {
	return <Container>Myflow</Container>;
};
