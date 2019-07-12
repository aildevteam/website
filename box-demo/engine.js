///////////////////////////////////////////////////////////
//WeBox VN Engine by g_o -------- All rights reserved (c)//
///////////////////////////////////////////////////////////

/**********************************************
* TODO
*	Finish WSL.
*	Make a comment system.
***********************************************/

////////////////////////////////////UTILS////////////////////////////////////

function util()
{

	var vars = {};
	this.v = vars;
	this.cOk = true; // Is choice state OK?
	
	this.injectVars = function(tokens)
	{
		result = tokens;
		for(i=1; i < result.length; i++)
		{
			if(result[i].charAt(0) != '\"')
			{
				result[i] = this.v[result[i]]; // Var injection
			}
		}
		
		return result;
	}
	
	this.createElement = function(eName,id) // Create element
	{
		e = document.createElement(eName); // Create the element
		document.body.appendChild(e);
		e.id = id; // Set it's id
		return e; // Return the element
	}

	this.deleteElement = function(id) // Delete an element by Id
	{
		$(id).remove(); // Delete
	}

	/*function deleteElement(e) // Delete an element by Var
	{
		e.remove(); // Delete
	}*/

	this.createImage = function(src,id,width, height) // Create image element
	{
		image = this.createElement("img",id); // Create image
		image.src = src; // Set source
		// Set dimentions
		image.width = width;
		image.height = height;
		return image; // Return the image
	}
	
	this.loadFile = function(url,type) // Load file
	{
		var Data = "_!Error loading file '"+url+"'";

		$.get(url, function(data) {
			if(type == "text")
				Data = data.split("\n");
			else
				Data = data;
		});
		
		return Data;
	}
	
	this.get = function(id) // Get element by ID
	{
		return document.getElementById(id);
	}
	
	this.setBGColor = function(color) // Set background color
	{
		document.body.style.backgroundColor=color;
	}
	
	this.setBGImage = function (element, url)
	{
		element.style.backgroundImage = "url('"+url+"')";
	}
	
	this.play = function(track,i)
	{
		pArr = [ "player","pfx" ];
		this.get(pArr[i]).src="SOUNDS/"+track;
		aplayers[i].play();
		return true;
	}
};

////////////////////////////////////EXECUTER////////////////////////////////////

/**
Let executer be the WSL-command-executer object;
Input: A WSL engine, a trigger for code snippet = execution
Output: none;

Command function convention:
	this.[function name] = function(args)
	{
		...
		if(success)
			return true;
		else
			return false;
	};
*/

