import { Dropdown, MenuProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { WorkFlowStatusInfo, selectCurStatusFieldId } from "../../../store/workflowSlice";
import _ from "lodash";
import { useAppSelector } from "../../../store/hooks";

const StatusTagRoot = styled.div``;
const genItems = (list: WorkFlowStatusInfo[]): MenuProps["items"] => {
	return list.map(item => {
		return {
			key: item.id || "", // TODO: ts类型体操 没处理好这个类型
			label: <div>{item.name}</div>
		};
	});
};

interface StatusTagProps {
	statusList: WorkFlowStatusInfo[];
	form: any;
	setForm: (value: any) => void;
}
export const StatusTag: React.FC<StatusTagProps> = props => {
	const { statusList, form, setForm } = props;
	const [name, setName] = useState("");
	const [color, setColor] = useState("");
	const curStatusFieldId = useAppSelector(selectCurStatusFieldId);

	useEffect(() => {
		const optionId = form[curStatusFieldId];
		const choosedItem = _.find(statusList, { id: optionId });
		if (optionId && choosedItem) {
			setName(choosedItem.name);
			const c = choosedItem.color;
			if (_.isString(c)) {
				setColor(c);
			} else {
				setColor("#2db7f5");
			}
			return;
		} else if (!optionId && statusList.length > 0) {
			const firstItem = statusList[0];
			setName(firstItem.name);
			if (_.isString(firstItem.color)) {
				setColor(firstItem.color);
			} else {
				setColor("#2db7f5");
			}
			handleMenuClick({ key: firstItem.id || "" });
		} else {
			setName(_.find(statusList, { id: optionId })?.name || "未开始");
			setColor("#2db7f5");
		}
	}, [form]);

	const handleMenuClick = (info: { key: string }) => {
		const id = info.key;
		setForm({
			...form,
			[curStatusFieldId]: id
		});
	};
	return (
		<StatusTagRoot>
			<Dropdown
				menu={{
					items: genItems(statusList),
					onClick: (info: { key: string }) => {
						handleMenuClick(info);
					}
				}}
				placement="bottom">
				<Tag color={color} style={{ color: "#000" }}>
					{name}
				</Tag>
			</Dropdown>
		</StatusTagRoot>
	);
};
