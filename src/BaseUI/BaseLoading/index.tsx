import { Spin } from "antd";
import styled from "styled-components";

const LoadingRoot = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

export function BaseLoading() {
	return (
		<LoadingRoot>
			<Spin />
		</LoadingRoot>
	);
}
