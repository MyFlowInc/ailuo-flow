import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";
import { selectIsExpired, selectIsMember, selectUser } from "../../store/globalSlice";
import { Popover } from "antd";
import wximg from "./assets/wximg.png";

const UpgradeHeaderRoot = styled.div`
	display: flex;
	flex-direction: column;
	padding-bottom: 26px;
	justify-content: flex-start;
	.title {
		margin-top: 70px;
		font-family: HarmonyOS Sans;
		font-size: 20px;
		font-weight: normal;
		line-height: 48px;
		letter-spacing: 0px;
	}
	.content {
		font-family: HarmonyOS Sans;
		font-size: 12px;
		font-weight: 300;
		line-height: 17px;
		letter-spacing: 0px;
		.text-a {
			color: #666666;
		}
		.text-b {
			color: #5966d6;
		}
		.text-red {
			color: #ff0000;
			margin-left: 4px;
			margin-right: 4px;
		}
	}
`;

interface UpgradeHeaderProps {}
const ContactUS = () => {
	const content = () => (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<img src={wximg} width={150} height={150} />
			<div style={{ fontSize: "18px" }}>添加客服微信</div>
		</div>
	);
	return (
		<Popover content={content}>
			<span className="text-b">联系我们</span>
		</Popover>
	);
};

const NotMember = () => {
	return (
		<div className="content">
			<span className="text-a">您目前使用的是MyFlow免费版，如果您想与我们的销售团队交流，请 </span>
			<ContactUS />
			<span className="text-a">。</span>
		</div>
	);
};
const Member = (props: { endTime: string }) => {
	const { endTime } = props;
	const parseDateString = (dateString: string) => {
		const parts = dateString.split(/[-: ]/);
		const year = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10);
		const day = parseInt(parts[2], 10);
		return [year, month, day];
	};

	const dateArray = parseDateString(endTime);

	return (
		<div className="content">
			<div>
				<span>您目前使用的是MyFlow +，此账号有效期至</span>
				<span className="text-red">{dateArray[0]}</span>
				<span>年</span>
				<span className="text-red">{dateArray[1]}</span>
				<span>月</span>
				<span className="text-red">{dateArray[2]}</span>
				<span>日 。</span>
			</div>
			<div>
				<span className="text-a">如果您想与我们的销售团队交流，请 </span>
				<ContactUS />
				<span className="text-a">。</span>
			</div>
		</div>
	);
};

const UpgradeHeader: React.FC<UpgradeHeaderProps> = props => {
	const user = useAppSelector(selectUser);
	const isMember = useAppSelector(selectIsMember);
	const isExpired = useAppSelector(selectIsExpired);
	return (
		<UpgradeHeaderRoot>
			<div className="title">
				{isExpired && <span>已过期</span>}
				{!isExpired && <span>{isMember ? "续费" : "升级"}</span>}
			</div>
			{isMember ? <Member endTime={user.endTime} /> : <NotMember />}
		</UpgradeHeaderRoot>
	);
};

export default UpgradeHeader;
