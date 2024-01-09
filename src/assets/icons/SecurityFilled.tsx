import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Security = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m7.41555,0.18006c0,0 -5.05082,2.26577 -5.05082,2.26577c-0.51951,0.23313 -0.85863,0.75768 -0.85863,1.33322c0,0 0,3.42414 0,3.42414c0,4.04334 2.77073,7.82452 6.4939,8.74244c3.72317,-0.91791 6.4939,-4.69909 6.4939,-8.74244c0,0 0,-3.42414 0,-3.42414c0,-0.57554 -0.33909,-1.10009 -0.8586,-1.33322c0,0 -5.05085,-2.26577 -5.05085,-2.26577c-0.36799,-0.16756 -0.80091,-0.16756 -1.1689,0c0,0 0,0 0,0zm0.58445,7.74437c0,0 5.05085,0 5.05085,0c-0.38249,3.00162 -2.3667,5.67527 -5.05085,6.51309c0,0 0,-6.5058 0,-6.5058c0,0 -5.05082,0 -5.05082,0c0,0 0,-4.15268 0,-4.15268c0,0 5.05082,-2.26575 5.05082,-2.26575c0,0 0,6.41114 0,6.41114c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const SecurityFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Security} {...props} />;

export default SecurityFilled;
