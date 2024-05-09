import React, { useContext } from "react";
import { ConfigProvider, Button, Space, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import { SplDatabaseContext } from "../SplDatabase";
import { splFileDataRemoveBatch } from "../../../api/ailuo/spl-db";
import { SplDatabaseImportTypeEnum } from "../../../enums/commonEnum";

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
	isImport?: boolean;
	importType?: SplDatabaseImportTypeEnum;
	setSelectedRows: (v: any[]) => void;
	onBatchImport?: (v: any[]) => void;
	children?: React.ReactNode;
}

const BatchHeader: React.FC<BatchHeaderProps> = ({
	hasSelected,
	selectedRows,
	setSelectedRows,
	isImport,
	importType,
	onBatchImport,
}) => {
	const { fetchList } = useContext(SplDatabaseContext)! as any;
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
					await splFileDataRemoveBatch(ids);
					setSelectedRows([]);
					await fetchList();
				} catch (error) {
					console.log(error);
				}
			},
			onCancel: () => {
				console.log("Cancel");
			},
		});
	};

	const handleBatchImport = () => {
		onBatchImport?.(
			selectedRows.filter(
				(item) =>
					!(
						!item.ingredientsList &&
						!item.bom &&
						!item.processPkg &&
						!item.fitOutPkg &&
						!item.operationInstruction
					),
			),
		);
	};

	return (
		<BatchHeaderRoot isShow={hasSelected}>
			<Space size={13}>
				{!isImport ? (
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
				) : importType === SplDatabaseImportTypeEnum.多型号导入 ? (
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary" onClick={handleBatchImport}>
							导入
						</Button>
					</ConfigProvider>
				) : (
					""
				)}
			</Space>
		</BatchHeaderRoot>
	);
};

export default BatchHeader;
