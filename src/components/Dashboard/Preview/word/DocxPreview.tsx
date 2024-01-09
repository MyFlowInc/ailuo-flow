import React from "react";
import * as docx from "docx-preview";

interface DocxPreviewProps {
	file: string;
	children?: React.ReactNode;
}

const DocxPreview: React.FC<DocxPreviewProps> = ({ file }) => {
	React.useEffect(() => {
		fetch(file).then(res => {
			const template = res.arrayBuffer();
			docx.renderAsync(template, document.getElementById("container") as HTMLElement).then(x => console.log("docx: finished", x));
			console.log("buffer: ", template);
		});
	}, []);

	return <div id="container" style={{ height: "100vh", overflowY: "auto" }} />;
};

export default DocxPreview;
