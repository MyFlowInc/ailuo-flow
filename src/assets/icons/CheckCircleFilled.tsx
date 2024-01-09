import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const CheckCircle = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m8,0.03254c-4.39804,0 -7.96746,3.56942 -7.96746,7.96746c0,4.39804 3.56942,7.96746 7.96746,7.96746c4.39804,0 7.96746,-3.56942 7.96746,-7.96746c0,-4.39804 -3.56942,-7.96746 -7.96746,-7.96746c0,0 0,0 0,0zm-1.59349,11.95119c0,0 -3.98373,-3.98373 -3.98373,-3.98373c0,0 1.12341,-1.12341 1.12341,-1.12341c0,0 2.86032,2.85235 2.86032,2.85235c0,0 6.0473,-6.0473 6.0473,-6.0473c0,0 1.12341,1.13138 1.12341,1.13138c0,0 -7.17071,7.17071 -7.17071,7.17071c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const CheckCircleFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={CheckCircle} {...props} />;

export default CheckCircleFilled;
