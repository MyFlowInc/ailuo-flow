import styled from "styled-components";
import setSvg from "./assets/settings.svg";

const UIROOT = styled.div`
	display: flex;
	width: fit-content;
	align-items: center;
	.title {
		font-size: 14px;
		font-weight: normal;
		line-height: 32px;
		letter-spacing: 0em;
		color: #666666;

		margin-left: 8px;
		margin-right: 20px;
	}
`;
const TabOperation = (props: any) => {
	const { className } = props;
	const { setIsModalOpen } = props;
	const clickHandler = () => {
		setIsModalOpen(true);
	};
	return (
		<UIROOT className={className} onClick={clickHandler}>
			<img src={setSvg} />
			<div className="title">设置</div>
		</UIROOT>
	);
};

export default TabOperation;
