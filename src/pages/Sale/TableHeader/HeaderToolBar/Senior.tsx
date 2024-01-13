import React from "react";
import { Button, Popover } from "antd";
import { useDispatch } from "react-redux";
import { setIsArchiveView } from "../../../../store/globalSlice";
import UpArrowFilled from "../../../../assets/icons/UpArrowFilled";

const SeniorActionPad: React.FC<{ children?: React.ReactNode }> = () => {
	const dispatch = useDispatch();

	const handleEntryArchiveView = () => {
		dispatch(setIsArchiveView(true));
	};

	return (
		<Button type="text" onClick={handleEntryArchiveView}>
			显示已归档工单
		</Button>
	);
};

interface SeniorProps {
	children?: React.ReactNode;
}

const Senior: React.FC<SeniorProps> = () => {
	return (
		<Popover placement="bottom" content={<SeniorActionPad />} overlayInnerStyle={{ padding: "8px" }}>
			<Button type="text" icon={<UpArrowFilled style={{ fontSize: "12px", color: "#707683" }} />}>
				高级
			</Button>
		</Popover>
	);
};

export default Senior;
