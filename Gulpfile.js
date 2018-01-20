
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const through = require('through');
const path = require('path');
const basedir = path.join(__dirname, 'src/');

function build() {
	const b = browserify({ entries: './index.js', bundleExternal: false, node: true, basedir })
	
	b.transform(function() {
		let data = '';

		function write(buf) {
			data += buf;
		}
		function end() {
			data = data.replace(/(['"])busyweb\//g, '$1' + basedir);
			data = data.replace(/(['"])\.\.\//g, '$1' + path.join(__dirname, '/'));
			this.queue(data);
			this.queue(null);
		}
		return through(write, end);
	});
		
	b.transform('babelify', { presets: ['env'] })
		.bundle()
		.pipe(source('busyweb-cli.js'))
		.pipe(gulp.dest("./bin/"));
}

function watch() {
	gulp.watch('src/**/*.js', ['build']);
}

gulp.task('build', build);
gulp.task('watch', ['build'], watch);
gulp.task('default', ['watch']);
