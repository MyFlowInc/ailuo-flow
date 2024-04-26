import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
	message,
} from "antd";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme, blueButtonTheme } from "../../../theme/theme";
import styled from "styled-components";
import SPLModeSelect from "./SPLModeSelect";
import SplDatabase from "../../SPL/SplDatabase";

const DataConfigWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const DataConfig: React.FC<any> = (props: any) => {
	const { step } = props;
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);


	const handleSaveRecord = () => {
		// 未实现
		message.warning('未实现')
	};

	const handleSubmit = () => {


	}
	const renderFooter = () => {
		return (
			<>
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" onClick={handleSaveRecord}>保存</Button>
				</ConfigProvider>
				<ConfigProvider theme={blueButtonTheme}>
					<Button className="ml-8" type="primary" onClick={handleSubmit}>
						提交审核
					</Button>
				</ConfigProvider>
			</>
		);

	};
	return (
		<DataConfigWrapper className="w-full">
			<ConfigProvider theme={TableTheme}>
				{/* <div style={{ height: '500px' }}>
					<SplDatabase isImport />
				</div> */}

				<SPLModeSelect
					key={"ModelTable" + props.key}
					{...{
						column,
						form,
						setForm,
					}}
				/>
				<div className="flex w-full justify-center items-center">{renderFooter()}</div>
			</ConfigProvider>
		</DataConfigWrapper>
	);
};

export default DataConfig;
