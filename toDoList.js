function maxInputSize(event, max) {
    if (event.target.value.length > max) {
        event.target.value = event.target.value.substring(0, max);
    }

    if (event.keyCode === 13) {
        inputCreate() || secondInputCreateElem(event)
    }
}

function inputCreate() {
    var list = document.getElementsByClassName('mainMenu')[0];
    list.createEl = createElem;
    list.createEl(0);
    document.getElementById('myInput').value = '';
}

//создать меню для ввода вложенных списков
function secondInputCreate(event) {
    var secondInput = document.getElementById('addSecondItem');

    if (!secondInput) {
        e = event.target.parentNode;
        var max = 17;
        if (e.classList.contains('second')) max = 9;

        //поле ввода вложенного
        var firstInput = document.createElement("input");
        firstInput.type = 'text';
        firstInput.id = 'secondInput';
        firstInput.setAttribute('onkeyup', 'maxInputSize(event,' + max + ')');

        //кнопка добавить вложенного
        var secondInput = document.createElement("input");
        secondInput.setAttribute('onclick', "secondInputCreateElem(event)");
        secondInput.type = 'button';
        secondInput.value = 'add';

        //создать вложенный элемент ввода
        var firstDiv = document.createElement("div");
        firstDiv.id = 'addSecondItem';
        firstDiv.appendChild(firstInput);
        firstDiv.appendChild(secondInput);
        e.appendChild(firstDiv);
        firstInput.focus();
    } else {
        secondInput.parentNode.removeChild(secondInput);
        secondInputCreate(event);
    }
}

//создать вложенный элемент списка в источнике вызова после нажатия кнопки добавить
function secondInputCreateElem(event) {
    var e = event.target.parentNode.parentNode;
    e.createEl = createElem;
    e.createEl(1, document.getElementById('secondInput').value);
    e.removeChild(document.getElementById('addSecondItem'));
}

//удалить элемент из DOM
function remChild(event) {
    var targElem = event.target.parentNode.lastChild.lastChild;
    var delElem = event.target.parentNode;

    if ((targElem) && (targElem.classList.contains('second')
        || targElem.classList.contains('third'))) {
        delElem.removeChild(delElem.lastChild);
    }
}

//создание єлемента 0 - главного, 1-вложенного в UL
function createElem(main, text) {
    var text = text || document.getElementById('myInput').value;

    if (text === '') {
        alert('Не введено содержимое')
    } else {

        //кнопки вверх/вниз
        //вверх
        var fourthDivTop = document.createElement("a");
        fourthDivTop.classList.add('scrollTop');
        fourthDivTop.setAttribute('onclick', "upDownElement(event)");
        //вниз
        var fourthDivBottom = document.createElement("a");
        fourthDivBottom.setAttribute('onclick', "upDownElement(event)");
        fourthDivBottom.classList.add('scrollBottom');
        //контейнер вверх/вниз
        var fourthDiv = document.createElement("div");
        fourthDiv.appendChild(fourthDivTop);
        fourthDiv.appendChild(fourthDivBottom);

        //основной элемент

        //чекбокс
        var firstChekBox = document.createElement("input");
        firstChekBox.classList.add('chekBox');
        firstChekBox.type = 'checkbox';

        //кнопка добавления
        var firstDiv = document.createElement("div");
        firstDiv.classList.add('addItem');
        firstDiv.setAttribute('onclick', "secondInputCreate(event)");

        //кнопка удаления дочернего
        var secondDiv = document.createElement("div");
        secondDiv.classList.add('removeItem');//1
        secondDiv.setAttribute('onclick', "remChild(event)");

        //кнопка редактирования
        var thirdDiv = document.createElement("div");
        thirdDiv.classList.add('editItem');
        fourthDiv.classList.add('topBottom');

        //кнопка удаления текущего
        var closediv = document.createElement("div");//3
        closediv.classList.add('close');
        closediv.setAttribute('onclick', "delCurrent(event)");

        //текст элемента
        var firstSpan = document.createElement("span");
        firstSpan.innerHTML = text;

        //создание элемента
        var firstLi = document.createElement("li");
        firstLi.appendChild(firstSpan);
        firstLi.appendChild(firstChekBox);
        firstLi.appendChild(thirdDiv);
        firstLi.appendChild(fourthDiv);
        firstLi.appendChild(closediv);
        firstLi.classList.add('first');
        firstLi.appendChild(firstDiv);
        firstLi.appendChild(secondDiv);

        //вложенный оборачиваем в UL
        if (main) {
            var firstUl = document.createElement("ul");
            firstUl.appendChild(firstLi);
            firstLi.classList.remove('first');
            firstLi.classList.add('second');
            firstLi = firstUl;
        }
        firstLi.style.opacity = '0';
        var id = setInterval(function () {
            frameOpacity(id, firstLi, 1)
        }, 40);

        this.appendChild(firstLi);

        //на 3 уровне обрезка элемента-ограничение вложенности 3
        if (firstLi.parentNode && firstLi.parentNode.classList.contains('second')) {
            firstLi.getElementsByClassName('addItem')[0].parentNode.removeChild(firstLi.getElementsByClassName('addItem')[0]);
            firstLi.getElementsByClassName('removeItem')[0].parentNode.removeChild(firstLi.getElementsByClassName('removeItem')[0]);
            firstLi.firstChild.classList.remove('second');
            firstLi.firstChild.classList.add('third');
        }

        addEvent(firstLi);
    }
}

