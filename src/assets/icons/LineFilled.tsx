import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Line = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path fillRule="evenodd" d="m15.81789,8.27921l-15.63577,0l0,-0.55842l15.63577,0l0,0.55842z" fill="currentColor" />
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const LineFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Line} {...props} />;

export default LineFilled;
