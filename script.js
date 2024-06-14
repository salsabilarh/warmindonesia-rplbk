// Singleton Pattern for FoodManager
class FoodManager {
    constructor() {
        if (!FoodManager.instance) {
            this.foods = [
                new Food('Rawon', 20000, './assets/images/rawon.jpg'),
                new Food('Soto Betawi', 15000, './assets/images/sotobetawi.jpg'),
                new Food('Krupuk', 2500, './assets/images/kerupuk_putih.jpg'),
                new Food('Indomie Rebus', 10000, './assets/images/indomierebus.png'),
                new Food('Nasi Ayam Bali', 13000, './assets/images/nasiayambali.png'),
                new Food('Indomie Goreng', 13000, './assets/images/indomiegorengtelur.png'),
                new Food('Nasi Goreng', 18000, './assets/images/nasigoreng.png'),
                new Food('Bakmie Goreng', 18000, './assets/images/bakmigoreng.png'),
                new Food('Bihun Goreng', 20000, './assets/images/bihungoreng.png'),
                new Food('Es Teh Manis', 3000, './assets/images/esteh.png'),
                new Food('Le Minerale', 5000, './assets/images/leminerale.png'),
                new Food('Es Jeruk', 5000, './assets/images/esjeruk.png')
            ];
            FoodManager.instance = this;
        }
        return FoodManager.instance;
    }

    getFoods() {
        return this.foods;
    }
}

