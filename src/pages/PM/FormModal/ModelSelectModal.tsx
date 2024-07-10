import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Flex, Modal, Table, message } from "antd";
import { greyButtonTheme } from "../../../theme/theme";
import { useParams } from "react-router";
import { CustomModalRoot } from "../../PMS/FormModal/MilestoneCustomModal";
import { batchUpdateEquip, getEquipInfo } from "../../../api/ailuo/deliver";

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
	dataSource: any;
	setNewSelection: any;
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
			const newlySelectedRows = selectedRows.filter((row: any) => {
				return !row.prevSelected;
			});
			props.setSelectedRowKeys(selectedRowKeys);
			props.setNewSelection(newlySelectedRows);
		},
		getCheckboxProps: (record: any) => ({
			disabled: record.choice === "yes", // Column configuration not to be checked
		}),
	};
	return (
		<div className="overflow-y-auto mt-4">
			<Table
				bordered
				rowKey={"id"}
				size="small"
				pagination={false}
				dataSource={props.dataSource}
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
	const params = useParams<{ deliverId: string; batchId: string }>();
	const [models, setModels] = useState<any[]>([]);
	const [newSelection, setNewSelection] = useState<any[]>([]);

	const handleSave = async () => {
		const request = newSelection.map((item: any) => {
			return {
				id: item.id,
				relationBatch: params.batchId,
				choice: "yes",
			};
		});
		const res = await batchUpdateEquip(request);
		if (res.success || !newSelection.length) {
			message.success("保存成功");
			setOpen(false);
			fetchModels();
			fetchTable();
		} else {
			message.error(res.msg);
		}
	};
	const fetchModels = async () => {
		const resp = await getEquipInfo({
			relationDeliver: params.deliverId,
			defaultIdentification: "yes",
		});
		const rowData = resp.data.record;
		if (!resp.success) {
			message.error(resp.msg);
		} else {
			const selectedRowKeys = rowData
				?.filter((data: any) => {
					return data.choice === "yes";
				})
				.map((data: any) => data.id);
			const rowDataWithPrevSelected = rowData?.map((data: any) => {
				return {
					...data,
					prevSelected: data.choice === "yes",
				};
			});
			setNewSelection([]);
			setSelectedRowKeys(selectedRowKeys);
			setModels(rowDataWithPrevSelected);
		}
	};

	useEffect(() => {
		fetchModels();
	}, [open]);

	return (
		<CustomModalRoot>
			<FormTitle
				handleSave={handleSave}
				setOpen={setOpen}
				title={"添加设备"}
			></FormTitle>
			<SelectModelTable
				dataSource={models}
				setNewSelection={setNewSelection}
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
