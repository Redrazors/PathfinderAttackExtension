
// this inject.js gets injected into the d20pfsrd javascript, so that the buttons we created work.

function rollAttack(npcName, weaponName, attackModifier, numDice, diceType, damageBonus, critical, critMulti){

    // this is still the message format as used by roll20.  This would instead be the text output from the PathfinderAttackSimulator.

    var message = 'The output from the PathfinderAttackSimulator would go here.  {{character_name='+npcName+'}} {{name='+weaponName+'}} {{attack=[[1d20cs>'+critical+'+'+attackModifier+']]}}'
    +'{{damage=[['+numDice+'d'+diceType+'+'+damageBonus+']]}} {{crit_confirm=[[1d20+'+attackModifier+']]}}'
 
    // finds the div created in the content.js
    var outputDiv = document.getElementById('outputDiv');

    // creates a new div, which could be styled etc and appends it to the output div.
    var div = document.createElement( 'div' );
    var text = document.createTextNode(message);   
    div.appendChild(text);
    outputDiv.appendChild(div);  

}

