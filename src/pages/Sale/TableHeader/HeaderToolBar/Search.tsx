import React from "react";
import styled from "styled-components";
import { Space, Form, Input } from "antd";
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

	return (
		<SearchRoot>
			<Form layout="inline" form={form} name="SearchForm" onValuesChange={() => {}}>
				<Form.Item name="searchField" style={{ margin: 0, padding: 0 }}>
					<Space>
						<Input placeholder="请输入搜索内容" prefix={<SearchFilled style={{ fontSize: "16px", color: "#707683" }} />} suffix={count} style={{ width: 280 }} />
					</Space>
				</Form.Item>
			</Form>
		</SearchRoot>
	);
};

export default Search;
