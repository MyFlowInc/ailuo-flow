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



const InfoCarrdContainer = styled.div`
	display: flex;
	justify-content: space-around;
	box-shadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)' ;
	.item-col{
		display: flex;
		margin-top: 16px;
	}
	.content{
		color: #848484;
		margin-left: 8px;
	}
`
const InfoCard = (props: any) => {

	return <div className="w-full"  >
		<div className="flex justify-between items-center mt-4" style={{ padding: "0 10%" }}>
			<div style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '24px' }}>
				土耳其项目
			</div>
			<div style={{
				borderRadius: '5px',
				border: '1px solid #707683',
				width: '121px',
				height: '24px',
				fontSize: '12px',
				color: '#707683',

			}} className="flex justify-center items-center">
				显示项目全部信息
			</div>
		</div>
		<div style={{ minHeight: '24px', }}>
			<InfoCarrdContainer>
				<div className="flex flex-col mb-8" >
					<div className="item-col">
						<div>项目名称</div>
						<div className="content">xxx容灾备份服务项目</div>
					</div>
					<div className="item-col">
						<div>单位名称</div>
						<div className="content">苏州xx生物科技有限公司</div>
					</div>
					<div className="item-col">
						<div>单位联系方式</div>
						<div className="content">文字</div>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="item-col">
						<div>销售经理</div>
						<div className="content">周时雨</div>
					</div>
					<div className="item-col">
						<div>合同编号</div>
						<div className="content">文字00</div>
					</div>
					<div className="item-col">
						<div>合同日期</div>
						<div className="content">2024年x月x日</div>
					</div>
				</div>
				<div className="flex  flex-col">
					<div className="item-col">
						<div>总价</div>
						<div className="content">文字</div>
					</div>
					<div className="item-col">
						<div>总数量</div>
						<div className="content">文字</div>
					</div>
					<div className="item-col">
						<div>交期</div>
						<div className="content">2024年x月x日</div>
					</div>
				</div>
			</InfoCarrdContainer>
			<div className="flex jus">
				mid
			</div>
		</div>
	</div>

}
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
			<div>
				<InfoCard />
			</div>

			<div
				className="w-full overflow-hidden overflow-x-auto"
				style={{ pointerEvents: disabled ? "none" : "auto" }}
			>
				<ConfigProvider theme={TableTheme}>

				</ConfigProvider>
			</div>
		</div>
	);
};

export default DataConfig;
