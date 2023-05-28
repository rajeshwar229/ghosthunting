/********* START OF SCRIPT *********/

$(function(){
    
    //This is only for storing static and dynamic UI Elements
    const UIController = (() => {
        
        //Add static UI Elements here
        const DOMElements = {
            documentEle : $(document),
            bodyEle : $('body'),
            // Page blocks
            gameEle : $('.game'),
            resultEle : $('.result'),

            // Form elements
            formElement : $('.setup form.setup-form'),
            yourName : $('.setup form.setup-form #your-name'),
            yourNum : $('.setup form.setup-form #your-num'),
            limitNum : $('.setup form.setup-form #limit-num'),
            darkMode : $('#dark-mode'),
            allFormElements : $('.setup form.setup-form input, .setup form.setup-form select'),

            // Buttons
            allButtons : $('button'),
            startGame : $('.setup .start-game-btn'),
            resetForm : $('.setup .reset-form-btn'),
            mainMenu : $('.main-menu-btn'),
            gameStatsBtn : $('.game-stats-btn'),

            // Text elements
            gameNumbers : $('.game .game-numbers'),
            showNumber : $('.game .show-num'),
            resultText : $('.result .result-text'),
            overlayNumbers : $('.game .overlay-numbers'),
            headerText : $('.main .header'),

            // Statstics elements
            gamesPlayed : $('.statistics .games-played'),
            gamesWon : $('.statistics .games-won'),
            gamesLost : $('.statistics .games-lost'),
            gamesDrawn : $('.statistics .games-drawn'),

            //Dynamically added UI Elements should be handled as functions
            newNumber : function() {
                return $('.game .game-numbers .new-num');
            },
            newNumberData : function(num) {
                return $(`.game .game-numbers .new-num:eq(${num})`);
            },
            numberHighlight : function() {
                return $('.game .game-numbers .num.number-highlight');
            },
        };

        // Return the DOMElements object to be used by controller function
        return {
            getDOMElements : () => DOMElements
        }
    })();

    // This is only for UI manipulation
    const gameController = (() => {

        return {
            // This will generate numbers from 10-40 range based on user selection
            generateNums : function (container, limitNum) {
                for(let i=1; i <= limitNum.val(); i++){
                    container.append(`<li class="d-inline-block">
                    <button class="num new-num btn btn-dark font-weight-bold btn-lg m-3">${i}</button></li>`);
                }
                return this;
            },

            // This will add html content to the element passed
            addContent : function (ele, content) {
                ele.html(content);
                return this;
            },

            // Empty the content for element passed
            emptyEle : function (ele) {
                ele.html('');
                return this;
            },

            //Add or remove the class for ele element. If there is no class to add, pass "addcls" as false
            addRemoveCls : function (ele, addcls, removecls){
                addcls && $(ele).addClass(addcls);
                removecls && $(ele).removeClass(removecls);
                return this;
            },

            // Change attribute value for an element
            attrChange : function (ele, atrname, atrval) {
                ele.prop(atrname, atrval);
                return this;
            },

            // Returns parent/s element for an element
            returnParent : function (ele, data) {
                if(data) {
                    return $(ele.parents(`.${data}`));
                }
                return $(ele.parent());
            },

            // Returns parent/s sibling element for an element
            returnParentSibling : function (ele, parent, sibling) {
                if(parent && sibling) {
                    return $(ele.parents(`.${parent}`).siblings(`.${sibling}`));
                }
            },

            // Add focus to the element
            addFocus : function (ele) {
                ele.focus();
                return this;
            },

            // Triggers the event to element
            triggerEvent : function (ele, action) {
                ele.trigger(action);
                return this;
            },

            // Add passed css json object for the element
            addCSS : function (ele, css) {
                const cssObj = JSON.parse(css);
                ele.css(cssObj);
            }
        }
    })();

    // GLOBAL APP CONTROLLER
    const controller = ((gameCtrl, UICtrl) => {

        // Storing DOM elements
        const DOM = UICtrl.getDOMElements();

        // Setting initial values for gameObj, which will be created by gameObject class, once game is started
        const gameObj = {
            start : null,
            over : false
        };

        // game object class
        class gameObject {
            constructor() {
                
                // Random Number Generator with limit and rounding(floor/ceil/round)
                this.randomGenerator = function (limit, rounding) {
                    return rounding((Math.random())*(limit));
                }

                // This is system guess number.
                this.systemNumber = this.randomGenerator(DOM.limitNum.val(), Math.ceil);

                //localstorage method
                this.gameLocalStorage = function(key) {
                    localStorage && localStorage[key] ? localStorage[key] = +localStorage[key]+1 : localStorage[key] = "1";
                }

                // Will check if system number or player number is equal to target number, and end the game and show results
                this.checkNumber = function (targetNumber, yourNumber) {
                    if (this.systemNumber === targetNumber || yourNumber === targetNumber) {
                        
                        console.info('%cGAME OVER', "color: black; font-weight: bold; background-color: rgba(255,0,0,0.5);padding: 2px");
                        // Setting gameover to true, which is used to stop system guess
                        gameObj.over = true;

                        // Hide game page and show results page
                        gameCtrl.addRemoveCls(DOM.gameEle, 'd-none', 'd-block')
                                .addRemoveCls(DOM.resultEle, 'd-block', 'd-none');

                        // Both system and player guess is same
                        if(this.systemNumber === yourNumber){
                            gameCtrl.addContent(DOM.resultText, `<p>Seriously 🙄? You both guys didn't had any other number to choose😲?</p><p> Your Number and System Number is ${this.systemNumber}</p>`);
                            // Number of games drawn
                            this.gameLocalStorage('gamesDrawn');
                        }

                        // Player Won
                        else if(this.systemNumber === targetNumber){
                            gameCtrl.addContent(DOM.resultText, `<p>${DOM.yourName.val()} Won the game 😀!!</p><p>Your Number : ${yourNumber}</p><p>System Number : ${this.systemNumber}</p>`);
                            // Number of games won
                            this.gameLocalStorage('gamesWon');
                        }

                        // System Won, either system guessed it, or player accidentally selected his number.
                        else {
                            gameCtrl.addContent(DOM.resultText, `<p>System Won the game ☹ </p><p>Your Number : ${yourNumber}</p><p>System Number : ${this.systemNumber}</p>`);
                            // Number of games lost
                            this.gameLocalStorage('gamesLost');
                        }

                        // Number of games played
                        this.gameLocalStorage('gamesPlayed');
                        
                    }
                };

                // Most of the game logic
                this.gameTurn = function (systemTurn) {

                    // systemTurn will be passed true for system turn
                    let newNumData;
                    if (systemTurn) {
                        // Storing system guess element, so we don't need to call it again.
                        newNumData = this.systemGuess();
                    }

                    // To remove highlight on previous number
                    gameCtrl.addRemoveCls(DOM.numberHighlight(), '', 'number-highlight');

                    // Storing target element either by system or player
                    const targetNumber = systemTurn ? newNumData : event.target;

                    // removing new-num and adding old-num classes for the guessed number.
                    gameCtrl.addRemoveCls($(targetNumber), 'old-num dim-out number-highlight', 'new-num')
                            .attrChange($(targetNumber), 'disabled', false);

                    // executing check number for result
                    this.checkNumber(systemTurn ? parseInt(newNumData[0].innerText) : parseInt(event.target.innerText), parseInt(DOM.yourNum.val()));
                    return this;
                }

                /* This will generate a random system guess of player number,
                which should not be same as original system guess number(this.systemNumber) */
                this.systemGuess = function () {
                    let systemGuessNumber;
                    const newNum = DOM.newNumber();
                    
                    do {
                        systemGuessNumber = this.randomGenerator(newNum.length, Math.floor);
                    // if only number is remaining, then both player and system guess is same number
                    } while (newNum.length > 1 && parseInt(DOM.newNumberData(systemGuessNumber)[0].innerText) === this.systemNumber);

                    // Returning system guess elements
                    return DOM.newNumberData(systemGuessNumber);

                }
            }
        }

        // This functions is for all User interactions events
        const setupEvents = () => {
            
            // Hide current page and show specific page for all buttons
            DOM.allButtons.on('click', function(event) {
                event.preventDefault();

                if( this.dataset.parent && this.dataset.show ) {
                    gameCtrl.addRemoveCls(gameCtrl.returnParentSibling($(this), this.dataset.parent, this.dataset.show), 'd-block', 'd-none')
                            .addRemoveCls(gameCtrl.returnParent($(this), this.dataset.parent), 'd-none', 'd-block');
                }
                
            });
            
            // Max value of user number should be max value of total numbers
            DOM.limitNum.on('change', ()=> {
                gameCtrl.attrChange(DOM.yourNum ,'max', DOM.limitNum.val());
            });

            // Once game is started, will generate numbers and show users number, so he don't need to remember it.
            DOM.startGame.on('click', () => {
                console.info('%cGAME STARTED', "color: white; font-weight: bold; background-color: rgba(0,0,0,0.5);padding: 2px");
                gameCtrl.generateNums(DOM.gameNumbers, DOM.limitNum)
                        .addContent(DOM.showNumber, `Your Number is : ${DOM.yourNum.val()}`);
            });

            // This will end game and return to main menu
            DOM.mainMenu.on('click', function() {
                gameCtrl.emptyEle(DOM.gameNumbers)
                        .addRemoveCls(DOM.overlayNumbers, 'd-none', 'd-block')
                        .attrChange(DOM.startGame, 'disabled', true)
                        .addRemoveCls(DOM.startGame, 'dim-out')
                        .triggerEvent(DOM.resetForm, 'click');
                
                // Setting back the gameObj to original values
                gameObj.start = null;
                gameObj.over = false;
            });

            // This will trigger the game turn logic on each click of number
            DOM.documentEle.on('click', '.game .game-numbers .new-num' , () => {

                // Creating gameObject in gameObj.start only once a number is clicked and if it is not null
                gameObj.start = gameObj.start || new gameObject();

                // overlay to prevent player from clicking multiple times
                gameCtrl.addRemoveCls(DOM.overlayNumbers, 'd-block', 'd-none');
                gameCtrl.addCSS(DOM.overlayNumbers, `{
                    "height": ${DOM.gameNumbers.height()},
                    "width": ${DOM.gameNumbers.width()},
                    "top": ${DOM.gameNumbers.position().top}
                }`);
                // Will not pass any parameter for players guess
                gameObj.start.gameTurn();

                // if game is not over, system will keep guessing.
                if(!gameObj.over){
                    setTimeout(function() {
                        gameObj.start.gameTurn(true); // Pass true as parameter which is systemTurn argument.
                        gameCtrl.addRemoveCls(DOM.overlayNumbers, 'd-none', 'd-block'); // Remove overlay once system guessed
                    },2000); // 2s time to show system guess number.
                }
            });

            //Updating game statstics in page
            DOM.gameStatsBtn.on('click', () => {
                gameCtrl.addContent(DOM.gamesPlayed, localStorage['gamesPlayed'])
                        .addContent(DOM.gamesWon, localStorage['gamesWon'])
                        .addContent(DOM.gamesLost, localStorage['gamesLost'])
                        .addContent(DOM.gamesDrawn, localStorage['gamesDrawn']);
            })

            //Enable start game button only if form is valid
            DOM.allFormElements.on('keyup blur', function() {
                DOM.formElement.valid() ? gameCtrl.attrChange(DOM.startGame, 'disabled', false).addRemoveCls(DOM.startGame, '', 'dim-out') : gameCtrl.attrChange(DOM.startGame, 'disabled', true).addRemoveCls(DOM.startGame, 'dim-out');
            });

            // Dark mode 
            DOM.darkMode.on('change', () => {
                if(this.activeElement.checked) {
                    gameCtrl.addRemoveCls(DOM.bodyEle, 'bg-dark dark-mode', 'bg-light');
                }
                else {
                    gameCtrl.addRemoveCls(DOM.bodyEle, 'bg-light', 'bg-dark dark-mode');
                }
            });

        };
        
        // returning only init function
        return {
            init: () => {
                console.info('Welcome to %cGUESS MY NUMBER', "color: yellow; font-weight: bold; background-color: blue;padding: 2px");
                setupEvents();
            }
        }
    })(gameController, UIController);

    // init function triggers setupEvents, which has events functions.
    controller.init();

});

/********* END OF SCRIPT *********/