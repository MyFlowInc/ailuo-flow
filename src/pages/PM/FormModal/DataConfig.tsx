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
import SPLModeSelect from "./SPLModeSelect";

const DataConfigWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const DataConfig: React.FC<any> = (props: any) => {
	const { step } = props;
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);

	return (
		<DataConfigWrapper className="w-full">
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect
					key={"ModelTable" + props.key}
					{...{
						column,
						form,
						setForm,
					}}
				/>
			</ConfigProvider>
		</DataConfigWrapper>
	);
};

export default DataConfig;
