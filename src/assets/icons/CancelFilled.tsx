import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Cancel = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m8.36814,4.84107c-2.09278,0 -3.98814,0.78183 -5.44914,2.0533c0,0 -1.49259,-1.49259 -1.49259,-1.49259c-0.49753,-0.49753 -1.35044,-0.15006 -1.35044,0.55281c0,0 0,4.41459 0,4.41459c0,0.43436 0.35538,0.78974 0.78973,0.78974c0,0 4.4146,0 4.4146,0c0.70285,0 1.05823,-0.85291 0.5607,-1.35044c0,0 -1.50838,-1.50839 -1.50838,-1.50839c1.09772,-0.91609 2.49555,-1.4847 4.04342,-1.4847c2.49558,0 4.65155,1.45311 5.67817,3.55379c0.21323,0.44225 0.71862,0.66337 1.1846,0.50543c0.56074,-0.18164 0.84504,-0.82132 0.5923,-1.35834c-1.35831,-2.76405 -4.18561,-4.6752 -7.46296,-4.6752c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const CancelFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Cancel} {...props} />;

export default CancelFilled;
