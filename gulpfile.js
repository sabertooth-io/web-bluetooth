const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const notify = require('gulp-notify');

const path = {
	SRC: 'lib/BluetoothDevice.js',
	NPM_Dest: 'dist/npm',
	BOWER_Dest: 'dist/build.js'
}

const configs = {
	npm: {
		entries: [`./lib/${file}`],
    debug: true,
    transform: [
      ['babelify', { presets: ['es2015'] }]
    ]
	},
	bower: {
		entries: 
	}
}

function handleErrors() {
	notify.onError({
    title : 'Compile Error',
    message : '<%= error.message %>'
  }).apply(this, arguments);
  this.emit('end'); //keeps gulp from hanging on this task
}

function build(props, src, out) {

	return browserify(props)
		.bundle()
		.on('error', handleErrors)
		.pipe(soucre(src))
	 	.pipe(source(out));
}

gulp.task('default', ['npm', 'bower']);
gulp.task('npm', build.call(this, path.SRC, path.NPM_Dest));
gulp.task('bower', build.call(this, path.SRC, path.BOWER_Dest));
