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
import { getPurMachining } from "../../api/ailuo/workshop";
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
				// const res = await removePurchaseItem({ id: item.id });
				// if (res.code == 200) {
				// 	await fetchData();
				// 	message.success("删除成功");
				// }
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	};

	const handleTest = async (item: any) => {
		if (
			status == PurchaseStatusEnum.Start ||
			status == PurchaseStatusEnum.NotStart
		) {
			return;
		}
		// await updatePurchaseItem({
		// 	id: item.id,
		// 	status: PurchaseItemStatusEnum.TobeTested,
		// });
		await fetchData();
	};

	const defaultColumns: any[] = [
		{
			title: "投料模块名称",
			dataIndex: "name",
			key: "name",
			type: NumFieldType.SingleText,
		},
		{
			title: "投料数量",
			dataIndex: "number",
			key: "number",
			type: NumFieldType.Number,
		},
		{
			title: "投料开始时间",
			dataIndex: "createTime",
			key: "createTime",
			showCtrlKey: "startTime",
		},
		{
			title: "预计加工结束时间",
			dataIndex: "expectedTime",
			key: "expectedTime",
			type: NumFieldType.DateTime,
		},
		{
			title: "加工检",
			dataIndex: "加工检",
			key: "加工检",
			render: (text: string, record: any, index: number) => {
				if (isPurchase) {
					return null;
				}
				if (record.status === PurchaseItemStatusEnum.Approve) {
					return (
						<div>
							<img src={RightPng} alt="" className="w-[15px] h-[15px]" />
						</div>
					);
				} else if (record.status === PurchaseItemStatusEnum.Reject) {
					return (
						<div>
							<img src={WrongPng} alt="" className=" w-[15px] h-[15px] " />
						</div>
					);
				} else {
					return (
						<div>
							<img
								className="mr-2 cursor-pointer w-[15px] h-[15px]"
								src={RightPng}
								alt=""
								onClick={() => {
									if (isWorkshop) {
										message.warning("车间人员无法编辑!");
										return;
									}
									setCurrentIndex(index);
								}}
							/>
							<img
								className="cursor-pointer w-[15px] h-[15px]"
								src={WrongPng}
								alt=""
								onClick={() => {
									if (isWorkshop) {
										message.warning("车间人员无法编辑!");
										return;
									}
									setCurrentIndex(index);
								}}
							/>
						</div>
					);
				}
			},
		},
		{
			title: "加工检完成时间",
			dataIndex: "endTime",
			key: "endTime",
			type: NumFieldType.DateTime,
		},
		{
			width: 90,
			title: "操作",
			dataIndex: "action",
			key: "action",
			render: (text: any, record: any, index: number) => {
				return (
					<div className="flex items-center justify-around">
						<Button
							type="text"
							color="#717682"
							icon={<EditFilled />}
							className="text-[#717682]"
							disabled={getCurrentSatus() !== "start"}
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
							disabled={getCurrentSatus() !== "start"}
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

	const formColumns = columns.slice(0, columns.length - 1);

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
			relatedProjects: workshopInfo.relationProject,
		});
		if (res.code == 200) {
			setDataSource(res.data.record);
		}
	};

	const getCurrentSatus = () => {
		if (stage === "machining") {
			return workshopInfo.children?.[1]?.status;
		}
		return workshopInfo.children?.[2]?.status;
	};

	useEffect(() => {
		fetchData();
	}, [workshopInfo]);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<div className="mt-8">
				<Flex gap={20} vertical>
					<ConfigProvider theme={TableTheme}>
						{getCurrentSatus() === "start" && (
							<Button
								style={{ width: "100px" }}
								type={"primary"}
								icon={<EditOutlined />}
								onClick={handleNew}
							>
								添加投料
							</Button>
						)}
						<Table
							rowKey={"id"}
							size="small"
							pagination={false}
							dataSource={dataSource}
							columns={columns}
						/>
					</ConfigProvider>
				</Flex>
				<ItemModal
					fetchTable={fetchData}
					projectId={workshopInfo.relationProject}
					workshopStatus={getCurrentSatus()}
					type={stage}
					columns={formColumns}
					open={isShowModal}
					setOpen={setIsShowModal}
					modalType={modalType}
				></ItemModal>
			</div>
		</ConfigProvider>
	);
};

export default ItemTable;
