# RHT-Skeleton-Angular-AspCore-APIs
Base template for creating quick web applications based upon Angular library technology

# Setting Up
	- Pull down the repo
	- Travel to the directory where the 'package.json' file is located
	- Open a shell and run "npm install"
	- In the shell, 'cd' to wherever the 'gulp.,js' is located (if not there in the same directory already) and run 'gulp' to begin the Gulp task-runner
	- If there is an error concerning an 'UnhandledPromiseRejectionWarning', just try typing 'gulp' again to retry the gulp process (known issue)
	
	- Ensure your connecting API is set up inside the angular app with the proper domain.
	- Ensure the API that is being connected to from this Angular app is able to connect through CORS
	- Do not be afraid

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## P.S.

Get rid of the *.css files inside the /app/ Angular/TypesScript files. You should be using *.styl and Gulp.js tactics for maintaining UI development architecture. Do not be afraid.
