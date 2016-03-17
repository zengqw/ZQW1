var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css');


gulp.task('build-main', ['less']);


gulp.task('less', function () {
    return gulp.src('less/global.less')
        .pipe(less({ compress: false }))
        .on('error', function(e){console.log(e);} )
        .pipe(gulp.dest('css/'));
});

// 合并、压缩、重命名css
gulp.task('min-styles', function() {
    gulp.src(['./css/global.css'])
        .pipe(concat('all.css')) // 合并文件为all.css
        .pipe(gulp.dest('./dist/')) // 输出all.css文件
        .pipe(rename({ suffix: '.min' })) // 重命名all.css为 all.min.css
        .pipe(minifycss()) // 压缩css文件
        .pipe(gulp.dest('./dist/')); // 输出all.min.css
});


gulp.task('pub', function() {
    gulp.watch('./less/**/*.less', ['build-main', 'min-styles']);
});