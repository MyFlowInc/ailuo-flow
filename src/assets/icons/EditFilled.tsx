import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Edit = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m15.7353,3.59549c0.34649,-0.3464 0.34649,-0.92375 0,-1.2524c0,0 -2.07844,-2.07845 -2.07844,-2.07845c-0.32858,-0.3464 -0.90594,-0.3464 -1.25242,0c0,0 -1.6343,1.62546 -1.6343,1.62546c0,0 3.3308,3.33086 3.3308,3.33086c0,0 1.63436,-1.62547 1.63436,-1.62547c0,0 0,0 0,0zm-15.73046,9.06881c0,0 0,3.33086 0,3.33086c0,0 3.33085,0 3.33085,0c0,0 9.82374,-9.83269 9.82374,-9.83269c0,0 -3.33081,-3.33085 -3.33081,-3.33085c0,0 -9.82377,9.83268 -9.82377,9.83268c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const EditFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Edit} {...props} />;

export default EditFilled;
