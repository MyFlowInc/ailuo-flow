import React from "react";
import { NumFieldType } from "../../TableColumnRender";
import dateSvg from "../../assets/type/date.svg";
import labelSvg from "../../assets/type/label.svg";
import linkSvg from "../../assets/type/link.svg";
import mailSvg from "../../assets/type/mail.svg";
import mediaSvg from "../../assets/type/media.svg";
import memberSvg from "../../assets/type/member.svg";
import multiSvg from "../../assets/type/multi-select.svg";
import numSvg from "../../assets/type/num.svg";
import phoneSvg from "../../assets/type/phone.svg";
import singleSvg from "../../assets/type/single-select.svg";
import EditFilled from "../../../../assets/icons/EditFilled";

import TypeSingleText from "./TypeSingleText";
import TypeNumber from "./TypeNumber";
import TypeSelectEditor from "./TypeSelectEditor";
import TypeAttachment from "./TypeAttachment";
import TypeDateTime from "./TypeDateTime";
import TypeLink from "./TypeLink";
import TypeEmail from "./TypeEmail";
import TypePhone from "./TypePhone";
import TypeText from "./TypeText";
import TypeRelationSaleView from "./TypeRelationSaleView";
import TypeRelationTechView from "./TypeRelationTechView";

export const FieldTypeList = [
	{
		key: "SingleText",
		label: "文本",
		type: NumFieldType.SingleText,
		icon: <img src={labelSvg} width={12} height={12} />,
	},
	{
		key: "Number",
		label: "数字",
		type: NumFieldType.Number,
		icon: <img src={numSvg} width={12} height={12} />,
	},
	{
		key: "SingleSelect",
		label: "单选",
		type: NumFieldType.SingleSelect,
		icon: <img src={singleSvg} width={12} height={12} />,
	},
	{
		key: "MultiSelect",
		label: "多选",
		type: NumFieldType.MultiSelect,
		icon: <img src={multiSvg} width={12} height={12} />,
	},
	{
		key: "DateTime",
		label: "日期",
		type: NumFieldType.DateTime,
		icon: <img src={dateSvg} width={12} height={12} />,
	},
	{
		key: "Member",
		label: "成员",
		type: NumFieldType.Member,
		icon: <img src={memberSvg} width={12} height={12} />,
	},
	{
		key: "Attachment",
		label: "媒体或文件",
		type: NumFieldType.Attachment,
		icon: <img src={mediaSvg} width={12} height={12} />,
	},
	{
		key: "Link",
		label: "网址链接",
		type: NumFieldType.Link,
		icon: <img src={linkSvg} width={12} height={12} />,
	},
	{
		key: "Email",
		label: "邮箱",
		type: NumFieldType.Email,
		icon: <img src={mailSvg} width={12} height={12} />,
	},
	{
		key: "Phone",
		label: "电话",
		type: NumFieldType.Phone,
		icon: <img src={phoneSvg} width={12} height={12} />,
	},
	{
		key: "Discuss",
		label: "评论",
		type: NumFieldType.discuss,
		icon: <EditFilled style={{ fontSize: "10px" }} />,
	},
];

interface TypeEditorProps {
	cell: any;
	form: { [id: string]: string };
	setForm: (value: any) => void;
	children?: React.ReactNode;
}

const TypeEditor: React.FC<TypeEditorProps> = ({ cell, ...rest }) => {
	let CellEditor: React.ReactNode;

	switch (cell.type) {
		case NumFieldType.Text:
			// 多行文本
			CellEditor = <TypeText cell={cell} {...rest} />;
			break;
		case NumFieldType.SingleText:
			CellEditor = <TypeSingleText cell={cell} {...rest} />;
			break;
		case NumFieldType.Number:
			CellEditor = <TypeNumber cell={cell} {...rest} />;
			break;
		case NumFieldType.SingleSelect:
			CellEditor = <TypeSelectEditor cell={cell} {...rest} />;
			break;
		case NumFieldType.SingleFixSelect:
			CellEditor = <TypeSelectEditor fixed cell={cell} {...rest} />;
			break;
		case NumFieldType.MultiSelect:
			CellEditor = <TypeSelectEditor mode="multiple" cell={cell} {...rest} />;
			break;
		case NumFieldType.MultiFixSelect:
			CellEditor = <TypeSelectEditor mode="multiple" fixed cell={cell} {...rest} />;
			break;
		case NumFieldType.Attachment:
			CellEditor = <TypeAttachment cell={cell} {...rest} />;
			break;
		case NumFieldType.DateTime:
			CellEditor = <TypeDateTime cell={cell} {...rest} />;
			break;
		case NumFieldType.Link:
			CellEditor = <TypeLink cell={cell} {...rest} />;
			break;
		case NumFieldType.Email:
			CellEditor = <TypeEmail cell={cell} {...rest} />;
			break;
		case NumFieldType.Phone:
			CellEditor = <TypePhone cell={cell} {...rest} />;
			break;
		case NumFieldType.RelationSaleView:
			CellEditor = <TypeRelationSaleView cell={cell} {...rest} />;
			break;
		case NumFieldType.RelationTechView:
			CellEditor = <TypeRelationTechView cell={cell} {...rest} />;
			break;
		default:
			CellEditor = <TypeSingleText cell={cell} {...rest} />;
	}

	return <React.Fragment>{CellEditor}</React.Fragment>;
};

export default TypeEditor;
