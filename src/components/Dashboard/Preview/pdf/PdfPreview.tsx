import React from "react";
import * as pdfjs from "pdfjs-dist";
import "./styles.css";

interface PdfPageProps {
	file: string;
}

interface PdfPageStates {}

let container: HTMLDivElement;

class PdfPreview extends React.Component<PdfPageProps, PdfPageStates> {
	/*eslint no-useless-constructor: "off"*/
	constructor(props: PdfPageProps) {
		super(props);
	}

	loadPdf = () => {
		pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.js";

		pdfjs.getDocument(this.props.file).promise.then(
			pdf => {
				container = document.getElementById("viewer") as HTMLDivElement;
				for (let i = 1; i <= pdf.numPages; i++) {
					this.renderPage(pdf, i);
				}
			},
			function (reason) {
				console.error(reason);
			}
		);
	};

	renderPage = (pdf: any, num: number) => {
		pdf.getPage(num).then((page: any) => {
			const scale = 1.5;
			const viewport = page.getViewport({ scale });
			const pageDiv = document.createElement("div");
			pageDiv.setAttribute("id", "page-" + num);
			pageDiv.setAttribute("style", "position: relative;margin-bottom:12px;text-align: center;");

			container.appendChild(pageDiv);

			const canvas = document.createElement("canvas");
			pageDiv.setAttribute("class", "canvasWrapper");
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			const renderContext = {
				canvasContext: canvas.getContext("2d"),
				viewport: viewport
			};
			pageDiv.appendChild(canvas);

			const renderTask = page.render(renderContext);

			renderTask.promise.then(() => {
				console.log("Page rendered");
				return page.getTextContent();
			});
		});
	};

	componentDidMount() {
		this.loadPdf();
	}

	render() {
		return (
			<div id="viewerContainer">
				<div id="viewer" className="pdfViewer"></div>
			</div>
		);
	}
}

export default PdfPreview;
