/**
 * type=3
 */

import React, { useContext, useEffect, useState } from "react";

import { myFlowUpload } from "../../../../api/upload";
import _ from "lodash";
import { Button, Popover } from "antd";
import { DashboardRouterOutletContext } from "../../../../context";
import SplDatabaseModal from "../../SplDatabaseModal";
import { SplDatabaseImportTypeEnum } from "../../../../enums/commonEnum";

interface TypeAttachmentProps {
	cell: any;
	form: any;
	setForm: any;
	enableSplDatabase?: boolean;
	splDatabaseField?: string;
	useFlex?: boolean;
}

const TypeAttachment: React.FC<TypeAttachmentProps> = (
	props: TypeAttachmentProps,
) => {
	const { cell, form, setForm } = props;

	const [fileList, setFileList] = useState<string[]>([]);

	if (!DashboardRouterOutletContext) {
		return null;
	}
	const { setFileUrl, setIsPdfModalViewOpen } = useContext(
		DashboardRouterOutletContext,
	);
	const [isShowSplDatabaseModal, setIsShowSplDatabaseModal] = useState(false);

	// 权限处理
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(cell, "disabled")) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [cell]);

	// 初始化
	useEffect(() => {
		const urls = form[cell.key];
		if (!urls) {
			return;
		}
		try {
			const urlList = JSON.parse(urls);
			setFileList(urlList);
		} catch (error) {
			console.log(error);
			setFileList([urls]);
		}
	}, [form]);

	const getFileName = (url: string) => {
		const file = url.split("/").pop();
		if (file) {
			let fileName;
			if (file.includes("-")) {
				fileName = file?.split("-")[1] || "";
			} else {
				fileName = file;
			}
			return fileName;
		}
	};

	const uploadHandler = async () => {
		if (disabled) {
			return;
		}
		console.log(111, "uploadHandler");
		const inputTag = document.createElement("input");
		inputTag.type = "file";
		inputTag.accept = "*";
		inputTag.click();
		inputTag.onchange = async () => {
			let res;
			try {
				if (inputTag.files && inputTag.files[0]) {
					const file = inputTag.files[0];
					const fileSizeInMB = file.size / (1024 * 1024);
					if (fileSizeInMB > 10) {
						alert("文件大小超过限制，请选择小于10MB的文件");
						return;
					}
					console.log(inputTag.files);
					const formData = new FormData();
					formData.append("file", inputTag.files[0]);
					const res = await myFlowUpload(formData);
					console.log("uploadHandler", res.data.url);
					if (res.data.url) {
						onUrlChange(res.data.url);
					}
				}
			} catch (e) {
				console.log(e, res);
			}
		};
	};
	const onUrlChange = (url: string) => {
		const list = [...fileList, url];
		// 同步
		setFileList(list);
		setForm({
			...form,
			[cell.key]: JSON.stringify(list),
		});
	};
	const downLoadHandle = (idx: number) => {
		const url = fileList[idx] as any;
		var downloadLink = document.createElement("a");
		downloadLink.href = url.replace("http", "https");
		downloadLink.download = url.split("/").pop();
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};
	const previewHandle = (idx: number) => {
		const url = fileList[idx] as any;
		console.log("previewHandle", url);
		setFileUrl(`/preview?url=${url.replace("http", "https")}`);
		setIsPdfModalViewOpen(true);
	};

	const deleteHandle = (idx: number) => {
		fileList.splice(idx, 1);
		setFileList([...fileList]);
		setForm({
			...form,
			[cell.key]: JSON.stringify(fileList),
		});
	};

	const handleShowSplDatabase = () => {
		setIsShowSplDatabaseModal(true);
	};

	const handleSplDatabaseImport = (record: any) => {
		let list = [...fileList];
		if (record[props.splDatabaseField as string]) {
			list = [
				...fileList,
				...JSON.parse(record[props.splDatabaseField as string]),
			];
		}
		// 同步
		setFileList(list);
		setForm({
			...form,
			[cell.key]: JSON.stringify(list),
		});
		setIsShowSplDatabaseModal(false);
	};

	const renderSplDatabaseModal = () => {
		return (
			<SplDatabaseModal
				open={isShowSplDatabaseModal}
				importType={SplDatabaseImportTypeEnum.单字段导入}
				setOpen={(open: boolean) => setIsShowSplDatabaseModal(open)}
				setImportFlowItemRecord={handleSplDatabaseImport}
			></SplDatabaseModal>
		);
	};

	const content = (idx: number) => {
		return (
			<div className="p-1">
				<Button
					disabled={disabled}
					type="link"
					danger
					onClick={() => {
						deleteHandle(idx);
					}}
				>
					删除
				</Button>
				<Button
					type="link"
					onClick={() => {
						downLoadHandle(idx);
					}}
				>
					下载
				</Button>
				<Button
					type="link"
					onClick={() => {
						previewHandle(idx);
					}}
				>
					预览
				</Button>
				{/* 继续上传 */}
				{props.enableSplDatabase ? (
					<>
						<Button type="link" onClick={uploadHandler}>
							本地新增
						</Button>
						<Button type="link" onClick={handleShowSplDatabase}>
							资料库新增
						</Button>
					</>
				) : (
					<Button type="link" onClick={uploadHandler}>
						继续上传
					</Button>
				)}
			</div>
		);
	};

	if (!_.isEmpty(fileList)) {
		return (
			<div className={props.useFlex ? "flex gap-3" : ""}>
				{fileList.map((url, index) => {
					return (
						<div key={"file" + index}>
							<Popover
								overlayInnerStyle={{ padding: 0 }}
								content={() => {
									return content(index);
								}}
							>
								<span
									style={{
										color: "#1677ff",
										cursor: "pointer",
										transition: "color 0.3s",
									}}
								>
									{getFileName(url)}
								</span>
							</Popover>
						</div>
					);
				})}
				{isShowSplDatabaseModal && renderSplDatabaseModal()}
			</div>
		);
	}

	const enableSplDatabaseUpload = () => {
		return (
			<>
				<Popover
					overlayInnerStyle={{ padding: 0 }}
					content={() => (
						<div>
							<Button type="link" onClick={uploadHandler}>
								本地新增
							</Button>
							<Button type="link" onClick={handleShowSplDatabase}>
								资料库新增
							</Button>
						</div>
					)}
				>
					<span
						style={{
							color: "#1677ff",
							cursor: "pointer",
							transition: "color 0.3s",
						}}
					>
						{"上传"}
					</span>
				</Popover>
				{isShowSplDatabaseModal && renderSplDatabaseModal()}
			</>
		);
	};

	return (
		<div>
			{props.enableSplDatabase ? (
				enableSplDatabaseUpload()
			) : (
				<span
					onClick={uploadHandler}
					style={{
						color: "#1677ff",
						cursor: "pointer",
						transition: "color 0.3s",
					}}
				>
					{"上传"}
				</span>
			)}
		</div>
	);
};

export default TypeAttachment;
