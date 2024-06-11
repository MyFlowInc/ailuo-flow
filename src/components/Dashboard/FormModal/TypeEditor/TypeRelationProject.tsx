import { WarningFilled } from "@ant-design/icons";
import { Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { getRelationProject } from "../../../../api/ailuo/pms";

const TypeRelationProject: React.FC<any> = ({ cell, form, setForm }) => {
	const [options, setOptions] = useState<any>([]);
	const handleChange = () => {};
	const fetchData = async () => {
		const res = await getRelationProject();
		if (res.code == 200) {
			setOptions(
				res.data.map((item: any) => ({
					value: item.id,
					label: item.name,
				})),
			);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-full">
			<Select
				disabled={cell.disabled}
				className="w-full"
				onChange={handleChange}
				notFoundContent={null}
				options={options}
			/>
		</div>
	);
};

export default TypeRelationProject;
