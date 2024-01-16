import React, { useContext, useRef, useState } from "react";
import { Button, ConfigProvider, Form, Input, Table } from "antd";
import { TableTheme } from "../../theme/theme";
import { CloseCircleFilled } from "@ant-design/icons";

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

const EditableCell: React.FC<EditableCellProps> = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
	const inputRef = useRef<InputRef>(null);
	const form = useContext(EditableContext)!;

	const toggleEdit = () => {
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
		childNode = 1 ? (
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
				}>
				<Input ref={inputRef} onInput={save} />
			</Form.Item>
		) : (
			<div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
				{children}
			</div>
		);
	}

	return (
		<td {...restProps} className="pd-4">
			{childNode}
		</td>
	);
};

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

const ModeSelectTable: React.FC = () => {
	const [dataSource, setDataSource] = useState<DataType[]>([
		{
			key: "0",
			mode: "",
			force: "",
			num: 0,
			price: 0,
			total: 0
		}
	]);

	const [count, setCount] = useState(2);

	const handleDelete = (key: React.Key) => {
		const newData = dataSource.filter(item => item.key !== key);
		setDataSource(newData);
	};

	const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
		{
			title: "初步选型型号",
			dataIndex: "mode",
			editable: true
		},
		{
			title: "额定扭矩/推力",
			editable: true,
			dataIndex: "force"
		},
		{
			title: "数量",
			editable: true,
			dataIndex: "num"
		},
		{
			editable: true,
			title: "单价",
			dataIndex: "price"
		},
		{
			title: "总价",
			width: 100,
			dataIndex: "total",
			render: (text, record: any) => {
				return (
					<div className="flex align-middle justify-around">
						{+record.num * +record.price}
						<CloseCircleFilled onClick={() => handleDelete(record.key)} />
					</div>
				);
			}
		}
	];

	const handleAdd = () => {
		const newData: DataType = {
			key: count,
			mode: "",
			force: "",
			num: 0,
			price: 0,
			total: 0
		};
		setDataSource([...dataSource, newData]);
		setCount(count + 1);
	};

	const handleSave = (row: DataType) => {
		const newData = [...dataSource];
		const index = newData.findIndex(item => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row
		});
		setDataSource(newData);
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell
		}
	};

	const columns = defaultColumns.map(col => {
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
				handleSave
			})
		};
	});

	return (
		<div style={{ width: "480px" }}>
			<div className="flex  justify-end">
				<Button className="mr-4" onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
					新增
				</Button>
			</div>
			<ConfigProvider theme={TableTheme}>
				<Table size="small" pagination={false} components={components} rowClassName={() => "editable-row"} bordered dataSource={dataSource} columns={columns as ColumnTypes} />
			</ConfigProvider>
		</div>
	);
};

export default ModeSelectTable;
