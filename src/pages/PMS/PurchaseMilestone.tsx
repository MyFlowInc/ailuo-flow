import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import PlusSvg from "./assets/plus.svg";
import { MilestoneRecordModal } from "./FormModal/MilestoneRecordModal";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	name: string;
	age: string;
	address: string;
}

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

interface EditableCellProps {
	title: React.ReactNode;
	editable: boolean;
	dataIndex: keyof Item;
	record: Item;
	handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef<InputRef>(null);
	const form = useContext(EditableContext)!;

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({ [dataIndex]: record[dataIndex] });
	};

	const save = async () => {
		try {
			const values = await form.validateFields();

			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0 }}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} is required.`,
					},
				]}
			>
				<Input ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{ paddingRight: 24 }}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
	id: number;
	name: string;
	type: string;
	content: string;
	deliveryTime: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const PurchaseMilestone: React.FC = () => {
	const user = useAppSelector(selectUser);

	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [isShowMilestoneRecordModal, setIsShowMilestoneRecordModal] =
		useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const handleDelete = (id: number) => {
		const newData = dataSource.filter((item) => item.id !== id);
		setDataSource(newData);
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
		},
	];

	const handleAdd = () => {
		setIsShowMilestoneRecordModal(true);
		setCurrentItem({ deliveryTime: "no", name: user.username });
		setModalType("add");
	};

	const handleSave = (row: DataType) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataSource(newData);
	};

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center">
				<span className="mr-6">重要事件</span>
				<div className="flex items-center cursor-pointer" onClick={handleAdd}>
					<img src={PlusSvg} alt="" className="mr-2" />
					<span className="text-[#707683]">添加重要事件</span>
				</div>
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
			></MilestoneRecordModal>
		</div>
	);
};

export default PurchaseMilestone;
