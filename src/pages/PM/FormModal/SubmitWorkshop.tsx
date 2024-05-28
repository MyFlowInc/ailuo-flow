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
import {
	TableTheme,
	blueButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import styled from "styled-components";
import PrepareForm from "./PrepareForm";
import SPLModeSelect from "./SPLModeSelect";
import { PreProductionContext } from "../PreProductionManage";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import UpdateWorkshop from "./UpdateWorkshop";
import {
	splPreProjectEdit,
	splProjectList,
} from "../../../api/ailuo/spl-pre-product";
import { DataType } from "./DataConfig";
import { useAppSelector } from "../../../store/hooks";
import { selectIsFinance } from "../../../store/globalSlice";

const SubmitWorkshopWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;
const SubmitWorkshop: React.FC<any> = (props: any) => {
	const { step } = props;
	const isFinance = useAppSelector(selectIsFinance);
	
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const { curProject, setIsShowApproveModal, freshData } = useContext(
		PreProductionContext,
	) as any;

	const getDataSource = async () => {
		const res = await splProjectList({
			id: curProject.id,
			pageNum: 1,
			pageSize: 10,
		});
		setDataSource(
			JSON.parse(_.get(res, "data.record[0].mechanismForm") || "[]"),
		);
	};
	const handleSaveRecord = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.Ended,
			});
			await freshData();
		} catch (error) {}
	};

	const changeBaseInfo = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.ProStart,
			});
			await freshData();
		} catch (error) {}
	};

	const changeMaterials = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.Materials,
			});
			await freshData();
		} catch (error) {}
	};

	const handleProChange = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.ProChange,
			});
			await freshData();
		} catch (error) {}
	};

	useEffect(() => {
		getDataSource();
	}, []);

	const renderFooter = () => {

		if (isFinance) {
			return null;
		}

		if (curProject.status === SPLProductStatusMap.SubWorkshop) {
			return (
				<>
					<ConfigProvider theme={redButtonTheme}>
						<Button key={"base-info"} type="primary" onClick={changeBaseInfo}>
							修改项目基本信息
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={redButtonTheme}>
						<Button
							key={"base-config"}
							className="ml-8"
							type="primary"
							onClick={changeMaterials}
						>
							修改生产资料配置
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button className="ml-8" type="primary" onClick={handleSaveRecord}>
							提交车间
						</Button>
					</ConfigProvider>
				</>
			);
		}
		if (
			curProject.status === SPLProductStatusMap.Ended &&
			Number(curProject.turnTime) < 2
		) {
			return (
				<ConfigProvider theme={redButtonTheme}>
					<Button key={"base-info"} type="primary" onClick={handleProChange}>
						预生产变更
					</Button>
				</ConfigProvider>
			);
		}
		return null;
	};
	return curProject.status === SPLProductStatusMap.ProChange ||
		curProject.status === SPLProductStatusMap.ChangeReview ? (
		<UpdateWorkshop />
	) : (
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
