import React, { useEffect, useState } from "react";
import {
	Button,
	ConfigProvider,
	Flex,
	Form,
	Modal,
	Table,
	message,
} from "antd";
import CellEditorContext from "./CellEditorContext";
import { NoFieldData } from "./NoFieldData";
import { greyButtonTheme } from "../../../theme/theme";
import { useParams } from "react-router";
import { CustomModalRoot } from "../../PMS/FormModal/MilestoneCustomModal";
import { getEquipInfo } from "../../../api/ailuo/deliver";

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	fetchTable: any;
}

const FormTitle = (props: { title: string; setOpen: any; handleSave: any }) => {
	return (
		<Flex className="header" align="center">
			<div
				className="title"
				style={{
					minWidth: "30%",
				}}
			>
				{props.title}
			</div>
			<Flex gap={20} style={{ width: "85%" }} justify={"flex-end"}>
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						onClick={() => {
							props.setOpen(false);
						}}
						type={"primary"}
					>
						取消
					</Button>
				</ConfigProvider>
				<Button onClick={props.handleSave} type={"primary"}>
					保存
				</Button>
			</Flex>
		</Flex>
	);
};

const SelectModelTable = (props: {
	selectedRowKeys: any;
	setSelectedRowKeys: any;
}) => {
	const columns = [
		{
			title: "型号",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "序列号",
			dataIndex: "serialNumber",
			key: "serialNumber",
		},
	];
	const rowSelection = {
		selectedRowKeys: props.selectedRowKeys,
		onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
			console.log(
				`selectedRowKeys: ${selectedRowKeys}`,
				"selectedRows: ",
				selectedRows,
			);
			props.setSelectedRowKeys(selectedRowKeys);
		},
	};
	const dataSource = [
		{
			id: "1",
			model: "型号1",
			serialNumber: "A-AA-01",
		},
	];
	return (
		<div className="overflow-y-auto mt-4">
			<Table
				bordered
				rowKey={"id"}
				size="small"
				pagination={false}
				dataSource={dataSource}
				columns={columns}
				rowSelection={{
					type: "checkbox",
					...rowSelection,
				}}
			></Table>
		</div>
	);
};

const customModalRender = (props: EditRecordModalProps) => {
	const { open, setOpen, fetchTable } = props;
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const params = useParams<{ deliverId: string }>();

	const handleSave = async () => {};
	const fetchModels = async () => {
		let resp = await getEquipInfo({ relationDeliver: params.deliverId });
		if (!resp.success) {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		fetchModels();
		setSelectedRowKeys([]);
	}, [open]);
	return (
		<CustomModalRoot>
			<FormTitle
				handleSave={handleSave}
				setOpen={setOpen}
				title={"添加设备"}
			></FormTitle>
			<SelectModelTable
				selectedRowKeys={selectedRowKeys}
				setSelectedRowKeys={setSelectedRowKeys}
			></SelectModelTable>
		</CustomModalRoot>
	);
};

export const ModelSelectModal: React.FC<EditRecordModalProps> = (props) => {
	const { open, setOpen } = props;

	return (
		<Modal
			width={"40%"}
			open={open}
			onCancel={() => setOpen(false)}
			footer={null}
			closable={false}
			modalRender={() => customModalRender(props)}
		></Modal>
	);
};

export default ModelSelectModal;
