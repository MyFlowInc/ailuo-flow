import React from "react";
import styled from "styled-components";
import { useAppDispatch } from "../store/hooks";
import { updateCurShowMode } from "../store/workflowSlice";

const UIRoot = styled.div`
	display: table-cell;
	vertical-align: middle;
	text-align: center;

	label {
		font-size: 14px;
		color: #424242;
		font-weight: 500;
	}

	.btn-color-mode-switch {
		display: inline-block;
		margin: 0px;
		position: relative;
	}

	.btn-color-mode-switch > label.btn-color-mode-switch-inner {
		margin: 0px;
		/* 8 +  92 + 10 + 92 + 8 */
		width: 210px;
		height: 32px;
		background: #ffffff;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		transition: all 0.3s ease;
		display: block;
	}

	.btn-color-mode-switch > label.btn-color-mode-switch-inner:before {
		content: attr(data-on);
		position: absolute;
		font-size: 14px;
		font-weight: 500;
		width: 92px;
		top: 9px;
	}

	.btn-color-mode-switch > label.btn-color-mode-switch-inner:after {
		content: attr(data-off);
		width: 92px;
		height: calc(100% - 4px);
		background: #f2f3f5;
		border-radius: 4px;
		position: absolute;
		left: 2px;
		top: 2px;
		text-align: center;
		transition: all 0.3s ease;
		padding: 7px 0px;
		color: #2845d4;
	}

	.btn-color-mode-switch > .alert {
		display: none;
		background: #ff9800;
		border: none;
		color: #fff;
	}

	.btn-color-mode-switch input[type="checkbox"] {
		cursor: pointer;
		width: 50px;
		height: 25px;
		opacity: 0;
		position: absolute;
		top: 0;
		z-index: 1;
		margin: 0px;
	}

	.btn-color-mode-switch input[type="checkbox"]:checked + label.btn-color-mode-switch-inner:after {
		content: attr(data-on);
		left: 114px;
		color: #2845d4;
	}

	.btn-color-mode-switch input[type="checkbox"]:checked + label.btn-color-mode-switch-inner:before {
		content: attr(data-off);
		right: auto;
		left: 0px;
		color: #3d3d3d;
	}
`;
const getState = (v: boolean) => {
	return v ? "status" : "list";
};

const AnimateRadio: React.FC = () => {
	const dispatch = useAppDispatch();
	const onChangeHandler = (e: any) => {
		const res = getState(e.target.checked);
		dispatch(updateCurShowMode(res));
	};

	return (
		<UIRoot>
			<div className="btn-container">
				<label className="switch btn-color-mode-switch">
					<input type="checkbox" name="color_mode" id="color_mode" value="1" onChange={onChangeHandler} />
					<label htmlFor="color_mode" data-on="状态视图" data-off="列表视图" className="btn-color-mode-switch-inner"></label>
				</label>
			</div>
		</UIRoot>
	);
};

export default AnimateRadio;
