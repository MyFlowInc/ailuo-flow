import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Flex, Form, Modal, message } from "antd";
import CellEditorContext from "./CellEditorContext";
import { NoFieldData } from "./NoFieldData";
import { useForm } from "antd/es/form/Form";
import { greyButtonTheme } from "../../../theme/theme";
import { savePurMachining } from "../../../api/ailuo/workshop";
import { Stage, Status } from "../types";
import { useParams } from "react-router";
import dayjs from "dayjs";

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	editFlowItemRecord?: any | undefined;
	modalType: "add" | "edit" | "view";
	columns: any;
	type: Stage;
	workshopStatus: Status;
	projectId: string;
	fetchTable: any;
}

const FormTitle = (props: { title: string; setOpen: any; handleSave: any }) => {
	return (
		<Flex align="center">
			<span style={{ minWidth: "10%" }}>{props.title}</span>
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

const ItemInfoForm = (props: {
	inputForm: any;
	columns: any;
	form: any;
	setForm: any;
	modalType: string;
}) => {
	return (
		<div className="overflow-y-auto">
			<Form
				form={props.inputForm}
				name="itemsForm"
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

export const ItemModal: React.FC<EditRecordModalProps> = (props) => {
	const {
		editFlowItemRecord,
		open,
		setOpen,
		modalType,
		type,
		workshopStatus,
		projectId,
		fetchTable,
	} = props;
	const [inputForm] = useForm();
	const [form, setForm] = useState<any>({});
	const params = useParams<{ wspId: string }>();

	const handleSave = async () => {
		if (modalType === "add") {
			const res = await savePurMachining({
				type: type,
				relatedManage: params.wspId,
				relatedProject: projectId,
				relatedWorkshopstatus: workshopStatus,
				expectedTime: form.expectedTime
					? dayjs(form.expectedTime).format("YYYY-MM-DD")
					: "",
				endTime: form.endTime ? dayjs(form.endTime).format("YYYY-MM-DD") : "",
				...form,
			});
			if (res.code === 200) {
				fetchTable();
				setOpen(false);
				message.success("保存成功");
			}
		} else {
		}
	};

	useEffect(() => {
		setForm({ startTime: "hide" });
	}, [open]);

	return (
		<Modal
			title={
				<FormTitle
					handleSave={handleSave}
					setOpen={setOpen}
					title="添加投料"
				></FormTitle>
			}
			width={"40%"}
			open={open}
			onCancel={() => setOpen(false)}
			footer={null}
		>
			<ItemInfoForm
				modalType={modalType}
				form={form}
				setForm={setForm}
				columns={props.columns}
				inputForm={inputForm}
			></ItemInfoForm>
		</Modal>
	);
};

export default ItemModal;
