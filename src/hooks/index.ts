import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { selectUser, setUser } from "../store/globalSlice";
import { userProfile } from "../api/user";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router";

// 通过缓存校验登录状态
export function useLoginByCache() {
	const history = useHistory();
	const user = useAppSelector(selectUser);
	const dispatch = useDispatch();
	const checkUser = async () => {
		try {
			if (_.isEmpty(user)) {
				const response = await userProfile();
				dispatch(setUser(response.data));
			}
		} catch (error) {
			console.error(error);
			history.push("/login");
		}
	};
	useEffect(() => {
		checkUser();
	}, []);
}
