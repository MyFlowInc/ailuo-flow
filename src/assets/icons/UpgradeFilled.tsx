import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Upgrade = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<g transform="matrix(-1.31325, -6.84807e-08, 6.84807e-08, -1.31325, 41.585, 42.0035)">
				<path
					d="m31.26731,21.33562c0,0 -0.9266,-1.13086 -0.9266,-1.13086c-0.18,-0.22886 -0.4534,-0.37022 -0.7667,-0.37022c0,0 -8,0 -8,0c-0.31333,0 -0.58667,0.14136 -0.77333,0.37022c0,0 -0.92,1.13086 -0.92,1.13086c-0.19334,0.22886 -0.30667,0.53177 -0.30667,0.85487c0,0 0,8.41415 0,8.41415c0,0.7404 0.6,1.3462 1.33333,1.3462c0,0 9.33337,0 9.33337,0c0.7333,0 1.3333,-0.6058 1.3333,-1.3462c0,0 0,-8.41415 0,-8.41415c0,-0.3231 -0.1133,-0.62601 -0.3067,-0.85487c0,0 0,0 0,0zm-5.92663,8.02369c0,0 -3.43334,-3.46661 -3.43334,-3.46661c0,0 2.33334,0 2.33334,0c0,0 0,-1.34626 0,-1.34626c0,0 2.66666,0 2.66666,0c0,0 0,1.34626 0,1.34626c0,0 2.33334,0 2.33334,0c0,0 -3.43334,3.46661 -3.43334,3.46661c-0.12666,0.1279 -0.34,0.1279 -0.46666,0c0,0 0,0 0,0c0,0 0,0 0,0zm-4.35334,-8.17851c0,0 0.54,-0.67313 0.54,-0.67313c0,0 8,0 8,0c0,0 0.62667,0.67313 0.62667,0.67313c0,0 -9.16667,0 -9.16667,0c0,0 0,0 0,0z"
					fill="currentColor"
				/>
			</g>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const UpgradeFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Upgrade} {...props} />;

export default UpgradeFilled;
