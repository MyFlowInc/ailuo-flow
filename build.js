// @
const { exec } = require("child_process");

const fs = require("fs");
const path = require("path");

// package.json的路径
const packageJsonPath = path.join(__dirname, "package.json");

try {
	// 以同步方式读取package.json
	const data = fs.readFileSync(packageJsonPath, "utf8");

	// 解析JSON以获取对象
	const packageJson = JSON.parse(data);

	// 更新updateTime字段
	packageJson.updateTime = new Date().toISOString();

	// 转换回JSON字符串
	const updatedData = JSON.stringify(packageJson, null, 2);

	// 同步方式写回package.json文件
	fs.writeFileSync(packageJsonPath, updatedData, "utf8");

	console.log("package.json的updateTime字段已更新。");
} catch (err) {
	console.error("发生错误:", err);
}

const formal = "121.40.147.23";
const test = "47.101.51.252";

let host = test;
// 首先，我们需要登录到服务器并删除 build 文件夹
const deleteCommand = `
ssh -tt root@${host} << EOF
cd /opt/www/html/workflow/ailuo/front
rm -rf build
exit
EOF
`;
exec(deleteCommand, (err, stdout, stderr) => {
	if (err) {
		console.error(`Error: ${err}`);
	} else {
		console.log(`Delete Output: ${stdout}`);
		console.log(`Delete Errors: ${stderr}`);
		// 如果删除完成，开始上传新的 build 文件夹
		const uploadCommand = `
scp -r ${__dirname}/build root@${host}:/opt/www/html/workflow/ailuo/front
`;
		exec(uploadCommand, (uploadErr, uploadStdout, uploadStderr) => {
			if (uploadErr) {
				console.error(`Upload Error: ${uploadErr}`);
			} else {
				console.log(`Upload Output: ${uploadStdout}`);
				console.log(`Upload Errors: ${uploadStderr}`);
			}
		});
	}
});
