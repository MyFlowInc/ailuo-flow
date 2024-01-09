import React from "react";
import moment from "moment";
import { Modal, List, Avatar, Button, Input, Form, Empty } from "antd";
import styled from "styled-components";
import { selectUser } from "../../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { updateDSCells, UpdateDSCellsParams } from "../../../../api/apitable/ds-record";
import { TableColumnItem, selectCurFlowDstId, freshCurTableRows } from "../../../../store/workflowSlice";
import { SocketMsgType, sendWebSocketMsg } from "../../../../api/apitable/ws-msg";

const DiscussPanel = styled.div`
	position: relative;
	padding: 16px;
	// border: 1px solid #c0c0c0;

	.discuss-header {
		font-size: 14px;
		font-weight: 600;
	}
`;

const DiscussAvatar = styled(({ src, ...rest }) => (
	<div {...rest}>
		<Avatar src={src} />
	</div>
))`
	display: flex;
	justify-content: center;
	align-items: center;
	padding-right: 16px;
`;

interface DiscussListWrapProps {
	comments?: CommentType[];
	children?: React.ReactNode;
}

const DiscussListWrap: React.FC<DiscussListWrapProps> = ({ comments }) => {
	return (
		<>
			{comments ? (
				<div style={{ height: 360, overflow: "auto" }}>
					<List
						itemLayout="horizontal"
						dataSource={comments}
						renderItem={(item: CommentType, index: number) => (
							<List.Item key={`item-${index}`}>
								<List.Item.Meta
									avatar={<Avatar src={item.avatar} />}
									title={item.username}
									description={
										<>
											{item.content}
											<br />
											{item.create_time}
										</>
									}
								/>
							</List.Item>
						)}
					/>
				</div>
			) : (
				<div
					style={{
						height: 360,
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}>
					<Empty description="暂无评论" />
				</div>
			)}
		</>
	);
};

interface DiscussBarProps {
	fieldId: string;
	record: any;
	comments: CommentType[];
	setComments: (comments: CommentType[]) => void;
	children?: React.ReactNode;
}

const DiscussBar: React.FC<DiscussBarProps> = ({ fieldId, record, comments, setComments }) => {
	const dispatch = useAppDispatch();
	const [form] = Form.useForm();
	const user = useAppSelector(selectUser);
	const curDstId = useAppSelector(selectCurFlowDstId);

	const updateComments = async (ncomments: CommentType[]) => {
		const { recordId, id, ...rest } = record;
		const fields = { ...rest, [fieldId]: ncomments };
		const params: UpdateDSCellsParams = {
			dstId: curDstId!,
			fieldKey: "id",
			records: [
				{
					recordId,
					fields
				}
			]
		};
		try {
			await updateDSCells(params);
			dispatch(freshCurTableRows(curDstId!));
			// 同步
			sendWebSocketMsg({
				user,
				dstId: curDstId!,
				type: SocketMsgType.SetRecords,
				recordId,
				row: fields
			});
		} catch (error) {
			console.log(error);
		}
	};

	const onFinish = (values: any) => {
		const comment: CommentType = {
			userId: user.id,
			username: user.nickname,
			avatar: user.avatar,
			content: values.content,
			create_time: moment().format("YYYY-MM-DD HH:mm:ss")
		};
		const ncomments = comments ? [comment, ...comments] : [comment];
		setComments(ncomments);
		updateComments(ncomments);
		form.resetFields();
		// close();
	};

	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item
				name="content"
				preserve={false}
				style={{ margin: 0, padding: 0 }}
				rules={[
					{ required: true, message: "评论不能为空" },
					{ type: "string", whitespace: true, message: "评论不能为空字符" }
				]}>
				<div style={{ display: "flex", width: "100%" }}>
					<DiscussAvatar src={user.avatar} />
					<Input
						style={{ width: "100%", flex: 1 }}
						suffix={
							<Button type="text" htmlType="submit">
								评论
							</Button>
						}
					/>
				</div>
			</Form.Item>
		</Form>
	);
};

