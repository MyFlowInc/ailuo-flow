import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
} from "antd";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import { TableTheme, blueButtonTheme, redButtonTheme } from "../../../theme/theme";
import styled from "styled-components";
import PrepareForm from "./PrepareForm";
import SPLModeSelect from "./SPLModeSelect";
import { PreProductionContext } from "../PreProductionManage";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import UpdateWorkshop from "./UpdateWorkshop";
import { splPreProjectEdit } from "../../../api/ailuo/spl-pre-product";
import { DataType } from "./DataConfig";


const SubmitWorkshopWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;
const SubmitWorkshop: React.FC<any> = (props: any) => {
	const { step } = props
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);
	const [dataSource, setDataSource] = useState<DataType[]>([])
	const { curProject, setIsShowApproveModal, freshData } = useContext(
		PreProductionContext,
	) as any;
	if (curProject.status === SPLProductStatusMap.ProChange) {
		return <UpdateWorkshop />
	}


	useEffect(() => {
		
	}, [])
	

	const handleSaveRecord = () => {

		const id = form.id;
		try {

		} catch (error) {

		}
	};
	const changeBaseInfo = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.ProChange,
			});
			await freshData();
		} catch (error) {

		}
	}
	const renderFooter = () => {
		if (curProject.status === SPLProductStatusMap.SubWorkshop) {
			return (
				<>
					<ConfigProvider theme={redButtonTheme}>
						<Button key={'base-info'} type="primary" onClick={changeBaseInfo}>修改项目基本信息</Button>
					</ConfigProvider>
					<ConfigProvider theme={redButtonTheme}>
						<Button key={'base-config'} className="ml-8" type="primary">修改生产资料配置</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button className="ml-8" type="primary" onClick={handleSaveRecord}>
							提交车间
						</Button>
					</ConfigProvider>
				</>
			);
		}
		return null

	};
	return (
		<SubmitWorkshopWrapper
			className="w-full flex flex-col"
			style={{ paddingRight: "200px" }}
		>
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect

					key={"ModelTable" + props.key}
					{...{
						column,
						form,
						setForm,
						rootStyle: {},
						dataSource,
						setDataSource,
						step,
					}}
				/>
			</ConfigProvider>
			<div className="w-full flex justify-center">{renderFooter()}</div>

		</SubmitWorkshopWrapper>
	);
};

export default SubmitWorkshop;