function frameOpacity(interval, element, upDown) {
    var step;

    if (upDown === 1) {
        step = 0.1
    } else {
        step = -0.1
    }

    if ((upDown) && +element.style.opacity > upDown || (!upDown) && +element.style.opacity < upDown) {
        clearInterval(interval);

        if (!upDown) element.parentNode.removeChild(element);

    } else {
        element.style.opacity = +element.style.opacity + step;

    }
}

function delCurrent(event) {
    var div = event.target.parentElement;
    var id = setInterval(function () {frameOpacity(id, div, 0)}, 40);
    if (div.classList.contains('second') || div.classList.contains('third')) div = div.parentNode;
    div.style.opacity = '1';
}

function upDownElement(event) {
    var lockElem = event.target.parentNode.parentNode;

    if (lockElem.classList.contains('second') || lockElem.classList.contains('third')) {
        lockElem = lockElem.parentNode;
    }

    if (lockElem.previousSibling && event.target.classList.contains('scrollTop')) {
        targetElement = lockElem;
        lockElem = lockElem.previousSibling;
    } else if (lockElem.nextSibling && event.target.classList.contains('scrollBottom')) {
        var targetElement = lockElem.nextSibling;
    }

    if (targetElement && lockElem && lockElem.classList && !lockElem.classList.contains('removeItem')) {
        var id = setInterval(frame, 20);
        var pos1 = 0;

        function frame() {
            if (pos1 < 39) {
                lockElem.style.top = +pos1 + 'px';
                targetElement.style.top = -pos1 + 'px';
                pos1++;
            } else {
                lockElem.style.top = -0 + 'px';
                targetElement.style.top = +0 + 'px';
                clearInterval(id);
                lockElem.parentNode.insertBefore(targetElement.parentNode.removeChild(targetElement), lockElem);
            }
        }
    }
}

function addEvent(node) {
    var listEdit = node.getElementsByClassName('editItem');
    var thisSpan = listEdit[0].parentElement.getElementsByTagName('span')[0];
    var chek = node.getElementsByTagName('input');

    chek[0].addEventListener('click', function (event) {
        chek[0].parentNode.classList.toggle('checked');

        for (var i = 0; i < chek.length; i++) {
            if (chek[i].checked !== chek[0].checked) {
                chek[i].parentNode.classList.toggle('checked');
            }
            chek[i].checked = chek[0].checked;
        }
    });

    node.addEventListener('click', function (event) {
        event.cancelBubble = true;

        function addEvents(event) {
            var chek = event.target.getElementsByTagName('input');

            if (event.target.classList.contains('first')
                || event.target.classList.contains('second')
                || event.target.classList.contains('third')) {
                chek[0].checked = !chek[0].checked;
                chek[0].parentNode.classList.toggle('checked');

                for (var i = 0; i < chek.length; i++) {

                    if (chek[i].checked !== chek[0].checked) {
                        chek[i].parentNode.classList.toggle('checked');
                    }
                    chek[i].checked = chek[0].checked;
                }
            }
        }

        addEvents(event);
    });

    //редактирование имени по щелчку на нем
    thisSpan.addEventListener('click', function (event) {
        (event.target.isContentEditable) ? event.target.contentEditable = false : event.target.contentEditable = true;
        event.target.focus();
    });

    node.addEventListener('keypress', function (event) {
        var max;

        if (event.target.parentNode.classList.contains('first')) {
            max = 27;
        } else if (event.target.parentNode.classList.contains('second')) {
            max = 17;
        } else max = 8;

        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.contentEditable = false;
        }

        if (event.target.innerHTML.length > max) {
            event.preventDefault();
        }
    });

    //кнопка редактирования
    listEdit[0].addEventListener('click', function (event) {

        if (event.target.parentNode.classList.contains('first')) {
            chek.checked = false;
            event.target.parentNode.classList.remove('checked');
        }

        (thisSpan.isContentEditable) ? thisSpan.contentEditable = false : thisSpan.contentEditable = true;
        thisSpan.focus();
    });
}
