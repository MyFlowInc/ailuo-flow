/**
 * type=3
 */

import React, { useRef, useEffect, } from "react";
import { saleProjectList } from "../../../../api/ailuo/sale";
import _ from "lodash";
import styled from "styled-components";
import { DashboardRouterOutletContext } from "../../../../routes/DashboardRouterOutlet";
import { techProjectList } from "../../../../api/ailuo/tech";

const PriceRoot = styled.div`
	height: fit-content;
	border-radius: 20px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 4px 16px;
	background: #e3f5e4;
	width: fit-content;
	cursor: pointer;
`;

const TypeRelationSaleView: React.FC<any> = (props: any) => {
	const { form, } = props;
	const [techInfo, setTechInfo] = React.useState<any>({});
	const fetchSaleInfo = async (techId: number) => {
		const res = await techProjectList({
			id: techId,
			pageNum: 1,
			pageSize: 5,
		});
		console.log(111, res.data);
		const info = _.get(res, "data.record[0]") || {};
		setTechInfo(info);
	};

	useEffect(() => {
		const { relationSale, } = form;
		// TODO: 后端没有统一字段
		const techId = relationSale;
		if (techId) {
			fetchSaleInfo(techId);
		}
	}, [form]);
	const showModalView = (techInfo: any) => {
		console.log(11, techInfo)
		const { id } = techInfo
	}
	if (!_.isEmpty(techInfo)) {
		return (
			<PriceRoot onClick={() => showModalView(techInfo)}>
				{`${techInfo.name}-技术评审`}
			</PriceRoot>
		);
	}
	if (!form.name) {
		return null;
	}
	return null
};

export default TypeRelationSaleView;
