import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	Modal,
	Popconfirm,
	Table,
	message,
} from "antd";
import PlusSvg from "./assets/plus.svg";
import { MilestoneRecordModal } from "./FormModal/MilestoneRecordModal";
import { useParams } from "react-router";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsQuality, selectUser } from "../../../../store/globalSlice";
import { PurchaseRecordViewContext } from "../IncomingPurchase/PurchaseRecordView";
import { getMilestoneList, removeMilestone } from "../../../../api/ailuo/pms";
import EditFilled from "../../../../assets/icons/EditFilled";
import DeleteFilled from "../../../../assets/icons/DeleteFilled";
import { PurchaseStatusEnum } from "../../../../api/ailuo/dict";
import {
	BlueTableNoRadiusTheme,
	blueButtonTheme,
} from "../../../../theme/theme";
import { useSelector } from "react-redux";
import { Status } from "../../types";

interface Item {
	key: string;
	name: string;
	age: string;
	address: string;
}

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
	id: number;
	name: string;
	type: string;
	content: string;
	deliveryTime: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface MilestoneTableProps {
	workshopType: string;
	status: Status;
}

const MilestoneTable: React.FC<MilestoneTableProps> = ({
	workshopType,
	status,
}) => {
	const workshop = useSelector((state) => (state as any).global.curWorkshop);
	const user = useAppSelector(selectUser);
	const isQuality = useAppSelector(selectIsQuality);
	const params = useParams<any>();
	const { updateMilestoneCount } = useContext(PurchaseRecordViewContext);

	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [isShowMilestoneRecordModal, setIsShowMilestoneRecordModal] =
		useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");
	const [disabled, setDisabled] = useState(false);

	const handleDelete = (item: any) => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			async onOk() {
				const res = await removeMilestone({ id: item.id });
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

	const handleEdit = (item: any) => {
		setCurrentItem(item);
		setIsShowMilestoneRecordModal(true);
		setModalType("edit");
	};

	const defaultColumns: (ColumnTypes[number] & {
		dataIndex: string;
	})[] = [
		{
			title: "时间",
			dataIndex: "createTime",
		},
		{
			title: "人员",
			dataIndex: "name",
		},
		{
			title: "类型",
			dataIndex: "type",
		},
		{
			title: "描述",
			dataIndex: "content",
		},
		{
			title: "是否影响交期",
			dataIndex: "deliveryTime",
			render: (text, record) => {
				return <div>{text == "yes" ? "是" : "否"}</div>;
			},
		},
		{
			width: 90,
			title: "操作",
			dataIndex: "action",
			key: "action",
			render: (text: any, record: any, index: number) => {
				return (
					!record.remark &&
					!isQuality && (
						<div className="flex items-center justify-around">
							<Button
								type="text"
								color="#717682"
								icon={<EditFilled />}
								className="text-[#717682]"
								disabled={disabled}
								onClick={() => handleEdit(record)}
							></Button>
							<Button
								type="text"
								color="#717682"
								icon={<DeleteFilled />}
								className="text-[#717682]"
								disabled={disabled}
								onClick={() => handleDelete(record)}
							></Button>
						</div>
					)
				);
			},
		},
	];

	const handleAdd = () => {
		setIsShowMilestoneRecordModal(true);
		setCurrentItem({ deliveryTime: "no", name: user.username });
		setModalType("add");
	};

	const fetchData = async () => {
		const res = await getMilestoneList({
			pageNum: 1,
			pageSize: 999999,
			relatedWorkshop: params.wspId,
			workshopType,
		});
		if (res.code == 200) {
			setDataSource(res.data.record);
		}
	};

	useEffect(() => {
		fetchData();
	}, [params.wspId]);

	useEffect(() => {
		if (status === "start") {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [status]);

	return (
		<div className="mt-4">
			{!disabled && (
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						className="mb-4"
						type="primary"
						icon={<EditFilled></EditFilled>}
						onClick={handleAdd}
					>
						新建重要事件
					</Button>
				</ConfigProvider>
			)}

			<ConfigProvider>
				<Table
					bordered
					size="small"
					dataSource={dataSource}
					columns={defaultColumns as ColumnTypes}
					pagination={false}
					scroll={{ y: "70vh" }}
				/>
			</ConfigProvider>

			<MilestoneRecordModal
				open={isShowMilestoneRecordModal}
				setOpen={setIsShowMilestoneRecordModal}
				formItem={currentItem}
				modalType={modalType}
				fetchData={fetchData}
				workshopType={workshopType}
			></MilestoneRecordModal>
		</div>
	);
};

export default MilestoneTable;
