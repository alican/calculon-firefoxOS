window.addEventListener('DOMContentLoaded', function() {

    // We'll ask the browser to use strict code to help us catch errors earlier.
    // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';


    // We want to wait until the localisations library has loaded all the strings.
    // So we'll tell it to let us know once it's ready.
    navigator.mozL10n.once(start);

    // ---



    function start() {

        generator.newQuestion();


        var enter = document.getElementById('enter');
        var input = document.getElementById('input');


        enter.addEventListener("click", function(){

            if (input.value.length > 0){
                generator.validateAnswer();
                generator.save();
                generator.newQuestion();
            }

        });

        rechnung.addEventListener("click", function(){
            generator.newQuestion();
        });

        // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
        // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations

    }

});



