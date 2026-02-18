let database = JSON.parse(localStorage.getItem('cards')) ? JSON.parse(localStorage.getItem('cards')) : []
    //let database = JSON.parse(localStorage.getItem('cards')) || [];
    let displayPin = document.getElementById("recharge-display");
    let userLoad = document.getElementById("load-airtime");
    let userBalance = document.getElementById("user-balance");
    let tbody = document.getElementById("tbody");
    let userSearch = document.getElementById("search-bar");
    let userPreview = document.getElementById("preview");

    let balances = JSON.parse(localStorage.getItem('userBalances')) || {
        MTN: 0,
        GLO: 0,
        AIRTEL: 0,
        "T2(9MOBILE)": 0
    };

    updateStorage();
    displayBalance();

    function updateStorage() {
        localStorage.setItem('cards', JSON.stringify(database));
        localStorage.setItem('userBalances', JSON.stringify(balances));
        showCards();
        displayBalance();
    }

    function generatePin() {
        let pin = '';
        for (let i = 0; i < 12; i++) {
            pin += Math.floor(Math.random() * 10);
        }
        return pin;
    }

    function userPin() {
        let userNetwork = document.getElementById("network").value;
        let userAmount = document.getElementById("user-amount").value.trim();

        if (userNetwork === '' || userAmount === '') {
            alert('Abeg select network and amount first! ⚠️');
            return;
        }

        if (isNaN(userAmount)) {
            alert('Amount must be a number! ⚠️');
            return;
        }

         if (userAmount > 10000) {
            alert('Maximum amount is 10,000 Naira! ⚠️');
            return;
        }

        if (userAmount < 50) {
            alert('Minimum amount is 50 Naira! ⚠️');
            return;
        }

        let pin = generatePin();

        const networkLogos = {
            MTN: "New-mtn-logo.jpg",
            GLO: "glo-limited-seeklogo.png",
            AIRTEL: "airtelMobile.png",
            "T2(9MOBILE)": "T2Mobile.png"
        }

        let pinDetails = {
            network: userNetwork.toUpperCase(),
            amount: Number(userAmount),
            pin: pin,
            used: false, //true
            date: new Date().toLocaleTimeString(),
            logo: networkLogos[userNetwork.toUpperCase()]
        };

        database.push(pinDetails);

        displayPin.innerHTML = ` <b>${pin}</b>`;
        alert(`You have successfully generated ${pinDetails.network} airtime of ${pinDetails.amount}.`);
        userAmount.value = '';
        console.log(database);
        updateStorage();
    }

    function loadAirtime() {
        let fullPin = userLoad.value;

        if (!fullPin.startsWith("*311*") || !fullPin.endsWith("#")) {
            alert("Please enter the full PIN in the format *311*PIN#");
            console.log(fullPin);
            return;
        }

        let enteredPin = fullPin.slice(5, -1);
        if (enteredPin.length !== 12 || isNaN(enteredPin)) {
            alert("Check the PIN and try again! Make sure you enter the full PIN in the format *311*PIN#");
            return;
        }

        let foundCard = database.find(card => {
            return enteredPin === card.pin;
            //return enteredPin.includes(card.pin);
        });

        if (foundCard) {
            if (foundCard.used) {
                alert("This card has already been used by you! ❌");
            } else {
                foundCard.used = true;
                balances[foundCard.network] += foundCard.amount;
                console.log(balances[foundCard.network]);

                //userBalance.innerHTML = `Wallet Balance: ${foundCard.network} ₦${balances[foundCard.network].toLocaleString()}`;

                let msg = foundCard.network === 'MTN' ? "Yello!" : "Dear Customer,";
                alert(`${msg} You have successfully loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                userLoad.value = '*311*...#';
                displayPin.innerHTML = 'SUCCESSFUL!';
                //alert(`Recharge Successful! You have loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                /*if (foundCard.network === 'MTN') {
                    alert(`YEllO! You have successfuly loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                    userBalance.innerHTML = `${foundCard.network} Balance: ₦${foundCard.amount}`;
                } else if (foundCard.network === 'GLO') {
                    alert(`Dear customer! You have Successfully loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                    userBalance.innerHTML = `${foundCard.network} Balance: ₦${foundCard.amount}`;
                } else if (foundCard.network === 'AIRTEL') {
                    alert(`Dear customer! You have Successfully loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                    userBalance.innerHTML = `${foundCard.network} Balance: ₦${foundCard.amount}`;
                } else if (foundCard.network === 'T2') {
                    alert(`Dear customer! You have Successfully loaded N${foundCard.amount} ${foundCard.network} airtime. ✅`);
                    userBalance.innerHTML = `${foundCard.network} Balance: ₦${foundCard.amount}`;
                }*/

            }
        } else {
            alert("Invalid PIN! Abeg check your code. ❌");
        }
        updateStorage();
        console.log(enteredPin);
        console.log(database);
    }

    function deleteCard(i) {
        // alert(`you clicked on delete , for index ${i}`)
        let confirmDelete = confirm(`You're about to trash ${database[i].network}, Are you sure?`)
        if (confirmDelete) {
            database.splice(i, 1)
            updateStorage()
            console.log(database);
            console.log(i);
        }
    }

    function showCards() {
        //tbody.innerHTML = ''
        for (let index = 0; index < database.length; index++) {
            fillTable();
        }
    }

    function fillTable() {
        tbody.innerHTML = '';
        database.forEach(({ network, logo, amount, pin, used, date }, index) => {
            let rowStyle = used ? "background-color: rgba(255, 0, 0, 0.2);" : "";
            tbody.innerHTML += ` 
            <tr style="${rowStyle}">
                <td>${index + 1}</td>  
                <td><img src="${logo}" alt="${network} logo" width="40" height="40"></td>  
                <td>${network}</td>  
                <td>₦${amount.toLocaleString()}</td> 
                <td>${pin}</td>  
                <td>${used ? "Used ✅" : "Unused ❌"}</td>
                <td>${date}</td>
                <td style = "background-color: rgb(233, 26, 26); cursor: pointer; text-shadow: 1px 0 5px #FFFFFF;" title="Delete Card" onclick="deleteCard(${index})"> 🗑️ </td>
            </tr> `
        })
    }

    /*function displayBalanceOnLand() {
        userBalance.innerHTML = `
        <b>Current Balances:</b><br>
        MTN: ₦${balances.MTN.toLocaleString()} | 
        Glo: ₦${balances.GLO.toLocaleString()} | 
        Airtel: ₦${balances.AIRTEL.toLocaleString()} | 
        T2(9Mobile): ₦${balances["T2(9MOBILE)"].toLocaleString()}
    `;
    }*/
    function displayBalance() {
        document.getElementById('mtn-bal').innerHTML = balances.MTN.toLocaleString();
        document.getElementById('glo-bal').innerHTML = balances.GLO.toLocaleString();
        document.getElementById('airtel-bal').innerHTML = balances.AIRTEL.toLocaleString();
        document.getElementById('t2-bal').innerHTML = balances["T2(9MOBILE)"].toLocaleString();
    }

    function resetBalance() {
        let confirmReset = confirm("You're about to reset your balances to zero, Are you sure?");
        if (confirmReset) {
            balances = { MTN: 0, GLO: 0, AIRTEL: 0, "T2(9MOBILE)": 0 };
            updateStorage();
        }
    }

    function searchCards() {
        let searchValue = document.getElementById("search-input").value.toUpperCase();

        // We filter the database based on the search term
        let filteredData = database.filter(card => {
            return card.network.includes(searchValue) ||
                card.amount.toString().includes(searchValue) ||
                card.pin.includes(searchValue);
        });
        displayFiltered(filteredData);
    }

    function displayFiltered(dataToShow) {
        tbody.innerHTML = '';

        if (dataToShow.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No match found! ❌</td></tr>';
            return;
        }

        dataToShow.forEach(({ network, logo, amount, pin, used, date }, index) => {
            let rowStyle = used ? "background-color: rgba(255, 0, 0, 0.2);" : "";

            tbody.innerHTML += ` 
        <tr style="${rowStyle}">
            <td>${index + 1}</td>   
            <td><img src="${logo}" width="40" height="40"></td>   
            <td>${network}</td>   
            <td>₦${Number(amount).toLocaleString()}</td> 
            <td>${pin}</td>   
            <td>${used ? "Used ✅" : "Unused ❌"}</td>
            <td>${date}</td>
            <td style="background-color: rgb(233, 26, 26); cursor: pointer;" title="Delete Card" onclick="deleteCard(${index})"> 🗑️ </td>
        </tr> `;
        });
    }
    console.log(database)