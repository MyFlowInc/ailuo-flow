import React, { useContext, useEffect, useRef, useState } from "react";

import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { Checkbox, CheckboxProps } from "antd";

const ExportProject: React.FC = (props: any) => {
	const { column, form, setForm } = props;
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(column, "disabled")) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [column]);

	const onChange: CheckboxProps["onChange"] = (e) => {
		console.log(`checked = ${e.target.checked}`);
		setForm({
			...form,
			[column.dataIndex]: e.target.checked ? "show" : "hide",
		});
	};
	return (
		<div className="w-full">
			<div className="flex mb-4">
				<div style={{ width: "100px" }}>出口项目</div>
				<div className="flex items-center">
					<Checkbox
						// defaultChecked={form[column.dataIndex] === "show"}
						disabled={disabled}
						checked={form[column.dataIndex] === "show"}
						onChange={onChange}
					>
						出口
					</Checkbox>
				</div>
			</div>
		</div>
	);
};

export default ExportProject;
