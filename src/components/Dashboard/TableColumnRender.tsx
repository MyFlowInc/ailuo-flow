import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Tag, Avatar } from "antd";
import { Link } from "react-router-dom";

// import { DiscussModal } from "./FormModal/TypeEditor/TypeDiscuss";

import type { DeveloperUser } from "../../store/globalSlice";
import { DashboardRouterOutletContext } from "../../routes/DashboardRouterOutlet";
/**
 * The type of field returned by the interface	The type of the corresponding field
			SingleText	single-line text
			Text	Multi-line text
			SingleSelect	Single choice
			MultiSelect	Multiple choice
			Number	Number
			Currency	Currency
			Percent	Percentage
			DateTime	Datetime
			Attachment	Attachment
			Member	Member
			Checkbox	Check
			Rating	Rating
			URL	Website
			Phone	A telephone number.
			Email	Email
			MagicLink	MagicLink
			MagicLookUp	MagicLookUp
			Formula	Intelligent formula
			AutoNumber	Autoincrement number
			CreatedTime	Create Timestamp
			LastModifiedTime	Modify Timestamp
			CreatedBy	Created by
			LastModifiedBy	Updated by
 */
export const NumFieldType = {
	NotSupport: 0,
	Text: 1, // Multi-line text
	Number: 2,
	SingleSelect: 3,
	MultiSelect: 4,
	DateTime: 5,
	Attachment: 6,
	Link: 7,
	URL: 8,
	Email: 9,
	Phone: 10,
	Checkbox: 11,
	Rating: 12,
	Member: 13,
	LookUp: 14,
	// RollUp : 15,
	Formula: 16,
	Currency: 17,
	Percent: 18,
	SingleText: 19, //
	AutoNumber: 20,
	CreatedTime: 21,
	LastModifiedTime: 22,
	CreatedBy: 23,
	LastModifiedBy: 24,
	Cascader: 25,
	OptionStatus: 26,
	discuss: 27,
	SingleFixSelect: 28,
	RelationSaleView: 29, // 关联报价
	MultiFixSelect: 30,
	RelationTechView: 31,	// 关联技术评审
	DeniedField: 999, // no permission column
};
export const ReverSedNumFieldType = {
	"0": "NotSupport",
	"1": "Text",
	"2": "Number",
	"3": "SingleSelect",
	"4": "MultiSelect",
	"5": "DateTime",
	"6": "Attachment",
	"7": "Link",
	"8": "URL",
	"9": "Email",
	"10": "Phone",
	"11": "Checkbox",
	"12": "Rating",
	"13": "Member",
	"14": "LookUp",
	"16": "Formula",
	"17": "Currency",
	"18": "Percent",
	"19": "SingleText",
	"20": "AutoNumber",
	"21": "CreatedTime",
	"22": "LastModifiedTime",
	"23": "CreatedBy",
	"24": "LastModifiedBy",
	"25": "Cascader",
	"26": "OptionStatus",
	"27": "discuss",
	"999": "DeniedField",
};

interface TableColumnRenderProps {
	rIndex: number;
	cIndex: number;
	record: any;
	column: any;
	reader: boolean;
	writer: boolean;
	manager: boolean;
	searchText: string;
	users: DeveloperUser[];
	view?: string;
	children: React.ReactNode;
}

