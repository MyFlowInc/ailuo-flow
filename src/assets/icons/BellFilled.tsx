import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Bell = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m13.27377,11.07068c0,0 0,-4.09424 0,-4.09424c0,-2.51386 -1.4415,-4.6183 -3.95533,-5.17511c0,0 0,-0.55682 0,-0.55682c0,-0.67964 -0.5889,-1.22827 -1.31844,-1.22827c-0.72954,0 -1.31844,0.54863 -1.31844,1.22827c0,0 0,0.55682 0,0.55682c-2.52262,0.55682 -3.95533,2.65306 -3.95533,5.17511c0,0 0,4.09424 0,4.09424c0,0 -1.75792,1.63769 -1.75792,1.63769c0,0 0,0.81885 0,0.81885c0,0 14.0634,0 14.0634,0c0,0 0,-0.81885 0,-0.81885c0,0 -1.75792,-1.63769 -1.75792,-1.63769c0,0 0,0 0,0zm-4.39481,0c0,0 -1.75792,0 -1.75792,0c0,0 0,-1.63769 0,-1.63769c0,0 1.75792,0 1.75792,0c0,0 0,1.63769 0,1.63769c0,0 0,0 0,0zm0,-3.27539c0,0 -1.75792,0 -1.75792,0c0,0 0,-3.27539 0,-3.27539c0,0 1.75792,0 1.75792,0c0,0 0,3.27539 0,3.27539c0,0 0,0 0,0zm-0.87896,8.18847c0.96686,0 1.75792,-0.73696 1.75792,-1.63769c0,0 -3.51585,0 -3.51585,0c0,0.90073 0.78228,1.63769 1.75792,1.63769c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const BellFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Bell} {...props} />;

export default BellFilled;
