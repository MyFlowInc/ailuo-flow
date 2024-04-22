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
import PrepareForm from "./PrepareForm";
import SPLModeSelect from "./SPLModeSelect";

const SubmitWorkshopWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const SubmitWorkshop: React.FC<any> = (props: any) => {
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);

	return (
		<SubmitWorkshopWrapper
			className="w-full flex flex-col"
			style={{ paddingRight: "200px" }}
		>
			<div>
				<PrepareForm />
			</div>
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
		</SubmitWorkshopWrapper>
	);
};

export default SubmitWorkshop;

