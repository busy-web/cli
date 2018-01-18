
module.exports = function(arg) {
	const proc = exec(arg);
	proc.stdout.pipe(process.stdout);
}
