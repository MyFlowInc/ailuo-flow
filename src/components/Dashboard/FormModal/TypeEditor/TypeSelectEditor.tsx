import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button, Divider, Input, Select, Space, message } from "antd";
import { ReverSedNumFieldType } from "../../TableColumnRender";
import { TableColumnItem, freshCurMetaData } from "../../../../store/workflowSlice";
import { UpdateDSMetaParams, updateDSMeta } from "../../../../api/apitable/ds-meta";
import { useAppDispatch } from "../../../../store/hooks";
import CloseFilled from "../../../../assets/icons/CloseFilled";
import _ from "lodash";

import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const LabelRoot = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

interface TypeSelectEditorProps {
	mode?: "multiple";
	cell: TableColumnItem;
	form: any;
	setForm: any;
}

let index = 0;
const TypeSelectEditor: React.FC<TypeSelectEditorProps> = (props: TypeSelectEditorProps) => {
	const { mode, cell, form, setForm } = props;

	const [items, setItems] = useState<string[]>([]);
	const [name, setName] = useState("");

	const [value, setValue] = useState<string[] | string>([]);

	const inputRef = useRef<InputRef>(null);
	const dispatch = useAppDispatch();

	const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const removeItem = async (e: React.MouseEvent | React.KeyboardEvent, value: string) => {
		e.stopPropagation();
		const options = items.filter(item => !(item === value));
		try {
			await updateField(options);
			setItems(options);
			setName("");
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		} catch (error) {}
	};

	const Label: React.FC<{ item: string; children?: React.ReactNode }> = ({ item }) => {
		return (
			<LabelRoot>
				<div>{item}</div>
				<div>
					<Button type="text" icon={<CloseFilled style={{ fontSize: "10px", color: "#707683" }} />} onClick={e => removeItem(e, item)} />
				</div>
			</LabelRoot>
		);
	};

	const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		e && e.preventDefault();
		e && e.stopPropagation();
		const text = name || `选项${index++}`;

		if (items.some(item => item === text)) {
			message.warning("选项已存在");
			return false;
		}

		const options = [...items, text];
		try {
			await updateField(options);
			setItems(options);
			setName("");
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		} catch (error) {}
	};

	// 更新字段值
	const updateField = async (options: string[]) => {
		const k = ReverSedNumFieldType[cell.type as unknown as keyof typeof ReverSedNumFieldType] || "NotSupport";
		const dstId = cell.dstId;
		const temp: UpdateDSMetaParams = {
			dstId: cell.dstId,
			fieldId: cell.fieldId,
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
		// console.log('useEffect--TypeSelectEditor === ', cell, 'form == =',form)
		const options = _.get(cell, "fieldConfig.property.options");
		if (options) {
			setItems(options);
		}
		const temp = _.get(form, cell.fieldId);
		if (!temp) {
			mode === "multiple" ? setValue([]) : setValue("");
		} else {
			setValue(temp);
		}
	}, [form]);

	const handleSelectChange = (value: string[] | string) => {
		console.log("value", value);
		setValue(value);

		setForm({
			...form,
			[cell.fieldId]: value
		});
	};

	return (
		<Select
			style={{ width: "100%" }}
			placeholder={mode === "multiple" ? "多选框" : "单选框"}
			mode={mode}
			value={value}
			onChange={handleSelectChange}
			optionLabelProp="value"
			dropdownRender={menu => (
				<>
					{menu}
					<Divider style={{ margin: "8px 0" }} />
					<Space style={{ padding: "0 8px 4px" }}>
						<Input placeholder="请输入选项" ref={inputRef} value={name} onChange={onNameChange} onPressEnter={addItem as any} />
						<Button type="text" icon={<PlusOutlined />} onClick={addItem}>
							添加项
						</Button>
					</Space>
				</>
			)}
			options={items.map(item => ({ label: <Label item={item} />, value: item }))}
		/>
	);
};

export default TypeSelectEditor;
