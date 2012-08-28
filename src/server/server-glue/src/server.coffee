if process?
	databaseOptions =
		engine: 'mysql'
		params:
			host: 'localhost'
			user: 'root'
			password: '.'
			database: 'rulemotion'
	# databaseOptions =
		# engine: 'postgres'
		# params: process.env.DATABASE_URL || "postgres://postgres:.@localhost:5432/postgres"
else
	databaseOptions =
		engine: 'websql'
		params: 'rulemotion'
		

setupCallback = (requirejs, app) ->
	#IFDEF server
	requirejs(['data-server/SBVRServer'], (sbvrServer) ->
		sbvrServer.setup(app, requirejs)
	)
	#ENDIFDEF

	#IFDEF editor
	requirejs(['editorServer'], (editorServer) ->
		editorServer.setup(app, requirejs)
	)
	#ENDIFDEF

	if process?
		app.listen(process.env.PORT or 1337, () ->
			console.log('Server started')
		)



if process?
	requirejs = require('requirejs')
	rootPath = process.cwd() + '/../../../'
	requirejs.config(
		paths: {
			'jquery':					rootPath + 'external/jquery-1.7.1.min',
			# 'jquery':					'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
			'jquery-ui':				rootPath + 'external/jquery-ui/js/jquery-ui-1.8.17.custom.min',
			'jquery-custom-file-input':	rootPath + 'external/jquery-custom-file-input',
			'jquery.hotkeys':			rootPath + 'external/jquery.hotkeys',
			'ometa-core':				rootPath + 'external/ometa-js/lib/ometajs/core',
			'ometa-compiler':			rootPath + 'external/ometa-js/lib/ometajs/ometa/parsers',
			'codemirror':				rootPath + 'external/CodeMirror2/lib/codemirror',
			'codemirror-util':			rootPath + 'external/CodeMirror2/lib/util',
			'codemirror-keymap':		rootPath + 'external/CodeMirror2/keymap',
			'codemirror-modes':			rootPath + 'external/CodeMirror2/mode',
			'js-beautify':				rootPath + 'external/beautify/beautify',
			'qunit':					rootPath + 'external/qunit/qunit',
			'underscore':				rootPath + 'external/underscore-1.2.1.min',
			'inflection':				rootPath + 'external/inflection/inflection',
			'json2':					rootPath + 'external/json2',
			'downloadify':				rootPath + 'external/downloadify',
			'ejs':						rootPath + 'external/ejs/ejs.min',
			
			'sbvr-parser':				rootPath + 'common/sbvr-parser/src/',
			'utils':					rootPath + 'common/utils/src/',
			
			'sbvr-frame':				rootPath + 'client/sbvr-frame/src',
			'data-frame':				rootPath + 'client/data-frame/src',
			'Prettify':					rootPath + 'client/prettify-ometa/src/Prettify',
			'codemirror-ometa-bridge':	rootPath + 'client/codemirror-ometa-bridge/src',
			
			'sbvr-compiler':			rootPath + 'server/sbvr-compiler/src/',
			
			'server-glue':				rootPath + 'server/server-glue/src/server',
			'express-emulator':			rootPath + 'server/express-emulator/src/express',
			'data-server':				rootPath + 'server/data-server/src',
			'editorServer':				rootPath + 'server/editor-server/src/editorServer',
			'database-layer':			rootPath + 'server/database-layer/src/',
			'passportBCrypt':			rootPath + 'server/passport-bcrypt/src/passportBCrypt',
			
			'frame-glue/main':			rootPath + 'client/frame-glue/src/main',
			'frame-glue/script':		rootPath + 'client/frame-glue/src/script'
		}
		nodeRequire: require
		baseUrl: 'js'
	)
	
	express = require('express')
	app = express.createServer()
	#IFDEF server
	passport = require('passport')
	#ENDIFDEF
	
	app.configure(->
		#IFDEF server
		app.use(express.cookieParser())
		#ENDIFDEF
		app.use(express.bodyParser())
		#IFDEF server
		app.use(express.session({ secret: "A pink cat jumped over a rainbow" }))
		app.use(passport.initialize())
		app.use(passport.session())
		#ENDIFDEF
		app.use(express.static(process.cwd()))
	)
	
	#IFDEF server
	requirejs(['database-layer/db'], (dbModule) ->
		db = dbModule.connect(databaseOptions)
		requirejs('passportBCrypt').init(passport, db)
	)
	
	app.post('/login', passport.authenticate('local', {failureRedirect: '/login.html'}), (req, res, next) ->
		res.redirect('/')
	)
	#ENDIFDEF
	setupCallback(requirejs, app)
else
	requirejs = window.requirejs
	#IFDEF websql
	requirejs(['express-emulator'], (express) ->
		window?.remoteServerRequest = express.app.process
		setupCallback(requirejs, express.app)
	)
	#ENDIFDEF

# fs = require('fs')
# lazy = require("lazy")
# imported = 0
# new lazy(fs.createReadStream(process.argv[2])).lines.forEach((query) ->
	# query = query.toString().trim()
	# if query.length > 0
		# _db.run query, (error) ->
			# if error
				# console.log error, imported++
			# else
				# console.log "Import Success", imported++
# )
