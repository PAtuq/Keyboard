//Global Variables and Properties:
const timer = new Date();
var startTime = timer.getTime();
var errors = 0;                     //Number of caught errors made by user, tallied for calculateError() method.
var finalErrors = 0;              //Number of uncaught errors made by user, submitted with input, tallied for calculateError() method.
var testNum = 0;                    //Number of tests completed, from 0 to 5
var blockTime = 0;                  //Time elapsed in previous tests, needed to show WPM calculations on a test-by-test (rather than 5-test block) basis

const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "The five boxing wizards jump quickly",
    "Pack my box with five dozen liquor jugs",
    "Fix problems quickly with galvanized jets",
    "Sphinx of black quartz, judge my vow"
];

//Variables to track average stats, holds [#errors, length of expected input, WPM, accuracy]
var results = [
    [0, 0, 0, 0],          //Test 1
    [0, 0, 0, 0],          //Test 2
    [0, 0, 0, 0],          //Test 3
    [0, 0, 0, 0],          //Test 4
    [0, 0, 0, 0]           //Test 5
]

//Setting variables
var blind = 0;
var muted = 0;
var reverse = 0;

//Preventing the form - i.e., input - from reloading the page when submitted with a physical enter key
var inputForm = document.getElementById("textEntry");
function handleForm(event)
{ 
    event.preventDefault(); 
} 
inputForm.addEventListener('submit', handleForm);

//Function to handle soft-keyboard clicks
function keyClick(s, type)
{
    if(type === 'space')
    {
        var elem = document.getElementById('textBox');
        var prev  = elem.value;
        elem.value = prev + ' ';
    }
    else if(type === 'backspace')
    {
        errors = errors + 1;
        var elem = document.getElementById('textBox');
        var prev  = elem.value;
        var len = String(prev).length;
        elem.value = prev.substring(0, len-1);
    }
    else if(type === 'enter')
    {
        var elem = document.getElementById('textBox');
        var userInput = elem.value;
        calculateError(userInput, sentences[testNum]);
        calculateWPM(userInput);
        calculateAcc(userInput, sentences[testNum]);
        if(testNum == 4)
        {
            console.log(results[0][0] + ", " + results [0][1] + ", " + results[0][2] + ", " + results[0][3]);
            console.log(results[1][0] + ", " + results [1][1] + ", " + results[1][2] + ", " + results[1][3]);
            console.log(results[2][0] + ", " + results [2][1] + ", " + results[2][2] + ", " + results[2][3]);
            console.log(results[3][0] + ", " + results [3][1] + ", " + results[3][2] + ", " + results[3][3]);
            console.log(results[4][0] + ", " + results [4][1] + ", " + results[4][2] + ", " + results[4][3]);
            localStorage.setItem("results", JSON.stringify(results));

            localStorage.setItem("blindSettingRes", blind);
            localStorage.setItem("muteSettingRes", muted);
            localStorage.setItem("reverseSettingRes", reverse);

            location.assign("summaryPage.html");
        }
        testNum++;
        updateTestNumber();

        //Resetting text field and error count
        errors = 0;
        elem.value = "";

        //Updating sentence-to-type
        updateSentence()
    }
    else
    {
        var elem = document.getElementById('textBox');
        var prev  = elem.value;
        elem.value = prev + s;
    }

    if(type === 'vowel')
    {
        document.getElementById('aAudio').play();
    }
    else if(type == 'consonant')
    {
        document.getElementById('bAudio').play();
    }
    else if(type == 'punctuation')
    {
        //document.getElementById('punctuationAudio').play();
    }
    else if(type == 'backspace')
    {
        document.getElementById('backspaceAudio').play();
    }
    else if(type == 'space')
    {
        document.getElementById('spaceAudio').play();
    }
}

//Function to change to blind mode if checkbox in appStart is checked
function setBlind()
{
    if(blind == 0) 
    { 
        blind = 1; 
    }
    else
    { 
        blind = 0; 
    }
    console.log("Blind mode checked: " + blind);
    localStorage.setItem('blindVal', blind);
}

//Helper method for mute setting
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

