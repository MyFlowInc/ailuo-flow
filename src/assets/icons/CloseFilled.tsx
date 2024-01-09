import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Close = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m15.61553,0.39662c-0.4715,-0.47143 -1.23304,-0.47143 -1.70448,0c0,0 -5.91106,5.89897 -5.91106,5.89897c0,0 -5.91106,-5.91106 -5.91106,-5.91106c-0.47143,-0.47143 -1.23298,-0.47143 -1.70442,0c-0.47143,0.47143 -0.47143,1.23298 0,1.70442c0,0 5.91106,5.91106 5.91106,5.91106c0,0 -5.91106,5.91106 -5.91106,5.91106c-0.47143,0.47143 -0.47143,1.23298 0,1.70448c0.47143,0.47136 1.23298,0.47136 1.70442,0c0,0 5.91106,-5.91112 5.91106,-5.91112c0,0 5.91106,5.91112 5.91106,5.91112c0.47143,0.47136 1.23298,0.47136 1.70448,0c0.47136,-0.4715 0.47136,-1.23304 0,-1.70448c0,0 -5.91112,-5.91106 -5.91112,-5.91106c0,0 5.91112,-5.91106 5.91112,-5.91106c0.4593,-0.45934 0.4593,-1.23298 0,-1.69232c0,0 0,0 0,0c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const CloseFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Close} {...props} />;

export default CloseFilled;
