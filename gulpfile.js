"use strict"

// Подключаем/регистрируем GULP пакеты/модули
var gulp         = require('gulp'), // Подключаем Gulp
		sass         = require('gulp-sass'), //Подключаем Sass пакет,
		browserSync  = require('browser-sync'), // Подключаем Browser Sync
		concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		uglify       = require('gulp-uglify'), // Подключаем gulp-uglify (для сжатия JS)
		cleanCSS     = require('gulp-clean-css'), // Подключаем пакет для минификации CSS
		rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
		cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
		autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
		csscomb 		 = require('gulp-csscomb'); // Подключаем библиотеку для сортировки css свойств
// // ==========================================================
// Создаем задачу для browserSync (Обновление без перезагрузки)
// // ==========================================================
gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'src' // Директория для сервера - src
		},
		notify: false // Отключаем уведомления
	});
});
// // ======================
// Создаем задачу для SASS
// // ======================
gulp.task('sass', function() { // Создаем таск Sass
	return gulp.src('src/sass/**/*.sass') // Берем все файлы с расширением sass
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError)) // Преобразуем Sass и Bourbon в CSS посредством gulp-sass
		.pipe(rename({suffix: '.min', prefix : ''})) // Добавляем к файлу суфикс .min
		.pipe(autoprefixer(['last 15 versions'])) // добавляем вендорные префиксы
		.pipe(csscomb()) // Сортировка css свойств
		.pipe(cleanCSS()) // Минимифицируем CSS
		.pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
	});
// // ===================================================
// Создаем задачу js скриптов (сборка/сжимание/выгрузка)
// // ===================================================
gulp.task('libs', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'./bower_components/jquery/dist/jquery.min.js', // Берем jQuery
		// сюда через заяпятую перечисляем все библиотеки
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('src/js')); // Выгружаем в папку src/js
	});
// // ========================================
// Создаем задачу для слежения за изменениями
// // ========================================
gulp.task('watch', ['sass', 'libs', 'browser-sync'], function() {
	gulp.watch('src/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('src/libs/**/*.js', ['libs']); // Наблюдение за js файлами в папке libs
	gulp.watch('src/js/**/*.js').on("change", browserSync.reload);; // Наблюдение за js файлами в папке js
	gulp.watch('src/*.html').on("change", browserSync.reload);; // Наблюдение за html файлами в корне проекта
});
// // ========================
// Создаем задачу для очистки
// // ========================
gulp.task('removebuild', function() {
	return del.sync('build'); // Удаляем папку build перед сборкой
});
// // =========================================
// Создаем задачу для финальной сборки проекта
// // =========================================
gulp.task('build', ['removebuild', 'sass', 'libs'], function() {

	var buildCss = gulp.src('src/css/**/*')
	.pipe(gulp.dest('build/css')) // Переносим css в build

	var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в build
	.pipe(gulp.dest('build/fonts'))

	var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в build
	.pipe(gulp.dest('build/js'))

	var buildHtml = gulp.src('src/*.html') // Переносим HTML в build
	.pipe(gulp.dest('build'))

	var buildImage = gulp.src('src/img/**/*') // Переносим Image в build
	.pipe(gulp.dest('build/img'));

});
// // =============================
// Создаем задачу для очистки кеша
// // =============================
gulp.task('clearcache', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']); // Дефолтная задача запускающаяя слежение