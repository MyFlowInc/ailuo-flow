import { useState, useEffect } from "react";
import axios from "axios";
type apiData = {
	[prop: string]: any;
};
// type apiConfig = apiData;

export const useRequest = (url: string, data: apiData) => {
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState(null);
	const [error, setError] = useState<Error | null>(null);

	const request = async () => {
		setLoading(true);
		try {
			const result = await axios({
				url,
				params: data,
				method: "get"
			});
			if (result && result.status >= 200 && result.status <= 304) {
				setResult(result.data);
			} else {
				setError(new Error("get data error in useRequest"));
			}
		} catch (reason: any) {
			setError(reason);
		}
		setLoading(false);
	};

	useEffect(() => {
		request();
	}, []);

	return {
		loading,
		result,
		error
	};
};
