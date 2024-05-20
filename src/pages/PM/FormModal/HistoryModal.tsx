import { Button, ConfigProvider, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { TableTheme, blueButtonTheme } from "../../../theme/theme";
import { splProjectList } from "../../../api/ailuo/spl-pre-product";
import _ from "lodash";
import HistoryInfoModal from "./HistoryInfoModal";

interface HistoryModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	project: any;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
	open,
	setOpen,
	project,
}) => {
	const [dataSource, setDataSource] = useState([]);
	const [isShowInfoModal, setIsShowInfoModal] = useState(false);
	const [currentHistoryInfo, setCurrentHistoryInfo] = useState({});

	const handleCancel = () => {
		setOpen(false);
	};

  const handleViewDetail = (record: any) => {
    setCurrentHistoryInfo(record);
    setIsShowInfoModal(true);
	};

	const columns = [
		{
			title: "修改时间",
			dataIndex: "updateTime",
			key: "updateTime",
			render: (text: any, record: any, index: any) => {
				return <div className="text-[#5966D6]">{text}</div>;
			},
		},
		{
			title: "关联工单",
			dataIndex: "address",
			key: "address",
			render: (text: any, record: any, index: any) => {
				return (
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							type="text"
							className="text-[#5966D6]"
							onClick={() => handleViewDetail(record)}
						>
							查看
						</Button>
					</ConfigProvider>
				);
			},
		},
	];

	const getList = async () => {
		const res = await splProjectList({
			pageSize: 999,
			pageNum: 1,
			version: 1,
			uuid: project.uuid,
		});
		setDataSource(_.get(res, "data.record"));
	};

	useEffect(() => {
		if (open) {
			getList();
		}
	}, [open]);

	return (
		<>
			<Modal
				title={"历史变更"}
				width={500}
				open={open}
				onCancel={handleCancel}
				footer={null}
			>
				<ConfigProvider theme={TableTheme}>
					<Table dataSource={dataSource} columns={columns} pagination={false} />
				</ConfigProvider>
			</Modal>
			<HistoryInfoModal
				isShowInfoModal={isShowInfoModal}
				setIsShowInfoModal={setIsShowInfoModal}
				project={currentHistoryInfo}
			></HistoryInfoModal>
		</>
	);
};

export default HistoryModal;
