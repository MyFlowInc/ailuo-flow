/**
 * type=3
 */

import React, { useEffect, useState } from "react";
import { DatePicker, DatePickerProps } from "antd";
import { TableColumnItem } from "../../../../store/workflowSlice";
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
	cell: TableColumnItem;
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
		}
	}, [cell])

	const onChange: DatePickerProps["onChange"] = (date, dateString) => {
		console.log(date, dateString);
		setForm({
			...form,
			[cell.key]: dateString,
		});
	};

	return (
		<DatePicker
			disabled={disabled}
			value={value && dayjs(value)}
			showTime={{ format: "HH:mm" }}
			format="YYYY-MM-DD HH:mm"
			onChange={onChange}
			style={{ width: "100%" }}
		/>
	);
};

export default TypeDateTime;
