import { Button, ConfigProvider, Flex, Modal, Table, message } from "antd";
import { dashboardTheme, TableTheme } from "../../../theme/theme";
import { useState } from "react";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import {
	EditFilled,
	DeleteFilled,
	ExclamationCircleFilled,
	PlusCircleFilled,
} from "@ant-design/icons";
import DeliveryModelModal from "../FormModal/DeliveryModelModal";
import { useAppSelector } from "../../../store/hooks";
import { selectIsManager } from "../../../store/globalSlice";
import ModelSelectModal from "../FormModal/ModelSelectModal";
import { removeEquip, updateEquip } from "../../../api/ailuo/deliver";

interface BatchModelTableProp {
	dataSource: any;
	fetchBatchInfo: any;
	canAddModel: boolean;
}

const BatchModelTable: React.FC<BatchModelTableProp> = (
	props: BatchModelTableProp,
) => {
	const isManager = useAppSelector(selectIsManager);

	const [isShowDeliveryModal, setIsShowDeliveryModal] = useState(false);
	const [isShowSelectModal, setIsShowSelectModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [readonly, setReadonly] = useState(true);
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const shouldDisabled = (status: any) => {
		return !props.canAddModel;
	};

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		if (!shouldDisabled(item.status) && item.defaultIdentification === "no") {
			setReadonly(false);
		} else {
			setReadonly(true);
		}
		setIsShowDeliveryModal(true);
	};

	const handleDelete = async (item: any) => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			async onOk() {
				let res: any;
				if (item.defaultIdentification === "yes") {
					res = await updateEquip({
						id: item.id,
						choice: "no",
						relationBatch: "",
					});
				} else {
					res = await removeEquip({ id: item.id });
				}
				if (res.code == 200) {
					await props.fetchBatchInfo();
					message.success("删除成功");
				} else {
					message.error(res.msg);
				}
			},
		});
	};

	const handleSelectModal = () => {
		setIsShowSelectModal(true);
	};

	const handleShowDeliveryModal = (type: "add" | "edit") => {
		setReadonly(false);
		setModalType(type);
		setIsShowDeliveryModal(true);
		setCurrentItem({});
	};

	const columns: any = [
		{
			title: "型号",
			dataIndex: "name",
			key: "name",
			type: NumFieldType.SingleText,
		},
		{
			title: "序列号",
			dataIndex: "serialNumber",
			key: "serialNumber",
			type: NumFieldType.SingleText,
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark",
			type: NumFieldType.Text,
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
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
							disabled={shouldDisabled(record.status)}
							onClick={() => handleDelete(record)}
						></Button>
					</div>
				);
			},
		},
	];
	return (
		<ConfigProvider theme={dashboardTheme}>
			<div className="mt-8 mb-8">
				<Flex gap={20} vertical>
					<Flex gap={10}>
						<span>设备资料包</span>
						{props.canAddModel && (
							<div
								className={["flex items-center cursor-pointer "].join("")}
								onClick={handleSelectModal}
							>
								<PlusCircleFilled size={14} />
								<div className="ml-2">添加设备</div>
							</div>
						)}
						{props.canAddModel && (
							<div
								className={["flex items-center cursor-pointer "].join("")}
								onClick={() => handleShowDeliveryModal("add")}
							>
								<PlusCircleFilled size={14} />
								<div className="ml-2">添加交付材料</div>
							</div>
						)}
					</Flex>
					<ConfigProvider theme={TableTheme}>
						<Table
							bordered
							rowKey={"id"}
							size="small"
							pagination={false}
							dataSource={props.dataSource}
							columns={columns}
							scroll={{ y: "70vh" }}
						/>
					</ConfigProvider>
				</Flex>
				<DeliveryModelModal
					editFlowItemRecord={currentItem}
					fetchTable={props.fetchBatchInfo}
					columns={columns}
					open={isShowDeliveryModal}
					setOpen={setIsShowDeliveryModal}
					modalType={modalType}
					readonly={readonly}
				></DeliveryModelModal>
				<ModelSelectModal
					fetchTable={props.fetchBatchInfo}
					open={isShowSelectModal}
					setOpen={setIsShowSelectModal}
				></ModelSelectModal>
			</div>
		</ConfigProvider>
	);
};

export default BatchModelTable;
