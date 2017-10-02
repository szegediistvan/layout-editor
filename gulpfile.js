/**
 * Created by istvan.szegedi on 2017. 09. 14.
 */
'use strict'

var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

const reload = browserSync.reload;

gulp.task('handlebars', function() {
    var content = fs.readFileSync('app/data.json');
    var templData = JSON.parse(content);
    return gulp.src('app/index.hbs')
        .pipe(handlebars(templData, {
            helpers: {
                math: function(lvalue, operator, rvalue, options) {
                    lvalue = parseFloat(lvalue);
                    rvalue = parseFloat(rvalue);

                    return {
                        "+": lvalue + rvalue,
                        "-": lvalue - rvalue,
                        "*": lvalue * rvalue,
                        "/": lvalue / rvalue,
                        "%": lvalue % rvalue
                    }[operator];
                }
            }
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('app/'));
});

gulp.task('build', ['handlebars'], function(){
    gulp.src('app/images/*')
        .pipe(gulp.dest('build/images'));
    return gulp.src('app/index.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('serve', ['handlebars'], function() {
    browserSync({
        server: ['app'],
        port: 3000
    });

    gulp.watch(['app/**/*.hbs'], ['handlebars']);
    gulp.watch(['app/**/*.html'], reload);
});
