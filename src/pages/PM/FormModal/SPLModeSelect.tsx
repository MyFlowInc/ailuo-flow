import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
} from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme } from "../../../theme/theme";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import {
	Attachment,
	NumFieldType,
} from "../../../components/Dashboard/TableColumnRender";
import TypeAttachment from "../../../components/Dashboard/FormModal/TypeEditor/TypeAttachment";
type InputRef = any;
type FormInstance<T> = any;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	mode: string;
	force: string;
	ingredientsList: [];
	bom: [];
	processPkg: [];
	fitOutPkg: [];
	operationInstruction: [];
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
	type: number;
	column: any;
	handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	type,
	column,
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
	// const columnKey = column?.key;
	// switch (type) {
	// 	case NumFieldType.Attachment:
	// 		childNode = <Attachment value={record[columnKey as keyof Item]} />;
	// 		break;
	// 	default:
	// 		break;
	// }

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
	ingredientsList: [];
	bom: [];
	processPkg: [];
	fitOutPkg: [];
	operationInstruction: [];
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
const item = {
	key: "0",
	mode: "",
	force: "",
	ingredientsList: [],
	bom: [],
	processPkg: [],
	fitOutPkg: [],
	operationInstruction: [],
};
const SPLModeSelect: React.FC = (props: any) => {
	const { column, form, setForm, rootStyle } = props;
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
			key: "mode",
		},
		{
			title: "序列号",
			editable: true,
			dataIndex: "force",
			key: "force",
		},
		{
			title: "配料单",
			dataIndex: "ingredientsList",
			key: "ingredientsList",
			type: NumFieldType.Attachment,
			render: (text: any, record: any) => {
				return text.length ? (
					<Attachment value={record[text]} />
				) : (
					<TypeAttachment
						setForm={() => { }}
						cell={{ key: "ingredientsList" }}
						form={{}}
						enableSplDatabase
					></TypeAttachment>
				);
			},
		},
		{
			title: "BOM",
			dataIndex: "bom",
			key: "bom",
			type: NumFieldType.Attachment,
			render: (text: any, record: any) => {
				return text.length ? (
					<Attachment value={record[text]} />
				) : (
					<TypeAttachment
						setForm={() => { }}
						cell={{ key: "bom" }}
						form={{}}
						enableSplDatabase
					></TypeAttachment>
				);
			},
		},
		{
			title: "加工图纸包",
			dataIndex: "processPkg",
			key: "processPkg",
			type: NumFieldType.Attachment,
			render: (text: any, record: any) => {
				return text.length ? (
					<Attachment value={record[text]} />
				) : (
					<TypeAttachment
						setForm={() => { }}
						cell={{ key: "processPkg" }}
						form={{}}
						enableSplDatabase
					></TypeAttachment>
				);
			},
		},
		{
			title: "装配图纸包",
			dataIndex: "fitOutPkg",
			key: "fitOutPkg",
			type: NumFieldType.Attachment,
			render: (text: any, record: any) => {
				return text.length ? (
					<Attachment value={record[text]} />
				) : (
					<TypeAttachment
						setForm={() => { }}
						cell={{ key: "fitOutPkg" }}
						form={{}}
						enableSplDatabase
					></TypeAttachment>
				);
			},
		},
		{
			title: "作业指导书",
			dataIndex: "operationInstruction",
			key: "operationInstruction",
			type: NumFieldType.Attachment,
			render: (text: any, record: any) => {
				return text.length ? (
					<Attachment value={record[text]} />
				) : (
					<TypeAttachment
						setForm={() => { }}
						cell={{ key: "operationInstruction" }}
						form={{}}
						enableSplDatabase
					></TypeAttachment>
				);
			},
		},
		{
			title: "操作",
			dataIndex: "action",
			render: (text: any, record: any) => {
				return (
					<div className="flex items-center justify-around">
						<Button type="text" className="text-[#5966D6]">
							一键导入同型号所有资料
						</Button>
						<DeleteFilled
							className="text-[#707683]"
							onClick={() => handleDelete(record.key)}
						/>
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
			ingredientsList: [],
			bom: [],
			processPkg: [],
			fitOutPkg: [],
			operationInstruction: [],
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
		<div className={'w-full pb-10'} style={rootStyle ? rootStyle : { paddingRight: "200px" }}>
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
export default SPLModeSelect;
