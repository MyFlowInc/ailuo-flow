import { Button, ConfigProvider, Modal, Table, Tag, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { TableTheme, greyButtonTheme } from "../../theme/theme";
import EditFilled from "../../assets/icons/EditFilled";
import DeleteFilled from "../../assets/icons/DeleteFilled";
import PlusSvg from "./assets/plus.svg";
import { PurchaseItemRecordModal } from "./FormModal/PurchaseItemRecordModal";
import {
	PurchaseItemStatusEnum,
	PurchaseStatusEnum,
} from "../../api/ailuo/dict";
import {
	getPurChaseItemList,
	getQualityItemList,
	removePurchaseItem,
	updatePurchaseItem,
} from "../../api/ailuo/pms";
import { useParams } from "react-router";
import { ExclamationCircleFilled } from "@ant-design/icons";
import RightPng from "./assets/RIGHT.png";
import WrongPng from "./assets/WRONG.png";
import { EditRecordModal } from "./RecordModal";
import { QualityControlContext } from "./QualityControl";
import { selectIsPurchase, selectIsWorkshop } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";

interface PurchaseItemTableProps {
	form: any;
	disabled: boolean;
	setForm: (value: any) => void;
}

const PurchaseItemTable: React.FC<PurchaseItemTableProps> = ({
	form,
	disabled,
	setForm,
}) => {
	const params = useParams<any>();

	const { editFlowItemRecord } = useContext(QualityControlContext);
	const isPurchase = useAppSelector(selectIsPurchase);
	const isWorkshop = useAppSelector(selectIsWorkshop);

	const [dataSource, setDataSource] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isShowRequistionModal, setIsShowRequistionModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");
	const [isShowEditRecordModal, setIsShowEditRecordModal] = useState(false);
	const [defaultStatus, setDefaultStatus] = useState<"approve" | "reject">(
		"approve",
	);

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		setIsShowRequistionModal(true);
	};

	const handleDelete = async (item: any) => {
		if (disabled) {
			return;
		}
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			async onOk() {
				const res = await removePurchaseItem({ id: item.id });
				if (res.code == 200) {
					await fetchData();
					message.success("删除成功");
				}
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	};

	const handleTest = async (item: any) => {
		if (
			form.status == PurchaseStatusEnum.Start ||
			form.status == PurchaseStatusEnum.NotStart
		) {
			return;
		}
		await updatePurchaseItem({
			id: item.id,
			status: PurchaseItemStatusEnum.TobeTested,
		});
		await fetchData();
	};

	const defaultColumns: any[] = [
		// {
		// 	title: "序号",
		// 	dataIndex: "number",
		// 	key: "number",
		// },
		{
			title: "物料名称",
			dataIndex: "name",
			key: "name",
		},
		// {
		// 	title: "规格",
		// 	dataIndex: "specifications",
		// 	key: "specifications",
		// },
		{
			title: "材质/品牌",
			dataIndex: "brand",
			key: "brand",
		},
		{
			title: "单位",
			dataIndex: "unit",
			key: "unit",
		},
		{
			title: "采购数量",
			dataIndex: "quantity",
			key: "quantity",
		},
		{
			title: "订单/使用部门",
			dataIndex: "orderDepartment",
			key: "orderDepartment",
		},
		{
			title: "用途",
			dataIndex: "purpose",
			key: "purpose",
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark",
		},
		// {
		// 	title: "来料检",
		// 	dataIndex: "来料检",
		// 	key: "来料检",
		// 	render: (text: string, record: any, index: number) => {
		// 		if (isPurchase) {
		// 			return null;
		// 		}
		// 		if (record.status === PurchaseItemStatusEnum.Approve) {
		// 			return (
		// 				<div>
		// 					<img src={RightPng} alt="" className="w-[15px] h-[15px]" />
		// 				</div>
		// 			);
		// 		} else if (record.status === PurchaseItemStatusEnum.Reject) {
		// 			return (
		// 				<div>
		// 					<img src={WrongPng} alt="" className=" w-[15px] h-[15px] " />
		// 				</div>
		// 			);
		// 		} else {
		// 			return (
		// 				<div>
		// 					<img
		// 						className="mr-2 cursor-pointer w-[15px] h-[15px]"
		// 						src={RightPng}
		// 						alt=""
		// 						onClick={() => {
		// 							if (isWorkshop) {
		// 								message.warning("车间人员无法编辑!");
		// 								return;
		// 							}
		// 							setCurrentIndex(index);
		// 							setDefaultStatus("approve");
		// 							setIsShowEditRecordModal(true);
		// 						}}
		// 					/>
		// 					<img
		// 						className="cursor-pointer w-[15px] h-[15px]"
		// 						src={WrongPng}
		// 						alt=""
		// 						onClick={() => {
		// 							if (isWorkshop) {
		// 								message.warning("车间人员无法编辑!");
		// 								return;
		// 							}
		// 							setCurrentIndex(index);
		// 							setDefaultStatus("reject");
		// 							setIsShowEditRecordModal(true);
		// 						}}
		// 					/>
		// 				</div>
		// 			);
		// 		}
		// 	},
		// },
		// {
		// 	title: "入库",
		// 	dataIndex: "入库",
		// 	key: "入库",
		// 	render: (text: string, record: any) => {
		// 		return <div></div>;
		// 	},
		// },
		// {
		// 	title: "来料检完成时间",
		// 	dataIndex: "incomingCompletiontime",
		// 	key: "incomingCompletiontime",
		// },
		// {
		// 	title: "入库完成时间",
		// 	dataIndex: "warehousingCompletiontime",
		// 	key: "warehousingCompletiontime",
		// },
	];

	const columns = defaultColumns.map((col: any) => {
		return {
			...col,
		};
	});

	const handleNew = () => {
		setModalType("add");
		setCurrentItem({});
		setIsShowRequistionModal(true);
	};

	const fetchData = async () => {
		const res = await getQualityItemList({
			pageNum: 1,
			pageSize: 9999999,
			relationRequisition: editFlowItemRecord.relatedRequisition,
			// id: editFlowItemRecord.relatedItem,
		});
		if (res.code == 200) {
			setDataSource(res.data);
		}
	};

	useEffect(() => {
		fetchData();
	}, [form.id]);

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center">
				<span className="mr-6">采购清单</span>
			</div>
			<ConfigProvider theme={TableTheme}>
				<Table
					size="small"
					pagination={false}
					dataSource={dataSource}
					columns={columns}
				/>
			</ConfigProvider>
			<PurchaseItemRecordModal
				open={isShowRequistionModal}
				setOpen={setIsShowRequistionModal}
				formItem={currentItem}
				modalType={modalType}
				fetchData={fetchData}
				disabled={disabled}
				purchaseForm={form}
			></PurchaseItemRecordModal>
			<EditRecordModal
				modalType={"edit"}
				open={isShowEditRecordModal}
				setOpen={setIsShowEditRecordModal}
				editFlowItemRecord={editFlowItemRecord}
				defaultStatus={defaultStatus}
				setPurchaseItemForm={(params: any) => {
					// @ts-ignore
					dataSource[currentIndex].status = params.status;
					setDataSource([...dataSource]);
				}}
			></EditRecordModal>
		</div>
	);
};

export default PurchaseItemTable;