var executer = function(u,triger) // The executer object
{

	this.snippetTriger = triger; // Trigger char
	
	// FUNCTION AS DESCRIBED IN THE WSL DOCUMENTATION
	
	this.bg = function(args)
	{
		$("#bg").fadeOut(400, function(){
			u.get("bg").src = "BGS/"+args;
			$("#bg").one("load", function() {
				$("#bg").fadeIn(400);
			})
		});
		return true;
	};
	
	this.display = function(args) 
	{
		return true;
	};
	
	this.shake = function(args)
	{
		$("#bg").animate({left: '50px'}, 80).animate({left: '-50px'}, 80);
		$("#bg").animate({left: '50px'}, 80).animate({left: '-50px'}, 80);
		$("#bg").animate({left: '50px'}, 100).animate({left: '-50px'}, 100).animate({left: '0px'}, 100);
		return true;
	};

	this.fade = function(args)
	{
		if(args < 0)
			$("#bg").fadeOut(args);
		else
			$("#bg").fadeIn(Math.abs(args));
		return true;
	};
	
	this.bgcolor = function(args)
	{
		u.setBGColor(args.toString().replace(",",""));
		return true;
	};
	
	this.set = function(args)
	{
		args = args.toString().split(","); // Make sure you treat this as an array
		u.v[args[0]] = args[1]; // Store the variable in memory.
		return true;
	};
	
	this.unset = function(args)
	{
		delete u.v[args];
		u.v["^"]="";
		return true;
	};
	
	this.repeat = function(args) {
		return u.play(args,0);
	};
	
	this.play = function(args) {
		return 	u.play(args,1);
	};
	
	this.bad = function(args) {
		alert("Your bad ending message here!");
		location.replace("index.html");
		return true;
	};
	
	this.good = function(args) {
		alert("Your good ending message here!");
		location.replace("index.html");
		return true;
	};
	
	this.go = function(args) {
		u.v["^^"]=args.replaceAll(",","");
		u.v["^"]="goto";
		return true;
	};
	
	this.comment = function(args) {
		u.v["^"] = "";
		return true; // done haha
	};
	
	this.choice = function(args) {
		// Open choice dialog
		
		u.get("dialog").style.display="block";
		u.cOk = false; // PAUSE!
		u.v["^^"] = "choice"; // Make a choice flag (enable next line interpret)
		var p = args.toString().split(",");
		
		for(var x = 0; x < p.length; x+=2) {
			var id = p[x+1]; // BUTTON ID = line;
			u.get("dialog").innerHTML+="<div id='"+id+"' onclick='last_id=this.id;'></div>";
			u.get(id).innerHTML = p[x].replaceAll("_", " "); // Set the label
			u.get("dialog").innerHTML+="<br/><br/>";			
		}
		
		for(var x = 0; x < p.length; x+=2)
		{
			var id = p[x+1]; // BUTTON ID = line;
			$("#"+id).button();
			$("#"+id).button().click(function( event ) {
				event.preventDefault();
				u.cOk=true; // Continue
				u.v["^"]=last_id; // Returned value
				u.get("dialog").style.display="none";
				u.get("dialog").innerHTML = "<br/><br/>";
			});
		}
		
		return true;
	};
	
	this.sxor = function(args) {
		u.v["^^"] = "choice"; // Make a choice flag (enable next line interpret)
		args = args.split(",");
		if(args[0] == args[1]) {
			u.v["^"] = args[2];
		}
		else {
			u.v["^"] = args[3];
		}

		return true;
	};
};


////////////////////////////////////ENGINE////////////////////////////////////

