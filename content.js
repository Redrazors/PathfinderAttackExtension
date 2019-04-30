

var npcName = document.title.replace(' – d20PFSRD','');

chrome.runtime.onMessage.addListener(function (msg) {	

	if (msg.command==='addButtons' && window.location.href.includes('d20pfsrd.com/bestiary/monster-listings/')){

		console.log("ADDING OUTPUT DIV");

		var outputDiv = document.createElement( 'div' );
		document.body.insertBefore(outputDiv, document.body.firstChild);

        outputDiv.setAttribute('id', 'outputDiv');
        
		console.log("ADDING BUTTONS");


		// this inserts out inject.js file into the d20pfsrd page so that our buttons work.
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('inject.js');
		s.onload = function() {
			this.remove();
		};
		(document.head || document.documentElement).appendChild(s);


        
        var statblock;
		if (document.getElementsByClassName('statblock').length>0){
			//console.log("found stat block");
			statBlock = document.getElementsByClassName('statblock')[0];
			//console.log(document.getElementsByClassName('statblock')[0]);
			var check = document.getElementsByClassName('statblock')[0];
			statblock = check;
			//console.log(statblock);
		} else if (document.getElementsByClassName('article-content').length>0){
			statBlock = document.getElementsByClassName('article-content')[0].children[2];
		}

		// weird span fix
		if (statblock.outerHTML.includes('<span>Melee</span>') && statblock.outerHTML.includes('<span>Init</span>')){
			console.log(statblock.innerHTML);
			statblock.innerHTML = fixWeirdSpan(statblock.innerHTML);
			//statblock = statblock.firstChild;
		}
		

		for (var i=0; i<statBlock.children.length; i++){
			var childHTML = statBlock.children[i];
			var childString = childHTML.outerHTML;

			//console.log("CHILD STRING "+childString);
			if ( (childString.includes('<b>Spd</b>') || childString.includes('<b>Speed</b>')) && (childString.includes('<b>Melee</b>') || childString.includes('<b>Ranged</b>')) ){
				childHTML.outerHTML = getOffenseWithButtons(childString);
			}
		}


	} 
	
});



function getOffenseWithButtons(childString){
	if (childString.includes('<b>Melee</b>')){
        console.log("ADDING MELEE");
		childString = getMeleeButtons(childString);
	}
	if (childString.includes('<b>Ranged</b>')){
		childString = getRangedButtons(childString);
	}
	return childString;
}




function getMeleeButtons(childString){

	var newLine = childString.split('<b>Melee</b>')[1];
	newLine = newLine.split('<br>')[0];
	var originalLine = newLine;

    // square brackets fit
    var squareBracketsReplace = '';
    if (newLine.includes('[') && newLine.includes(']')){
        squareBracketsReplace = newLine.substring(newLine.lastIndexOf("[") , newLine.lastIndexOf("]")+1);
        newLine = newLine.replace(squareBracketsReplace, 'SBRTEXT');
    }
    newLine = newLine.replace(new RegExp('&nbsp;', 'g'), ' ');
    newLine = newLine.replace('Melee ' , '');
    newLine = newLine.replace('(touch) ' , 'touch ');

    // space start fix
    if (newLine.charAt(0)===' '){
        newLine = newLine.substring(1, newLine.length);
    }
     // space start fix
     if (newLine.charAt(0)==='&'){
        newLine = newLine.substring(7, newLine.length);
    }
    // weapon enhancement name fix
    if (newLine.charAt(0)==='+'){
        newLine = newLine.substring(3, newLine.length);
    }

	var orSplit = newLine.split(' or ');
	for (var j=0; j<orSplit.length; j++){
		var split = orSplit[j].split(', ');
		for (var i=0; i<split.length; i++){
			//console.log(split[i]);
	
			newLine = newLine.replace(split[i], getAttackButton(split[i]));
	
		}	
	}
    
    if (squareBracketsReplace.length>0){
        newLine = newLine.replace('SBRTEXT', squareBracketsReplace);
    }


	newLine = '&nbsp;'+newLine;
    return childString.replace(originalLine, newLine);
}

function getRangedButtons(childString){
	var newLine = childString.split('<b>Ranged</b>')[1];
	newLine = newLine.split('<br>')[0];
	var originalLine = newLine;

	// square brackets fit
    var squareBracketsReplace = '';
    if (newLine.includes('[') && newLine.includes(']')){
        squareBracketsReplace = newLine.substring(newLine.lastIndexOf("[") , newLine.lastIndexOf("]")+1);
        newLine = newLine.replace(squareBracketsReplace, 'SBRTEXT');

    }

    newLine = newLine.replace(new RegExp('&nbsp;', 'g'), ' ');
    newLine = newLine.replace('Ranged ' , '');
    newLine = newLine.replace('(ranged touch) ' , 'ranged touch ');
    var split = newLine.split(', ');
    for (var i=0; i<split.length; i++){
        newLine = newLine.replace(split[i], getAttackButton(split[i]));
    }

    if (squareBracketsReplace.length>0){
        newLine = newLine.replace('SBRTEXT', squareBracketsReplace);
    }

	newLine = '&nbsp;'+newLine;
    return childString.replace(originalLine, newLine);
}

