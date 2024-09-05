import { Button, ConfigProvider, Modal, Table, Tag, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import PlusSvg from "./assets/plus.svg";
import { PurchaseItemRecordModal } from "./FormModal/PurchaseItemRecordModal";
import { useParams } from "react-router";
import { ExclamationCircleFilled } from "@ant-design/icons";
import RightPng from "../../../QM/assets/RIGHT.png";
import WrongPng from "../../../QM/assets/WRONG.png";
import { PurchaseRecordViewContext } from "./PurchaseRecordView";
import { useAppSelector } from "../../../../store/hooks";
import {
	selectIsQuality,
	selectIsStorage,
} from "../../../../store/globalSlice";
import {
	getPurChaseItemList,
	purRequisitionItem,
	removePurchaseItem,
	updatePurchaseItem,
} from "../../../../api/ailuo/pms";
import {
	PurchaseItemStatusEnum,
	PurchaseItemWarehousingsStatusEnum,
	PurchaseStatusEnum,
} from "../../../../api/ailuo/dict";
import EditFilled from "../../../../assets/icons/EditFilled";
import DeleteFilled from "../../../../assets/icons/DeleteFilled";
import { BlueTableTheme } from "../../../../theme/theme";

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
	const isStorage = useAppSelector(selectIsStorage);
	const isQuality = useAppSelector(selectIsQuality);

	const { fetchPurchaseRecordViewData, addUpdateMilestoneCount } = useContext(
		PurchaseRecordViewContext,
	);

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
			form.status == PurchaseStatusEnum.NotStart ||
			isQuality
		) {
			return;
		}
		await updatePurchaseItem({
			id: item.id,
			status: PurchaseItemStatusEnum.TobeTested,
			relationRequisition: params.purId,
			relationProject: form.relationProject,
			name: item.name,
		});
		await fetchData();
	};

	const handleReTest = async (item: any) => {
		if (isQuality) {
			return;
		}
		await updatePurchaseItem({
			id: item.id,
			status: PurchaseItemStatusEnum.TobeTested,
			relationRequisition: params.purId,
			relationProject: form.relationProject,
			name: item.name,
		});
		await fetchData();
	};

	const handleInStorage = async (item: any) => {
		if (!isStorage) {
			message.warning("只有仓储部门可以入库");
			return;
		}
		if (item.status !== PurchaseItemStatusEnum.Approve) {
			message.warning("只有已检的物料才能入库");
			return;
		}
		await updatePurchaseItem({
			id: item.id,
			warehousing: PurchaseItemWarehousingsStatusEnum.Yes,
			relationRequisition: params.purId,
		});
		await fetchData();
		await fetchPurchaseRecordViewData();
		addUpdateMilestoneCount();
	};

	const defaultColumns: any[] = [
		{
			title: "物料名称",
			dataIndex: "productName",
			key: "productName",
		},
		{
			title: "单位",
			dataIndex: "unitName",
			key: "unitName",
		},
		{
			title: "采购数量",
			dataIndex: "count",
			key: "count",
		},
		{
			title: "已领料数量",
			dataIndex: "outCount",
			key: "outCount",
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark",
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
		const res = await purRequisitionItem({
			pageNum: 1,
			pageSize: 9999999,
			associationRequisition: params.purId,
		});
		if (res.code == 200) {
			setDataSource(res.data);
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
