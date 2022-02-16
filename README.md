# RHT-Skeleton-Angular-AspCore-APIs
Base template for creating quick web applications based upon Angular library technology

## Setting Up
- Pull down the repo
- Travel to the directory where the 'package.json' file is located
- Open a shell and run "npm install"
  - Must have node.js installed, if not, Install it onto your hard drive
  - Ensure it is properly installed by running `node -v` inside Git Bash or cmd prompt
- In the shell, 'cd' to wherever the 'gulp.js' is located (if not there in the same directory already) and run 'gulp' to begin the Gulp task-runner
  - Must have gulp installed, if not, Install it by running `npm install -g gulp` inside Git Bash or cmd prompt
  - Ensure it is properly installed by running `gulp -v` inside Git Bash or cmd prompt
- If there is an error concerning an 'UnhandledPromiseRejectionWarning', just try typing 'gulp' again to retry the gulp process (known issue)	
- Ensure your connecting API is set up inside the angular app with the proper domain.
- Ensure the API that is being connected to from this Angular app is able to connect through CORS
- Do not be afraid

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
  - Must have Angular installed, if not, Install it by running `npm install -g @angular/cli` it by running `npm install -g gulp` inside a Git Bash or cmd prompt
  - Ensure it is properly installed by running `ng v` inside Git Bash or cmd prompt

## P.S.

Get rid of the *.css files inside the /app/ Angular/TypesScript files. You should be using *.styl and Gulp.js tactics for maintaining UI development architecture. Do not be afraid.
