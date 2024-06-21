import { Button, Layout } from "antd";
import { getStore } from "../../../store";
import { useHistory } from "react-router";

const Assembling: React.FC = () => {
	const curWorkshop = { ...getStore("global.curWorkshop") };
	const history = useHistory();
	console.log(curWorkshop);

	return (
		<Layout>
			<div>Assembling!</div>
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
export default Assembling;
