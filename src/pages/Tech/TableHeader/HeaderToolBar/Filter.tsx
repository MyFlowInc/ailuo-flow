import React, { useState } from "react";
import { ConfigProvider, Button, Popover, Form, Typography, Select, Input, Space } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";

import FilterFilled from "../../../../assets/icons/FilterFilled";
import CloseFilled from "../../../../assets/icons/CloseFilled";
import { greyButtonTheme2 } from "../../../../theme/theme";
import type { SelectProps } from "antd";

function encode(keyword: string) {
	const reg = /[\[\(\$\^\.\]\*\\\?\+\{\}\\|\)]/gi;
	return keyword.replace(reg, key => `\\${key}`);
}

interface ConditionType {
	conditionName: string;
	conditionOperator: string;
	conditionValue: string;
}

interface FilterTableProps {
	setFiltering: (v: boolean) => void;
	records: any[];
	columns: any[];
	children?: React.ReactNode;
}

const FilterTable: React.FC<FilterTableProps> = ({ records, columns, setFiltering }) => {
	const [form] = Form.useForm();
	console.log(11, columns);
	const [firstKey, setFirstKey] = React.useState<string>();
	const [relation, SetRelation] = React.useState<"either" | "every">("either");
	const [conditions, SetConditions] = React.useState<ConditionType[]>([]);

	const CompareCondition = (record: any, condition: ConditionType): boolean => {
		switch (condition.conditionOperator) {
			case "eq":
				return record[condition.conditionName] === condition.conditionValue;

			case "ne":
				return record[condition.conditionName] !== condition.conditionValue;

			case "include":
				const target = record[condition.conditionName] as string;
				// console.log("search condition", record[condition.conditionName]);
				const rega: RegExp = new RegExp(encode(condition.conditionValue), "gi");
				return rega.test(target);

			case "notinclude":
				const target1 = record[condition.conditionName] as string;
				// console.log("search condition", record[condition.conditionName]);
				const regb: RegExp = new RegExp(encode(condition.conditionValue), "gi");
				return !regb.test(target1);

			case "null":
				return record[condition.conditionName] === undefined || record[condition.conditionName] === "";

			case "notnull":
				return record[condition.conditionName] && record[condition.conditionName] !== "";

			default:
				return true;
		}
	};

	const handleFilter = () => {
		const filterRecords = records.filter(record => {
			if (conditions.length < 1) {
				return true;
			} else if (conditions.length === 1) {
				return CompareCondition(record, _.get(conditions, 0));
			} else {
				switch (relation) {
					case "either":
						return conditions.some((value: ConditionType) => CompareCondition(record, value));

					case "every":
						return conditions.every((value: ConditionType) => CompareCondition(record, value));

					default:
				}
			}
		});
		console.log(filterRecords);
	};

	const handleRelationChange = (value: "either" | "every") => {
		SetRelation(value);
	};

	const handleValuesChanged = (changedValues: any, allValues: any) => {
		const values = allValues.conditions
			.map((condition: any) => {
				const conditionName = condition && condition.conditionName ? condition.conditionName : firstKey;
				const conditionOperator = condition && condition.conditionOperator ? condition.conditionOperator : "eq";
				const conditionValue = condition && condition.conditionValue ? condition.conditionValue : undefined;
				return { conditionName, conditionOperator, conditionValue };
			})
			.filter(
				(v: ConditionType) =>
					v.conditionOperator === "null" ||
					v.conditionOperator === "notnull" ||
					(v.conditionOperator !== "null" && v.conditionValue !== undefined) ||
					(v.conditionOperator !== "notnull" && v.conditionValue !== undefined)
			);

		SetConditions(values);
	};

	const init = () => {
		conditions.length > 0 ? handleFilter() : console.log("no filter");
		conditions.length > 0 ? setFiltering(true) : setFiltering(false);
	};

	React.useEffect(() => {
		init();
	}, [relation, conditions]);

	React.useEffect(() => {
		form.resetFields();
		setFirstKey(_.get(columns, 0)?.key);
	}, [records, columns]);

	return (
		<Form form={form} name="FilterForm" style={{ width: 500, margin: "3px" }} onValuesChange={handleValuesChanged}>
			<Form.Item name="conditionRelation">
				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
					<Typography.Text>设置筛选条件</Typography.Text>
					<div>
						符合以下
						<Select
							popupMatchSelectWidth={false}
							style={{ margin: "0px 8px", width: 70 }}
							dropdownStyle={{ width: 120 }}
							defaultValue="either"
							onChange={handleRelationChange}>
							<Select.Option value="every">所有</Select.Option>
							<Select.Option value="either">任一</Select.Option>
						</Select>
						条件
					</div>
				</div>
			</Form.Item>
			<Form.List
				name="conditions"
				initialValue={[
					{
						conditionName: _.get(columns, 0)?.key,
						conditionOperator: "eq"
					}
				]}>
				{(fields, { add, remove }) => {
					return (
						<>
							{fields.map(({ key, name, ...restField }) => {
								const options: SelectProps["options"] = columns.map((item: any) => {
									return {
										label: item.label,
										value: item.key
									};
								});

								return (
									<div key={key} style={{ display: "flex", justifyContent: "space-around", marginBottom: "15px" }}>
										<Form.Item {...restField} name={[name, "conditionName"]}>
											<Select style={{ width: 180 }} options={options} />
										</Form.Item>
										<Form.Item {...restField} name={[name, "conditionOperator"]}>
											<Select popupMatchSelectWidth={false} style={{ margin: "0px 12px", width: 90 }} dropdownStyle={{ width: 90 }}>
												<Select.Option value="eq">等于</Select.Option>
												<Select.Option value="ne">不等于</Select.Option>
												<Select.Option value="include">包含</Select.Option>
												<Select.Option value="notinclude">不包含</Select.Option>
												<Select.Option value="null">为空</Select.Option>
												<Select.Option value="notnull">不为空</Select.Option>
											</Select>
										</Form.Item>
										<Form.Item {...restField} name={[name, "conditionValue"]} style={{ width: "100%" }}>
											<Input placeholder="请输入" />
										</Form.Item>
										<Form.Item>
											<Button type="text" icon={<CloseFilled style={{ fontSize: "12px", color: "#707683" }} />} style={{ marginLeft: "4px" }} onClick={() => remove(name)} />
										</Form.Item>
									</div>
								);
							})}
							<div>
								<Space align="baseline">
									<Form.Item>
										<Button
											onClick={() =>
												add(
													{
														conditionName: firstKey,
														conditionOperator: "eq"
													},
													fields.length
												)
											}
											block
											icon={<PlusCircleFilled style={{ color: "#707683", fontSize: "12px" }} />}>
											添加条件
										</Button>
									</Form.Item>
								</Space>
							</div>
						</>
					);
				}}
			</Form.List>
		</Form>
	);
};

interface FilterProps {
	records: any[];
	columns: any[];
	children?: React.ReactNode;
}

const Filter: React.FC<FilterProps> = ({ records, columns }) => {
	const [isFiltering, set] = useState<boolean>(false);

	return (
		<ConfigProvider theme={greyButtonTheme2}>
			<Popover
				placement="bottom"
				content={
					<FilterTable
						records={records}
						columns={columns}
						setFiltering={(v: boolean) => {
							set(v);
						}}
					/>
				}
				trigger="click">
				<Button type={`${isFiltering ? "primary" : "text"}`} icon={<FilterFilled style={{ fontSize: "12px", color: "#707683" }} />}>
					筛选
				</Button>
			</Popover>
		</ConfigProvider>
	);
};

export default Filter;
