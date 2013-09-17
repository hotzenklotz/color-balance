module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json")
    watch:
      options:
        livereload: true
      coffee: 
        files: "src/*.coffee"
        tasks: ["coffee:development"]
      less: 
        files: "css/*.less"
        tasks: ["less:development"]
      html:
        files: "*.html"

    coffee:
      development:
        files: [
          expand: true,
          cwd: "src",
          src: ["*.coffee"],
          dest: "build/js",
          ext: ".js"
        ]
        #options:
        #  sourceMap: true

    less:
      development:
        files: [
          expand: true,
          cwd: "css",
          src: ["*.less"],
          dest: "build/css",
          ext: ".css"
        ]

    connect:
      server :
        options:
          port: 8000
          livereload: true

    deploy:
      "gh-pages":
        options:
            message: 'Auto-generated commit'
        src: ["**"]

  })

  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-coffee")
  grunt.loadNpmTasks("grunt-contrib-watch")
  grunt.loadNpmTasks("grunt-contrib-less")
  grunt.loadNpmTasks("grunt-contrib-connect")
  grunt.loadNpmTasks("grunt-gh-pages")

  # Default task(s).
  grunt.registerTask("default", ["connect", "watch"])

