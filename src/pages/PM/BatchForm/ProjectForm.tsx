import _ from "lodash";
import { splProjectList } from "../../../api/ailuo/spl-pre-product";
import { Form } from "antd";
import { useState, useEffect } from "react";
import CellEditorContext from "../FormModal/CellEditorContext";
import { NoFieldData } from "../FormModal/NoFieldData";
import { columns } from "../FormModal/WorkShopFullDataModal";

interface ProjectFormProp {
	projectId: string;
}

const ProjectForm: React.FC<ProjectFormProp> = (props: ProjectFormProp) => {
	const batchFormColumns = columns.filter((col: any) => {
		return col.dataIndex !== "typeSelection" && col.dataIndex !== "totalNum";
	});

	const [showDstColumns, setShowDstColumns] = useState(batchFormColumns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const fetchData = async () => {
		const res = await splProjectList({
			id: props.projectId,
			pageNum: 1,
			pageSize: 10,
		});
		const item = _.get(res, "data.record.0");
		setForm({ ...item });
		inputForm.setFieldsValue(item);
		setShowDstColumns(
			showDstColumns.map((el: any) => ({ ...el, disabled: true })),
		);
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<Form
			className="w-full"
			form={inputForm}
			name="recordForm"
			colon={false}
			wrapperCol={{ flex: 1 }}
			preserve={false}
		>
			{showDstColumns.length > 0 ? (
				<CellEditorContext
					form={form}
					setForm={setForm}
					dstColumns={showDstColumns}
					modalType={"edit"}
				/>
			) : (
				<NoFieldData />
			)}
		</Form>
	);
};

export default ProjectForm;
