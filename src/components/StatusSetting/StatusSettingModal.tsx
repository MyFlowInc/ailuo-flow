import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Modal } from "antd";
import { useAppDispatch } from "../../store/hooks";
import lockSvg from "./assets/lock.svg";
import unlockSvg from "./assets/unlock.svg";
import closeSvg from "./assets/x.svg";
import ItemSettingContainer from "../ItemSetting/ItemSettingContainer";
import { TableColumnItem, WorkFlowInfo, WorkFlowStatusInfo, fetchMetaDataByDstId, freshCurMetaData } from "../../store/workflowSlice";
import _ from "lodash";
import { UpdateDSMetaParams, updateDSMeta } from "../../api/apitable/ds-meta";
const LockSvg = () => {
	return <img src={lockSvg} />;
};
const UnLockSvg = () => {
	return <img src={unlockSvg} />;
};
const CloseSvg = (props: any) => {
	const { onClick } = props;
	return <img src={closeSvg} onClick={onClick} style={{ cursor: "pointer" }} />;
};

const StatusSettingModalRoot = styled.div`
	display: flex;
	/* padding: 28px; */
	flex-direction: column;
	.header {
		display: flex;
		justify-content: space-between;
		width: 100%;
		.title {
			font-family: HarmonyOS Sans;
			font-size: 18px;
			font-weight: normal;
			line-height: 26px;
			display: flex;
			align-items: center;
			color: #000000;
		}
		.right {
			display: flex;
			align-items: center;
		}
	}
	.list-content {
		margin-top: 40px;
	}
	.divider {
		margin-top: 64px;
		width: 316px;
		height: 0px;
		opacity: 1;
		border: 1px solid #e5e6eb;
	}
	.footer {
		width: 316px;
		margin-top: 18px;
		display: flex;
		justify-content: center;
	}
`;
interface StatusSettingModalProps {
	isStatusSettingModalOpen: boolean;
	setIsStatusSettingModalOpen: (value: boolean) => void;
	flowInfo: WorkFlowInfo;
}
const StatusSettingModal: React.FC<StatusSettingModalProps> = (props: StatusSettingModalProps) => {
	const { isStatusSettingModalOpen, setIsStatusSettingModalOpen, flowInfo } = props;
	const [isLocked, setIsLocked] = useState(true);
	const dispatch = useAppDispatch();
	const curFlowDstId = flowInfo.dstId;
	const [oldStatusList, setOldStatusList] = useState([]);
	const [curTableColumn, setCurTableColumn] = useState<TableColumnItem[]>([]);
	const [statusList, setStatusList] = useState<WorkFlowStatusInfo[]>(oldStatusList);

	// 数据准备
	useEffect(() => {
		if (isStatusSettingModalOpen) {
			initData();
		}
	}, [isStatusSettingModalOpen]);

	const initData = async () => {
		if (!curFlowDstId) {
			return;
		}
		try {
			const res = await fetchMetaDataByDstId(curFlowDstId);
			const columns = res[2];
			setCurTableColumn(columns);
			const temp = _.find(columns, { type: 26 });
			let s = [];
			if (temp) {
				s = _.get(temp, "fieldConfig.property.options");
			}

			setOldStatusList(s);
			setStatusList(s);
		} catch (error) {
			console.error(error);
		}
	};

	const cancleHandle = () => {
		// 恢复
		setIsStatusSettingModalOpen(false);
	};

	const saveHandle = async () => {
		const options = [...statusList];
		console.log("saveHandle", options);
		// 同步临时
		setStatusList(options);
		// 同步数据库
		try {
			await updateField(options);
		} catch (e) {
			console.log(e);
		}
		setIsStatusSettingModalOpen(false);
	};
	// 数据库更新字段值
	const updateField = async (options: WorkFlowStatusInfo[]) => {
		const dstId = curFlowDstId;
		const optionStatusField = _.find(curTableColumn, { type: 26 });
		if (!optionStatusField || !dstId) {
			return;
		}
		const temp: UpdateDSMetaParams = {
			dstId,
			fieldId: optionStatusField.fieldId,
			name: optionStatusField.name,
			type: "OptionStatus",
			property: {
				options: options
			}
		};

		await updateDSMeta(temp);
		await dispatch(freshCurMetaData(dstId));
	};

	return (
		<Modal
			open={isStatusSettingModalOpen}
			width={380}
			// centered={true}
			footer={null}
			closeIcon={null}
			styles={{
				body: {
					padding: "0 !important"
				}
			}}>
			<StatusSettingModalRoot>
				<div className="header">
					<div className="title">工作流设置</div>
					<div className="right">
						{isLocked && (
							<Button style={{ marginRight: "16px" }} onClick={() => setIsLocked(false)} icon={<UnLockSvg />}>
								解锁
							</Button>
						)}
						{!isLocked && (
							<Button style={{ marginRight: "16px", background: "#5966D6" }} onClick={() => setIsLocked(true)} type="primary" icon={<LockSvg />}>
								锁定
							</Button>
						)}
						<CloseSvg onClick={cancleHandle} />
					</div>
				</div>
				<div className="list-content">
					<ItemSettingContainer {...{ statusList, setStatusList }} isLocked={isLocked} />
				</div>
				<div className="divider"></div>
				<div className="footer">
					<Button style={{ background: "#F2F3F5", color: "#707683" }} onClick={cancleHandle} type="primary">
						取消
					</Button>
					<Button style={{ background: "#5966D6", marginLeft: "36px" }} onClick={saveHandle} type="primary">
						保存
					</Button>
				</div>
			</StatusSettingModalRoot>
		</Modal>
	);
};

export default StatusSettingModal;
