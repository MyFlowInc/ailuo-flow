import React from "react";

const EmptyInvite: React.FC = () => {
	return (
		<>
			<div className="max-w-4xl mx-auto px-10 py-4 bg-white">
				<div className="flex flex-col justify-center py-12 items-center">
					<div className="flex justify-center items-center">
						<img className="w-64 h-64" src="https://res.cloudinary.com/daqsjyrgg/image/upload/v1690257804/jjqw2hfv0t6karxdeq1s.svg" alt="image empty states" />
					</div>
					<h1 className="text-gray-500 font-medium text-2xl text-center mb-3">暂无邀请信息</h1>
					{/* <p className="text-gray-500 text-center mb-6">暂无邀请信息</p> */}
				</div>
			</div>
		</>
	);
};

export default EmptyInvite;