const TableColumnRender: React.FC<TableColumnRenderProps> = ({
	rIndex,
	cIndex,
	record,
	column,
	reader,
	writer,
	manager,
	searchText,
	users,
	view,
	children,
	...restProps
}) => {
	// console.log("TableColumnRender", rIndex, cIndex, record, column, reader, writer, manager, searchText, users, view, children, restProps);
	if (column === undefined || record === undefined) {
		return <td {...restProps}>{children}</td>;
	}
	if (column.render) {
		return <td {...restProps}>{column.render(null, record)}</td>;
	}

	const { type = "SingleText" } = column;
	const columnKey = column.key;

	let childNode = children;
	switch (type) {
		case NumFieldType.SingleText:
		case NumFieldType.DateTime:
		case NumFieldType.Number:
		case NumFieldType.Email:
		case NumFieldType.Phone:
			break;

		case NumFieldType.Text:
			childNode = <MultipleText value={record[columnKey]} />;
			break;

		case NumFieldType.OptionStatus:
			childNode = <SingleSelect value={record[columnKey]} fieldConfig={{}} />;
			break;

		case NumFieldType.Attachment:
			childNode = <Attachment value={record[columnKey]} />;
			break;

		case NumFieldType.SingleSelect:
			childNode = <SingleSelect value={record[columnKey]} fieldConfig={{}} />;
			break;

		case NumFieldType.MultiSelect:
			childNode = <MultiSelect value={record[columnKey]} fieldConfig={{}} />;
			break;

		case NumFieldType.Link:
			childNode = <NetAddress value={record[columnKey]} record={record} />;
			break;

		case NumFieldType.Member:
			childNode = <MemberSelect value={record[columnKey]} userList={users} />;
			break;

		default:
			childNode = <StringifyTextRender value={record[columnKey]} />;
	}

	let styles: React.CSSProperties = {};
	if (cIndex === 0) {
		styles = {
			position: "sticky",
			left: `${view === "standard" ? "29.5px" : "0px"}`,
		};
	}

	return (
		<td {...restProps} style={{ ...styles }} id={`cell-${rIndex}-${cIndex}`}>
			{/* <div {...restProps} style={{ width: "100%", background: "red", ...styles }} id={`cell-${rIndex}-${cIndex}`}> */}
			{childNode}
			{/* </div> */}
		</td>
	);
};

export default TableColumnRender;

const SingleText: React.FC<{ value: any; children?: React.ReactNode }> = ({
	value,
}) => {
	if (_.isArray(value)) {
		return (
			<div>
				{value &&
					value.map &&
					value.map((item: any, i: number) => <div key={i}>{item.text}</div>)}
			</div>
		);
	} else {
		return <div>{value}</div>;
	}
};

const MultipleText: React.FC<{ value: any; children?: React.ReactNode }> = ({
	value,
}) => {
	return (
		<div>
			{value &&
				value.map &&
				value.map((item: any, idx: number) => <div key={idx}>{item.text}</div>)}
		</div>
	);
};

const getStatusText = (value: any, fieldConfig: any) => {
	const temp = _.get(fieldConfig, "property.options") || [];
	if (temp.length === 0) {
		return;
	}

	const item0 = temp[0];
	let options: any = [];

	if (typeof item0 === "string") {
		options = temp.map((item: any) => ({
			label: item,
			value: item,
		}));
	}

	if (typeof item0 === "object") {
		options = temp.map((item: any) => ({
			label: item.name,
			value: item.id,
		}));
	}

	return _.find(options, { value: value })?.label || "";
};

const SingleSelect: React.FC<{
	value: any;
	fieldConfig: any;
	children?: React.ReactNode;
}> = ({ value, fieldConfig }) => {
	const text = getStatusText(value, fieldConfig);
	// console.log("value", value, fieldConfig, text);
	const color =
		_.find(_.get(fieldConfig, "property.options") || [], { id: value })
			?.color || "default";
	return text && text !== "" ? (
		<Tag style={{ color: "#000" }} color={color}>
			{text}
		</Tag>
	) : (
		<div></div>
	);
};

const MultiSelect: React.FC<{
	value: any;
	fieldConfig: any;
	children?: React.ReactNode;
}> = ({ value, fieldConfig }) => {
	const list = _.get(fieldConfig, "property.options") || [];
	const options = list.map((item: any) => ({
		label: item.name,
		value: item.id,
	}));

	return (
		<div>
			{value &&
				value.map &&
				value.map((item: any, index: number) => (
					<Tag key={index} color="cyan">
						{item}
					</Tag>
				))}
		</div>
	);
};