interface DiscussModalProps {
	fieldId: string;
	record: any;
	dstId?: any;
	open: boolean;
	close: () => void;
	children?: React.ReactNode;
	reader: boolean;
	writer: boolean;
	manager: boolean;
}

interface CommentType {
	userId: string;
	username: string;
	avatar: string;
	content: string;
	create_time: string;
}

export const DiscussModal: React.FC<DiscussModalProps> = ({ open, close, fieldId, record, reader, writer, manager }) => {
	const [comments, setComments] = React.useState<any>(record[fieldId] || undefined);

	React.useEffect(() => {
		setComments(record[fieldId]);
	}, [record[fieldId]]);

	return (
		<Modal
			title={`${comments ? comments.length : 0}条评论`}
			open={open}
			onCancel={close}
			width={620}
			footer={writer || manager ? <DiscussBar record={record} fieldId={fieldId} comments={comments} setComments={setComments} /> : null}>
			<DiscussListWrap comments={comments} />
		</Modal>
	);
};

interface TypeDiscussProps {
	mode?: "multiple";
	cell: TableColumnItem;
	form: any;
	setForm: any;
}

const TypeDiscuss: React.FC<TypeDiscussProps> = (props: TypeDiscussProps) => {
	const { form, cell, setForm } = props;
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const curDstId = useAppSelector(selectCurFlowDstId);

	const [inpValue, setInpValue] = React.useState<string>("");
	const [status, setStatus] = React.useState<boolean>(false);
	const [comments, setComments] = React.useState<CommentType[]>(form[cell.fieldId] || undefined);

	const updateComments = async (ncomments: CommentType[]) => {
		setForm({
			...form,
			[cell.fieldId]: ncomments
		});
		const { recordId, id, ...rest } = form;
		const fields = { ...rest, [cell.fieldId]: ncomments };
		const params: UpdateDSCellsParams = {
			dstId: curDstId!,
			fieldKey: "id",
			records: [
				{
					recordId,
					fields
				}
			]
		};

		try {
			await updateDSCells(params);
			dispatch(freshCurTableRows(curDstId!));
			// 同步
			sendWebSocketMsg({
				user,
				dstId: curDstId!,
				type: SocketMsgType.SetRecords,
				recordId,
				row: fields
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = () => {
		if (typeof inpValue === `undefined` || inpValue.trim() === "") {
			setStatus(true);
			return;
		}
		const comment: CommentType = {
			userId: user.id,
			username: user.nickname,
			avatar: user.avatar,
			content: inpValue,
			create_time: moment().format("YYYY-MM-DD HH:mm:ss")
		};
		const ncomments = comments ? [comment, ...comments] : [comment];
		setComments(ncomments);
		updateComments(ncomments);
		setInpValue("");
		status && setStatus(false);
	};

	const handleInputChange = (e: React.SyntheticEvent) => {
		const target = e.target as typeof e.target & { value: string };
		setInpValue(target.value);
		target.value.trim() !== "" && setStatus(false);
	};

	React.useEffect(() => {
		setComments(form[cell.fieldId]);
	}, [form[cell.fieldId]]);

	return (
		<DiscussPanel>
			<div className="discuss-header">{`${comments ? comments.length : 0}条评论`}</div>
			<DiscussListWrap comments={comments} />
			{form?.recordId && (
				<div style={{ display: "flex", width: "100%" }}>
					<DiscussAvatar src={user.avatar} />
					<Input
						value={inpValue}
						onChange={handleInputChange}
						style={{ width: "100%", flex: 1 }}
						status={status ? "error" : undefined}
						suffix={
							<Button type="text" onClick={handleSubmit}>
								评论
							</Button>
						}
					/>
				</div>
			)}
			<div
				style={{
					display: `${status ? "" : "none"}`,
					color: "red",
					textAlign: "right"
				}}>
				评论不能为空！
			</div>
		</DiscussPanel>
	);
};

export default TypeDiscuss;