function getAttackButton(text){
    try {
		var numExtraAttacks=0;
		text = strip_tags(text);
		text = text.replace(new RegExp('×', 'g'), 'x');
		text = text.replace(new RegExp('–', 'g'), '-');

        //console.log("attack text:"+text);
        var weaponSplit = text.split(" (");
        var weaponName = weaponSplit[0];  // 2 claws +6 

		console.log("WEAPON NAME: "+weaponName);

		weaponName = weaponName.trim();
		if (weaponName.substring(0, 4)==='Huge'){
			weaponName = weaponName.substring(5, weaponName.length);
		}

		console.log("new WEAPON NAME: "+weaponName);

		// get rid of +4 weapons
		if (weaponName.charAt(0)==='+'){
			// rip out the first 2 characters
			weaponName = weaponName.substring(2, weaponName.length);
		}
        var bonus=0;
        if (weaponName.includes('+')){

			//console.log("found plus "+weaponName);
            if (weaponName.includes('/')){

				//console.log("found slash "+weaponName);
				var toClean = weaponName.split('/'); 
				numExtraAttacks = toClean.length-1;
				//console.log("to clean 0 "+toClean[0]);
				bonus = +toClean[0].split('+')[1];

				console.log("attacks: "+toClean.length);
            } else {
                bonus = +weaponName.split('+')[1];
            }


        } else if (weaponName.includes('-')){

            console.log("splitting by -");
            bonus = -weaponName.split('-')[1];
        }

        // parse damage
        var numDice =1;
        var diceType=20;
        var damageBonus=0;
        var critical=20;
        var critMulti=2;

        var detailSplit = weaponSplit[1];
        //console.log(detailSplit);
        var damage = detailSplit.split('/');
        var diceSplit = damage[0].split('d');

        // check for critical details
        if (damage.length>1){
            var critString = damage[1];
            if (damage[1].includes('x')){

                console.log("damage 1 :@ "+damage[1]);
                var critSplit = damage[1].split('x');
                if (critSplit[0].length>0){
					var cleaned = critSplit[0].replace(/[^0-9\-]/g,'');
                    critical = cleaned.split('-')[0];        
                }
                if (critSplit.length>1){
					critMulti = critSplit[1].replace(/[^0-9\-]/g,''); 
                }

            } else {
                var cleaned = damage[1].replace(/[^0-9\-]/g,'');
                critical = cleaned.split('-')[0];
            }
            
		}
		
		console.log("critical: "+critical);

        var numDice = +diceSplit[0];
		var bonusSplit = diceSplit[1].split(' ')[0]; // cut space and righ,t incase there is 1d4 con etc
		
        var diceAndBonus = bonusSplit.replace(/[^0-9\-+]/g,'');

        var modSplit;
        if (diceAndBonus.includes('-')){
            modSplit = diceAndBonus.split('-');

            if (modSplit.length>1){
                var cleaned = modSplit[1].replace(/[^0-9\-]/g,'');
                if (cleaned.length>0){
                    damageBonus = -cleaned;
                }
            }

        } else {
            modSplit = diceAndBonus.split('+');

            if (modSplit.length>1){
                var cleaned = modSplit[1].replace(/[^0-9\-]/g,'');
                if (cleaned.length>0){
                    damageBonus = cleaned;
                }
            }
        }
        
        diceType = modSplit[0];

        
		return '<button class="quickButton" onClick="rollAttack(\''+npcName+'\',\''+weaponName+'\','+bonus+','+numDice+','+diceType+','
		+damageBonus+','+critical+','+critMulti+')">'+text+'</button>';
    } catch(err) {
        console.log("Caught Error: "+err);
        return text;
	}
}

function fixWeirdSpan(statBlockString){
	console.log("fixing weird spans");

	statBlockString = statBlockString.replace(new RegExp('<span>', 'g'), '');
	statBlockString = statBlockString.replace(new RegExp('</span>', 'g'), '');
	statBlockString = statBlockString.replace(new RegExp(' rel="nofollow"', 'g'), '');

	return statBlockString;
}

function strip_tags( _html /*you can put each single tag per argument*/ ){
    var _tags = [], _tag = "" ;
    for( var _a = 1 ; _a < arguments.length ; _a++ ){
        _tag = arguments[_a].replace( /<|>/g, '' ).trim() ;
        if ( arguments[_a].length > 0 ) _tags.push( _tag, "/"+_tag );
    }

    if ( !( typeof _html == "string" ) && !( _html instanceof String ) ) return "" ;
    else if ( _tags.length == 0 ) return _html.replace( /<(\s*\/?)[^>]+>/g, "" ) ;
    else {
        var _re = new RegExp( "<(?!("+_tags.join("|")+")\s*\/?)[^>]+>", "g" );
        return _html.replace( _re, '' );
    }
}

document.addEventListener('settingsEvent', function(data) {
    chrome.runtime.sendMessage(data.detail);
});

