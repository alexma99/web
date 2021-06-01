//создаем уникальный айди
const generateId = () => `ID${Math.round(Math.random()*1e8).toString(8)}`
const overallBalance = document.querySelector('#overallBalance'), // баланс
        incomeBalance = document.querySelector('#incomeBalance'), // доходы
        outcomeBalance = document.querySelector('#outcomeBalance'), // расходы
        form = document.querySelector('#form'),
        operationNameInput = document.querySelector('#operationNameInput'), // название операции
        operationAmountInput = document.querySelector('#operationAmountInput'), // сумма операции
        operationAddBtn = document.querySelector('#operationAddBtn'), // добавляем операцию
        historyList = document.querySelector('#historyList'); // история расходов

//создаем базу данных
let financeDB = {
    balance: 0,
    incomeBalance: 0,
    outcomeBalance: 0,
    // либо получаем данные либо запишется пустой массив
    operations: JSON.parse(localStorage.getItem('Data')) || []
}


// считаем баланс
const calcBalance = array => {
    let s = 0;
    if( array.length > 0){
        array.forEach( item => {
            s += item.cost;
        })
    }
    return s;
}

const showInfo = () => {
    // фильтруем на доходы и расходы
    let incomeBalanceArray = financeDB.operations.filter( item => item.cost > 0 ),
        outcomeBalanceArray = financeDB.operations.filter( item => item.cost < 0 );
    // добавляем в значения в доходы и расходы 
    financeDB.incomeBalance = calcBalance( incomeBalanceArray );
    financeDB.outcomeBalance = calcBalance( outcomeBalanceArray );
    // выводим текст доходов и расходов
    incomeBalance.textContent = financeDB.incomeBalance;
    outcomeBalance.textContent = financeDB.outcomeBalance;
    // считаем баланс
    financeDB.balance = financeDB.incomeBalance + financeDB.outcomeBalance;
    // выводим текст баланса
    overallBalance.textContent = financeDB.balance;
}

const renderOperation = operation => {
    // создаем новый элемент с заданным тегом
    const listItem = document.createElement('u1');
    // если > 0 то вернется '+' + operation.cost
    const amount = operation.cost > 0 ? '+' + operation.cost : operation.cost;
    // добавляем классы 
    listItem.classList.add('history__item', 'animate__animated', 'animate__fadeInUp');
    if( amount < 0 ){
        // если < 0 то присваиваем класс минус
        listItem.classList.add('history__item-minus');
    } else {
        listItem.classList.add('history__item-plus');
    }
    // добавляем верстку
    // $() - интерполяция (внутри строки используем js код)
    listItem.innerHTML = `
    <div class="info">
    <span>${operation.title}</span>
    <span class="history__money">${amount} ₽</span>
    <button class="history_delete" data-id="${operation.id}">x</button>
    </div>
    <div class="date-block">
    <span class="date">${operation.day}.${operation.month}.${operation.year}</span>
    <span class="time">${operation.hour}:${operation.minute}</span>
    </div>`;
    historyList.append(listItem);
}

const initHistory = () => {
    localStorage.setItem('Data', JSON.stringify(financeDB.operations)); // чтобы положить строку используем stringify
    historyList.textContent = ''; // очищаем контент
    financeDB.operations.forEach(renderOperation); // перебираем все операции
    showInfo();// добавляем деньги

}

// проверка что непусто
const isValid = () => {
    if( operationNameInput.value && operationAmountInput.value ){
        return true
    } else return false
}


const errorInputs = () => {
    if(!operationNameInput.value){ //если пусто название операции то ошибка
        operationNameInput.classList.add('error');
    }
    if(!operationAmountInput.value){ //если пусто значение операции то ошибка
        operationAmountInput.classList.add('error');
    }

}

// очищаем значения из ошибки
const clearErrorInputs = () => {
    operationNameInput.classList.remove('error');
    operationAmountInput.classList.remove('error');
}


const addZero = item => {
    if( item < 10){
        return ('0' + item)
    } else {
        return item
    }
}


// добавляем события
form.addEventListener('submit', e => {
    e.preventDefault();// запрещает браузеру выполнять стандратные действия (чтобы при нажатии на добавить не было перезугрузки)
    const date = new Date();
    const title = operationNameInput.value.length > 20 ? operationNameInput.value.slice(0, 20) + '...': operationNameInput.value;
    const id = operationNameInput.value;//название операции
    const cost = operationAmountInput.value;//сумма операции 
    if( isValid() ){ // если непусто
        clearErrorInputs();
        // создаем объект для операций
        const operation = {
            id: generateId(),
            title,
            cost: +cost,// + конвертирует в число
            day: addZero(date.getDate()),
            month: addZero(date.getMonth()),
            year: addZero(date.getFullYear()),
            hour: addZero(date.getHours()),
            minute: addZero(date.getMinutes())
        }
        // добавляем объект в базу данных
        financeDB.operations.push(operation);
        initHistory();
        form.reset();
    } else {
        errorInputs();
    }

});

operationNameInput.addEventListener('input', e => {
    clearErrorInputs();
});
operationAmountInput.addEventListener('input', e => {
    clearErrorInputs();
});



const deleteOperation = event => {
    const target = event.target;
    // если произошел клик на крестик 
    if( target.classList.contains(("history_delete"))){
        const deletedElementId = target.dataset.id;
        // перебираем financeDB.operation и находим все элементы у которых айди не совпадает 
        // с айди, на который мы не кликнули
        const updatedOperation = financeDB.operations.filter( item => item.id !== deletedElementId);
        financeDB.operations = updatedOperation;
        initHistory();
    }
}


historyList.addEventListener('click', deleteOperation);

initHistory();
showInfo();
