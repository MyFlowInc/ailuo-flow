// @
const { exec } = require("child_process");

const formal = '121.40.147.23'
const test = '47.101.51.252'

let host = formal
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
