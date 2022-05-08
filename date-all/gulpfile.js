let gulp = require('gulp'),
		uglify = require('gulp-uglify'),
		minicss = require('gulp-clean-css'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		clean = require('gulp-clean'),
		browserSync = require('browser-sync').create(),
		pump = require('pump');

gulp.task('default',function(){
	gulp.src(['js/lunar.js','js/bootstrap-datetimepicker.js','js/bootstrap-datetimepicker.zh-CN.js','js/moment.min.js','js/JsSimpleDateFormat.js','js/bootstrap-datepicker.js','js/bootstrap-datepicker.zh-CN.min.js','js/daterangepicker.js'])
			.pipe(concat('date-all-min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('dist'));			
	pump([
				gulp.src('pickdate.js'),
				uglify(),
				rename({suffix:'.min'}),
				gulp.dest('dist')
			]);
});

gulp.task('mincss',function(){
	pump([
				gulp.src(['css/bootstrap-datetimepicker.css','css/bootstrap-datepicker3.css','css/daterangepicker.css','css/datequarterpicker.css']),
				concat('date-all-min.css'),
				minicss(),
				gulp.dest('dist')
			]);
});

gulp.task('minall',function(){
	let a = gulp.src(['dist/date-all-min.js','dist/pickdate.min.js']);
	pump([
				a,
				concat('date-all.js'),
				uglify(),				
				gulp.dest('dist')
			]);
	a.pipe(clean());
});

gulp.task('test',function(){
	let a = gulp.src(['dist/date-all-min.js','dist/pickdate.min.js']);
	return a.pipe(clean())
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './',
            // index: "./dist/demo.html",
            directory: true
        },
        // proxy: 'localhost'
    });
    gulp.watch(['./*.js'], ['default']);gulp.watch(['./*.js'], ['minall']);
    gulp.watch(['./css/*.css'], ['mincss']);
    //gulp.watch(['./*']).on('change', browserSync.reload);
    browserSync.watch('./*').on('change', browserSync.reload);
});