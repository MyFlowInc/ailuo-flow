import React, { useContext } from "react";
import { ConfigProvider, Button, Space, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { greyButtonTheme } from "../../../theme/theme";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import { SaleManageContext } from "../SaleManage";
import { saleProjectRemoveBatch } from "../../../api/ailuo/sale";

interface BatchHeaderRootProps {
	isShow: boolean;
}

const BatchHeaderRoot = styled.div<BatchHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: end;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 1 : 0)};
	width: ${({ isShow }) => (isShow ? "100%" : 0)};
	height: ${({ isShow }) => (isShow ? "100%" : 0)};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface BatchHeaderProps {
	hasSelected: boolean;
	selectedRows: any[];
	setSelectedRows: (v: any[]) => void;
	children?: React.ReactNode;
}

const BatchHeader: React.FC<BatchHeaderProps> = ({
	hasSelected,
	selectedRows,
	setSelectedRows,
}) => {
	const { fetchSaleList } = useContext(SaleManageContext)! as any;
	const handleBatchDelete = () => {
		Modal.confirm({
			title: "是否确认批量删除选中条目?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				const ids = selectedRows.map((item) => item.id);
				try {
					await saleProjectRemoveBatch(ids);
					setSelectedRows([]);
					await fetchSaleList();
				} catch (error) {
					console.log(error);
				}
			},
			onCancel: () => {
				console.log("Cancel");
			},
		});
	};

	return (
		<BatchHeaderRoot isShow={hasSelected}>
			<Space size={13}>
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						type="primary"
						icon={
							<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />
						}
						onClick={handleBatchDelete}
					>
						删除
					</Button>
				</ConfigProvider>
			</Space>
		</BatchHeaderRoot>
	);
};

export default BatchHeader;
