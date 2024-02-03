import React from "react";
import { useLocation } from "react-router-dom";

import FilePreview from "../components/Dashboard/Preview/FilePreview";

const Preview: React.FC = () => {
	const location = useLocation();

	const search = location.search;
	const url = search.substring(search.lastIndexOf("=") + 1);
	return <FilePreview file={url} />;
};

export default Preview;
