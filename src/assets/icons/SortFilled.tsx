import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Sort = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m2.98176,3.40683c0,0 1.50977,0 1.50977,0c0,0 -2.1808,-2.75424 -2.1808,-2.75424c0,0 -2.1808,2.75424 -2.1808,2.75424c0,0 1.39797,0 1.39797,0c0,0 0,9.18631 0,9.18631c0,0 -1.4087,0 -1.4087,0c0,0 2.1808,2.75427 2.1808,2.75427c0,0 2.1808,-2.75427 2.1808,-2.75427c0,0 -1.49903,0 -1.49903,0c0,0 0,-9.18631 0,-9.18631c0,0 0,0 0,0z"
				fill="currentColor"
			/>
			<path d="m15.88081,3.41021c0,0 -10.17707,0 -10.17707,0c0,0 0,-1.83617 0,-1.83617c0,0 10.17707,0 10.17707,0c0,0 0,1.83617 0,1.83617c0,0 0,0 0,0z" fill="currentColor" />
			<path d="m15.88081,7.08212c0,0 -10.17707,0 -10.17707,0c0,0 0,-1.83617 0,-1.83617c0,0 10.17707,0 10.17707,0c0,0 0,1.83617 0,1.83617c0,0 0,0 0,0z" fill="currentColor" />
			<path d="m5.70374,10.75402c0,0 10.17707,0 10.17707,0c0,0 0,-1.83617 0,-1.83617c0,0 -10.17707,0 -10.17707,0c0,0 0,1.83617 0,1.83617c0,0 0,0 0,0z" fill="currentColor" />
			<path d="m15.88081,14.42718c0,0 -10.17707,0 -10.17707,0c0,0 0,-1.83617 0,-1.83617c0,0 10.17707,0 10.17707,0c0,0 0,1.83617 0,1.83617c0,0 0,0 0,0z" fill="currentColor" />
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const SortFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Sort} {...props} />;

export default SortFilled;
