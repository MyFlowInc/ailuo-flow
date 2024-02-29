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
	packageJson.updateTime = new Date().toLocaleString();

	// 转换回JSON字符串
	const updatedData = JSON.stringify(packageJson, null, 2);

	// 同步方式写回package.json文件
	fs.writeFileSync(packageJsonPath, updatedData, "utf8");

	console.log("package.json的updateTime字段已更新。");
} catch (err) {
	console.error("发生错误:", err);
}
