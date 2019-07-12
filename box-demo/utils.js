var last_id;

var aplayers;
	
audiojs.events.ready(function() {
	aplayers = audiojs.createAll({		/*loop: "loop",*/		autoplay:true,		autoload:"none"		});
});

//////////////////UTILITIES//////////////////

// String 'replaceall' prototype function 

String.prototype.replaceAll = function(find,replace)
{
	return this.replace(new RegExp(find,"g"),replace);
};

function getQueryVariable(variable) // GET method using URL
{
    var str = window.location.toString();
	var i = str.lastIndexOf("?");
	if(i == -1)
		i = str.length;
	else
		i++;
    var res = str.substring(i,str.length); // X=1&Y=2&...
	var res2 = res.split("&");
	for(var g = 0; g <res2.length; g++)
	{
		var pairs = res2[g].split('=');
		if(pairs[0] == variable)
			return pairs[1];
	}
	return "";
}

/*function stringify(obj) {
    var tabjson=[];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            tabjson.push('"'+p +'"'+ ':' + '\"'+obj[p]+'\"');
        }
    }
    return "{"+tabjson.join(',')+"}";
}*/

function clickedUI(e) // Switch element src when clicked
{
	e.src = "UI/clicked/"+e.id+".png";
}

function normalUI(e)
{
	e.src = "UI/normal/"+e.id+".png";
}

// ----------------------------COOKIES RELATED[TNX W3Schools]
function setCookie(cname,cvalue) {
   		var d = new Date();
   		d.setTime(d.getTime() + (50000*24*60*60*1000));
   		var expires = "expires=" + d.toGMTString();
   		document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
   		var name = cname + "=";
   		var ca = document.cookie.split(';');
		
   		for(var i=0; i<ca.length; i++) {
   	  		var c = ca[i];
   	  		while (c.charAt(0)==' ') c = c.substring(1);
   	  		if (c.indexOf(name) != -1) {
   	      			return c.substring(name.length, c.length);
   	  		}
  		}
		return "";
	}

	