//Function to change to non-differentiated audio mode if checkbox in appStart is checked
function setSound()
{
    if(muted == 0)
    {
        muted = 1;
    }
    else
    {
        muted = 0;
    }
    console.log("Audio feedback mode checked " + muted);
    localStorage.setItem('soundVal', muted);
}

function setOrder()
{
    if(reverse == 0)
    {
        reverse = 1;
    }
    else
    {
        reverse = 0;
    }
    console.log("Reverse sentence order mode checked " + reverse);
    localStorage.setItem('reverseVal', reverse);
}

//Function to increment test number
function updateTestNumber()
{
    var testNumberSpan = document.getElementById('testNumber');
    var currentNum = testNumberSpan.textContent;

    testNumberSpan.textContent = testNum;
}


//Function to calculate error upon hitting enter/submitting text
function calculateError(input, target)
{
    var errorSpan = document.getElementById('correct?');
    var currentError = errorSpan.textContent;
    console.log(target);
    console.log(input);

    var textLength = target.length;
    var matches = 0;
    var errorsInFinal = 0;

    var expectedIndex = 0;
    for(let i = 0; i < input.length; i++)
    {
        console.log((input.charAt(i)).toUpperCase() + " and " + (target.charAt(expectedIndex)).toUpperCase());
        if((input.charAt(i)).toUpperCase() === (target.charAt(expectedIndex)).toUpperCase())
        {
            matches++;
            expectedIndex++;
        }
        else if((input.charAt(i)).toUpperCase() === (target.charAt(i)).toUpperCase())
        {
            matches++;
            expectedIndex++;
        }
        else
        {
            errorsInFinal++;
        }
    }

    //Adding #errors to array for average calculation
    results[testNum][0] = matches;
    results[testNum][1] = textLength;
    finalErrors = errorsInFinal;

    errorSpan.textContent = String(matches) + "/" + textLength;
}

//Function to calculate WPM upon hitting enter/submitting text
function calculateWPM(input)
{
    var wpmSpan = document.getElementById('wordsPerMinute');
    var currentError = wpmSpan.textContent;

    //Calculating time difference
    const newTime = new Date();
    console.log("start time : " + startTime);
    console.log("current time : " + newTime.getTime());
    let time = newTime.getTime() - (startTime + blockTime);

    //Calulating WPM, for which the standard is 1 word =~ 5 chars
    var words = (input.length) /5;
    var minutes = time / 60000;
    var wpm = words / minutes;

    //Adding WPM to array for average calculation
    results[testNum][2] = wpm;

    wpmSpan.textContent = String(wpm.toFixed(2)) + " words per minute";

    //blockTime keeps track of the time taken in all tests thus far.
    blockTime += time;
    console.log(blockTime + " ms so far in block");
}

//Function to calculate accuracy upon hitting enter/submitting text
function calculateAcc(input, expected)
{
    console.log(errors + " errors");
    var accSpan = document.getElementById('accuracy');
    var currentAcc = accSpan.textContent;

    //Calulating accuracy, which is total chars in correct input versus total chars typed
    var chars = (expected.length);
    var charsWithErrors = input.length + errors + finalErrors;
    var accuracy = (chars/charsWithErrors) * 100;
    console.log(accuracy);

    //Adding accuracy to array for average calculation
    results[testNum][3] = accuracy;

    accSpan.textContent = String(accuracy.toFixed(2)) + "%";
}

//Function to update sentence-to-type upon hitting enter/submitting text
function updateSentence()
{
    var sentenceSpan = document.getElementById('textToType');
    var currentSentence = sentenceSpan.value;
    
    if(testNum < 5)
    {
        sentenceSpan.textContent = sentences[testNum];
    }
}

