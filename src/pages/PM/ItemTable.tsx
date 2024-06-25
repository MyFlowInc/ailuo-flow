import { Button, ConfigProvider, Flex, Modal, Table, Tag, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { TableTheme, dashboardTheme } from "../../theme/theme";
import {
	PurchaseItemStatusEnum,
	PurchaseStatusEnum,
} from "../../api/ailuo/dict";
import { useParams } from "react-router";
import {
	DeleteFilled,
	EditFilled,
	EditOutlined,
	ExclamationCircleFilled,
} from "@ant-design/icons";
import RightPng from "./assets/RIGHT.png";
import WrongPng from "./assets/WRONG.png";
import { selectIsPurchase, selectIsWorkshop } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import { Stage, Status } from "./types";
import {
	getPurMachining,
	removePurMachining,
	updatePurMachining,
} from "../../api/ailuo/workshop";
import ItemModal from "./FormModal/ItemModal";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";

interface ItemTableProps {
	stage: Stage;
	workshopInfo: any;
}

const ItemTable: React.FC<ItemTableProps> = ({ stage, workshopInfo }) => {
	const params = useParams<any>();

	const isPurchase = useAppSelector(selectIsPurchase);
	const isWorkshop = useAppSelector(selectIsWorkshop);

	const [dataSource, setDataSource] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isShowModal, setIsShowModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		setIsShowModal(true);
	};

	const handleDelete = async (item: any) => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			async onOk() {
				const res = await removePurMachining({ id: item.id });
				if (res.code == 200) {
					await fetchData();
					message.success("删除成功");
				}
			},
		});
	};

	const handleTest = async (item: any) => {
		await updatePurMachining({
			...item,
			id: item.id,
			status: PurchaseItemStatusEnum.TobeTested,
		});
		await fetchData();
	};

	const defaultColumns: any[] = [
		{
			title: stage === "machining" ? "投料模块名称" : "模块名称",
			dataIndex: "name",
			key: "name",
			type: NumFieldType.SingleText,
		},
		{
			title: "投料数量",
			dataIndex: "number",
			key: "number",
			type: NumFieldType.Number,
			hidden: stage === "assembling",
			showCtrlKey: "showNumber",
		},
		{
			title: stage === "machining" ? "投料开始时间" : "开始总装时间",
			dataIndex: "createTime",
			key: "createTime",
			showCtrlKey: "showStartTime",
		},
		{
			title: "预计加工结束时间",
			dataIndex: "expectedTime",
			key: "expectedTime",
			type: NumFieldType.DateTime,
			hidden: stage === "assembling",
			showCtrlKey: "showExpectedTime",
		},
		{
			title: "总装人员",
			dataIndex: "workerName",
			key: "workerName",
			type: NumFieldType.SingleText,
			showCtrlKey: "showWorkerName",
			hidden: stage === "machining",
		},
		{
			title: stage === "machining" ? "加工检" : "装配检",
			dataIndex: "加工检",
			key: "加工检",
			showCtrlKey: "showStatus",
			render: (_text: string, record: any) => {
				if (record.status === PurchaseItemStatusEnum.Todo) {
					return (
						<Tag
							color={"#F2F3F5"}
							style={{ color: "#707683", cursor: "pointer" }}
							onClick={() => handleTest(record)}
						>
							请检
						</Tag>
					);
				} else if (record.status === PurchaseItemStatusEnum.TobeTested) {
					return (
						<Tag
							color={"#FFEEE3"}
							style={{ color: "#707683", cursor: "pointer" }}
						>
							请检中
						</Tag>
					);
				} else if (record.status === PurchaseItemStatusEnum.Approve) {
					return (
						<div className="">
							<img src={RightPng} alt="" className="w-[15px] h-[15px]" />
						</div>
					);
				} else if (record.status === PurchaseItemStatusEnum.Reject) {
					return (
						<div className="flex items-center">
							<img
								src={WrongPng}
								alt=""
								className="mr-1 w-[15px] h-[15px] flex-shrink-0"
							/>
							<Tag
								color={"#F2F3F5"}
								style={{ color: "#707683", cursor: "pointer" }}
								onClick={() => handleTest(record)}
							>
								重检
							</Tag>
						</div>
					);
				}
			},
		},
		{
			title: stage === "machining" ? "加工检完成时间" : "装配完成时间",
			dataIndex: "endTime",
			key: "endTime",
			type: NumFieldType.DateTime,
		},
		{
			width: 90,
			title: "操作",
			dataIndex: "action",
			key: "action",
			showCtrlKey: "showAction",
			render: (text: any, record: any, index: number) => {
				return (
					<div className="flex items-center justify-around">
						<Button
							type="text"
							color="#717682"
							icon={<EditFilled />}
							className="text-[#717682]"
							disabled={
								getCurrentStatus() !== "start" || record.status !== "todo"
							}
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
							disabled={
								getCurrentStatus() !== "start" || record.status !== "todo"
							}
							onClick={() => handleDelete(record)}
						></Button>
					</div>
				);
			},
		},
	];

	const columns = defaultColumns.map((col: any) => {
		return {
			...col,
		};
	});
	const handleNew = () => {
		setModalType("add");
		setCurrentItem({});
		setIsShowModal(true);
	};

	const fetchData = async () => {
		const res = await getPurMachining({
			pageNum: 1,
			pageSize: 9999999,
			type: stage,
			relatedProject: workshopInfo.relationProject,
		});
		if (res.code == 200) {
			setDataSource(res.data.record);
		}
	};

	const getCurrentStatus = () => {
		if (stage === "machining") {
			return workshopInfo.children?.[1]?.status;
		}
		return workshopInfo.children?.[2]?.status;
	};

	const getCurrentWorkShopStatusId = () => {
		if (stage === "machining") {
			return workshopInfo.children?.[1]?.id;
		}
		return workshopInfo.children?.[2]?.id;
	};

	useEffect(() => {
		fetchData();
	}, [workshopInfo]);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<div className="mt-8">
				<Flex gap={20} vertical>
					<ConfigProvider theme={TableTheme}>
						{getCurrentStatus() === "start" && (
							<Button
								style={{ width: "100px" }}
								type={"primary"}
								icon={<EditOutlined />}
								onClick={handleNew}
							>
								{stage === "machining" ? "添加投料" : "添加装配项"}
							</Button>
						)}
						<Table
							bordered
							rowKey={"id"}
							size="small"
							pagination={false}
							dataSource={dataSource}
							columns={columns}
							scroll={{ y: "70vh" }}
						/>
					</ConfigProvider>
				</Flex>
				<ItemModal
					editFlowItemRecord={currentItem}
					fetchTable={fetchData}
					projectId={workshopInfo.relationProject}
					workshopStatusId={getCurrentWorkShopStatusId()}
					type={stage}
					columns={columns}
					open={isShowModal}
					setOpen={setIsShowModal}
					modalType={modalType}
				></ItemModal>
			</div>
		</ConfigProvider>
	);
};

export default ItemTable;
