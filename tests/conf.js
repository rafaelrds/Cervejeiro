// Karma configuration
// Generated on Mon Feb 29 2016 20:10:20 GMT-0300 (BRT)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine','mocha', 'chai-as-promised', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            'www/lib/angular/angular.js',
            'www/lib/angular-animate/angular-animate.js',
            'www/lib/Chart.js/Chart.js',
            'www/lib/angular-chart.js/dist/angular-chart.js',
            'www/lib/angular-mocks.js',
            'www/lib/angular-sanitize/angular-sanitize.js',
            'www/lib/angular-ui-router/release/angular-ui-router.js',
            'www/lib/firebase/firebase.js',
            'https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js',
            'www/lib/ionic/js/ionic.bundle.js',
            'www/lib/ionic-material/dist/ionic.material.js',
            'www/lib/ion-md-input/js/ion-md-input.js',
            'www/lib/angular-storage/dist/angular-storage.js',

            'www/js/app.js',

            // CONTROLLERS
            'www/js/controllers.js',
            'www/js/atividadesController.js',
            'www/js/loginController.js',
            'www/js/perfilController.js',
            'www/js/tempoInvestidoController.js',
            'www/js/galleryController.js',

            // Service's

            'www/js/firebaseService.js',
            'www/js/authService.js',

            // TESTES

            'tests/controllers/*.js',
            'tests/services/*.js'
        ],


        // list of files to exclude
        exclude: [],



        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS2'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs2-launcher'),
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-chai-as-promised')
        ]
    })
}
