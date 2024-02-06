/**
 * type=3
 */

import React, { SyntheticEvent } from "react";
import { Input } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import _ from "lodash";

interface TypeLinkProps {
	mode?: "multiple";
	cell: any;
	form: any;
	setForm: any;
}

const TypeLink: React.FC<TypeLinkProps> = (props: TypeLinkProps) => {
	const { cell, form, setForm } = props;

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[cell.key]: value
		});
		// console.log("onChangeContent", form);
	};

	return <Input key={"key_" + cell.name} placeholder="请输入" defaultValue="" value={_.get(form, cell.key)} onChange={onChangeContent} suffix={<LinkOutlined />} />;
};

export default TypeLink;
