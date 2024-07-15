import { Button, ConfigProvider, Flex, Modal, Table, Tag, message } from "antd";
import { dashboardTheme, TableTheme } from "../../../theme/theme";
import { useEffect, useState } from "react";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import {
	EditFilled,
	DeleteFilled,
	ExclamationCircleFilled,
	PlusCircleFilled,
} from "@ant-design/icons";
import DeliveryInfoModal from "../FormModal/DeliveryInfoModal";
import {
	fetchDeliverInfo,
	removeDeliverInfo,
} from "../../../api/ailuo/deliver";
import { useParams } from "react-router";

interface BatchDeliveryInfoProps {
	canAddDeliverInfo: boolean;
	equips: any;
}

const BatchDeliveryInfo: React.FC<BatchDeliveryInfoProps> = (
	props: BatchDeliveryInfoProps,
) => {
	const parms = useParams<{ deliverId: any; batchId: any }>();
	const [dataSource, setDataSource] = useState();
	const [isShowDeliveryModal, setIsShowDeliveryModal] = useState(false);
	const [currentItem, setCurrentItem] = useState<any>({});
	const [readonly, setReadonly] = useState(true);
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const fecthDeliverInfo = async () => {
		const resp = await fetchDeliverInfo({ relationBatch: parms.batchId });
		if (resp.success) {
			setDataSource(resp.data.record);
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		fecthDeliverInfo();
	}, [props.equips]);

	const shouldDisabled = (status: any) => {
		return !props.canAddDeliverInfo;
	};

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		if (!shouldDisabled(item.status)) {
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
				const res = await removeDeliverInfo({ id: item.id });
				if (res.code == 200) {
					message.success("删除成功");
					fecthDeliverInfo();
				} else {
					message.error(res.msg);
				}
			},
		});
	};

	const handleShowDeliveryModal = (type: "add" | "edit") => {
		setReadonly(false);
		setModalType(type);
		setCurrentItem({});
		setIsShowDeliveryModal(true);
	};

	const columns: any = [
		{
			title: "发货型号",
			dataIndex: "equipmentinformationchildren",
			key: "equipmentinformationchildren",
			showCtrlKey: "showEquip",
			render: (record: any) => {
				return record.map((equip: any) => {
					return (
						<Tag key={equip.id} color={"#F3F7FF"} style={{ color: "#000" }}>
							{equip.name}
						</Tag>
					);
				});
			},
		},
		{
			title: "序号",
			dataIndex: "oddNumbers",
			key: "oddNumbers",
			type: NumFieldType.SingleText,
		},
		{
			title: "发货人员",
			dataIndex: "consignor",
			key: "consignor",
			type: NumFieldType.SingleText,
		},
		{
			title: "物流公司",
			dataIndex: "company",
			key: "company",
			type: NumFieldType.SingleText,
		},
		{
			title: "物流单号",
			dataIndex: "logisticsNumber",
			key: "logisticsNumber",
			type: NumFieldType.SingleText,
		},
		{
			title: "收货人",
			dataIndex: "consignee",
			key: "consignee",
			type: NumFieldType.SingleText,
		},
		{
			title: "收货手机号",
			dataIndex: "phone",
			key: "phone",
			type: NumFieldType.SingleText,
		},
		{
			title: "收货地址",
			dataIndex: "address",
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
						{props.canAddDeliverInfo && (
							<div
								className={["flex items-center cursor-pointer "].join("")}
								onClick={() => handleShowDeliveryModal("add")}
							>
								<PlusCircleFilled size={14} />
								<div className="ml-2">添加物流信息</div>
							</div>
						)}
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
					editFlowItemRecord={currentItem}
					fetchTable={fecthDeliverInfo}
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
