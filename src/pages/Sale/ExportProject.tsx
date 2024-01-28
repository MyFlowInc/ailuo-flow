import React, { useContext, useEffect, useRef, useState } from "react";

import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { Checkbox } from "antd";



const ExportProject: React.FC = (props: any) => {
	const { column, form, setForm } = props;

	const handleAdd = () => { }

	return (
		<div className="w-full">
			<div className="flex mb-4">
				<div style={{ width: "100px" }}>初步选型型号</div>
				<div className="flex items-center" onClick={handleAdd}>
					<Checkbox onChange={handleAdd}>Checkbox</Checkbox>;
				</div>
			</div>
			<div className="w-full overflow-hidden overflow-x-auto">
				<div>123</div>
			</div>
		</div>
	);
};

export default ExportProject;
