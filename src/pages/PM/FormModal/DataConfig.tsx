import React, { useContext, useEffect, useRef, useState } from "react";
import {
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
} from "antd";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme } from "../../../theme/theme";
import styled from "styled-components";

const DataConfig: React.FC = (props: any) => {
	const { column, form, setForm } = props;

	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(column, "disabled")) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [column]);

	return (
		<div className="w-full">
			<div
				className="w-full overflow-hidden overflow-x-auto"
				style={{ pointerEvents: disabled ? "none" : "auto" }}
			>
				<ConfigProvider theme={TableTheme}></ConfigProvider>
			</div>
		</div>
	);
};

export default DataConfig;
