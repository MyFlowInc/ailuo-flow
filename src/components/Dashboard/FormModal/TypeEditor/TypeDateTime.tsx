/**
 * type=3
 */

import React, { useEffect, useState } from "react";
import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import _ from "lodash";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

interface TypeDateTimeProps {
	mode?: "multiple";
	cell: any;
	form: any;
	setForm: any;
}

const TypeDateTime: React.FC<TypeDateTimeProps> = (
	props: TypeDateTimeProps,
) => {
	const { cell, form, setForm } = props;

	const value = form[cell.key] || null;

	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(cell, 'disabled')) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [cell])

	const onChange: DatePickerProps["onChange"] = (date, dateString) => {
		console.log(date, dateString);
		setForm({
			...form,
			[cell.key]: dateString,
		});
	};
	const footerHandle = (d: number) => {
		var newDate = dayjs().add(d, 'day');
		console.log(newDate.format('YYYY-MM-DD'));
		const dateString = newDate.format('YYYY-MM-DD')
		onChange(newDate, dateString)
	}
	const footer = () => {
		return <div className="flex " style={{ color: '#1677ff' }}>
			<div className=" cursor-pointer   mr-4" onClick={() => footerHandle(90)}>+90天</div>
			<div className=" cursor-pointer   mr-4" onClick={() => footerHandle(180)}>+180天</div>
			<div className=" cursor-pointer  " onClick={() => footerHandle(365)}>+365天</div>
		</div>
	}
	return (
		<DatePicker
			disabled={disabled}
			value={value && dayjs(value)}
			showTime
			format="YYYY-MM-DD"
			onChange={onChange}
			style={{ width: "100%" }}
			renderExtraFooter={footer}
		/>
	);
};

export default TypeDateTime;
