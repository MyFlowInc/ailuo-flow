import React from "react";
import styled from "styled-components";
import { Space, Form, Input, Select } from "antd";
import type { TableColumnItem } from "../../../../store/workflowSlice";

import SearchFilled from "../../../../assets/icons/SearchFilled";

const SearchRoot = styled.div`
	display: flex;
	align-items: center;
`;

interface SearchProps {
	columns: TableColumnItem[];
	children?: React.ReactNode;
}

const Search: React.FC<SearchProps> = ({ columns }) => {
	const [form] = Form.useForm();
	const rows = [];

	const count = <div>123</div>;
	const options = [
		{
			value: "name",
			label: "项目名称"
		},
		{
			value: "status",
			label: "状态"
		}
	];

	return (
		<SearchRoot>
			<Form layout="inline" form={form} name="SearchForm" onValuesChange={() => {}}>
				<Form.Item name="searchField" style={{ margin: 0, padding: 0 }}>
					<Space.Compact>
						<Select defaultValue="name" options={options} style={{ width: "120px" }} />
						<Input placeholder="请输入搜索内容" suffix={<SearchFilled style={{ fontSize: "16px", color: "#707683" }} />} style={{ width: 280 }} />
					</Space.Compact>
				</Form.Item>
			</Form>
		</SearchRoot>
	);
};

export default Search;
