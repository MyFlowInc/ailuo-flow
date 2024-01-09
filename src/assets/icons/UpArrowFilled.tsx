import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const UpArrow = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m6.96782,3.10098c0,0 -6.58052,7.89862 -6.58052,7.89862c-0.7766,0.93238 -0.14544,2.39079 1.03318,2.39079c0,0 13.161,0 13.161,0c0.26377,0.0002 0.52205,-0.07946 0.74389,-0.22933c0.22184,-0.14997 0.39769,-0.36392 0.50679,-0.61621c0.109,-0.25228 0.14654,-0.53217 0.1079,-0.80624c-0.03864,-0.27406 -0.15148,-0.53064 -0.32535,-0.73901c0,0 -6.58053,-7.89718 -6.58053,-7.89718c-0.12878,-0.15478 -0.28761,-0.27885 -0.46581,-0.36383c-0.17821,-0.085 -0.37166,-0.12898 -0.56737,-0.12898c-0.19573,0 -0.38917,0.04398 -0.56737,0.12898c-0.1782,0.08499 -0.33702,0.20905 -0.46581,0.36383c0,0 0,-0.00144 0,-0.00144c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const UpArrowFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={UpArrow} {...props} />;

export default UpArrowFilled;
