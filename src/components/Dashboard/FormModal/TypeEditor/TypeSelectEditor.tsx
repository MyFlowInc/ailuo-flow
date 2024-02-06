import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button, Divider, Input, Select, Space, message } from "antd";
import CloseFilled from "../../../../assets/icons/CloseFilled";
import _ from "lodash";

import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { dictAdd, dictPage, dictRemove } from "../../../../api/ailuo/dict";

const LabelRoot = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

interface TypeSelectEditorProps {
	mode?: "multiple";
	fixed?: boolean
	cell: any;
	form: any;
	setForm: any;
}

let index = 0;
const TypeSelectEditor: React.FC<TypeSelectEditorProps> = (props: TypeSelectEditorProps) => {
	const { mode, fixed, cell, form, setForm } = props;

	const [items, setItems] = useState<string[]>([]);
	const [name, setName] = useState("");
	const [value, setValue] = useState<string[] | string>([]);

	const inputRef = useRef<InputRef>(null);
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(cell, 'disabled')) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [cell])

	// 初始化
	useEffect(() => {
		if (!_.get(cell, "dictCode")) {
			return;
		}
		fetchOptions(_.get(cell, "dictCode")!);
	}, []);
	// 刷新受控值
	useEffect(() => {
		const temp = _.get(form, cell.key);
		if (!temp) {
			mode === "multiple" ? setValue([]) : setValue("");
		} else {
			setValue(temp);
		}
	}, [form, items]);

	const fetchOptions = async (dictCode: string, fresh: boolean = false) => {
		const res = await dictPage(dictCode, fresh);
		const record = _.get(res, "data.record");
		// key value 值相等
		setItems(record.map((item: any) => item.value));
	};

	const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const removeItem = async (e: React.MouseEvent | React.KeyboardEvent, value: string) => {
		e.stopPropagation();
		if (!_.get(cell, "dictCode")) {
			return;
		}
		const res = await dictPage(cell.dictCode!);
		const record = _.get(res, "data.record");
		const item = _.find(record, { value });
		try {
			await dictRemove(item.id);
			await fetchOptions(cell.dictCode!, true);
			setName("");
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		} catch (error) { }
	};

	const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		e && e.preventDefault();
		e && e.stopPropagation();
		if (!_.get(cell, "dictCode")) {
			return;
		}
		const text = name || `选项${index++}`;
		if (items.some(item => item === text)) {
			message.warning("选项已存在");
			return false;
		}
		const options = [...items, text];
		try {
			await addDict(text);
			setItems(options);
			setName("");
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		} catch (error) {
			console.log(error);
		}
	};

	// 更新字段值
	const addDict = async (text: string) => {
		if (!cell.dictCode) {
			return;
		}
		try {
			await dictAdd({
				code: cell.dictCode,
				label: text,
				value: text
			});
			await fetchOptions(cell.dictCode, true);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSelectChange = (value: string[] | string) => {
		setValue(value);
		setForm({
			...form,
			[cell.key]: value
		});
	};
	const Label: React.FC<{ item: string; fixed?: boolean; children?: React.ReactNode }> = ({ item }) => {
		return (
			<LabelRoot>
				<div>{item}</div>
				<div className={fixed ? 'hidden' : ''}>
					<Button type="text" icon={<CloseFilled style={{ fontSize: "10px", color: "#707683" }} />} onClick={e => removeItem(e, item)} />
				</div>
			</LabelRoot>
		);
	};
	const dropdownRender = (menu: any) => (
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
	)
	return (
		<Select
			disabled={disabled}
			style={{ width: "100%" }}
			placeholder={mode === "multiple" ? "多选框" : "单选框"}
			mode={mode}
			value={value}
			onChange={handleSelectChange}
			optionLabelProp="value"
			dropdownRender={fixed ? undefined : dropdownRender}
			options={items.map((item: any) => ({ label: <Label item={item} fixed={fixed} />, value: item }))}
		/>
	);
};

export default TypeSelectEditor;
