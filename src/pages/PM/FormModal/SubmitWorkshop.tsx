import React, { useContext, useEffect, useRef, useState } from "react";
import {
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
} from "antd";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme } from "../../../theme/theme";
import styled from "styled-components";
import PrepareForm from "./PrepareForm";

const SubmitWorkshopWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const SubmitWorkshop: React.FC<any> = (props: any) => {
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);

	return (
		<SubmitWorkshopWrapper
			className="w-full flex flex-col"
			style={{ paddingRight: "200px" }}
		>
			<div>
				<PrepareForm />
			</div>
			<ConfigProvider theme={TableTheme}>
				<ModelTable
					key={"ModelTable" + props.key}
					{...{
						column,
						form,
						setForm,
					}}
				/>
			</ConfigProvider>
		</SubmitWorkshopWrapper>
	);
};

export default SubmitWorkshop;

type InputRef = any;
type FormInstance<T> = any;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	mode: string;
	force: string;
	num: number;
	price: number;
	total: number;
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
	children: React.ReactNode;
	dataIndex: keyof Item;
	record: Item;
	handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
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
	const numKeys = ["num", "price"];
	useEffect(() => {
		if (editing) {
			inputRef.current!.focus();
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
			// console.log("Received values of form: ", record, values);
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
				rules={
					[
						// {
						// 	required: true,
						// 	message: `${title} is required.`
						// }
					]
				}
			>
				{numKeys.includes(dataIndex) && (
					<InputNumber
						size="small"
						style={{ width: "56px" }}
						ref={inputRef}
						onPressEnter={save}
						onBlur={save}
					/>
				)}
				{!numKeys.includes(dataIndex) && (
					<Input
						size="small"
						style={{ width: "56px" }}
						ref={inputRef}
						onPressEnter={save}
						onBlur={save}
					/>
				)}
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{ paddingRight: 12 }}
				onClick={toggleEdit}
			>
				{_.get(children, "1") ? children : "点击输入"}
			</div>
		);
	}

	return (
		<td {...restProps} className="overflow-hidden">
			{childNode}
		</td>
	);
};
const { Text } = Typography;

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
	key: React.Key;
	mode: string;
	force: string;
	num: number;
	price: number;
	total: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
const item = {
	key: "0",
	mode: "",
	force: "",
	num: 0,
	price: 0,
	total: 0,
};
const ModelTable: React.FC = (props: any) => {
	const { column, form, setForm } = props;
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [count, setCount] = useState(1);
	const debouncedSetForm = _.debounce(setForm, 300);

	useEffect(() => {
		let records = _.get(form, column.dataIndex) || [];
		if (typeof records === "string") {
			try {
				records = JSON.parse(records);
			} catch (error) {
				records = [];
			}
		}
		setDataSource(records);
		setCount(records.length + 1);
	}, [form.typeSelection]);

	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(column, "disabled")) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [column]);

	const handleDelete = (key: React.Key) => {
		const newData = dataSource.filter((item) => item.key !== key);
		setDataSource(newData);
		// console.log("do update");
		debouncedSetForm({
			...form,
			[column.dataIndex]: newData,
		});
	};

	const defaultColumns: any = [
		{
			title: "型号",
			dataIndex: "mode",
			editable: true,
		},
		{
			title: "序列号",
			editable: true,
			dataIndex: "force",
		},
		{
			title: "配料单",
			editable: true,
			dataIndex: "num",
		},
		{
			title: "BOM",
			editable: true,
			dataIndex: "num",
		},
		{
			title: "加工图纸包",
			editable: true,
			dataIndex: "num",
		},
		{
			title: "装配图纸包",
			editable: true,
			dataIndex: "num",
		},
		{
			title: "作业指导书",
			editable: true,
			dataIndex: "num",
		},
		{
			editable: true,
			title: "操作",
			dataIndex: "price",
			render: (text: any, record: any) => {
				return (
					<div className="flex items-center justify-around">
						{record.price}
						<CloseCircleFilled onClick={() => handleDelete(record.key)} />
					</div>
				);
			},
		},
	];

	const handleAdd = () => {
		const newData: DataType = {
			key: count,
			mode: "",
			force: "",
			num: 0,
			price: 0,
			total: 0,
		};
		setDataSource([...dataSource, newData]);
		debouncedSetForm({
			// typeSelection
			...form,
			[column.dataIndex]: [...dataSource, newData],
		});
		setCount(count + 1);
		// console.log("do update");
	};

	const handleSave = (row: DataType) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];
		// hack
		row.total = row.num * row.price;

		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataSource(newData);
		debouncedSetForm({
			...form,
			[column.dataIndex]: newData,
		});
		// console.log("do update");
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const columns = defaultColumns.map((col: any) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: DataType) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});

	return (
		<div className="w-full">
			<div className="flex mb-4">
				<div
					className={["flex items-center ", disabled ? "hidden" : ""].join("")}
					onClick={handleAdd}
				>
					<PlusCircleFilled size={14} />
					<div className="ml-2">添加型号</div>
				</div>
			</div>
			<div
				className="w-full overflow-hidden overflow-x-auto"
				style={{ pointerEvents: disabled ? "none" : "auto" }}
			>
				<ConfigProvider theme={TableTheme}>
					<Table
						size="small"
						pagination={false}
						components={components}
						rowClassName={() => "editable-row"}
						bordered
						dataSource={dataSource}
						columns={columns as ColumnTypes}
					/>
				</ConfigProvider>
			</div>
		</div>
	);
};