const getFileName = (url: string) => {
	const file = url.split("/").pop();
	const fileName = file || "";
	return fileName;
};

const Attachment: React.FC<{
	value: any;
	children?: React.ReactNode;
}> = ({ value }) => {

	const { setFileUrl, setIsPdfModalViewOpen } = useContext(DashboardRouterOutletContext)

	const clickHandle = (e: any, url: string) => {
		e.preventDefault()
		setFileUrl(`/preview?url=${url.replace('http', 'https')}`)
		setIsPdfModalViewOpen(true)
	}
	const [fileList, setFileList] = useState<string[]>([]);

	useEffect(() => {
		try {
			if (value) {
				const list = JSON.parse(value);
				setFileList(list);
			}
		} catch (error) {
			setFileList([value]);
		}
	}, [value])

	if (!_.isEmpty(fileList)) {
		return (
			<div>
				{fileList.map((value: string, idx: number) => {
					const suffix = value.substring(value.lastIndexOf(".") + 1).toLowerCase();
					if (suffix === "pdf" || suffix === "docx" || ['jpg', 'png', 'jpeg'].includes(suffix)) {
						return (
							<div key={'Attachment_' + idx} className="text-blue-500 hover:text-blue-800 cursor-pointer flex items-center transition-colors duration-300" onClick={(e) => clickHandle(e, value)}  >
								{getFileName(value)}
							</div>
						);
					} else {
						return (
							<a key={'Attachment_' + idx} href={value} target="blank">
								{getFileName(value)}
							</a>
						);
					}
				})}
			</div>
		);
	}


	return <></>;

};

const SingleNumber: React.FC<{
	value: any;
	children?: React.ReactNode;
}> = ({ value }) => {
	return <div> {(value && value) || "未输入"}</div>;
};

const SingleDateTime: React.FC<{
	value: any;
	children?: React.ReactNode;
}> = ({ value }) => {
	return <div> {(value && value) || "未输入"}</div>;
};
const NetAddress: React.FC<{
	value: any;
	record: any;
	children?: React.ReactNode;
}> = ({ value, record }) => {
	return (
		<div key={record.key}>
			{value && (
				<a href={`http://${value}`} target="_blank" rel="noreferrer">
					{value}
				</a>
			)}
		</div>
	);
};

const getMemberList = (value: any, userList: DeveloperUser[]) => {
	if (
		typeof value === `undefined` ||
		typeof userList === `undefined` ||
		!(value instanceof Array)
	) {
		return;
	}

	return value.map((item: string) => {
		return userList
			.map((users) => users.userInfo)
			.filter((m) => m.id === item)[0];
	});
};

const MemberSelect: React.FC<{
	value: any;
	userList: DeveloperUser[];
	children?: React.ReactNode;
}> = ({ value, userList }) => {
	const memberList = getMemberList(value, userList);

	return (
		<div>
			{memberList &&
				memberList.map(
					(member: any) =>
						member && (
							<Tag
								key={member.id}
								color="blue"
								icon={<Avatar src={member.avatar} />}
							>
								{member.nickname}
							</Tag>
						),
				)}
		</div>
	);
};

// const DiscussModalWrap: React.FC<{
// 	fieldId: string;
// 	record: any;
// 	reader: boolean;
// 	writer: boolean;
// 	manager: boolean;
// 	children?: React.ReactNode;
// }> = ({ fieldId, record, reader, writer, manager }) => {
// 	const [open, setOpen] = React.useState<boolean>(false);
// 	return (
// 		<div>
// 			<Button type="text" onClick={() => setOpen(true)}>
// 				查看评论
// 			</Button>

// 			<DiscussModal fieldId={fieldId} record={record} open={open} close={() => setOpen(false)} reader={reader} writer={writer} manager={manager} />
// 		</div>
// 	);
// };

const StringifyTextRender: React.FC<{
	value: any;
	children?: React.ReactNode;
}> = ({ value }) => {
	return <div>{JSON.stringify(value)}</div>;
};
