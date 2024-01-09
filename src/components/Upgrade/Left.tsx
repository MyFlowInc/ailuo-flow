import React from "react";
import styled from "styled-components";

const UpgradeLeftRoot = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 184px;
	.content {
		height: 320px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		.t1 {
			margin-top: 80px;
			font-family: HarmonyOS Sans;
			font-size: 18px;
			font-weight: normal;
			color: #666666;
		}
		.t2 {
			margin-top: 170px;
			font-family: HarmonyOS Sans;
			font-size: 12px;
			font-weight: normal;
			line-height: 16px;
			color: #000000;
		}
	}
	.list {
		.item {
			display: flex;
			flex-direction: column;
			.text {
				font-family: HarmonyOS Sans;
				font-size: 12px;
				font-weight: normal;
				line-height: 16px;
				display: flex;
				align-items: center;
				letter-spacing: 0px;
				color: #666666;
				margin-top: 16px;
				margin-bottom: 16px;
			}
			.line {
				width: 134px;
				height: 1px;
				border: 1px solid #e5e6eb;
			}
		}
	}
`;

interface UpgradeLeftProps {}

const UpgradeLeft: React.FC<UpgradeLeftProps> = props => {
	return (
		<UpgradeLeftRoot>
			<div className="content">
				<div className="t1">选择您的升级方案</div>
				<div className="t2">功能比对</div>
			</div>
			<div className="list">
				<div className="item">
					<div className="text">项目数限制</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">流程状态限制</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">单个文档存储限制</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">总存储空间</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">筛选、排序等高级工具</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">列表及状态视图</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">多端使用</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">协同合作</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">团队编辑权限</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">优先支持</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">功能尝鲜</div>
					<div className="line"></div>
				</div>
			</div>
		</UpgradeLeftRoot>
	);
};

export default UpgradeLeft;
