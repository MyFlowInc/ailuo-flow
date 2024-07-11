import React, { useCallback, useEffect, useState } from "react";
import { Button, ConfigProvider, Flex, Form, Modal, message } from "antd";
import CellEditorContext from "./CellEditorContext";
import { NoFieldData } from "./NoFieldData";
import { greyButtonTheme } from "../../../theme/theme";
import { useParams } from "react-router";
import { CustomModalRoot } from "../../PMS/FormModal/MilestoneCustomModal";
import {
	addDeliverInfo,
	getEquipInfo,
	updateDeliverInfo,
} from "../../../api/ailuo/deliver";
import TypeSelectEditor from "../../../components/Dashboard/FormModal/TypeEditor/TypeSelectEditor";
import {
	CellEditorWrap,
	CellLabelRoot,
} from "../../MyAgentPage/FormModal/CellEditorContext";

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
				name="deliveryInfoForm"
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
	const params = useParams<{ deliverId: string; batchId: string }>();
	const [form, setForm] = useState<any>({});
	const [formColumns, setFormColumns] = useState(props.columns);
	const [allOptions, setAllOptions] = useState<any[]>([]);

	const fetchOptions = async () => {
		const resp = await getEquipInfo({
			relationDeliver: params.deliverId,
			relationBatch: params.batchId,
		});
		if (resp.success) {
			setAllOptions(resp?.data?.record);
		} else {
			message.error(resp.msg);
		}
	};

	const setColumns = () => {
		const equipOtions = allOptions
			?.filter((option: any) => {
				return option.logistics === "no";
			})
			?.map((equip: any) => {
				return {
					value: equip.id,
					label: equip.name,
				};
			});
		const column = {
			title: "发货型号",
			dataIndex: "equipmentinformationId",
			key: "equipmentinformationId",
			hidden: true,
			render: () => {
				return (
					<CellEditorWrap key={"field_" + "model"}>
						<CellLabelRoot>
							<div className="cell-label-title">
								<div className="cell-drag-text">
									<div>{"发货型号"}</div>
								</div>
							</div>
						</CellLabelRoot>
						<TypeSelectEditor
							mode="multiple"
							key={"equip-info-" + Date.now()}
							fixed
							form={form}
							setForm={setForm}
							cell={{ key: "equipmentinformationId", disabled: readonly }}
							options={equipOtions ?? []}
							label
						></TypeSelectEditor>{" "}
					</CellEditorWrap>
				);
			},
		};
		if (readonly) {
			setFormColumns([
				column,
				...props.columns.map((col: any) => {
					return { ...col, disabled: true };
				}),
			]);
		} else {
			setFormColumns([column, ...props.columns]);
		}
	};

	const handleSave = async () => {
		let resp: any;
		const request = {
			...form,
			equipmentinformationId: form.equipmentinformationId
				.map((equip: any) => equip.value)
				.join(","),
			relationBatch: params.batchId,
		};
		if (modalType === "add") {
			resp = await addDeliverInfo(request);
		} else {
			resp = await updateDeliverInfo(request);
		}
		if (resp.success) {
			message.success("保存成功");
			props.fetchTable();
			props.setOpen(false);
		} else {
			message.error(resp.err);
		}
	};

	useEffect(() => {
		if (open) {
			if (editFlowItemRecord) {
				let formWithShowKey = {
					...editFlowItemRecord,
					equipmentinformationId: editFlowItemRecord.equipmentinformationId
						? editFlowItemRecord.equipmentinformationId
								?.split(",")
								.map((equip: any) => {
									return {
										value: equip,
										label: allOptions.find((option: any) => {
											return equip === option.id + "";
										})?.name,
									};
								})
						: [],
					showAction: "hide",
					showEquip: "hide",
				};
				setForm(formWithShowKey);
			}
		}
	}, [allOptions]);

	useEffect(() => {
		if (open) {
			fetchOptions();
		}
	}, [open]);

	useEffect(() => {
		setColumns();
	}, [form.equipmentinformationId]);

	return (
		<CustomModalRoot>
			<FormTitle
				readonly={readonly}
				handleSave={handleSave}
				setOpen={setOpen}
				title={"添加物流信息"}
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

export const DeliveryInfoModal: React.FC<EditRecordModalProps> = (props) => {
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

export default DeliveryInfoModal;
