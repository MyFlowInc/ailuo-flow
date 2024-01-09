import dragSvg from "../assets/new/drag.svg";
import editSvg from "../assets/new/edit.svg";
import deleteSvg from "../assets/new/del.svg";
import addSvg from "../assets/new/add.svg";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { ArrowLine } from "./ArrowLine";
import { WorkFlowStatusInfo } from "../../../store/workflowSlice";
import { SingleItemContainer } from "./style";
import { ColorPicker, Input } from "antd";
import { Button } from "antd/es";

interface EditTitleProps {
	info: WorkFlowStatusInfo;
	setInfo: (item: any) => void;
	type: string;
	updateType: (e: SyntheticEvent) => void;
}

const EditTitle: React.FC<EditTitleProps> = props => {
	const { info, setInfo, type, updateType } = props;

	const onChange = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const temp = { ...info };
		temp.name = target.value;
		setInfo((value: any) => {
			return {
				...value,
				name: target.value
			};
		});
		console.log("onChange", temp);
	};

	const cancelBubble = (e: SyntheticEvent) => {
		e.stopPropagation();
	};

	if (type === "edit") {
		return <Input placeholder="请输入" defaultValue={info.name} onChange={onChange} onClick={cancelBubble} />;
	}
	return (
		<div className="item-title" style={{ background: typeof info.color === "string" ? info.color : "#2ca0e2" }} onDoubleClick={updateType}>
			{info.name}
		</div>
	);
};

interface SingleItemProps {
	isLocked: boolean;
	isShowEnd: boolean;
	isShowDelete: boolean;
	isShowMove: boolean;
	item: WorkFlowStatusInfo;
	addStatus: (item: WorkFlowStatusInfo) => void;
	updateStatus: (item: WorkFlowStatusInfo, sync: boolean) => void;
	deleteStatus: (item: WorkFlowStatusInfo) => void;
}

const SingleItem: React.FC<SingleItemProps> = props => {
	const { item, isShowEnd, updateStatus, addStatus, deleteStatus, isLocked } = props;
	const [info, setInfo] = useState<any>({ ...item });

	const [hovered, setHovered] = useState(false);
	const [type, setType] = useState("view");

	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState<string>("#2ca0e2");
	useEffect(() => {
		setInfo(item);
	}, [item]);
	const updateColorHandle = () => {
		const item = { ...info };
		item.color = color;
		updateStatus(item, false);
		setColorPickerOpen(false);
	};
	const cancelHandle = () => {
		setColorPickerOpen(false);
	};
	const colorChangeHandle = (value: any, hex: string) => {
		setColor(hex);
	};
	const imgStyle: React.CSSProperties = {
		display: hovered ? "flex" : "none"
	};

	const cancelInput = () => {
		console.log("do cancle input", info.name);

		if (!info || !info.name) {
			return;
		}
		if (info.name !== item.name) {
			updateStatus(info, true);
		}
		setType("view");
		document.removeEventListener("click", cancelInput);
	};

	const updateType = (e: SyntheticEvent) => {
		e.stopPropagation();
		if (type === "edit") {
			cancelInput();
			setType("view");
		} else {
			setType("edit");
		}
	};

	useEffect(() => {
		if (type === "edit") {
			document.addEventListener("click", cancelInput);
		}
		return () => {
			document.removeEventListener("click", cancelInput);
		};
	}, [type, info.name]);

	const addHandler = (item: WorkFlowStatusInfo) => {
		addStatus(item);
	};

	if (isLocked) {
		return (
			<SingleItemContainer className="single-item-container">
				<div className="single-item">
					<EditTitle info={info} setInfo={setInfo} type={type} updateType={updateType} />
				</div>
				{isShowEnd && (
					<div className="line-container">
						<ArrowLine />
					</div>
				)}
			</SingleItemContainer>
		);
	}
	return (
		<SingleItemContainer className="single-item-container">
			<div
				className="single-item"
				onMouseEnter={() => {
					setHovered(true);
				}}
				onMouseLeave={() => {
					setHovered(false);
				}}>
				<EditTitle info={info} setInfo={setInfo} type={type} updateType={updateType} />
				<div className="operation-container" style={imgStyle}>
					<img src={dragSvg} className=" cursor-grab; item-move"></img>
					<img src={editSvg} className="item-update" onClick={updateType}></img>

					<img
						src={addSvg}
						className="item-add"
						onClick={() => {
							addHandler(item);
						}}></img>
					<img
						src={deleteSvg}
						className="item-update"
						onClick={() => {
							deleteStatus(item);
						}}></img>
					{/* <img src={colorSvg} className="item-add" onClick={() => {}}></img> */}
					{/* <ColorPicker className="item-color" size="small" value={"#2ca0e2"} destroyTooltipOnHide={false} onChange={colorChangeHandle} /> */}

					<ColorPicker
						className="item-color"
						size="small"
						open={colorPickerOpen}
						value={color}
						onChange={colorChangeHandle}
						onOpenChange={setColorPickerOpen}
						panelRender={(panel: any) => (
							<div className="custom-panel">
								{panel}
								<div
									style={{
										fontSize: 12,
										color: "rgba(0, 0, 0, 0.88)",
										lineHeight: "20px",
										marginBottom: 8,
										display: "flex",
										justifyContent: "flex-end",
										marginTop: "8px"
									}}>
									<Button size={"small"} onClick={cancelHandle}>
										取消
									</Button>
									<Button type="primary" size={"small"} style={{ marginLeft: "8px" }} onClick={updateColorHandle}>
										确定
									</Button>
								</div>
							</div>
						)}
					/>
				</div>
			</div>
			{isShowEnd && (
				<div className="line-container">
					<ArrowLine />
				</div>
			)}
		</SingleItemContainer>
	);
};

export default SingleItem;
