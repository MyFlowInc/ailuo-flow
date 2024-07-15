import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import {
	Button,
	ConfigProvider,
	Flex,
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
import { ExclamationCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import {
	selectIsDeliver,
	selectIsManager,
	selectIsQuality,
	selectIsWorkshop,
	selectUser,
} from "../../../../store/globalSlice";
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
	workshopId?: string;
}

const MilestoneTable: React.FC<MilestoneTableProps> = ({
	workshopType,
	status,
	workshopId,
}) => {
	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const isWorkshop = useAppSelector(selectIsWorkshop);
	const isDeliver = useAppSelector(selectIsDeliver);
	const params = useParams<any>();

	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [isShowMilestoneRecordModal, setIsShowMilestoneRecordModal] =
		useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");
	const [disabled, setDisabled] = useState(false);
	const [readonly, setReadonly] = useState(true);

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
		if (isManager || !disabled) {
			setReadonly(false);
		} else {
			setReadonly(true);
		}
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
			hidden: workshopType === "batch",
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
					!record.remark && (
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
		setReadonly(false);
	};

	const fetchData = async () => {
		let request: any = {
			pageNum: 1,
			pageSize: 999999,
			relatedWorkshop: params.wspId,
			workshopType,
		};
		switch (workshopType) {
			case "machining": {
				request.relatedMachining = workshopId;
				request.workshopType = "";
				break;
			}
			case "assembling": {
				request.relatedAssembling = workshopId;
				request.workshopType = "";
				break;
			}
			case "batch": {
				request.relatedBatch = workshopId;
				request.workshopType = "";
				request.relatedWorkshop = "";
				break;
			}
		}
		const res = await getMilestoneList(request);
		if (res.code == 200) {
			setDataSource(res.data.record);
		}
	};

	useEffect(() => {
		//只有开始阶段车间可以更改 或者 经理任何时候都能更改
		if (
			((workshopType === "batch" ? status !== "over" : status === "start") &&
				(workshopType === "batch" ? isDeliver : isWorkshop)) ||
			isManager
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [status]);

	useEffect(() => {
		if (workshopId) {
			fetchData();
		}
	}, [workshopId]);

	return (
		<div className="mt-8">
			<Flex align="center" gap={10} className="mb-4">
				<span>重要事件</span>
				{!disabled && (
					<ConfigProvider theme={blueButtonTheme}>
						{(((workshopType === "batch"
							? status !== "over"
							: status === "start") &&
							(workshopType === "batch" ? isDeliver : isWorkshop)) ||
							isManager) && (
							<div
								className={["flex items-center cursor-pointer "].join("")}
								onClick={handleAdd}
							>
								<PlusCircleFilled size={14} />
								<div className="ml-2">新建重要事件</div>
							</div>
						)}
					</ConfigProvider>
				)}
			</Flex>

			<ConfigProvider>
				<Table
					bordered
					size="small"
					dataSource={dataSource}
					columns={defaultColumns as ColumnTypes}
					pagination={false}
					scroll={{ y: "70vh" }}
					rowKey={"id"}
				/>
			</ConfigProvider>

			<MilestoneRecordModal
				open={isShowMilestoneRecordModal}
				setOpen={setIsShowMilestoneRecordModal}
				formItem={currentItem}
				modalType={modalType}
				fetchData={fetchData}
				workshopType={workshopType}
				workshopId={workshopId}
				readonly={readonly}
			></MilestoneRecordModal>
		</div>
	);
};

export default MilestoneTable;
