// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded


var storage = new function localStore(){
    var self = this;

    this.deleteAll = function () {
        return new Promise(function(resolve, reject){
            localStorage.setItem('questionsArray', "[]");
            resolve();
        });


    };

    this.save = function (object) {

        var oldQuestions = JSON.parse(localStorage.getItem('questionsArray')) || [];
        oldQuestions.push(object);
        localStorage.setItem('questionsArray', JSON.stringify(oldQuestions));

    };

    this.getAll = function() {
        return new Promise(function(resolve, reject){
            self._getAll(resolve);
        });
    };

    this._getAll = function(resolve){
        var questions = JSON.parse(localStorage.getItem('questionsArray')) || [];
        var items = [];

        questions.forEach(function (item) {
           items.push(item);
        });
        resolve(items);
    }

};



var indexedDb = new function indexedDb() {

    var db = null;
    var self = this;

    this.do = function(object, callback) {
        var request = indexedDB.open('calculon', 1);

        request.onupgradeneeded = function () {
            console.log('Datenbank angelegt');
            db = this.result;
            if (!db.objectStoreNames.contains('questions')) {
                store = db.createObjectStore('questions', {
                    keyPath: 'key',
                    autoIncrement: true
                });
            }
        };
        request.onsuccess = function () {
            console.log('Datenbank geoeffnet');
            db = this.result;
            callback(object);
        }
    };


    this.deleteAll = function() {
        return new Promise(function(resolve, reject){
            self.do(resolve, self._deleteAll);
        });

    };

    this.save = function(object) {
        this.do(object, this._saveObject);
    };

    this.getAll = function() {
        return new Promise(function(resolve, reject){
            self.do(resolve, self._getAll);
        });
    };

    this._saveObject = function(object) {
        var trans = db.transaction(['questions'], 'readwrite');
        var store = trans.objectStore('questions');
        var request = store.put(object);

        request.onsuccess = function (evt) {
            console.log('Eintrag ' + evt.target.result + ' gespeichert');
        };
        trans.oncomplete = function (e){
            console.log('db close');
            db.close();

        }

    };

    this._deleteAll = function (resolve) {

        var trans = db.transaction(['questions'], 'readwrite');
        var store = trans.objectStore('questions');
        var request = store.clear();

        request.onsuccess = function(e){
            console.log('1 : Alle Eintraege wurden entfernt.');
        };
        trans.oncomplete = function(e){
            db.close();
            resolve();

        }


    };


    this._getAll = function(resolve){
        var trans = db.transaction(['questions']);
        var store = trans.objectStore('questions');
        var range = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(range);

        var items = [];
        cursorRequest.onsuccess = function (evt) {

            var result = evt.target.result;

            if (result) {
                console.log('Eintrag gefunden:', result.value);
                items.push(result.value);
                result.continue();
            }else{
                resolve(items);
            }
        };

        trans.oncomplete = function (e){
            console.log('db close');
            db.close();
        }
    }
};




var generator = new function Calculon() {

    var db = storage;
    var self = this;


    this.question = [];

    this.gen = function () {
        var valueX = Math.floor((Math.random() * 100) + 1);
        var valueY = Math.floor((Math.random() * 100) + 1);
        var q = valueX + " + " + valueY;
        var r = valueX + valueY;
        this.question = new Question(q, r);
        return this.question;
    };

    this.validateAnswer = function () {
        var input = document.getElementById('input');
        this.question.answer = input.value;
        if (this.question.answer == this.question.result) {

        }
    };

    this.deleteAll = function () {
        var p = db.deleteAll();
        p.then(function(){
            console.log('then');

            self.showResults();
        })
    };


    this.showResults = function () {

        var container = document.getElementById('result_container');
        var stats = document.getElementById("stats");

        var richtige = 0;
        var falsche = 0;

        console.log('show');


        var p = db.getAll();
        p.then(
            function(questions){
                // this.showStats();
                console.log(questions.length);
                if (questions.length == 0){
                    container.innerHTML = "<p> Keine Eintraege vorhanden </p>"

                }else{

                questions.forEach(function (item) {
                    var node = document.createElement("p");
                    if (item.result == item.answer) {
                        node.className = "richtig";
                        richtige++;

                    } else {
                        node.className = "falsch";
                        falsche++;

                    }
                    node.innerHTML = item.question + " = " + item.result + " <br> Deine Eingabe: " + item.answer;
                    container.appendChild(node);
                    stats.innerHTML = "<p>Richtige: " + richtige + "<br> Falsche: " + falsche + "</p>";

                })

                }

            }, function(reason) {
                console.log(reason); // Error!
            });
    };


    this.newQuestion = function () {
        var rechnung = document.getElementById('rechnung');
        var input = document.getElementById('input');
        rechnung.textContent = generator.gen().question + " = ?";
        input.value = "";
    };

    this.save = function () {
        db.save(this.question);
    };

};

function Question(question, result) {
    this.question = question;
    this.result = result;
    this.answer = 0;
}