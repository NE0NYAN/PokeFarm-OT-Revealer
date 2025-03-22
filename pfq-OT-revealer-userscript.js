// ==UserScript==
// @name         PokéFarm Original Trainer Revealer
// @namespace    https://github.com/Vanyar92 & https://github.com/NE0NYAN
// @author       Vanyar & NE0NYAN
// @homepageURL  https://github.com/NE0NYAN/pfq-small-addons
// @downloadURL  https://raw.githubusercontent.com/NE0NYAN/pfq-small-addons/refs/heads/main/pfq-OT-revealer.js
// @updateURL    https://raw.githubusercontent.com/NE0NYAN/pfq-small-addons/refs/heads/main/pfq-OT-revealer.js
// @description  Adds the Original Trainer (OT) to a Pokémon's Summary Page
// @version      2.0.0
// @match        https://pokefarm.com/summary/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// ==/UserScript==

/* How to find the OT of a Pokemon:
- The first time they are traded, the SENDER is the OT.
- If they have not been traded, the HATCHER is the OT.
- If they are in the Shelter, they have NO OT.
*/

(function () {
    "use strict";
    // ---------------------------------------------------------------------------------------------------- //

    // Tell ESLint that jQuery's $ is defined elsewhere
    /* global $ */

    // Getting the OT
    const timelineEntries = $("#timeline").children('li');
    const pokemonSummaryTitle = $("#content > h1");
    let tradedEntries = [];
    let lastTraded = null;
    let hasOT = true;
    let linkToRead = null;
    let userName = null;

    // Iterate through each list item in the timeline and make a list of times the pokemon was traded
    $.each(timelineEntries, function (index, value) {
        let text = $(this).html();
        if (text.includes("Traded")) {
            tradedEntries.push("Timeline Entry " + index + ": " + text);
        }
    });

    // Check if Pokemon has an OT or not
   (tradedEntries.length == 0) ? hasOT = false  : hasOT = true;


    if (hasOT == true) {

        // Get the oldest entry where this pokemon was traded
        if (tradedEntries.length != 0) {
            lastTraded = tradedEntries[tradedEntries.length - 1];
        }

        // Get traded from username
        userName = (lastTraded.split(`from`).pop().split(`" class=`)[0]).split(`<a href="/user/`).pop().split(`" class=`)[0];
        console.log(userName);

    } else {
        // If the Pokemon has not been traded, use the link in the page's h1 element
        linkToRead = pokemonSummaryTitle.find("a").attr("href");
        userName = linkToRead.substring(linkToRead.lastIndexOf('/') + 1);
    }

    // ---------------------------------------------------------------------------------------------------- //

    // Insert OT into the box
    const insertLocation = $("#pkmnspecdata > p:contains('Parents')");
    const otText = `<p><b>Original Trainer:</b> <a href="/user/${userName}">${userName}</a></p>`;

    insertLocation.before(otText);

})();