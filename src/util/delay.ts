export async function delay(time: number = 500) {
	return new Promise(resove => {
		setTimeout(() => {
			resove(1);
		}, time);
	});
}
