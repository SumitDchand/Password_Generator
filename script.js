const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck= document.querySelector("#numbers");
const symbolCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateBtn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");

const symbols = "~`!@#$%^&*()_-+={[}]|\\:;<,>.?/";

// some default values for the given functions

let password="";
let passwordLength=10;
let checkCount=0; //it shows one checkbox is checked
//set strength circle color to grey
setIndicator("#ccc");
handleSlider();
//it only reflect the password length on UI

function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerText= passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize= ((passwordLength - min)* 100/(max-min) + "% 100%")
};

function setIndicator(color){
    //it sets color
    indicator.style.backgroundColor= color;
    // add shadow property here
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;

}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
    //math.floor will roundoff
    //math.random will provide range from [0,1)
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))
    //string.fromCharCode gives character according to ASCII value
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol(){
    const randNum= getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
    //charAt gives gives special character according to index from randNum

}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym=true;

    if (hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";

    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to visible span copy
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // fisher yates method      apply on array
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random(0, i+1));
        // swap a[i] and a[j]
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((element) => {str += element});
    return str;
}


function handleCheckBoxChange (){
    checkCount=0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})
//for each change for check or uncheck to keep track how many are checked or unchecked

inputSlider.addEventListener('input', (e) =>{
    passwordLength=e.target.value;
    handleSlider();
    //whenever we move slider e.target.value gives slider current length value
    //password length ke equal ho gya vlaue to ui me show krne ke liye hadleSlider ko call kr diya
})

copyBtn.addEventListener('click', () =>{
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',() =>{
    if (checkCount <= 0) 
        return;

    else if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSlider();

    }

    //starting

    //remove old password
    password= "";

    //which checkbox are ticked by user

    // if(uppercaseCheck.checked){
    //     password+= generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    //let do above process using array
    let funcArr= [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);
    
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
        // console.log(password);
    }

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();


})




