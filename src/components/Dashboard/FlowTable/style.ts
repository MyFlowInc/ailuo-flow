import styled from "styled-components";

export const FlowTableContainer = styled.div`
	height: auto;
	padding: 24px 24px;
	background: #fff;
	border-radius: 4px;
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32px;
	}
	:where(.css-dev-only-do-not-override-1hyej8k).ant-table-wrapper .ant-table-thead > tr > th {
		background: #fff;
	}

	:where(.css-dev-only-do-not-override-1hyej8k).ant-table-wrapper
		.ant-table-thead
		> tr
		> th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
		width: 0px;
	}
`;
