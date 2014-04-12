// Note: this is a lineman file, not original gruntfile, 
// but it doesn't change the point
// - the code looks similar and it's messy anyway.

module.exports = require(process.env["LINEMAN_MAIN"]).config.extend("application", {
  appTasks: {
    common: [
      "jade:templates",
      "copy:jadehtml",
      "ngtemplates",
      "sass",
      "coffee",
      "concat_sourcemap",
      "copy:player"
    ],
    dev: [
      "coffeelint",
      "images:dev",
      "jade:dev",
      "pages:dev",
      "symlink",
      "copy:dev",
      "watch"
    ],
    dist: [
      "ngmin",
      "concat:dist",
      "uglify",
      "cssmin",
      "images:dist",
      "jade:dist",
      "pages:dist",
      "copy:dist"
    ]
  },


  server: {
    pushState: true,
    apiProxy: {
      enabled: true,
      host: 'localhost',
      port: 3000,
      prefix: 'api'
    }
  },


  sass: {
    compile: {
      options: {
        compass: true,
        bundleExec: true,
        sourcemap: true,
        quiet: true
      }
    }
  },


  jade: {
    options: {
      pretty: false,
      data: {
        pkg: pkg,
        environment: process.env["LINEMAN_ENV"] || 'development',
        time: (new Date).getTime(),
        errbit: {
          api_key: '123123'
        }
      }
    },

    templates: {
      files: [
        {
          expand: true,
          cwd: "app/templates",
          src: ["**/*.jade"], /**/
          dest: "generated/jade/",
          ext: ".html"
        }
      ]
    },

    dev: {
      files: [
        {
          expand: true,
          cwd: "app/pages",
          src: ["**/*.jade"], /**/
          dest: "generated/pages",
          ext: ".us"
        }
      ]
    },

    dist: {
      files: [
        {
          expand: true,
          cwd: "app/pages",
          src: ["**/*.jade"], /**/
          dest: "generated/pages",
          ext: ".dist.us"
        }
      ]
    }
  },


  pages: {
    dev: {
      files: {
        "generated": "generated/pages/**/*.us" /**/
      },
      context: {
        js: "js/app.js",
        css: "css/app.css"
      }
    },
    dist: {
      files: {
        "dist": "generated/pages/**/index.dist.us"  /**/
      },
      context: {
        js: "js/app.js",
        css: "css/app.css"
      }
    }
  },


  copy: {
    jadehtml: {
      files: [
        {
          expand: true,
          cwd: "app/templates",
          src: ["**/*.html"], /**/
          dest: "generated/jade/",
          ext: ".html"
        }
      ]
    },

    dev: {
      files: [
        {
          expand: true,
          cwd: "public",
          src: ["**", ".htaccess"], /**/
          dest: "generated/"
        }
      ]
    },

    dist: {
      files: [
        {
          expand: true,
          cwd: "public",
          src: ["**", ".htaccess"], /**/
          dest: "dist/"
        }
      ]
    },

    player: {
      files: [
        {
          expand: true,
          cwd: "vendor/player",
          src: ["aacplayer.swf", "config.xml"],
          dest: "generated/player/"
        }, {
          expand: true,
          cwd: "vendor/player",
          src: ["aacplayer.swf", "config.xml"],
          dest: "dist/player/"
        }
      ]
    }
  },


  coffeelint: {
    options: {
      no_trailing_whitespace: {
        level: 'ignore'
      },
      max_line_length: {
        level: 'ignore'
      }
    },

    app: {
      files: files.coffee.app
    },

    spec: {
      files: files.coffee.spec
    }
  },


  coffee: {
    options: {
      sourceMap: true
    },

    app: {
      files: files.coffee.app
    },

    spec: {
      files: files.coffee.spec
    }
  },


  ngtemplates: {
    app: {
      options: {
        base: "generated/jade"
      },
      src: "generated/jade/**/*.html", /**/
      dest: files.ngtemplates.dest
    }
  },

  concat_sourcemap: {
    options: {
      sourceRoot: '/src/'
    },

    jsAppBase: {
      src: files.concat.js.appBase,
      dest: files.concat.js.generatedAppBase
    },

    jsAppTemplates: {
      src: files.concat.js.appTemplates,
      dest: files.concat.js.generatedAppTemplates
    },

    jsAppModules: {
      src: files.concat.js.appModules,
      dest: files.concat.js.generatedAppModules
    },

    jsVendor: {
      src: files.js.vendor,
      dest: files.concat.js.generatedVendor
    },

    jsSpec: {
      src: files.concat.js.spec,
      dest: files.concat.js.generatedSpec
    },

    css: {
      src: [files.sass.generatedVendor, files.css.vendor, files.sass.generatedApp, files.css.app],
      dest: files.css.concatenated
    }
  },


  ngmin: {
    js: {
      files: {
        files[concat][js][generatedAppBase]: files.concat.js.generatedAppBase,
        files[concat][js][generatedAppModules]: files.concat.js.generatedAppModules,
        files[concat][js][generatedVendor]: files.concat.js.generatedVendor
      }
    }
  },


  concat: {
    dist: {
      src: [files.concat.js.generatedAppBase, files.concat.js.generatedAppTemplates, files.concat.js.generatedAppModules],
      dest: files.concat.js.concatenatedApp
    }
  },


  symlink: {
    source: {
      files: [
        {
          src: 'app',
          dest: 'generated/app/'
        }, {
          src: '.',
          dest: 'generated/src/'
        }
      ]
    }
  },


  uglify: {
    js: {
      options: {
        mangle: false
      },
      files: {
        "dist/js/app.js": files.concat.js.concatenatedApp,
        "dist/js/vendor.js": files.concat.js.generatedVendor
      }
    }
  },


  casperjs: {
    options: {
      casperjsOptions: ['--includes=spec-casper/helpers/support.coffee', '--verbose', '--fail-fast']
    },
    files: [files.casperjs.specs]
  },


  watch: {
    options: {
      livereload: true,
      spawn: false
    },
    lint: [],
    js: [],
    jsSpecs: [],
    public_files: {
      files: "public/**", /**/
      tasks: ["copy:dev"]
    },
    player_files: {
      files: "vendor/player/**", /**/
      tasks: ["copy:player"]
    },
    images: {
      files: "app/img/**", /**/
      tasks: ["images:dev"]
    },
    jade: {
      files: "app/templates/**/*.jade", /**/
      tasks: ["jade:dev", "pages:dev", "jade:templates", "copy:jadehtml", "ngtemplates", "concat_sourcemap:jsAppTemplates"]
    },
    pages: {
      files: "app/pages/**/*.jade", /**/
      tasks: ["jade:dev", "pages:dev"]
    },
    jsVendors: {
      files: [files.js.vendor],
      tasks: ["concat_sourcemap:jsVendor"]
    },
    coffee: {
      files: ["app/js/**/*.coffee"], /**/
      tasks: ["coffeelint:app", "coffee:app", "concat_sourcemap:jsAppBase", "concat_sourcemap:jsAppModules"]
    },
    jsSpecVendors: {
      files: [files.js.spec],
      tasks: ["concat_sourcemap:jsSpec"]
    },
    coffeeSpecs: {
      files: ["spec/**/*.coffee"], /**/
      tasks: ["coffeelint:spec", "coffee:spec", "concat_sourcemap:jsSpec"]
    },
    casperjs: {
      files: [files.casperjs.specs, files.casperjs.helpers],
      tasks: ["casperjs"]
    },
    css: {
      files: [files.css.vendor, files.css.app],
      tasks: ["concat_sourcemap:css"]
    },
    sass: {
      files: [files.sass.vendor, files.sass.app],
      tasks: ["sass", "concat_sourcemap:css"]
    }
  }

  
});
