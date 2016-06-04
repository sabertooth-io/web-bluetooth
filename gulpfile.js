const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const notify = require('gulp-notify');

function handleErrors() {
	notify.onError({
    title : 'Compile Error',
    message : '<%= error.message %>'
  }).apply(this, arguments);
  this.emit('end'); //keeps gulp from hanging on this task
}

function build(file) {
	const props = {
		entries : [`./lib/${file}`],
    debug : false,
    transform : [
      ['babelify', { presets: ['es2015'] }]
    ]
	}

	return browserify(props)
		.bundle()
		.on('error', handleErrors)
		.pipe(source('bundle.js'))
	 	.pipe(gulp.dest('/dist/'));
}

gulp.task('default', ['build']);
gulp.task('build', build.bind(this, 'BluetoothDevice.js'));
