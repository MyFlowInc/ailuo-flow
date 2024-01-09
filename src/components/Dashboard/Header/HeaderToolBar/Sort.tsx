import React, { useEffect, useState } from "react";
import { ConfigProvider, Button, Popover, Form, Typography, Select, Segmented } from "antd";
import SortFilled from "../../../../assets/icons/SortFilled";
import ArrowRightFilled from "../../../../assets/icons/ArrowRightFilled";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { setCurTableRows, selectCurTableRows } from "../../../../store/workflowSlice";
import { NumFieldType } from "../../TableColumnRender";
import styled from "styled-components";
import _ from "lodash";
import { greyButtonTheme2 } from "../../../../theme/theme";

import type { SelectProps } from "antd";
import type { TableColumnItem } from "../../../../store/workflowSlice";
import CloseFilled from "../../../../assets/icons/CloseFilled";

const getFileName = (url: string) => {
	const file = url.split("/").pop();
	const fileName = file?.split("-")[1] || "";
	return fileName;
};

interface SortSegmentedProps {
	from: string;
	to: string;
	v: boolean;
	children?: React.ReactNode;
}

const SortSegmented = styled(({ from, to, ...rest }) => (
	<div {...rest}>
		{from}
		<ArrowRightFilled style={{ fontSize: "18px", padding: "0px 8px" }} />
		{to}
	</div>
))<SortSegmentedProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0px 8px;
	font-size: 18;
	font-weight: 700;

	color: ${props => (props.v ? "#0000ff" : "#000000")};
`;

SortSegmented.defaultProps = {
	v: false
};

interface SearchContentProps {
	setFiltering: (v: boolean) => void;
	columns: TableColumnItem[];
	children?: React.ReactNode;
}

const SortContent: React.FC<SearchContentProps> = ({ columns, setFiltering }) => {
	const [form] = Form.useForm();
	const records = useAppSelector(selectCurTableRows);
	const dispatch = useAppDispatch();

	const [c, setConditionValue] = useState<string | "">("");
	const [s, setSortValue] = useState<string | "">("");

	const options: SelectProps["options"] = columns.map((item: any) => {
		return {
			label: item.name,
			value: item.fieldId
		};
	});

	const compare = (a: any, b: any, sortType: string) => {
		const x = a || "";
		const y = b || "";
		const reg: RegExp = new RegExp("[a-zA-Z0-9]", "g");
		if (reg.test(x) || reg.test(y)) {
			if (x > y) {
				return sortType === "asc" ? 1 : -1;
			} else if (x < y) {
				return sortType === "asc" ? -1 : 1;
			} else {
				return 0;
			}
		} else {
			const n = x.localeCompare(y, "zh-Hans-CN");
			return sortType === "asc" ? n : -n;
		}
	};

	const sort = (field: string, sortType: string = s) => {
		if (field) {
			setFiltering(true);
			const currents = columns.filter(column => column.fieldId === field);
			const current = _.get(currents, 0);

			const sortRecords = records.slice().sort((a: any, b: any) => {
				if (current) {
					switch (current.type) {
						case NumFieldType.Attachment:
							const attachmentA = a[field] && getFileName(a[field]);
							const attachmentB = b[field] && getFileName(b[field]);
							return compare(attachmentA, attachmentB, sortType);

						default:
							return compare(a[field], b[field], sortType);
					}
				} else {
					return compare(a[field], b[field], sortType);
				}
			});

			dispatch(setCurTableRows(sortRecords));
		}
	};

	const handleValuesChanged = (changedValues: any, allValues: any) => {
		if (changedValues.condition && changedValues.condition !== "") {
			setConditionValue(changedValues.condition as string);
			s !== "" && sort(changedValues.condition);
		}
	};

	const handleSortChange = (value: string | number) => {
		setSortValue(value as string);
		sort(form.getFieldValue("condition"), value as string);
	};

	const resetSortCondition = () => {
		form.resetFields();
		setSortValue("");
		setConditionValue("");
		sort("createDateTime", "desc");
		setFiltering(false);
	};

	useEffect(() => {
		resetSortCondition();
	}, [columns]);

	useEffect(() => {
		s !== "" && c !== "" && sort(c);
	}, [records.length]);

	return (
		<Form form={form} name="sortForm" initialValues={{ condition: "" }} onValuesChange={handleValuesChanged} style={{ width: 410 }}>
			<Form.Item style={{ marginBottom: "12px" }}>
				<Typography.Text>设置排序条件</Typography.Text>
			</Form.Item>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
				<Form.Item name="condition">
					<Select style={{ width: 180 }} options={[{ label: "选择条件", value: "" }, ...options]} />
				</Form.Item>
				{c !== "" && (
					<Form.Item>
						<Segmented
							defaultValue=""
							options={[
								{
									label: <SortSegmented from="A" to="Z" v={s === "asc" ? 1 : 0} />,
									value: "asc"
								},
								{
									label: <SortSegmented from="Z" to="A" v={s === "desc" ? 1 : 0} />,
									value: "desc"
								}
							]}
							onChange={handleSortChange}
						/>
						<Button type="text" icon={<CloseFilled style={{ fontSize: "12px", color: "#707683" }} />} style={{ marginLeft: "8px" }} onClick={resetSortCondition} />
					</Form.Item>
				)}
			</div>
		</Form>
	);
};

interface SortProps {
	columns: TableColumnItem[];
	children?: React.ReactNode;
}

const Sort: React.FC<SortProps> = ({ columns }) => {
	const [isSorting, set] = useState<boolean>(false);

	return (
		<ConfigProvider theme={greyButtonTheme2}>
			<Popover
				placement="bottom"
				content={
					<SortContent
						columns={columns}
						setFiltering={(v: boolean) => {
							set(v);
						}}
					/>
				}
				trigger="click">
				<Button type={`${isSorting ? "primary" : "text"}`} icon={<SortFilled style={{ fontSize: "12px", color: "#707683" }} />}>
					排序
				</Button>
			</Popover>
		</ConfigProvider>
	);
};

export default Sort;
