import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Flex, Form, Modal, message } from "antd";
import CellEditorContext from "./CellEditorContext";
import { NoFieldData } from "./NoFieldData";
import { greyButtonTheme } from "../../../theme/theme";
import { useParams } from "react-router";
import { CustomModalRoot } from "../../PMS/FormModal/MilestoneCustomModal";
import { addEquip, updateEquip } from "../../../api/ailuo/deliver";

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	editFlowItemRecord?: any | undefined;
	modalType: "add" | "edit" | "view";
	columns: any;
	fetchTable: any;
	readonly: boolean;
}

const FormTitle = (props: {
	title: string;
	setOpen: any;
	handleSave: any;
	readonly: boolean;
}) => {
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
				<Button
					disabled={props.readonly}
					onClick={props.handleSave}
					type={"primary"}
				>
					保存
				</Button>
			</Flex>
		</Flex>
	);
};

const DeliveryModelForm = (props: {
	columns: any;
	form: any;
	setForm: any;
	modalType: string;
}) => {
	return (
		<div className="overflow-y-auto mt-4">
			<Form
				name="deliveryModelForm"
				colon={false}
				wrapperCol={{ flex: 1 }}
				preserve={false}
			>
				{props.columns.length > 0 ? (
					<CellEditorContext
						modalType={props.modalType}
						form={props.form}
						setForm={props.setForm}
						dstColumns={props.columns}
					/>
				) : (
					<NoFieldData />
				)}
			</Form>
		</div>
	);
};

const customModalRender = (props: EditRecordModalProps) => {
	const { editFlowItemRecord, open, setOpen, modalType, readonly } = props;
	const [form, setForm] = useState<any>({});
	const [formColumns, setFormColumns] = useState(props.columns);
	const parms = useParams<{ deliverId: any; batchId: any }>();

	const handleSave = async () => {
		let resp: any;
		if (modalType === "add") {
			resp = await addEquip({
				relationBatch: parms.batchId,
				relationDeliver: parms.deliverId,
				name: form.name,
				serialNumber: form.serialNumber,
				remark: form.remark,
				choice: "yes",
				defaultIdentification: "no",
			});
		} else {
			resp = await updateEquip({
				id: form.id,
				name: form.name,
				serialNumber: form.serialNumber,
				remark: form.remark,
			});
		}

		if (resp.success) {
			message.success("保存成功");
			props.setOpen(false);
			props.fetchTable();
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		if (editFlowItemRecord) {
			let formWithShowKey = {
				...editFlowItemRecord,
				showAction: "hide",
			};
			setForm(formWithShowKey);
		}

		if (readonly) {
			setFormColumns(
				props.columns.map((col: any) => {
					return { ...col, disabled: true };
				}),
			);
		} else {
			if (editFlowItemRecord.defaultIdentification === "yes") {
				setFormColumns(
					props.columns.map((col: any) => {
						return { ...col, disabled: col.dataIndex !== "remark" };
					}),
				);
			} else {
				setFormColumns(props.columns);
			}
		}
	}, [open]);
	return (
		<CustomModalRoot>
			<FormTitle
				readonly={readonly}
				handleSave={handleSave}
				setOpen={setOpen}
				title={"添加交付材料"}
			></FormTitle>
			<DeliveryModelForm
				modalType={modalType}
				form={form}
				setForm={setForm}
				columns={formColumns}
			></DeliveryModelForm>
		</CustomModalRoot>
	);
};

export const DeliveryModelModal: React.FC<EditRecordModalProps> = (props) => {
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

export default DeliveryModelModal;
