import React, { useState, useEffect } from "react";
import { Select, Avatar } from "antd";
import styled from "styled-components";

import { TableColumnItem, freshCurMetaData } from "../../../../store/workflowSlice";
import { ReverSedNumFieldType } from "../../TableColumnRender";
import _ from "lodash";
import { UpdateDSMetaParams, updateDSMeta } from "../../../../api/apitable/ds-meta";
import { useAppDispatch } from "../../../../store/hooks";
import { apitableDeveloperUserList } from "../../../../api/apitable/ds-share";

import type { DeveloperUser } from "../../../../store/globalSlice";

const UIListItem = styled.div`
	display: flex;
	width: fit-content;
	align-items: flex-end;
	border-radius: 4px;
	overflow: hidden;
	width: 100%;
	.container {
		/* 550 - 42  -42 */
		width: 100%;
		height: 32px;
		border-radius: 4px;
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
	}

	.img-container {
		position: relative;
	}
	.left {
		display: flex;
		.word {
			margin-left: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.title {
			font-size: 12px;
			font-weight: bold;
			line-height: 14px;
			letter-spacing: 0em;
			color: #3d3d3d;
		}
		.content {
			font-size: 12px;
			font-weight: normal;
			line-height: 14px;
			letter-spacing: 0em;
			color: #666666;
		}
	}
`;

interface TypeSelectEditorProps {
	mode?: "multiple";
	cell: TableColumnItem;
	form: any;
	setForm: any;
}

const index = 0;
const TypeSelectEditor: React.FC<TypeSelectEditorProps> = (props: TypeSelectEditorProps) => {
	const { mode, cell, form, setForm } = props;
	const [value, setValue] = useState<string[]>([]);
	const [useList, set] = useState<any[]>([]);

	const dispatch = useAppDispatch();

	const fetchUserList = async () => {
		if (!cell.dstId) return;

		const res = await apitableDeveloperUserList(cell.dstId);
		if (_.get(res, "data.record")) {
			const users = _.get(res, "data.record", []);
			set(users.map((user: DeveloperUser) => user.userInfo));
		}
	};

	const init = () => {
		fetchUserList();
	};

	useEffect(() => {
		init();
	}, [cell.dstId]);

	// 更新字段值
	const updateField = async (options: string[]) => {
		const k = ReverSedNumFieldType[cell.type as unknown as keyof typeof ReverSedNumFieldType] || "NotSupport";
		const dstId = cell.dstId;
		const temp: UpdateDSMetaParams = {
			dstId: cell.dstId,
			fieldId: cell.key,
			name: cell.name,
			type: k,
			property: {
				options: options
			}
		};
		await updateDSMeta(temp);
		await dispatch(freshCurMetaData(dstId));
	};

	// 初始化
	useEffect(() => {
		fetchUserList();
		const temp = _.get(form, cell.key);
		if (!temp) {
			setValue([]);
		} else {
			setValue(temp);
		}
	}, [form]);

	const handleSelectChange = (value: string[]) => {
		setValue(value);
		setForm({
			...form,
			[cell.key]: value
		});
	};

	return (
		<Select mode={mode} style={{ width: "100%" }} value={value} placeholder="请选择成员" onChange={handleSelectChange} optionLabelProp="label">
			{useList.map(user => {
				return (
					<Select.Option key={user.id} value={user.id} label={user.email}>
						<UIListItem>
							<div className="container">
								<div className="left">
									<div className="img-container">
										<Avatar size="small" src={user.avatar} />
									</div>

									<div className="word">
										<div className="title">{user.email} </div>
										{/* <div className="content">{user.email} </div> */}
									</div>
								</div>
							</div>
						</UIListItem>
					</Select.Option>
				);
			})}
		</Select>
	);
};

export default TypeSelectEditor;
