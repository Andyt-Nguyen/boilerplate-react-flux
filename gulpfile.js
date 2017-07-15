"use strict";

const gulp = require('gulp');
const connect = require('gulp-connect'); //Runs Local Web Server
const open = require('gulp-open'); //Opens app in web browser
const browserify = require('browserify'); //Bundle Js
const reactify = require('reactify'); //Transform React JSX To JS
const source = require('vinyl-source-stream'); //Use conventional text streams with gulp
const concat = require('gulp-concat'); //Concats files
const lint = require('gulp-eslint'); //Lint Js Files and JSX



const config = {
	port: 3000,
	devBaseUrl: "http://localhost",
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		dist: './dist',
		mainJs:  './src/main.js'
	}
}

//Start Local Development Server
gulp.task('connect', () => {
	connect.server({
		root:['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], ()=> {
	gulp.src('dist/index.html')
			.pipe(open({uri:config.base + ':' + config.port + '/'}));
})

gulp.task('html', ()=> {
	gulp.src(config.paths.html)
			.pipe(gulp.dest(config.paths.dist))
			.pipe(connect.reload())
});

gulp.task('js', ()=> {
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + "/scripts"))
		.pipe(connect.reload());
});

gulp.task('css', ()=> {
	gulp.src(config.paths.css)
			.pipe(concat('bundle.css'))
			.pipe(gulp.dest(config.paths.dist + '/css'));
})

gulp.task('lint', ()=> {
	return gulp.src(config.paths.js)
							.pipe(lint({config: 'eslint.config.json'}))
							.pipe(lint.format());
})

gulp.task('watch', ()=> {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
})

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
