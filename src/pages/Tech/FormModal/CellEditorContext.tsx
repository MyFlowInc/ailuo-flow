import React, { useState, useEffect } from "react";
import { Form } from "antd";
import styled from "styled-components";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import TypeEditor from "../../../components/Dashboard/FormModal/TypeEditor";

const CellEditorRoot = styled.div`
	color: #848484;
	flex-grow: 1;
`;

interface CellEditorProps {
	cell: any;
	form: { [id: string]: string };
	setForm: (value: any) => void;
	modalType: string;
}

const CellEditor: React.FC<CellEditorProps> = props => {
	const { cell, form, setForm, modalType } = props;
	let rules: any;

	switch (cell.type) {
		case NumFieldType.OptionStatus:
			return <div className="hidden"></div>;
		case NumFieldType.Email:
			rules = [{ type: "email", message: "请输入有效的邮箱地址." }];
			break;
		case NumFieldType.Phone:
			rules = [
				{
					pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
					message: "请输入有效的手机号码."
				}
			];
			break;
		case NumFieldType.Member:
		case NumFieldType.MultiSelect:
			rules = [{ type: "array" }];
			break;
		case NumFieldType.Number:
			rules = [{ type: "number" }];
			break;

		default:
	}

	return (
		<CellEditorRoot>
			<Form.Item name={cell.key} rules={rules}>
				<TypeEditor {...{ cell, form, setForm }} />
			</Form.Item>
		</CellEditorRoot>
	);
};

const CellLabelRoot = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	.cell-label-title {
		display: flex;

		.cell-drag-icon {
			display: flex;
			align-items: center;
			opacity: 0;
			margin: 0 4px;

			:hover {
				cursor: move;
			}
		}

		.cell-drag-text {
			width: 100px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.cell-label-action {
		display: flex;
		align-items: center;
		margin-right: 8px;
	}

	:hover .cell-drag-icon {
		opacity: 1;
	}
`;
const CellEditorWrap = styled.div`
	display: flex;
	align-items: center;
	height: "12px";
	line-height: 12px;
	margin: 12px 0 24px 0px;
	padding: 0;
`;

interface CellEditorContextProps {
	dstColumns: any[];
	form: { [id: string]: string };
	setForm: (value: any) => void;
	modalType: string;
}

const CellEditorContext: React.FC<CellEditorContextProps> = ({ dstColumns, form, setForm, modalType }) => {
	const [columns, setColumns] = useState<any[]>(dstColumns);
	useEffect(() => {
		setColumns(dstColumns);
	}, [dstColumns]);

	return (
		<div>
			{columns.map((item, index) => {
				if (item.render) {
					return item.render(item, "field_" + item.key, form, setForm);
				}
				return (
					<CellEditorWrap key={"field_" + item.key}>
						<CellLabelRoot>
							<div className="cell-label-title">
								<div className="cell-drag-text">
									<div>{item.title}</div>
								</div>
							</div>
						</CellLabelRoot>
						<CellEditor cell={item} form={form} setForm={setForm} modalType={modalType} />
					</CellEditorWrap>
				);
			})}
		</div>
	);
};

export default CellEditorContext;
