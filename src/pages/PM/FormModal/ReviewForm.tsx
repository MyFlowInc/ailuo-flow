import React from "react";

import _ from "lodash";

import PrepareForm from "./PrepareForm";

const ReviewForm: React.FC<any> = (props: any) => {
	console.log(222, props);
	return <PrepareForm {...props} />;
};

export default ReviewForm;
