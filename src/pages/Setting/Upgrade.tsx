import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { freshGradeList } from "../../store/globalSlice";
import UpgradeHeader from "../../components/Upgrade/Header";
import UpgradeLeft from "../../components/Upgrade/Left";
import UpgradeMiddle from "../../components/Upgrade/Middle";
import UpgradeRight from "../../components/Upgrade/Right";
import { useLoginByCache } from "../../hooks";
const UpgradeRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	overflow: auto;
	.combine {
		margin-bottom: 60px;
	}
	.container {
		display: flex;
		margin-top: 60px;
	}
`;

interface UpgradeProps {
	children?: React.ReactNode;
}

const Upgrade: React.FC<UpgradeProps> = () => {
	const dispatch = useAppDispatch();
	// 通过缓存自动登录
	useLoginByCache();
	useEffect(() => {
		dispatch(freshGradeList());
	}, []);
	return (
		<UpgradeRoot>
			<div className="combine">
				<UpgradeHeader />
				<div className="container">
					<UpgradeLeft />
					<UpgradeMiddle />
					<UpgradeRight />
				</div>
			</div>
		</UpgradeRoot>
	);
};

export default Upgrade;
