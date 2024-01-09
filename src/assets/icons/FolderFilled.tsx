import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Folder = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m4.82496,15.92033l0,-8.80037l11.1126,0l0,7.92033c0,0.48598 -0.35542,0.88003 -0.79384,0.88003l-10.31875,0zm-1.58751,0l-2.38126,0c-0.43837,0 -0.79375,-0.39406 -0.79375,-0.88003l0,-14.08061c0,-0.48602 0.35538,-0.88003 0.79375,-0.88003l5.8849,0l1.5875,1.76008l6.81513,0c0.43842,0 0.79384,0.394 0.79384,0.88003l0,2.64011l-11.90634,0c-0.43838,0 -0.79376,0.39401 -0.79376,0.88003l0,9.68041z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const FolderFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Folder} {...props} />;

export default FolderFilled;
