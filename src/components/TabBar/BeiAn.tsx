import styled from "styled-components";
import React from "react";
const BeiAnUIRoot = styled.div`
	width: 100%;
	position: absolute;
	bottom: 8px;

	.copyright {
		display: flex;
		justify-content: center;
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
		font-weight: normal;
		line-height: 34px;
		letter-spacing: 1px;
		color: #b7b7b7;
		margin-bottom: 8px;
		text-align: center;

		span:first-child {
			margin-right: 16px;
		}
	}
`;
export const BeiAnUI: React.FC = props => {
	return (
		<BeiAnUIRoot>
			<div className="copyright">
				<span>弗络科技（苏州）有限公司</span>
				<span>苏ICP备2023002380号-1</span>
			</div>
		</BeiAnUIRoot>
	);
};