//Function to create the stat values for the summary page, and set them accordingly
function createSummary()
{
    var testStats = JSON.parse(localStorage.getItem("results"));

    //Stats for individual trials.
    console.log(testStats[0][0] + ", " + testStats [0][1] + ", " + testStats[0][2] + ", " + testStats[0][3]);
    console.log(testStats[1][0] + ", " + testStats [1][1] + ", " + testStats[1][2] + ", " + testStats[1][3]);
    console.log(testStats[2][0] + ", " + testStats [2][1] + ", " + testStats[2][2] + ", " + testStats[2][3]);
    console.log(testStats[3][0] + ", " + testStats [3][1] + ", " + testStats[3][2] + ", " + testStats[3][3]);
    console.log(testStats[4][0] + ", " + testStats [4][1] + ", " + testStats[4][2] + ", " + testStats[4][3]);

    var t1Str = "Test 1: " + testStats[0][0] + "/" + testStats[0][1] + " correct, WPM = " + (testStats[0][2]).toFixed(2) + ", Accuracy = " + (testStats[0][3]).toFixed(2);
    var t2Str = "Test 2: " + testStats[1][0] + "/" + testStats[1][1] + " correct, WPM = " + (testStats[1][2]).toFixed(2) + ", Accuracy = " + (testStats[1][3]).toFixed(2); 
    var t3Str = "Test 3: " + testStats[2][0] + "/" + testStats[2][1] + " correct, WPM = " + (testStats[2][2]).toFixed(2) + ", Accuracy = " + (testStats[2][3]).toFixed(2); 
    var t4Str = "Test 4: " + testStats[3][0] + "/" + testStats[3][1] + " correct, WPM = " + (testStats[3][2]).toFixed(2) + ", Accuracy = " + (testStats[3][3]).toFixed(2);
    var t5Str = "Test 5: " + testStats[4][0] + "/" + testStats[4][1] + " correct, WPM = " + (testStats[4][2]).toFixed(2) + ", Accuracy = " + (testStats[4][3]).toFixed(2);

    var t1Span = document.getElementById("test1Res");
    var t2Span = document.getElementById("test2Res");
    var t3Span = document.getElementById("test3Res");
    var t4Span = document.getElementById("test4Res");
    var t5Span = document.getElementById("test5Res");

    t1Span.textContent = t1Str;
    t2Span.textContent = t2Str;
    t3Span.textContent = t3Str;
    t4Span.textContent = t4Str;
    t5Span.textContent = t5Str;

    //Total and average stats across all trials.
    var totalCorrect = testStats[0][0] + testStats[1][0] + testStats[2][0] + testStats[3][0] + testStats[4][0];
    var totalExpected = testStats[0][1] + testStats[1][1] + testStats[2][1] + testStats[3][1] + testStats[4][1];
    var avgWPM = (testStats[0][2] + testStats[1][2] + testStats[2][2] + testStats[3][2] + testStats[4][2]) / 5;
    var avgAcc = (testStats[0][3] + testStats[1][3] + testStats[2][3] + testStats[3][3] + testStats[4][3]) / 5;

    var correctSpan = document.getElementById("avgCorrect");
    var wpmSpan = document.getElementById("avgWPM");
    var accSpan = document.getElementById("avgAcc");

    correctSpan.textContent = "Total correct : " + totalCorrect + "/" + totalExpected;
    wpmSpan.textContent = "Average WPM : " + avgWPM.toFixed(2);
    accSpan.textContent = "Average accuracy : " + avgAcc.toFixed(2);

    //Informing us of what settings the test was completed under
    var blindResSpan = document.getElementById("blindSettingSpan");
    var mutedResSpan = document.getElementById("mutedSettingSpan");
    var reverseResSpan = document.getElementById("reverseSettingSpan");

    blindResSpan.textContent = localStorage.getItem("blindSettingRes");
    mutedResSpan.textContent = localStorage.getItem("muteSettingRes");
    reverseResSpan.textContent = localStorage.getItem("reverseSettingRes");

    localStorage.setItem("blindVal", 0);
    localStorage.setItem("soundVal", 0);
    localStorage.setItem("reverseVal", 0);

}

/*Initializing the app, this function is called when the main (i.e., test) page loads. Handles:
  -Adding event listeners for every key press
  -Starting timer for WPM calculation
  -Altering test to match settings selected in appStart page, passed via localStorage */
