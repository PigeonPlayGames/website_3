'use strict';

///////////////////////////////////////////////////////////////////////////////
// Input Configuration
const enableGamepads = 1;
const enableTouchInput = 1; // Enable touch input handling
const copyGamepadDirectionToStick = 0;
const copyWASDToDpad = 1;

// Input Data Initialization
const inputData = [[]];
const keyIsDown = (key, device = 0) => inputData[device][key] && inputData[device][key].d ? 1 : 0;
const keyWasPressed = (key, device = 0) => inputData[device][key] && inputData[device][key].p ? 1 : 0;
const keyWasReleased = (key, device = 0) => inputData[device][key] && inputData[device][key].r ? 1 : 0;
const clearInput = () => inputData[0].length = 0;

// Mouse and Touch Input Variables
let hadInput = 0;
let mouseWheel = 0;
let mousePosScreen = vec2();
let mousePosWorld = vec2();

// Mouse Input Handlers
document.onkeydown = e => {
    if (debug && e.target !== document.body) return;
    e.repeat || (inputData[isUsingGamepad = 0][remapKeyCode(e.keyCode)] = {d: hadInput = 1, p: 1});
};
document.onkeyup = e => {
    if (debug && e.target !== document.body) return;
    const c = remapKeyCode(e.keyCode); inputData[0][c] && (inputData[0][c].d = 0, inputData[0][c].r = 1);
};
document.onmousedown = e => (inputData[0][e.button] = {d: hadInput = 1, p: 1}, document.onmousemove(e));
document.onmouseup = e => inputData[0][e.button] && (inputData[0][e.button].d = 0, inputData[0][e.button].r = 1);
document.onmousemove = e => {
    const rect = mainCanvas.getBoundingClientRect();
    mousePosScreen.x = mainCanvasSize.x * (e.clientX - rect.left) / rect.width;
    mousePosScreen.y = mainCanvasSize.y * (e.clientY - rect.top) / rect.height;
};
if (debug) document.onwheel = e => e.ctrlKey || (mouseWheel = Math.sign(e.deltaY));
document.oncontextmenu = e => false; // Prevent right-click menu

// Key Code Remapping
const remapKeyCode = c => copyWASDToDpad ? {'87': 38, '83': 40, '65': 37, '68': 39}[c] || c : c;

///////////////////////////////////////////////////////////////////////////////
// Touch Input Handling

if (enableTouchInput && window.ontouchstart !== undefined) {
    document.ontouchstart = document.ontouchmove = document.ontouchend = e => {
        const touchX = e.touches[0].clientX;
        const screenWidth = window.innerWidth;
        const touchZone = screenWidth / 2; // Left half for movement, right half for jump

        if (touchX < touchZone) {
            // Movement: Simulate right arrow key press
            simulateKeyPress('ArrowRight');
        } else {
            // Jump: Simulate spacebar press
            simulateKeyPress('Space');
        }
    };
}

// Simulate key press based on touch input
function simulateKeyPress(key) {
    console.log(`Simulated key press: ${key}`);
    // Here you should integrate the key simulation with your game's input handling
    // For example, updating `inputData` or directly triggering actions
}

///////////////////////////////////////////////////////////////////////////////
// Vector and Gamepad Utilities (Placeholder Implementations)

function vec2(x = 0, y = 0) {
    return { x, y, clampLength: function() { return this; } };
}

function percent(value, max, min) {
    return (value - min) / (max - min);
}

let mainCanvas = document.getElementById('mainCanvas'); // Ensure you have a canvas with this ID
let mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

let debug = false; // Set this based on your development needs

// Additional gamepad logic...



///////////////////////////////////////////////////////////////////////////////
// touch screen input

if (enableTouchInput && window.ontouchstart !== undefined)
{
    // handle all touch events the same way
    ontouchstart = ontouchmove = ontouchend = e=>
    {
        e.button = 0; // all touches are left click
        hadInput || zzfx(hadInput = 1) ; // fix mobile audio, force it to play a sound the first time

        // check if touching and pass to mouse events
        const touching = e.touches.length;
        if (touching)
        {
            // set event pos and pass it along
            e.x = e.touches[0].clientX;
            e.y = e.touches[0].clientY;
            wasTouching ? onmousemove(e) : onmousedown(e);
        }
        else if (wasTouching)
            wasTouching && onmouseup(e);

        // set was touching
        wasTouching = touching;
    }
    let wasTouching;
}

