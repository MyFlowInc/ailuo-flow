import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const ArrowRight = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 24 24">
			<path fill="currentColor" d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z" />
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const ArrowRightFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={ArrowRight} {...props} />;

export default ArrowRightFilled;
