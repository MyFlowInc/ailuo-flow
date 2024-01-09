import { Button, Checkbox } from "antd";
import styled from "styled-components";

const UIROOT = styled.div`
	display: flex;
	width: fit-content;
	align-items: flex-end;
	background-color: #fff;
	border-radius: 4px;
	overflow: hidden;
	.container {
		width: 596px;
		height: 68px;
		border-radius: 4px;
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
	}
	.title {
		font-size: 14px;
		font-weight: normal;
		line-height: 24px;
		letter-spacing: 0em;
		color: #666666;
	}
`;
const NotifyHeader = (props: any) => {
	const { className } = props;
	return (
		<UIROOT className={className}>
			<div className="container">
				<Button style={{ background: "#2845D4" }} type="primary">
					全部同意
				</Button>
				<Checkbox>
					<div className="title">只看与我有关</div>
				</Checkbox>
			</div>
		</UIROOT>
	);
};

export default NotifyHeader;
