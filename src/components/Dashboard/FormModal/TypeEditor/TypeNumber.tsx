/**
 * type=3
 */

import React from "react";
import { InputNumber } from "antd";
import _ from "lodash";

interface TypeNumberProps {
	mode?: "multiple";
	cell: any;
	form: any;
	setForm: any;
}

const TypeNumber: React.FC<TypeNumberProps> = (props: TypeNumberProps) => {
	const { cell, form, setForm } = props;

	const onChangeContent = (value: number | null) => {
		setForm({
			...form,
			[cell.key]: value
		});
	};

	return <InputNumber value={_.get(form, cell.key)} placeholder="请输入" onChange={onChangeContent} style={{ width: "100%" }} />;
};

export default TypeNumber;
