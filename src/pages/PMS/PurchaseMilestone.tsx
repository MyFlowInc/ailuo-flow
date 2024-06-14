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
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import { MilestoneTypeDict, PurchaseStatusEnum } from "../../api/ailuo/dict";
import { useParams } from "react-router";
import { getMilestoneList, removeMilestone } from "../../api/ailuo/pms";
import DeleteFilled from "../../assets/icons/DeleteFilled";
import EditFilled from "../../assets/icons/EditFilled";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BlueTableNoRadiusTheme, BlueTableTheme } from "../../theme/theme";

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

interface PurchaseMilestoneProps {
	form: any;
	setForm: (value: any) => void;
}

const PurchaseMilestone: React.FC<PurchaseMilestoneProps> = ({ form }) => {
	const user = useAppSelector(selectUser);
	const params = useParams<any>();

	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [isShowMilestoneRecordModal, setIsShowMilestoneRecordModal] =
		useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

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
		if (params.purId == "new") {
			setDataSource([]);
			return;
		}
		const res = await getMilestoneList({
			pageNum: 1,
			pageSize: 999999,
			relationRequisition: params.purId,
		});
		if (res.code == 200) {
			console.log(res.data.record);
			setDataSource(res.data.record);
		}
	};

	useEffect(() => {
		fetchData();
	}, [params.purId]);

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center">
				<span className="mr-6">重要事件</span>
				{form?.status == PurchaseStatusEnum.Start && (
					<div className="flex items-center cursor-pointer" onClick={handleAdd}>
						<img src={PlusSvg} alt="" className="mr-2" />
						<span className="text-[#707683]">添加重要事件</span>
					</div>
				)}
			</div>
			<ConfigProvider theme={BlueTableNoRadiusTheme}>
				<Table
					bordered
					size="small"
					dataSource={dataSource}
					columns={defaultColumns as ColumnTypes}
					pagination={false}
				/>
			</ConfigProvider>

			<MilestoneRecordModal
				open={isShowMilestoneRecordModal}
				setOpen={setIsShowMilestoneRecordModal}
				formItem={currentItem}
				modalType={modalType}
				fetchData={fetchData}
			></MilestoneRecordModal>
		</div>
	);
};

export default PurchaseMilestone;
