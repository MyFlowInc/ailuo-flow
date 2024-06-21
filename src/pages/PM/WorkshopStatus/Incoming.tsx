import { Layout, Button } from "antd";
import { useHistory } from "react-router";
import { getStore } from "../../../store";

const Incoming: React.FC = () => {
	const curWorkshop = { ...getStore("global.curWorkshop") };
	const history = useHistory();
	console.log(curWorkshop);

	return (
		<Layout>
			<div>Incoming!</div>
			<Button
				onClick={() => {
					history.push("/dashboard/work-shop-manage/" + curWorkshop.id);
				}}
			>
				返回
			</Button>
		</Layout>
	);
};
export default Incoming;
