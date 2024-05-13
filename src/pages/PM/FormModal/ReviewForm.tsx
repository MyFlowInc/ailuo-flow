import React, { useEffect, useState } from "react";

import _ from "lodash";

import PrepareForm from "./PrepareForm";
import { finalInfoPage } from "../../../api/ailuo/approve";

const ReviewForm: React.FC<any> = (props: any) => {
	const { splId } = props;
	const [accessList, setAccessList] = useState<any[]>([]);
	const getAclList = async (id: string) => {
		try {
			const res = await finalInfoPage(id);
			setAccessList(_.get(res, "data.record") || []);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (splId) {
			getAclList(splId);
		}
	}, [splId]);

	return <PrepareForm {...props} accessList={accessList} />;
};

export default ReviewForm;
