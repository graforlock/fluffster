var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('bundle', function() {
    return gulp.src('./src/**/*.js')
        .pipe(uglify().on('error', function(err) { console.log(err)}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['bundle']);