function engine() // Constructor + Class definer
{
	// ===========PRIVATES [except from the window object of course]===========
	var typeEffect = true; // Type effect = On/Off
	var textSpeed = 220; // Text speed (Word per Minute)
	var u = new util(); // Utilities
	var ex = new executer(u, "["); // Executer
	var plotFile; // Plot file
	var menuFile; // Menu html
	var resourceFile; // Resources & effects file
	var chapter = 0; // Chapter
	var i = 0; // Iterator
	var typerTimer = setTimeout("",0); // Reseting the typer timer
	var cur_ch; // Current character
	var pause = false; // Are we paused?
	
	// ===========CONSTRUCTING CALLS===========

	init(); // Init engine

	// ===========FUNCTIONS===========

	// ----------------------------WSL RELATED
	function execute(cmd,params) // Execute a command! cmd: the command name; params: the parameters;
	{
		try
		{
			if(!ex[cmd](params)) // Execution stuff = executing using the executer object
				alert("Error: Executing command "+cmd+"\n Please report!");
				
			if(u.v["^"]=="goto") {
				i=u.v["^^"]-1;
				u.v["^"] = "done";
			}
				
			if(u.v["^^"]=="choice") {
				return "";
			}
				
			i++;
			
			return plotFile[i];
		}
		catch(err) // Handle exceptions
		{
			alert("Error: Unknown command!\nPlease report!\n\nTechnical info:\n "+err); // Error handling
			return false;
		}
		return true;
	}
	
	function interpret(plotLine) // Interpret a WSL line
	{
		if(plotLine[0] != ex.snippetTriger)
			return plotLine;
		else // TOKENIZE
		{
			var tokens = plotLine.substring(1,plotLine.length);
			// Snippet-ception
			var r = tokens.indexOf("["), j = tokens.indexOf("]")+1;
			var b_i = i;
			var n_tokens; // NON LOCAL TOKEN SECTION!
			
			while(r!=-1) { 
				n_token = tokens.substring(r, j);
				interpret(n_token.substring(0,n_token.length-1));
				tokens = tokens.replace(n_token,'\"'+u.v["^"]+'\"');
				r = tokens.indexOf("["), j = tokens.indexOf("]")+1;
			}
			i=b_i;
			
			tokens = tokens.split(" ");
			cmd = tokens[0];
			tokens = u.injectVars(tokens); // Injectioning var values in params
			tokens = tokens.toString();
			params = tokens.substring(cmd.length, tokens.length);
			params = params.replaceAll("\"","").split(" "); // Fixing the values problem
			params = params.toString().substring(1, params.toString().length); // Fixing value
			return execute(cmd,params); // Execute! (params is "object" when array -> we need to later convert to specificly array through string.)
		}
	}
	
	// ----------------------------LOG RELATED
	
	function typeToLog(str,j) // str - string to type; j: current char iterator;
	{
		if(j<str.length)
		{
			u.get("logDiv").innerHTML+= str[j];
			typerTimer = setTimeout(function(){typeToLog(str,j+1);},1000.0/(5.0*(textSpeed/60)*2.0)); // Second/letter*2.0 (We need to be slightly ahead of the reader)
		}
	}

	function printToLog(str) // Set text to the log div.
	{
		u.get("logDiv").innerHTML = str;
	}

	function printPlot(index) // Print plot by line index
	{
		clearTimeout(typerTimer);
		printToLog("");
		var line = interpret(plotFile[index]);
		var name, saying;
		var x = line.indexOf(":");
		name = (line.substring(0,x));
		saying = line.substring(x+1,line.length);
		
		u.get("nameDiv").innerHTML=name.split('_', 1);
		
		var clist = { }; // list of characters
		
		if(name) 
		{
			cur_ch = name;
			
			if(name in clist) {
				u.get("ch").src="CHARACTERS/"+name+".png";
				u.get("ch").style.display="block";
			} else
			{
				u.get("ch").style.display="none";
			}
		} 
		else
		{
			u.get("ch").style.display="none";
		}
		
		if(typeEffect)	
			typeToLog(saying,0);
		else	// In case type effect isn't supported.
			printToLog(saying);
	}

	// ----------------------------LOAD/SAVE RELATED
	
	function load() // Load from cookie
	{
		var oldC = chapter;
		var oldI = i;
		chapter = getCookie("chapter");
		
		if(chapter != "") {
		
			if(oldC==0) {
				location.replace("index.html?c="+chapter+"&l=1");
				return;
			}
			
			i = getCookie("index");
			var v = getCookie("vars");
			if(v)
				u.v = $.parseJSON(v);
			u.get("bg").src = getCookie("bg");
			alert("Loaded successfuly! [Chapter "+chapter+"]");

			plotFile = u.loadFile("CHAPTERS/"+chapter+".html","text"); // Load chapter plot
			mainDiv.innerHTML = "<h2 unselectable='on'>Chapter "+chapter+"</h2>";
			printPlot(i);
		}
		else{
			alert("Loading failed!");
			chapter = oldC;
			i = oldI;
		}
	}

	function save() // Save from cookie
	{
		if(chapter)
		{
			setCookie("chapter",chapter);
			setCookie("index",i);
			setCookie("vars", $.toJSON(u.v));
			setCookie("bg", u.get("bg").src);
			alert("Saved successfuly!");
		}
	}

	// ----------------------------INPUT RELATED
	
	function mouse(event) // Handle mouse events
	{
		switch(event.target.id)
		{
			case "Main Menu":
				break;
			case "save":
				save();
				break;
			case "load":
				load();
				break;
			case "up":
				prev();
				break;
			case "down":
				step();
				break;
			case "forwards":
				break;
			case "backwards":
				break;
			default:
				step();
		}
	}

	function keyboard(event) // Handle keyboard events
	{
		if(event.which == 13 || event.which == 37) // ENTER OR RIGHT ARROW
		{
			step();
		} 
		else if(event.which == 39) // BACK
		{
			prev();
		}
		else if(event.which == 113) // F2
		{
			alert("DEBUG\n\n-----------------------------\nReturned Value: ^="+u.v["^"]+"\nCurrent line: i="+i+"\nVars="+$.toJSON(u.v)+"\n-----------------------------\n For additional info press F12 to get to your browser debug mode!");
		}
	}

	// ----------------------------GENERAL
	
	function next_chapter() {
		save();
		location.replace("index.html?c="+parseInt(parseInt(chapter,10)+1,10));
	}
	
	function step() // Next interpetation/"step" to be made
	{
		if(pause || !u.cOk)
			return;
			
		if(chapter==0)
			return;
			
		if(i<plotFile.length-1)
			i++;
		else
			next_chapter();
			
		try{	
			if(plotFile.charAt(0)=='_' && plotFile.charAt(1)=='!')
				alert(plotFile.substring(2,plotFile.length)+"\n Please report it!");
			else
				printPlot(i);
		} catch(err) // If there's an error try to bear it XD
		{
			printPlot(i);
		}
		
	}

	function prev() // Go to previous line
	{
		if(chapter==0)
			return;
			
		if(u.v["^"]=="done" && i-1 <= u.v["^^"])
			return;
			
		if(i>0)
		{
			i-=2;
			if(plotFile[i+1].charAt(0)!="[")
				step();
			else {
				i--;
				step();
			}
		}
	}
	
	function start() // Start [menu & final initiation]
	{
		var v = getCookie("vars");
		if(v) {
			u.v = $.parseJSON(v);
			u.v["^^"] = 0;
		}
		var mainDiv = u.get("mainDiv"); // Get the main div
		// Set the log div:
		var logDiv = u.createElement("div","logDiv");
		logDiv.style.position = "absolute";
		logDiv.style.bottom = "45px";
		logDiv.style.right = "10%";
		logDiv.style.fontSize = "25px";
		logDiv.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
		logDiv.style.dir = "ltr";
		logDiv.setAttribute("unselectable","on");
		logDiv.style.zIndex = "99"; 
		
		var nameDiv = u.createElement("div","nameDiv");
		nameDiv.style.position = "absolute";
		nameDiv.style.bottom = "70px";
		nameDiv.style.right = "5%";
		nameDiv.style.fontSize = "30px";
		nameDiv.style.dir = "ltr";
		nameDiv.setAttribute("unselectable","on");
		nameDiv.style.color = "#3366FF";
		
		if(chapter)
		{	
			plotFile = u.loadFile("CHAPTERS/"+chapter+".html","text"); // Load chapter plot
			mainDiv.innerHTML = "<h2 unselectable='on'>Chapter "+chapter+"</h2>";
			printPlot(0);
		}
		
		if(getQueryVariable('l').replace("#","")==1)
			load();
	}
	
	function playSound(sound)
	{
		u.get("player").src="SOUNDS/"+sound;
	}
	
	// ----------------------------INIT FUNCTIONS
	
	function resizeMenu()
	{
		bottomDiv.innerHTML = "<a href='#' id='up'> < </a>&nbsp;<a href='#' id='down'> > </a>&nbsp;<a href='#' id='backwards'> << </a>&nbsp;<a href='#' id='forwards'> >> </a> &nbsp;&nbsp;&nbsp;<a href='#' id = 'save'>| Save </a>&nbsp;<a href='#' id = 'load'>| Load </a>&nbsp;<a href='index.html'>| Main Menu</a>";
	}
	
	function init() // Initialize engine
	{
		jQuery.ajaxSetup({async:false}); // AJAX SETTINGS
		u.setBGColor("black"); // BACKGROUND COLORS
		// SET IMPORTANT DIVS:
		var mainDiv = u.createElement("div","mainDiv");
		mainDiv.innerHTML = "Loading...";
		menuFile = u.loadFile("menu.html","html");
		mainDiv.innerHTML = menuFile;
		var bottomDiv = u.createElement("div","bottomDiv");
		bottomDiv.style.backgroundColor="#404040";
		// Set the event listeners:
		document.addEventListener("click",mouse);
		document.addEventListener("keydown",keyboard);
		window.addEventListener("resize", resizeMenu);
		
		resizeMenu(); // Set Menu

		//GET CHAPTER:
		chapter = getQueryVariable('c').replace("#","");
		if(chapter.length!=0)
			start(); // START THE ENGINE!!!
		else
			;//playSound("Your Sound.mp3");
	}

}

////////////////////////////////////MAIN////////////////////////////////////

var E; // Our engine object

$(function() {
// Document is ready
	E = new engine();
});

