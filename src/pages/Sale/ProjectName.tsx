import React, {
	SyntheticEvent,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import _ from "lodash";
import { Input } from "antd";
import TurnView from "./TurnView";
import { fetchTurnTime } from "../../api/ailuo/sale";

const ProjectName: React.FC = (props: any) => {
	const { column, form, setForm } = props;
	const el = useRef<any>(null);
	useEffect(() => {
		// console.log('useEffect--TypeSingleText', form)
		forceSetValue();
	}, [form]);

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[column.dataIndex]: value,
		});
		// console.log("onChangeContent", form);
	};

	const forceSetValue = () => {
		if (el.current) {
			const input = el.current.input;
			input.value = form[column.dataIndex] || "";
			input.setAttribute("value", form[column.dataIndex] || "");
		}
	};
	const getTurnTime = async (e: any) => {
		if (1) {
			return 1
		}
		if (!e.target.value) {
			return;
		}
		try {
			const res = await fetchTurnTime(e.target.value);
			const time = _.get(res, "data.turn_time");
			console.log(e.target.value, time);

			setForm({
				...form,
				turnTime: time,
			});
		} catch (error) { }
	};
	return (
		<div className="w-full">
			<div className="flex mb-4">
				<div style={{ width: "100px" }}>项目名称</div>
				<div className="flex-1 flex items-center" onClick={() => { }}>
					<Input
						className="flex-1"
						onBlur={(e) => {
							getTurnTime(e);
						}}
						ref={(input) => {
							if (!input) {
								return;
							}
							el.current = input;
							forceSetValue();
						}}
						key={"key_" + column.name}
						placeholder="请输入"
						onChange={onChangeContent}
					/>
					<div style={{ width: "auto" }}>
						<TurnView turnTime={form.turnTime} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectName;
