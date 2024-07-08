import { Button, ConfigProvider, Flex, Modal, Table, message } from "antd";
import { dashboardTheme, TableTheme } from "../../../theme/theme";
import { useEffect, useState } from "react";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import {
	EditFilled,
	DeleteFilled,
	ExclamationCircleFilled,
	PlusCircleFilled,
} from "@ant-design/icons";
import { useAppSelector } from "../../../store/hooks";
import { selectIsManager } from "../../../store/globalSlice";
import DeliveryInfoModal from "../FormModal/DeliveryInfoModal";
import { render } from "@testing-library/react";
import TypeSelectEditor from "../../../components/Dashboard/FormModal/TypeEditor/TypeSelectEditor";
import {
	CellEditorWrap,
	CellLabelRoot,
} from "../../MyAgentPage/FormModal/CellEditorContext";

const BatchDeliveryInfo: React.FC = () => {
	const isManager = useAppSelector(selectIsManager);

	const [dataSource, setDataSource] = useState();
	const [isShowDeliveryModal, setIsShowDeliveryModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [readonly, setReadonly] = useState(true);
	const [modalType, setModalType] = useState<"add" | "edit">("add");
	const [form, setForm] = useState({ model: [] });

	useEffect(() => {
		console.log(form);
	}, [form]);

	const shouldDisabled = (status: any) => {
		let disabled = true;
		if (isManager) {
			disabled = false;
		}
		return disabled;
	};

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		if (isManager || !shouldDisabled(item.status)) {
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
				const res = { code: 200 };
				if (res.code == 200) {
					// await fetchData();
					message.success("删除成功");
				}
			},
		});
	};

	const handleShowDeliveryModal = (type: "add" | "edit") => {
		setReadonly(false);
		setModalType(type);
		setIsShowDeliveryModal(true);
	};

	const columns: any = [
		{
			title: "发货型号",
			dataIndex: "model",
			key: "model",
			render: () => {
				return (
					<CellEditorWrap key={"field_" + "model"}>
						<CellLabelRoot>
							<div className="cell-label-title">
								<div className="cell-drag-text">
									<div>{"发货型号"}</div>
								</div>
							</div>
						</CellLabelRoot>
						<TypeSelectEditor
							mode="multiple"
							key={"model"}
							fixed
							form={form}
							setForm={setForm}
							cell={{ key: "model" }}
							options={[
								{ value: "1", label: "型号1" },
								{ value: "2", label: "型号2" },
							]}
						></TypeSelectEditor>{" "}
					</CellEditorWrap>
				);
			},
		},
		{
			title: "序列号",
			dataIndex: "serialNumber",
			key: "serialNumber",
			type: NumFieldType.SingleText,
		},
		{
			title: "发货人员",
			dataIndex: "serialNumber",
			key: "sender",
			type: NumFieldType.SingleText,
		},
		{
			title: "物流公司",
			dataIndex: "serialNumber",
			key: "company",
			type: NumFieldType.SingleText,
		},
		{
			title: "物流单号",
			dataIndex: "serialNumber",
			key: "trackingNumber",
			type: NumFieldType.SingleText,
		},
		{
			title: "收货人",
			dataIndex: "serialNumber",
			key: "receiever",
			type: NumFieldType.SingleText,
		},
		{
			title: "收获手机号",
			dataIndex: "serialNumber",
			key: "phone",
			type: NumFieldType.SingleText,
		},
		{
			title: "收货地址",
			dataIndex: "serialNumber",
			key: "address",
			type: NumFieldType.SingleText,
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
							disabled={shouldDisabled(record.status) || record.remark}
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
						<span>物流信息</span>
						<div
							className={["flex items-center cursor-pointer "].join("")}
							onClick={() => handleShowDeliveryModal("add")}
						>
							<PlusCircleFilled size={14} />
							<div className="ml-2">添加物流信息</div>
						</div>
					</Flex>
					<ConfigProvider theme={TableTheme}>
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
				<DeliveryInfoModal
					editFlowItemRecord={{}}
					fetchTable={{}}
					projectId={"372"}
					columns={columns}
					open={isShowDeliveryModal}
					setOpen={setIsShowDeliveryModal}
					modalType={modalType}
					readonly={readonly}
				></DeliveryInfoModal>
			</div>
		</ConfigProvider>
	);
};

export default BatchDeliveryInfo;
