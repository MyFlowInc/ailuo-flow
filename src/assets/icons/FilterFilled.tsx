import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Filter = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				fillRule="evenodd"
				d="m6.00581,9.25949l-5.98256,-7.55691l0,-1.67932l15.95349,0l0,1.67932l-5.98256,7.55691l0,5.03788l-3.98837,1.67937l0,-6.71726z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const FilterFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Filter} {...props} />;

export default FilterFilled;
