import { Button, ConfigProvider, Modal, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { BlueTableTheme, TableTheme, greyButtonTheme } from "../../theme/theme";
import EditFilled from "../../assets/icons/EditFilled";
import DeleteFilled from "../../assets/icons/DeleteFilled";
import PlusSvg from "./assets/plus.svg";
import { PurchaseItemRecordModal } from "./FormModal/PurchaseItemRecordModal";
import {
	PurchaseItemStatusEnum,
	PurchaseItemWarehousingsStatusEnum,
	PurchaseStatusEnum,
} from "../../api/ailuo/dict";
import {
	getPurChaseItemList,
	removePurchaseItem,
	updatePurchaseItem,
} from "../../api/ailuo/pms";
import { useParams } from "react-router";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ApproveButton from "../../BaseUI/Button/Approve";

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

	const [dataSource, setDataSource] = useState([]);
	const [isShowRequistionModal, setIsShowRequistionModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

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
			relationRequisition: params.purId,
			relationProject: form.relationProject,
		});
		await fetchData();
	};

	const handleInStorage = async (item: any) => {
		await updatePurchaseItem({
			id: item.id,
			warehousing: PurchaseItemWarehousingsStatusEnum.Yes,
		});
		await fetchData();
	};

	const defaultColumns: any[] = [
		{
			title: "序号",
			dataIndex: "number",
			key: "number",
		},
		{
			title: "物料名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "规格",
			dataIndex: "specifications",
			key: "specifications",
		},
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
		{
			title: "来料检",
			dataIndex: "来料检",
			key: "来料检",
			render: (text: string, record: any) => {
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
				}
			},
		},
		{
			title: "入库",
			dataIndex: "warehousing",
			key: "warehousing",
			render: (text: string, record: any) => {
				if (record.warehousing === PurchaseItemWarehousingsStatusEnum.Yes) {
					return <ApproveButton />;
				}
				if (record.status === PurchaseItemStatusEnum.Approved) {
					return (
						<Tag
							color={"#F2F3F5"}
							style={{ color: "#707683", cursor: "pointer" }}
							onClick={() => handleInStorage(form)}
						>
							入库
						</Tag>
					);
				}
				return null;
			},
		},
		{
			title: "来料检完成时间",
			dataIndex: "incomingCompletiontime",
			key: "incomingCompletiontime",
			render: (text: string, record: any) => {
				return <div></div>;
			},
		},
		{
			title: "入库完成时间",
			dataIndex: "warehousingCompletiontime",
			key: "warehousingCompletiontime",
			render: (text: string, record: any) => {
				return <div></div>;
			},
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
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
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
		setIsShowRequistionModal(true);
	};

	const fetchData = async () => {
		if (params.purId == "new") {
			setDataSource([]);
			return;
		}
		const res = await getPurChaseItemList({
			pageNum: 1,
			pageSize: 9999999,
			relationRequisition: params.purId,
		});
		if (res.code == 200) {
			setDataSource(res.data.record);
		}
	};

	useEffect(() => {
		fetchData();
	}, [params.purId]);

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center">
				<span className="mr-6">采购清单</span>
				{form?.status == PurchaseStatusEnum.Start && (
					<div className="flex items-center cursor-pointer" onClick={handleNew}>
						<img src={PlusSvg} alt="" className="mr-2" />
						<span className="text-[#707683]">添加采购项目</span>
					</div>
				)}
			</div>
			<ConfigProvider theme={BlueTableTheme}>
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
		</div>
	);
};

export default PurchaseItemTable;