class Food {
    constructor(name, price, image) {
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

// Observer Pattern for Cart and UIHandler
class Cart {
    constructor() {
        this.items = [];
        this.totalHargaMakanan = 0;
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    notify() {
        this.subscribers.forEach(subscriber => subscriber.update());
    }

    addItem(food) {
        const item = this.items.find(i => i.food.name === food.name);
        if (item) {
            item.quantity++;
        } else {
            this.items.push(new CartItem(food, 1));
        }
        this.totalHargaMakanan += food.price;
        this.notify();
    }

    removeItem(index) {
        const item = this.items[index];
        if (item.quantity > 0) {
            this.totalHargaMakanan -= item.food.price;
            item.quantity--;
        }
        if (item.quantity === 0) {
            this.items.splice(index, 1);
        }
        this.notify();
    }

    clearCart() {
        this.items = [];
        this.totalHargaMakanan = 0;
        this.notify();
    }

    getItems() {
        return this.items;
    }

    getTotalHarga() {
        return this.totalHargaMakanan;
    }
}

class CartItem {
    constructor(food, quantity) {
        this.food = food;
        this.quantity = quantity;
    }
}

// UIHandler as a Subscriber
class UIHandler {
    constructor(cart, foodManager) {
        this.cart = cart;
        this.foodManager = foodManager;
        this.cart.subscribe(this);
    }

    update() {
        this.generateData();
    }

    generateData() {
        const foodList = document.getElementById('foodList');
        const cartList = document.getElementById('cartList');
        foodList.innerHTML = '';
        cartList.innerHTML = '';

        this.foodManager.getFoods().forEach((food, index) => {
            foodList.appendChild(this.createFoodCard(food, index));
        });

        cartList.appendChild(this.createCartTotal());
        this.cart.getItems().forEach((item, index) => {
            cartList.appendChild(this.createCartItem(item, index));
        });

        cartList.appendChild(this.createOrderForm());

        cartList.style.display = this.cart.getItems().length ? 'inline-block' : 'none';
    }

    createFoodCard(food, index) {
        let divCard = document.createElement('div');
        divCard.classList.add('card');

        let imageData = document.createElement('img');
        imageData.setAttribute("src", food.image);
        divCard.appendChild(imageData);

        let title = document.createElement('p');
        title.innerHTML = food.name;
        divCard.appendChild(title);

        let divAction = document.createElement('div');
        divAction.classList.add('action');

        let spanData = document.createElement('span');
        spanData.innerHTML = `Rp ${UIHandler.toRupiah(food.price)},00`;
        divAction.appendChild(spanData);

        let buttonAdd = document.createElement('button');
        buttonAdd.innerHTML = '<i class="fas fa-cart-plus"></i> Pesan';
        buttonAdd.onclick = () => this.addToCart(index);
        divAction.appendChild(buttonAdd);

        divCard.appendChild(divAction);

        return divCard;
    }

    createCartTotal() {
        let totalDiv = document.createElement('div');
        totalDiv.classList.add('total');

        let totalh1 = document.createElement('h1');
        totalh1.innerHTML = `TOTAL : Rp${UIHandler.toRupiah(this.cart.getTotalHarga())},00`;
        totalDiv.appendChild(totalh1);

        let totalhr = document.createElement('hr');
        totalDiv.appendChild(totalhr);

        return totalDiv;
    }

    createCartItem(item, index) {
        let divCardx = document.createElement('div');
        divCardx.classList.add('card-order');

        let divCardDetail = document.createElement('div');
        divCardDetail.classList.add('detail');

        let imageData = document.createElement('img');
        imageData.setAttribute("src", item.food.image);
        divCardDetail.appendChild(imageData);

        let foodName = document.createElement('p');
        foodName.innerHTML = item.food.name;
        divCardDetail.appendChild(foodName);

        let foodJumlah = document.createElement('span');
        foodJumlah.innerHTML = item.quantity;
        divCardDetail.appendChild(foodJumlah);

        divCardx.appendChild(divCardDetail);

        let buttonCancel = document.createElement('button');
        buttonCancel.setAttribute('value', index);
        buttonCancel.onclick = () => this.removeFromCart(index);
        buttonCancel.innerHTML = '<i class="fas fa-trash"></i> Hapus';
        divCardx.appendChild(buttonCancel);

        return divCardx;
    }

    createOrderForm() {
        let formDiv = document.createElement('div');
        formDiv.classList.add("card-finish");

        let labelName = document.createElement('label');
        labelName.setAttribute('for', 'customerName');
        labelName.innerText = 'Nama Anda';
        formDiv.appendChild(labelName);

        let inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'customerName');
        inputName.setAttribute('placeholder', 'Masukkan nama Anda');
        formDiv.appendChild(inputName);

        let labelTable = document.createElement('label');
        labelTable.setAttribute('for', 'tableNumber');
        labelTable.innerText = 'Nomor Meja';
        formDiv.appendChild(labelTable);

        let inputTable = document.createElement('input');
        inputTable.setAttribute('type', 'text');
        inputTable.setAttribute('id', 'tableNumber');
        inputTable.setAttribute('placeholder', 'Masukkan nomor meja');
        formDiv.appendChild(inputTable);

        let buttonOrder = document.createElement('button');
        buttonOrder.onclick = () => this.orderFood();
        buttonOrder.innerHTML = 'ORDER SEKARANG';
        formDiv.appendChild(buttonOrder);

        return formDiv;
    }

    addToCart(index) {
        const food = this.foodManager.getFoods()[index];
        this.cart.addItem(food);
    }

    removeFromCart(index) {
        this.cart.removeItem(index);
    }

    orderFood() {
        const customerName = document.getElementById('customerName').value.trim();
        const tableNumber = document.getElementById('tableNumber').value.trim();
        
        if (!customerName || !tableNumber) {
            alert('Nama dan Nomor Meja harus diisi.');
            return;
        }

        const orderMessage = this.generateOrderMessage(customerName, tableNumber);
        const encodedMessage = encodeURIComponent(orderMessage);
        const whatsappURL = `https://wa.me/6285211131190?text=${encodedMessage}`;

        if (confirm("Anda akan diarahkan ke WhatsApp untuk mengirim pesanan. Lanjutkan?")) {
            const newWindow = window.open(whatsappURL, "_blank");
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                alert("Gagal membuka WhatsApp. Pastikan WhatsApp terinstall atau salin pesan berikut untuk mengirim manual:\n\n" + decodeURIComponent(encodedMessage));
            } else {
                alert("Pesanan telah diterima, Mohon menunggu.");
                this.cart.clearCart();
                this.generateData();
            }
        }
    }

    generateOrderMessage(customerName, tableNumber) {
        let orderMessage = `*Nama: ${customerName}*\n`;
        orderMessage += `*Nomor Meja: ${tableNumber}*\n\n`;
        orderMessage += `*Pesanan:*\n\n`;
        this.cart.getItems().forEach(item => {
            orderMessage += `• ${item.food.name} x ${item.quantity}\n`;
        });
        orderMessage += `\n*Total Harga: Rp${UIHandler.toRupiah(this.cart.getTotalHarga())},00*\n\n`;
        return orderMessage;
    }
    
    static toRupiah(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

const cart = new Cart();
const foodManager = new FoodManager();
const uiHandler = new UIHandler(cart, foodManager);
uiHandler.generateData();