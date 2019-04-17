# PathfinderAttackExtension
Sample chrome extension for d20pfsrd

<b>To install</b>
Clone or download the repo</br>
open chrome, navigate to chrome://extensions/</br>
Check "developer mode" to on at the top right.</br>
Click load unpacked and select the folder containing the extension.</br>

<b>Usage</b></br>
Go to a d20pfsrd monster listing page https://www.d20pfsrd.com/bestiary/</br>
Select a monster.  After it finishes loading a red output box should appear at the top, and the attack details should turn into buttons. </br>Clicking the button outputs to the red output box.</br>

<h2>Explanation</h2>

<b>background.js</b>
This runs in the background, watching for when d20pfsrd has finished loading a page.  If the setting for run of d20pfsrd is selected, then it sends a message to the tab telling it to load the extension.

<b>content.js</b>
This contains the bulk of the code for the extension.  It listens for the command from background.js to run, and makes sure it is on a valid d20pfsrd page.  It then creates an output div and changes the normal statblock melee/ranged text for altered text surrounded by a <button> tag. The button calls rollAttack() when clicked.

<b>inject.js</b>
This contains the rollAttack() method which is injected into the page's javascript, so that the buttons work.


<b>inject.css</b>
This contains the styling information for the buttons and divs that are injected onto the page.

<b>manifest.json</b>
The info required by chrome for the extension, permissions etc.

<b>popup.html</b>
This is the html for the little popup window when you click on the extension icon (little d20 to the right of the address bar). Gives an option to enable or disable on d20pfsrd.

<b>popup.js</b>
Javascript code for the popup, to store settings.

<h2>Notes</h2>

At the point when the buttons are created in the content.js there will probably need to be some sort of interface with the f# PathfinderAttackSimulator library. That information would then need to be passed through to the rollAttack() parameters.


