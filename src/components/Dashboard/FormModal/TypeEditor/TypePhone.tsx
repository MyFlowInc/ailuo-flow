/**
 * type=3
 */

import React, { useRef, SyntheticEvent } from "react";
import { Input } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import _ from "lodash";

interface TypePhoneProps {
	mode?: "multiple";
	cell: any;
	form: any;
	setForm: any;
}

const TypePhone: React.FC<TypePhoneProps> = (props: TypePhoneProps) => {
	const { cell, form, setForm } = props;
	const el = useRef<any>(null);

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[cell.key]: value
		});
		// console.log("onChangeContent", form);
	};

	return <Input placeholder="请输入手机号码" value={_.get(form, cell.key)} onChange={onChangeContent} suffix={<PhoneOutlined />} />;
};

export default TypePhone;
