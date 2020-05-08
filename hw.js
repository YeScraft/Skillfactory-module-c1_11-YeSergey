function jQuery(selector, context = document){
    this.elements = Array.from(context.querySelectorAll(selector));
    return this;
}

jQuery.prototype.each = function (fn){
    this.elements.forEach((element, index) => fn(element, index));
    //this.elements.forEach((element, index) => fn.call(element, element, index));
    return this;
}

jQuery.prototype.click = function (fn){
    this.each((element) => element.addEventListener("click", fn));
    return this;
}

jQuery.prototype.remove = function (){
    this.each(element => element.remove());
    return this;
}

jQuery.prototype.hide = function (){
    this.each(element => element.style.display = "none");
    return this;
}

jQuery.prototype.show = function(){
	this.each(element => element.style.display = "")
  return this;
}

jQuery.prototype.class = function (name){
    this.each(element => element.className = name);
    return this;
}

jQuery.prototype.query = function (){
    elem = this.elements[0];
    return elem;
}

// Метод jQuery.prototype.text()
jQuery.prototype.text = function (text=""){
    /* Получает текст выбранного элемента в наборе. 
    Если таких элементов несколько, получит содержимое всех элементов, 
    разделенные пробелом.
    */
    if (!text){
        content = "";
        this.each((element) => content += " " + element.textContent);
        return content;
    }
    /*Задает новое содержимое для выбранных элементов.
    */
    else if (typeof(text) === 'string'){
        this.each((element) => element.textContent = text);
        return this;
    }
    /*Заменяет содержимое каждого выбранного элемента в наборе
     на возвращенное функцией function значение. Функция вызывается, 
     для каждого из выбранных элементов.
    */
    else if (typeof(text) === 'function'){
        this.each((element, index) => element.textContent=(text(element.textContent, index)));
    }
    else {
        return console.log("Некорректный формат данных");
    }
}

// Метод jQuery.prototype.html()
jQuery.prototype.html = function(htmlString=""){
    /* Возвращается содержимое только первого элемента в наборе
     (независимо от количества подобных элементов, выбранных селектором).
    */
    if (!htmlString){
        content = this.elements[0].innerHTML;
        return content;
    }
    /* Задает новое содержимое для выбранных элементов 
     (может содержать HTML теги).
    */
    else if (typeof(htmlString) === 'string'){
        this.each((element) => element.innerHTML = htmlString);
        return this;
    }
    /* Заменяет html-содержимое каждого выбранного элемента в наборе
     на возвращенное функцией function значение. Функция вызывается, 
     для каждого из выбранных элементов.
    */
    else if (typeof(htmlString) === 'function'){
        this.elements.forEach((element, index) => element.innerHTML=(htmlString(element.innerHTML, index)));
    }
    else {
        return console.log("Некорректный формат данных");
    }
}

const $ = (selector) => new jQuery(selector);

// Определяем элементы DOM, с которыми будем работать
const timer = $('.countdown').query();
const minutes = $('.minutes').query();
const seconds = $('.seconds').query();
const message = $('.message').query();

const plus = $('.plus').query();
const minus = $('.minus').query();
const start = $('.start').query();

// Присваиваем текущие значения переменным минут и секунд 
let countSec = seconds.value;
let countMin = minutes.value;

// Функция из примера формирует новую строку, орезаея из строки все елементы до -2 символа, 
// на экран выводятся 2 последние символа
const updateText = () =>{
    minutes.value = (0 + String(countMin)).slice(-2);
    seconds.value = (0 + String(countSec)).slice(-2);
}
updateText();

// Функция через событие input в режиме прямого времени отслеживает в поле <input> вводимые значения
// и отслеживает чтобы кол-во минут не превысило 99. При попытке ввести отрицительное значение обнуляет счётчик
seconds.oninput = function(){
    if ((seconds.value).includes("-")){
        countSec = 0;
        updateText();
        return null;
    }
    else {
        countSec = Number(seconds.value);
        if (countSec<=59) return countSec;
    else {
        if (countMin<99) {
            countMin = Number(countMin + (countSec-countSec%60)/60);
            countSec = Number(countSec%60);
            if (countMin>99) {
                countMin = 99;
                updateText();
                return countSec, countMin;
            }
            else {
                updateText();
                return countSec, countMin;
            }
        }
        else {
            countMin = 99;
            countSec = Number(countSec%60);
            updateText();
            return countSec, countMin;
        }
    }
    }
}
// Смотри функцию ввода секунд
minutes.oninput = function(){
    if ((minutes.value).includes("-")){
        countMin = 0;
        updateText();
        return null;
    }
    else {
        countMin = Number(minutes.value);
        if (countMin>99) {
            countMin = 99;
            updateText();
            return countMin;
        }
        else return countMin;
        }  
}

idTimer = null;
// Задаём  счётчик запусков, чтобы ограничить кол-во одновременных запусков
launch = 0;

function go(){
    // Задали id счётчика и вызываем функцию countDown каждую секунду
    return idTimer = setInterval(countDown, 1000);
}

/* Функция определяет общее количество секунд, если секунд неосталось обнуляется вызов функции, обнуляется кол-во
запусков, скрывается <section class="countdown"> и в <div class="message"> вводится сообщение. В противном случае
определяется исходя из кол-ва оставшихся секунд в переменной countSec
*/
function countDown () {	
    let total = countSec + countMin * 60;
    if (total <= 0) {
        clearInterval(idTimer);
        launch = 0;
        $('.countdown').hide();
        $('.message').html('<p>I am done... Please push Reset.</p>');
    }
    else if(countSec > 0) {
        countSec--;
    }
    else{
        countSec = 59;
        countMin--;
    } 
    updateText();
}

// Обработка события  click по кнопке Plus
$('.plus').click(() =>{
    if(countSec < 59) ++countSec;
    else{
        if (countMin>=99){
            countSec = 0;
            countMin = 99;
        }
        else {
            countSec = 0;
            ++countMin;
        }
    }
    updateText()
});

// Обработка события  click по кнопке Minus
$('.minus').click(() =>{
    if(countMin <= 0 && countSec==0){
        countSec = 0;
        countMin = 0;
        updateText();
        return null;
    }
    if(countSec > 0) --countSec;
    else{
        countSec = 59;
        --countMin;
    }
    updateText();
});

// Обработка события  click по кнопке Start с счётчиком кол-ва запусков
$('.start').click(() => {
    if (launch == 0) {
        go();
        launch++;
    }
    else return null;
});

// Обработка события  click по кнопке Pause с обнулением счётчика запуска
$('#pause').click(() => {
    if (!idTimer) return null;
    else {
        clearInterval(idTimer);
        launch = 0;
    }
});

// Обработка события  click по кнопке Reset с обнулением счётчика запуска
$('#reset').click(() => {
    if (!idTimer) return null;
    else {
        clearInterval(idTimer);
        countSec = 0;
        countMin = 0;
        $('.countdown').show()
        message.innerHTML = ''
        launch = 0;
        updateText();
    }
});
