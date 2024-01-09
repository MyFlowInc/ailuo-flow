import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { freshUser } from "../../store/globalSlice";
import React from "react";

const FormRoot = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 24px;
	padding-left: 24px;
	width: 100%;
	.ml-16 {
		margin-left: 16px;
	}
`;

const UpdateModal: React.FC<any> = (props: any) => {
	const { open, setOpen, title, updateKey, label, updateApi, renderItem } = props;
	const dispatch = useAppDispatch();

	const [contextHolder] = message.useMessage();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const initForm = () => {
		const keys = updateKey.split(",");

		keys.forEach((key: string) => {
			form.setFieldValue(key, "");
		});
	};

	useEffect(() => {
		setLoading(false);
		initForm();
	}, [open]);

	const cancle = () => {
		setOpen(false);
	};

	const updateHandler = () => {
		form.validateFields().then(async () => {
			setLoading(true);
			const keys = updateKey.split(",");
			const data = form.getFieldsValue([...keys]);
			try {
				// todo
				await updateApi(data);
				dispatch(freshUser());
				message.success("修改成功");

				setLoading(false);
				setOpen(false);
			} catch (error) {
				console.log("error", error);
			}
		});
	};

	return (
		<>
			{contextHolder}
			<Modal title={title} open={open} width={680} footer={null}>
				<FormRoot>
					<Form layout={"horizontal"} form={form} style={{ width: "100%" }}>
						{renderItem && renderItem()}
						{!renderItem && (
							<Form.Item label={label} name={updateKey} rules={[{ required: true, message: "请输入值" }]}>
								<Input />
							</Form.Item>
						)}
						<Form.Item>
							<div style={{ display: "flex", justifyContent: "flex-end" }}>
								<Button
									className="ml-16"
									style={{
										background: "#2845D4",
										marginLeft: "24px"
									}}
									type="primary"
									onClick={cancle}>
									取消
								</Button>
								<Button
									className="ml-16 tw-text-white"
									style={{
										background: "#2845D4",
										color: "#fff !important"
									}}
									type="primary"
									onClick={updateHandler}
									loading={loading}
									disabled={loading}>
									{"更新"}
								</Button>
							</div>
						</Form.Item>
					</Form>
				</FormRoot>
			</Modal>
		</>
	);
};

export default UpdateModal;