function init()
{  
    //Setting blind mode (if checked)
    blind = localStorage.getItem("blindVal");
    console.log(blind);
    if(blind == 1)
    {
        var textBox = document.getElementById("textBox");
        textBox.type = "password";
    }

    //Muting audio feedback (if checked)
    muted = localStorage.getItem('soundVal');
    console.log(muted);
    if(muted == 1)
    {
        var soundElements = document.querySelectorAll("audio");
        [].forEach.call(soundElements, function(elem) { muteMe(elem)});
    }

    //Reversing sentence order (if checked)
    reverse = localStorage.getItem('reverseVal');
    console.log(reverse);
    if(reverse == 1)
    {
        var hold = sentences[0];
        sentences[0] = sentences[4];
        sentences[4] = hold;
        hold = sentences[1];
        sentences[1] = sentences[3];
        sentences[3] = hold;
        updateSentence();
    }

    //Starting timer for average WPM
    const time = new Date();

    document.getElementById('textEntry').addEventListener('keydown', function (keyClick) {
        if (event.code == 'Backspace') {
            console.log('The physical key pressed was the BACKSPACE key');
        } 
        /*
        Ugly switch statement, but without some clean mathmatical distinction between key types (e.g, some hash function which I doubt exists)
        we don't really have a better option. Still, this works fast enough in real-time for our application.  
        */
        switch(event.code)
        {
            case "KeyA":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('aAudio').play();
            break; 
            case "KeyB":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('bAudio').play();
            break; 
            case "KeyC":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('cAudio').play();
            break; 
            case "KeyD":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('dAudio').play();
            break; 
            case "KeyE":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('eAudio').play();
            break; 
            case "KeyF":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('fAudio').play();
            break;
            case "KeyG":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('gAudio').play();
            break; 
            case "KeyH":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('hAudio').play();
            break; 
            case "KeyI":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('iAudio').play();
            break; 
            case "KeyJ":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('jAudio').play();
            break; 
            case "KeyK":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('kAudio').play();
            break; 
            case "KeyL":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('lAudio').play();
            break; 
            case "KeyM":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('mAudio').play();
            break; 
            case "KeyN":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('nAudio').play();
            break; 
            case "KeyO":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('oAudio').play();
            break; 
            case "KeyP":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('pAudio').play();
            break; 
            case "KeyQ":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('qAudio').play();
            break; 
            case "KeyR":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('rAudio').play();
            break;
            case "KeyS":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('sAudio').play();
            break; 
            case "KeyT":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('tAudio').play();
            break; 
            case "KeyU":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('uAudio').play();
            break; 
            case "KeyV":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('vAudio').play();
            break; 
            case "KeyW":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('wAudio').play();
            break; 
            case "KeyX":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('xAudio').play();
            break;
            case "KeyY":
                console.log('The physical key pressed was the vowel key');
                document.getElementById('yAudio').play();
            break; 
            case "KeyZ":
                console.log('The physical key pressed was the consonant key');
                document.getElementById('zAudio').play();
            break;
            case "Backspace":
                console.log('The physical key pressed was the backspace key');
                document.getElementById('backspaceAudio').play();
                errors = errors + 1;
            break;
            case "Space":
                console.log('The physical key pressed was the space bar');
                document.getElementById('spaceAudio').play();
            break;
            case "Enter":
                var elem = document.getElementById('textBox');
                var userInput = elem.value;
                calculateError(userInput, sentences[testNum]);
                calculateAcc(userInput, sentences[testNum]);
                calculateWPM(userInput);
                if(testNum == 4)
                {
                    console.log(results[0][0] + ", " + results [0][1] + ", " + results[0][2] + ", " + results[0][3]);
                    console.log(results[1][0] + ", " + results [1][1] + ", " + results[1][2] + ", " + results[1][3]);
                    console.log(results[2][0] + ", " + results [2][1] + ", " + results[2][2] + ", " + results[2][3]);
                    console.log(results[3][0] + ", " + results [3][1] + ", " + results[3][2] + ", " + results[3][3]);
                    console.log(results[4][0] + ", " + results [4][1] + ", " + results[4][2] + ", " + results[4][3]);
                    localStorage.setItem("results", JSON.stringify(results));

                    localStorage.setItem("blindSettingRes", blind);
                    localStorage.setItem("muteSettingRes", muted);
                    localStorage.setItem("reverseSettingRes", reverse);

                    location.assign("summaryPage.html");
                }
                testNum++;
                updateTestNumber();

                //Resetting text field and error count
                errors = 0;
                elem.value = "";

                //Providing new sentence
                updateSentence();
            break; 
            default:
            break;
        }
    });
}
