import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Popover,
	Table,
	Typography,
} from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme, blueButtonTheme } from "../../../theme/theme";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import {
	Attachment,
	NumFieldType,
} from "../../../components/Dashboard/TableColumnRender";
import TypeAttachment from "../../../components/Dashboard/FormModal/TypeEditor/TypeAttachment";
import SplDatabaseModal from "../../../components/Dashboard/SplDatabaseModal";
import { SplDatabaseImportTypeEnum } from "../../../enums/commonEnum";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import { useAppSelector } from "../../../store/hooks";
import {
	selectIsFinance,
	selectIsManager,
	selectIsProduct,
} from "../../../store/globalSlice";
type InputRef = any;
type FormInstance<T> = any;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	name: string;
	serialNumber: string;
	ingredientsList: string;
	bom: string;
	processPkg: string;
	fitOutPkg: string;
	operationInstruction: string;
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
	name: string;
	serialNumber: string;
	ingredientsList: string;
	bom: string;
	processPkg: string;
	fitOutPkg: string;
	operationInstruction: string;
}

interface SPLModeSelectProps {
	dataSource: DataType[];
	setDataSource: (dataSource: DataType[]) => void;
	rootStyle?: React.CSSProperties;
	step: SPLProductStatusMap;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
const SPLModeSelect: React.FC<SPLModeSelectProps> = ({
	rootStyle,
	dataSource,
	setDataSource,
	step,
}) => {
	// const [dataSource, setDataSource] = useState<DataType[]>([])
	const isManage = useAppSelector(selectIsManager);
	const isProduct = useAppSelector(selectIsProduct);
	const [count, setCount] = useState(1);
	const [isShowGenerateIndexRender, setIsShowGenerateIndexRender] =
		useState(false);
	const [firstIndex, setFirstIndex] = useState("");
	const [isShowSplDatabaseModal, setIsShowSplDatabaseModal] = useState(false);
	const [importType, setImportType] = useState<SplDatabaseImportTypeEnum>(0);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectRowKeys, setSelectRowKeys] = useState<any[]>([]);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		setDisabled(
			step === SPLProductStatusMap.MaterialsRev ||
				step === SPLProductStatusMap.SubWorkshop ||
				step === SPLProductStatusMap.Ended ||
				step === SPLProductStatusMap.ChangeReview,
		);
		if (!isManage && !isProduct) {
			setDisabled(true);
		}
	}, [step]);

	const handleDelete = (key: React.Key) => {
		const newData = dataSource.filter((item) => item.key !== key);
		setDataSource(newData);
	};

	const generateSerialNumber = (inputSerial: string, interval: number) => {
		const regex = /(.*)(\d{6})$/;
		const match = inputSerial.match(regex);
		if (match) {
			const nonDigitPart = match[1]; // 非数字部分
			const digitPart = match[2]; // 数字部分
			const incrementedDigitPart = (
				parseInt(digitPart, 10) + interval
			).toString();
			// 确保数字部分是6位，不足6位时前面补0
			const paddedIncrementedDigitPart = incrementedDigitPart.padStart(6, "0");
			const newSerial = `${nonDigitPart}${paddedIncrementedDigitPart}`;
			return newSerial;
		} else {
			// 如果没有匹配到数字部分 返回 '000001'
			return inputSerial + "000001";
		}
	};

	const handleGenerateIndex = () => {
		setIsShowGenerateIndexRender(false);
		let currentSerialNumber = firstIndex;
		let isFirst = true;
		dataSource.map((item, index) => {
			if (selectRowKeys.includes(item.key)) {
				item.serialNumber = isFirst
					? generateSerialNumber(currentSerialNumber, 0)
					: generateSerialNumber(currentSerialNumber, 1);
				isFirst = false;
				currentSerialNumber = item.serialNumber;
			}
		});
		setDataSource([...dataSource]);
	};

	const generateIndexRender = () => {
		return (
			<Popover
				content={
					<div className="flex items-center">
						<Input
							placeholder="输入首个序列号"
							value={firstIndex}
							onChange={(e) => setFirstIndex(e.target.value)}
						></Input>
						<a className="ml-2 whitespace-nowrap" onClick={handleGenerateIndex}>
							确认
						</a>
					</div>
				}
				trigger="click"
				open={isShowGenerateIndexRender}
				onOpenChange={(newOpen: boolean) => {
					setFirstIndex("");
					setIsShowGenerateIndexRender(newOpen);
				}}
			>
				<span className="ml-2 cursor-pointer text-[#5966D6]">生成</span>
			</Popover>
		);
	};

	const renderAttachment = (
		text: any,
		record: any,
		index: number,
		key: any,
	) => {
		return disabled ? (
			<Attachment value={record[key]}></Attachment>
		) : (
			<TypeAttachment
				setForm={(form: any) => {
					dataSource[index] = {
						...dataSource[index],
						...form,
					};
					setDataSource([...dataSource]);
				}}
				cell={{ key }}
				form={{ [key]: record[key] }}
				enableSplDatabase
				splDatabaseField={key}
			></TypeAttachment>
		);
	};

	const defaultColumns: any = [
		{
			width: 90,
			title: "型号",
			dataIndex: "name",
			editable: !disabled,
			key: "name",
		},
		{
			width: 100,
			title: ({ sortOrder, sortColumn, filters }: any) => {
				return (
					<div className="w-24">
						序列号
						{!disabled && generateIndexRender()}
					</div>
				);
			},
			editable: !disabled,
			dataIndex: "serialNumber",
			key: "serialNumber",
		},
		{
			width: 120,
			title: "配料单",
			dataIndex: "ingredientsList",
			key: "ingredientsList",
			type: NumFieldType.Attachment,
			render: (text: any, record: any, index: number) =>
				renderAttachment(text, record, index, "ingredientsList"),
		},
		{
			width: 100,
			title: "BOM",
			dataIndex: "bom",
			key: "bom",
			type: NumFieldType.Attachment,
			render: (text: any, record: any, index: number) =>
				renderAttachment(text, record, index, "bom"),
		},
		{
			width: 150,
			title: "加工图纸包",
			dataIndex: "processPkg",
			key: "processPkg",
			type: NumFieldType.Attachment,
			render: (text: any, record: any, index: number) =>
				renderAttachment(text, record, index, "processPkg"),
		},
		{
			width: 150,
			title: "装配图纸包",
			dataIndex: "fitOutPkg",
			key: "fitOutPkg",
			type: NumFieldType.Attachment,
			render: (text: any, record: any, index: number) =>
				renderAttachment(text, record, index, "fitOutPkg"),
		},
		{
			width: 150,
			title: "作业指导书",
			dataIndex: "operationInstruction",
			key: "operationInstruction",
			type: NumFieldType.Attachment,
			render: (text: any, record: any, index: number) =>
				renderAttachment(text, record, index, "operationInstruction"),
		},
		{
			width: 200,
			title: "操作",
			dataIndex: "action",
			hidden: disabled,
			render: (text: any, record: any, index: number) => {
				return (
					<div className="flex items-center justify-around">
						<Button
							type="text"
							className="text-[#5966D6]"
							onClick={() => {
								setCurrentIndex(index);
								setImportType(SplDatabaseImportTypeEnum.同型号导入);
								setIsShowSplDatabaseModal(true);
							}}
						>
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
			name: "",
			serialNumber: "",
			ingredientsList: "",
			bom: "",
			processPkg: "",
			fitOutPkg: "",
			operationInstruction: "",
		};
		setDataSource([...dataSource, newData]);
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

	const handleBatchInsert = (fields: string[], record: any) => {
		fields.forEach((field) => {
			const value = dataSource[currentIndex]?.[field as keyof DataType];
			if (value && record[field]) {
				dataSource[currentIndex][field as keyof DataType] = JSON.stringify([
					...JSON.parse(value as string),
					...JSON.parse(record[field]),
				]);
			} else if (record[field]) {
				dataSource[currentIndex][field as keyof DataType] = record[field];
			}
		});
		setDataSource([...dataSource]);
	};

	const onSplDatabaseImport = (record: any) => {
		setIsShowSplDatabaseModal(false);
		handleBatchInsert(
			[
				"ingredientsList",
				"bom",
				"fitOutPkg",
				"operationInstruction",
				"processPkg",
			],
			record,
		);
	};

	const onBatchImport = (selectedRow: any) => {
		dataSource.push(
			...selectedRow.map((item: any, index: number) => ({
				ingredientsList: item.ingredientsList,
				bom: item.bom,
				fitOutPkg: item.fitOutPkg,
				operationInstruction: item.operationInstruction,
				processPkg: item.processPkg,
				key: new Date().getTime() + index,
			})),
		);

		setDataSource([
			...dataSource.filter(
				(item) =>
					!(
						!item.ingredientsList &&
						!item.bom &&
						!item.processPkg &&
						!item.fitOutPkg &&
						!item.operationInstruction
					),
			),
		]);
		setIsShowSplDatabaseModal(false);
	};

	return (
		<div
			className={"pb-10"}
			style={rootStyle ? rootStyle : { paddingRight: "200px", width: "100%" }}
		>
			<div
				className={[
					"flex mb-4 justify-between items-center",
					disabled && "!hidden",
				].join(" ")}
			>
				<div className={"flex items-center cursor-pointer"} onClick={handleAdd}>
					<PlusCircleFilled size={14} />
					<div className="ml-2">添加型号</div>
				</div>
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						type="primary"
						onClick={() => {
							setImportType(SplDatabaseImportTypeEnum.多型号导入);
							setIsShowSplDatabaseModal(true);
						}}
					>
						一键导入多型号所有资料
					</Button>
				</ConfigProvider>
			</div>
			<div
				className="w-full overflow-hidden overflow-x-auto"
				// style={{ pointerEvents: disabled ? "none" : "auto" }}
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
						rowSelection={{
							fixed: true,
							onChange: (selectedRowKeys, selectedRows) => {
								console.log(selectedRows);
								setSelectRowKeys(selectedRowKeys);
							},
						}}
					/>
				</ConfigProvider>
			</div>
			{isShowSplDatabaseModal && (
				<SplDatabaseModal
					open={isShowSplDatabaseModal}
					setOpen={setIsShowSplDatabaseModal}
					importType={importType}
					setImportFlowItemRecord={onSplDatabaseImport}
					onBatchImport={onBatchImport}
				></SplDatabaseModal>
			)}
		</div>
	);
};
export default SPLModeSelect;
