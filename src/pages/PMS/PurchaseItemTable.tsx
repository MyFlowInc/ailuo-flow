import { Button, ConfigProvider, Table } from "antd";
import React, { useState } from "react";
import { TableTheme } from "../../theme/theme";
import EditFilled from "../../assets/icons/EditFilled";
import DeleteFilled from "../../assets/icons/DeleteFilled";
import PlusSvg from "./assets/plus.svg";
import { PurchaseItemRecordModal } from "./FormModal/PurchaseItemRecordModal";
import { PurchaseStatusEnum } from "../../api/ailuo/dict";

interface PurchaseItemTableProps {
	form: any;
	setForm: (value: any) => void;
}

const PurchaseItemTable: React.FC<PurchaseItemTableProps> = ({
	form,
	setForm,
}) => {
	const [dataSource, setDataSource] = useState([{}]);
	const [isShowRequistionModal, setIsShowRequistionModal] = useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const [modalType, setModalType] = useState<"add" | "edit">("add");

	const handleEdit = (item: any) => {
		setModalType("edit");
		setCurrentItem(item);
		setIsShowRequistionModal(true);
	};

	const defaultColumns: any[] = [
		{
			width: 60,
			title: "序号",
			dataIndex: "index",
			key: "index",
			render: (text: any, record: any, index: number) => {
				return <span>{index + 1}</span>;
			},
		},
		{
			width: 90,
			title: "物料名称",
			dataIndex: "物料名称",
			key: "物料名称",
		},
		{
			width: 90,
			title: "规格",
			dataIndex: "规格",
			key: "规格",
		},
		{
			width: 90,
			title: "材质/品牌",
			dataIndex: "材质/品牌",
			key: "材质/品牌",
		},
		{
			width: 90,
			title: "单位文字",
			dataIndex: "单位文字",
			key: "单位文字",
		},
		{
			width: 90,
			title: "采购数量",
			dataIndex: "采购数量",
			key: "采购数量",
		},
		{
			width: 90,
			title: "订单/使用部门",
			dataIndex: "订单/使用部门",
			key: "订单/使用部门",
		},
		{
			width: 90,
			title: "用途",
			dataIndex: "用途",
			key: "用途",
		},
		{
			width: 90,
			title: "备注",
			dataIndex: "备注",
			key: "备注",
		},
		{
			width: 90,
			title: "来料检",
			dataIndex: "来料检",
			key: "来料检",
		},
		{
			width: 90,
			title: "入库",
			dataIndex: "入库",
			key: "入库",
		},
		{
			width: 90,
			title: "来料检完成时间",
			dataIndex: "来料检完成时间",
			key: "来料检完成时间",
		},
		{
			width: 90,
			title: "入库完成时间",
			dataIndex: "入库完成时间",
			key: "入库完成时间",
		},
		{
			width: 90,
			title: "操作",
			dataIndex: "action",
			key: "action",
			render: (text: any, record: any, index: number) => {
				return (
					<div className="flex items-center justify-around">
						<Button
							type="text"
							color="#717682"
							icon={<EditFilled />}
							className="text-[#717682]"
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
						></Button>
					</div>
				);
			},
		},
	];

	const columns = defaultColumns.map((col: any) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: any) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
			}),
		};
	});

	const handleNew = () => {
		setModalType("add");
		setCurrentItem({});
		setIsShowRequistionModal(true);
	};

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center">
				<span className="mr-6">采购清单</span>
				{form?.status == PurchaseStatusEnum.Start && (
					<div className="flex items-center cursor-pointer" onClick={handleNew}>
						<img src={PlusSvg} alt="" className="mr-2" />
						<span className="text-[#707683]">添加采购项目</span>
					</div>
				)}
			</div>
			<ConfigProvider theme={TableTheme}>
				<Table
					size="small"
					pagination={false}
					dataSource={dataSource}
					columns={columns}
				/>
			</ConfigProvider>
			<PurchaseItemRecordModal
				open={isShowRequistionModal}
				setOpen={setIsShowRequistionModal}
				formItem={currentItem}
				modalType={modalType}
			></PurchaseItemRecordModal>
		</div>
	);
};

export default PurchaseItemTable;
