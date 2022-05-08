let gulp = require('gulp'),
		uglify = require('gulp-uglify'),
		minicss = require('gulp-clean-css'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		clean = require('gulp-clean'),
		browserSync = require('browser-sync').create(),
		pump = require('pump');

gulp.task('minjs',()=>{
	pump([
			gulp.src(['js/select2.full.js','js/bootstrap-table.js','js/bootstrap-table-zh-CN.js','js/bootstrap-table-fixed-columns.js','js/bootstrap-treeview.js','js/helpout.js','js/pagination.min.js']),
			concat('help-all-min.js'),
			uglify(),
			gulp.dest('dist')
		]);
});

gulp.task('mincss',()=>{
	pump([
			gulp.src(['universal.css','css/select2.css','css/select2-bs.css','css/bootstrap-treeview.css','css/bootstrap-table.css','css/bootstrap-table-fixed-columns.css','css/popalert.css','css/pagination.css']),
			concat('help-all-min.css'),
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