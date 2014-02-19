module.exports = function(grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Process images
		imagemin: {
			dynamic: {
				files: [{
					expand: true,						// Enable dynamic expansion
					cwd: 'images',						// Src matches are relative to this path
					src: ['**/*.{png,jpg,jpeg,gif}'],		// Actual patterns to match
					dest: 'images'						// Destination path prefix
				}]
			}
		},

		// Run Compass
		compass: {
			dev: {
				options: {
					http_path: "../../",
					sassDir: 'src/css',
					cssDir: 'dest/css',
					imagesDir: 'images/',
//					importPath: '../templates/common/css/',
					environment: 'development'
				}
			},
			dist: {
				options: {
					http_path: "../",
					sassDir: 'src/css',
					cssDir: 'css',
					imagesDir: 'images/',
//					importPath: '../templates/common/css/',
					environment: 'production'
				}
			}
		},

		// Javascript linting with jshint
		jshint: {
			options: {
				smarttabs: true
			},
			all: [ 'src/js/*.js' ]
		},

		// Concat & minify
		uglify: {
			dev: {
				options: {
					mangle: false,
					compress: false,
					preserveComments: 'all',
					beautify: true
				},
				files: {
					'dest/js/main.js' : [ 'src/js/*.js' ]
				}
			},
			dist: {
				options: {
					mangle: true,
					compress: true,
				},
				files: {
					'js/main.min.js': [ 'src/js/*.js' ]
				}
			}
		},

		// Watch for changes
		watch: {
			sass: {
				files: ['src/css/*.scss'],
				tasks: ['compass:dev']
			},
			js: {
				files: 'src/js/*.js',
				tasks: ['jshint', 'uglify:dev']
			},
			livereload: {
				files: ['dest/css/style.css'],
				options: {
					livereload: true
				},
			},
		},

	});

	// Default task(s).
	grunt.registerTask('build', ['compass:dist','uglify:dist','newer:imagemin']);
	grunt.registerTask('default', ['watch']);

};
