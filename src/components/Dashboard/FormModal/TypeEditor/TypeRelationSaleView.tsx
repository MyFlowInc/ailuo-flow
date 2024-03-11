/**
 * type=3
 */

import React, { useRef, useEffect, SyntheticEvent, useContext } from "react";
import TurnView from "../../../../pages/Sale/TurnView";
import { saleProjectList } from "../../../../api/ailuo/sale";
import _ from "lodash";
import styled from "styled-components";
import { DashboardRouterOutletContext } from "../../../../routes/DashboardRouterOutlet";

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
	const { form } = props;
	const [saleInfo, setSaleInfo] = React.useState<any>({});
	const { setSaleId, setIsSaleModalViewOpen } = useContext(
		DashboardRouterOutletContext,
	);
	const fetchSaleInfo = async (saleId: string) => {
		const res = await saleProjectList({
			id: saleId,
			pageNum: 1,
			pageSize: 5,
		});
		const info = _.get(res, "data.record[0]") || {};
		setSaleInfo(info);
	};

	useEffect(() => {
		const { linkSale, relationReview } = form; // relationReview 后端取名字搞反了
		// console.log(' SaleView', form)
		// TODO: 后端没有统一字段
		const saleId = linkSale || relationReview;
		if (saleId) {
			fetchSaleInfo(saleId);
		}
		return () => {
			setSaleInfo({});
		};
	}, [form.linkSale, form.relationReview]);
	const showModalView = (saleInfo: any) => {
		const { id } = saleInfo;
		setSaleId(id);
		setIsSaleModalViewOpen(true);
	};
	if (!_.isEmpty(saleInfo)) {
		return (
			<PriceRoot onClick={() => showModalView(saleInfo)}>
				{`${saleInfo.name}-报价  (第${saleInfo.turnTime}轮)`}
			</PriceRoot>
		);
	}
	if (!form.name) {
		return null;
	}
	return null;
};

export default TypeRelationSaleView;
