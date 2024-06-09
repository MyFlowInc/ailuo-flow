import React from "react";
import ApproveSvg from "./assets/approve.svg";

interface ApproveButtonProps {}

const ApproveButton: React.FC<ApproveButtonProps> = () => {
	return (
		<div className="flex items-center justify-center bg-[#09AB00] w-[16px] h-[16px] rounded-sm">
			<img src={ApproveSvg} alt="" />
		</div>
	);
};

export default ApproveButton;
