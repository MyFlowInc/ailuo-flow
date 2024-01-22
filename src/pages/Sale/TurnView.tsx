const TurnView: (p: any) => any = ({ turnTime }) => {
	return (
		<span
			className="ml-2"
			style={{
				border: "1px solid #0052D9",
				borderRadius: "16px",
				height: "14px",
				padding: 4,
				color: "#0052D9",
			}}
		>
			第{turnTime ? turnTime : 1}轮
		</span>
	);
};

export default TurnView;
