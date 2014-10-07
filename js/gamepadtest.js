/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  console.log("controller" + gamepad.index);
  var t = document.createElement("h2");
  t.appendChild(document.createTextNode("Gamepad: " + gamepad.id));
  d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("progress");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("max", "2");
    e.setAttribute("value", "1");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.getElementById("start").style.display = "none";
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
		//console.log(pressed, val)
      }
      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      if (pressed) {
        b.className = "button pressed";
		//console.log(b)
      } else {
        b.className = "button";
      }
    }


    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
	  
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i] + 1);
	  //console.log( controller.axes[i] )
	  
	  // PANNING
	  
	  
	  // Left =  [0] 1 // Right = [0] -1
	  // Down = [1] 1 // Top = [1] -1
	         if (controller.axes[0] > 0.90 ) { map.panRight()  }
	  else if (controller.axes[0] <  -0.90 ) { map.panLeft()  }
	  else if (controller.axes[1] > 0.90) { map.panDown() }
	  else if (controller.axes[1] < -0.90 ) { map.panUp() }
	  
	  //Upper Right 
	   else if ( ( controller.axes[0] >= 0.50 && controller.axes[0] <= 0.89 ) && ( controller.axes[1] <= -0.50 && controller.axes[1] >= -0.89 )  ) { map.panUpperRight()  }
	   //Upper Left
	   else if ( ( controller.axes[0] <= -0.60 && controller.axes[0] >= -0.89 ) && ( controller.axes[1] <= -0.60 && controller.axes[1] >= -0.89 )  ) { map.panUpperLeft()  }
	   else if ( ( controller.axes[0] >= 0.60 && controller.axes[0] <= 0.89 ) && ( controller.axes[1] >= 0.60 && controller.axes[1] <= 0.89 )  ) { map.panLowerRight()  }
	   else if ( ( controller.axes[0] <= -0.60 && controller.axes[0] >= -0.89 ) && ( controller.axes[1] >= 0.60 && controller.axes[1] <= 0.89 )  ) { map.panLowerLeft()  }
	  
	  
		// LOOP OCCURS TO FAST, NEED SOME SORT OF TIME BUFFER TO PREVENT SUPER FAST ZOOMING
		// ZOOM
		//console.log(map.getZoom()	);
		//console.log(zoomMax, zoomMin);
		
		
		if (controller.axes[3] > 0.8) { 
			if (zoomBuffer > zoomMin) {
				zoomBuffer -= 0.1; 
				zoomBuffer = +zoomBuffer.toFixed(1)
				console.log(zoomBuffer);
				if (+zoomBuffer % 1 === 0 ) {
					console.log(zoomBuffer);
					zoomLevel = zoomBuffer
					map.setZoom(zoomLevel) 
				}
			}
		}
		else if (controller.axes[3] < -0.8) {
			if (zoomBuffer < zoomMax) {
				zoomBuffer += 0.1; 
				zoomBuffer = +zoomBuffer.toFixed(1)
				console.log(zoomBuffer);
				if (+zoomBuffer % 1 === 0) {
					console.log(zoomBuffer);
					zoomLevel = zoomBuffer
					map.setZoom(zoomLevel) 
				}
			}
	 
		}
	}
  rAF(updateStatus);
 }
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
