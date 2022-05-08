let gulp = require('gulp'),
		uglify = require('gulp-uglify'),
		minicss = require('gulp-clean-css'),
		concat = require('gulp-concat'),
		//rename = require('gulp-rename'),
		//clean = require('gulp-clean'),
		browserSync = require('browser-sync').create(),
		pump = require('pump');

gulp.task('minjs',()=>{
	pump([
			gulp.src(['js/canvasProgress__.js','js/tools.js']),
			concat('tools-min.js'),
			uglify(),
			gulp.dest('dist')
		]);
});

gulp.task('mincss',()=>{
	pump([
			gulp.src(['css/tools.css']),
			concat('tools-min.css'),
			minicss(),
			gulp.dest('dist')
		]);
});

gulp.task('watch', ()=> {
    browserSync.init({
        server: {
            baseDir: './',
            //index: "./dist/demo-tree.html",
            directory: true
        },
        //proxy: 'localhost'
    });
    gulp.watch(['./js/*.js'], ['minjs']);
    gulp.watch(['./css/*.css'], ['mincss']);
    gulp.watch(['./*']).on('change', browserSync.reload);
    browserSync.watch('dist/*').on('change', browserSync.reload);
});