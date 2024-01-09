import { User } from "../../store/globalSlice";

export interface SocketData {
	status: 1 | 2 | 3;
	data: {
		uid: string;
		room_id: string;
		username: string;
		content: string;
	};
}
interface SocketParams {
	user: User;
	dstId: string;
	type: SocketMsgType;
	recordId?: string;
	row?: any;
}

export enum SocketMsgType {
	AddRecords = "AddRecords",
	SetRecords = "SetRecords",
	DeleteRecords = "DeleteRecords",
	AddFields = "AddFields",
	SetFieldAttr = "SetFieldAttr",
	DeleteField = "DeleteField"
}

export function sendWebSocketMsg(data: SocketParams) {
	const { user, dstId, recordId, row, type } = data;
	const content = getContent(type, { recordId, row });
	const record = JSON.stringify({
		status: 3,
		data: {
			uid: user.id,
			room_id: dstId,
			username: user.nickname,
			content
		}
	});
	window.ws && window.ws.send(record);
}

function getContent(type: SocketMsgType, data: { recordId?: string; row: any }) {
	switch (type) {
		case SocketMsgType.AddRecords:
			return AddRecordsContent(data);
		case SocketMsgType.SetRecords:
			return SetRecordsContent(data);
		case SocketMsgType.DeleteRecords:
			return DeleteRecordsContent(data);
		case SocketMsgType.AddFields:
			return AddFieldsContent();
		case SocketMsgType.SetFieldAttr:
			return SetFieldAttrContent(data);
		case SocketMsgType.DeleteField:
			return DeleteFieldContent(data);
		default:
			return "";
	}
}

function AddRecordsContent(data: any) {
	const { recordId, row } = data;
	const structure = [
		{
			cmd: "AddRecords",
			actions: [
				{
					n: "LI",
					p: ["meta", "views", 0, "rows", 11],
					li: { recordId: recordId }
				},
				{
					n: "OI",
					p: ["recordMap", recordId],
					oi: {
						id: recordId,
						data: {
							...row
						},
						commentCount: 0,
						comments: [],
						recordMeta: {}
					}
				}
			]
		}
	];
	return JSON.stringify(structure);
}

function SetRecordsContent(data: any) {
	const { recordId } = data;
	const structure = [
		{
			cmd: "SetRecords",
			recordId,
			actions: [
				{
					n: "OI",
					p: ["recordMap", recordId],
					oi: []
				}
			]
		}
	];
	return JSON.stringify(structure);
}

function DeleteRecordsContent(data: any) {
	const { recordId } = data;
	const structure = [
		{
			cmd: "DeleteRecords",
			recordId: recordId,
			actions: [
				{
					n: "LD",
					p: [],
					ld: {
						recordId: recordId
					}
				}
			]
		}
	];
	return JSON.stringify(structure);
}

function AddFieldsContent() {
	const structure = [
		{
			cmd: "AddFields",
			actions: []
		}
	];
	return JSON.stringify(structure);
}

function SetFieldAttrContent(data: any) {
	const { fieldId } = data;
	const structure = [
		{
			cmd: "SetFieldAttr",
			actions: [
				{
					n: "OR",
					p: ["meta", "fieldMap", fieldId || ""]
				}
			]
		}
	];
	return JSON.stringify(structure);
}

function DeleteFieldContent(data: any) {
	const { fieldId } = data;
	const structure = [
		{
			cmd: "DeleteField",
			actions: [
				{
					n: "OD",
					p: ["recordMap", fieldId || ""],
					od: []
				}
			]
		}
	];
	return JSON.stringify(structure);
}
