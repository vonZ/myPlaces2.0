MyPlaces 2.0
=================================

Frontedn resource README for MyPlaces 2.0. 
The installation guide works for Windows only.

Symbol explanations: 
	Bash script: ``Some code``
	Navigate to a directory using the bash: >> Directory
	Some qoute: "Example"

Remember to "Check out for edit" in the TFS to the "Resource" catalogue before doing any of below: 

Techniques
----------
- AngularJS
- Bower
- Grunt
- NPM
- Sass
- Bootstrap 

Dependencies
------------
- Specified in the bower.json file. 
- When updating the dependencies, see "Updating the dependencies" below. 

Install
-------

**Install Git Bash**
1. >> https://git-for-windows.github.io/
2. Click through the installation guide.
	2.1 When asking for "PATH environment", choose "Use git from the Windows Command Promt"
3. Finish installation.
4. Fire up Git bash as administrator. 

**Install NPM**
1. >> https://nodejs.org/download/release/latest/win-x64/
	1.1 Choose "node.exe"
2. Click through the installation guide.

**Install Bower**
1. ``npm install -g bower``

**Install Grunt**
1. ``npm install -g grunt-cli``

**Install all of the dependencies**
1. >> Navigate to the "Resources" folder using "Git bash"
2. ``bower install``
3. ``npm install``


Updating the dependencies
-------------------------
1. In grunt/bower.json, add a new line in the "dependencies" section
2. Specify a version, or use "*" to take latest
3. Save file
4. ``bower install``
4. Add the new file to the concat-section in gruntfile.js
4. ``grunt concat`` (stop watch script (CTRL + C), if grunt is running)

Development
-----------
To make js and css changes take affect you need to have grunt up and running with Git bash open in administration mode. 

1. ``grunt``

Known issues
------------
- NEVER include "bower_components" or "node_modules" in project. 
- Sometimes the local sites isn´t reachable due to grunt build fail. Try to rebuild using the ``grunt`` command in a new instance of Git bash. 
