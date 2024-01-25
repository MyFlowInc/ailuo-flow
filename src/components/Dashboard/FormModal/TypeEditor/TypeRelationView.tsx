/**
 * type=3
 */

import React, { useRef, useEffect, SyntheticEvent } from "react";
import TurnView from "../../../../pages/Sale/TurnView";
import { saleProjectList } from "../../../../api/ailuo/sale";
import _ from "lodash";
import styled from "styled-components";

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
`;

const TypeRelationView: React.FC<any> = (props: any) => {
	const { cell, form, setForm } = props;
	const [saleInfo, setSaleInfo] = React.useState<any>({});
	const fetchSaleInfo = async (saleId: string) => {
		const res = await saleProjectList({
			id: saleId,
			pageNum: 1,
			pageSize: 5,
		});
		console.log(111, res.data);
		const info = _.get(res, "data.record[0]") || {};
		setSaleInfo(info);
	};

	useEffect(() => {
		console.log(222, form);
		const { linkSale } = form;
		if (linkSale) {
			fetchSaleInfo(linkSale);
		}
	}, [form]);
	if (!_.isEmpty(saleInfo)) {
		return (
			<PriceRoot>
				{`${saleInfo.name}-报价  (第${saleInfo.turnTime}轮)`}
			</PriceRoot>
		);
	}
	return (
		<div>
			<span>{form.name}</span>
			<TurnView turnTime={form.turnTime} />
		</div>
	);
};

export default TypeRelationView;
