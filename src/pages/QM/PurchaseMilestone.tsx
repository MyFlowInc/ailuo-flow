import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import PlusSvg from "./assets/plus.svg";
import { MilestoneRecordModal } from "./FormModal/MilestoneRecordModal";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import { PurchaseStatusEnum } from "../../api/ailuo/dict";
import { useParams } from "react-router";
import { getMilestoneList } from "../../api/ailuo/pms";
import DeleteFilled from "../../assets/icons/DeleteFilled";
import EditFilled from "../../assets/icons/EditFilled";

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
	disabled: boolean;
}

const PurchaseMilestone: React.FC<PurchaseMilestoneProps> = ({
	form,
	disabled = false,
}) => {
	const user = useAppSelector(selectUser);
	const params = useParams<any>();

	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [isShowMilestoneRecordModal, setIsShowMilestoneRecordModal] =
		useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const handleDelete = (id: number) => {
		const newData = dataSource.filter((item) => item.id !== id);
		setDataSource(newData);
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
		// {
		// 	width: 90,
		// 	title: "操作",
		// 	dataIndex: "action",
		// 	key: "action",
		// 	render: (text: any, record: any, index: number) => {
		// 		if (disabled) {
		// 			return;
		// 		}
		// 		return (
		// 			!record.remark && (
		// 				<div className="flex items-center justify-around">
		// 					<Button
		// 						type="text"
		// 						color="#717682"
		// 						icon={<EditFilled />}
		// 						className="text-[#717682]"
		// 						onClick={() => handleEdit(record)}
		// 					></Button>
		// 					<Button
		// 						type="text"
		// 						color="#717682"
		// 						icon={<DeleteFilled />}
		// 						className="text-[#717682]"
		// 						onClick={() => handleDelete(record)}
		// 					></Button>
		// 				</div>
		// 			)
		// 		);
		// 	},
		// },
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
			relatedProject: params.purId,
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
			</div>

			<Table
				bordered
				dataSource={dataSource}
				columns={defaultColumns as ColumnTypes}
				pagination={false}
			/>
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
