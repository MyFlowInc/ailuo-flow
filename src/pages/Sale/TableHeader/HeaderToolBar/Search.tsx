import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Space, Form, Input, Select } from "antd";
import SearchFilled from "../../../../assets/icons/SearchFilled";
import { SaleManageContext } from "../../SaleManage";

const SearchRoot = styled.div`
	display: flex;
	align-items: center;
`;

interface SearchProps {
	columns: any[];
	children?: React.ReactNode;
}

const Search: React.FC<SearchProps> = ({ columns }) => {
	const [form] = Form.useForm();
	const options = columns;
	const [inputValue, setInputValue] = useState<string>("");
	const [selectValue, setSelectValue] = useState<string>("name");
	const { fetchSaleList } = useContext(SaleManageContext);
	const handleSearch = async () => {
		await fetchSaleList({
			search: {
				[selectValue]: inputValue.trim(),
			},
		});
	};
	return (
		<SearchRoot>
			<Form
				layout="inline"
				form={form}
				name="SearchForm"
				onValuesChange={() => {}}
			>
				<Form.Item name="searchField" style={{ margin: 0, padding: 0 }}>
					<Space.Compact>
						<Select
							value={selectValue}
							onChange={(e: string) => setSelectValue(e)}
							options={options}
							style={{ width: "120px" }}
						/>
						<Input
							value={inputValue}
							onInput={(e: any) => setInputValue(e.target.value)}
							placeholder="请输入搜索内容"
							suffix={
								<SearchFilled
									style={{ fontSize: "16px", color: "#707683" }}
									onClick={handleSearch}
								/>
							}
							style={{ width: 280 }}
							onPressEnter={handleSearch}
						/>
					</Space.Compact>
				</Form.Item>
			</Form>
		</SearchRoot>
	);
};

export default Search;
