window.addEventListener('DOMContentLoaded', function() {

    // We'll ask the browser to use strict code to help us catch errors earlier.
    // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';


    // We want to wait until the localisations library has loaded all the strings.
    // So we'll tell it to let us know once it's ready.
    navigator.mozL10n.once(start);

    // ---

    var deleteAll = document.getElementById("deleteAll");
    deleteAll.addEventListener("click", function(){
        generator.deleteAll();

    });


    function start() {
        generator.showResults();

    }

});



