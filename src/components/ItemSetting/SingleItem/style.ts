import styled from "styled-components";

export const SingleItemContainer = styled.div`
	cursor: default;
	.single-item {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		.item-title {
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 5px;
			padding: 1px 8px;
			gap: 8px;
			font-family: HarmonyOS Sans;
			font-size: 12px;
			font-weight: normal;
			line-height: 20px;
			letter-spacing: 0px;
			/* color: #ffffff; */
			overflow: hidden;
			height: 20px;
			background: #2ca0e2;
		}
		.operation-container {
			position: absolute;
			left: 208px;
			width: 113px;
			height: 20px;
			transform: rotate(0deg);
			opacity: 1;
			background: #e8ecf1;
			box-sizing: border-box;
			border: 0.92px solid #e8ecf1;
			display: flex;
			align-items: center;
			justify-content: space-around;
			/* img {
				width: 16px;
				height: 16px;
				margin: auto 8px;
			} */
		}
	}
	.line-container {
		display: flex;
		justify-content: center;
	}
	.item-color {
		width: 10px !important;
		height: 10px !important;
		min-width: unset;
		border-radius: unset;
		padding: 0;
		font-size: 10px;
		margin: 0;
		line-height: 0px;
		overflow: hidden;
	}
`;
