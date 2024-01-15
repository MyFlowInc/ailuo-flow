/**
 * type=3
 */

import React, { useState } from "react";
import { TableColumnItem } from "../../../../store/workflowSlice";

import { myFlowUpload } from "../../../../api/upload";

interface TypeAttachmentProps {
	mode?: "multiple";
	cell: TableColumnItem;
	form: any;
	setForm: any;
}

const TypeAttachment: React.FC<TypeAttachmentProps> = (props: TypeAttachmentProps) => {
	const { cell, form, setForm } = props;
	const [fileName, setFileName] = useState("");

	const uploadHandler = async () => {
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
					if (fileSizeInMB > 4) {
						alert("文件大小超过限制，请选择小于4MB的文件");
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
	// 初始化
	// useEffect(() => {
	//   console.log('?????', mode, cell, form, setForm )
	// }, [form])

	const onUrlChange = (url: string) => {
		const file = url.split("/").pop();
		const fileName = file?.split("-")[1] || "";
		setFileName(fileName);
		setForm({
			...form,
			[cell.key]: url
		});
	};

	return (
		<div>
			<span
				onClick={uploadHandler}
				style={{
					color: "#1677ff",
					cursor: "pointer",
					transition: "color 0.3s"
				}}>
				{fileName || "上传"}
			</span>
		</div>
	);
};

export default TypeAttachment;
