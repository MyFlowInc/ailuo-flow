import React from "react";

import PdfPreview from "./pdf/PdfPreview";
import DocxPreview from "./word/DocxPreview";

interface FilePreviewProps {
	file: string;
	children?: React.ReactNode;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
	const suffix = file.substring(file.lastIndexOf(".") + 1).toLowerCase();

	switch (suffix) {
		case "pdf":
			return <PdfPreview file={file} />;
		case "docx" || "doc":
			return <DocxPreview file={file} />;
		case "jpg":
		case "png":
		case "jpeg":
			return <div className="w-full h-full flex justify-center"><img src={file} /></div>
		default:
			return <></>;
	}
};

export default FilePreview;
