import React, { useEffect, useState } from "react";

import _ from "lodash";

import PrepareForm from "./PrepareForm";
import { flowApproveInfo } from "../../../api/ailuo/approve";

const ReviewForm: React.FC<any> = (props: any) => {
	const { splId } = props;
	const [accessList, setAccessList] = useState<any[]>([]);
	const getAclList = async () => {
		try {
			let params: any = {
				pageNum: 1,
				pageSize: 10,
				projectSaleId: splId,
				audittype: "pro_reviewing",
			};
			const res = await flowApproveInfo(params);
			setAccessList(_.get(res, "data.record") || []);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (splId) {
			getAclList();
		}
	}, [splId]);

	return (
		<PrepareForm {...props} accessList={accessList} getAclList={getAclList} />
	);
};

export default ReviewForm;
