const books = [
    { id: 1, title: "Código Limpo", author: "Robert Martin", price: 45.90, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
    { id: 2, title: "Algoritmos: Teoria e Prática", author: "Thomas H. Cormen", price: 89.00, img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400" },
    { id: 3, title: "Design Patterns", author: "Erich Gamma", price: 55.00, img: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400" },
    { id: 4, title: "Hábitos Atómicos", author: "James Clear", price: 24.99, img: "https://images.unsplash.com/photo-1592492159418-39f319320569?q=80&w=400" },
    { id: 5, title: "O Programador Pragmático", author: "Andrew Hunt", price: 42.00, img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400" },
    { id: 6, title: "Pai Rico, Pai Pobre", author: "Robert Kiyosaki", price: 21.50, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400" }
];
let cart = JSON.parse(localStorage.getItem('book_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    updateUI();
});

function renderBooks() {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.img}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p style="font-weight: 800; color: #2563eb; margin: 10px 0">${book.price.toFixed(2)}€</p>
            <button class="btn-pay" style="margin-top:0" onclick="addToCart(${book.id})">Adicionar</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const book = books.find(b => b.id === id);
    const inCart = cart.find(i => i.id === id);
    inCart ? inCart.qty++ : cart.push({ ...book, qty: 1 });
    saveAndRefresh();
    if (!document.getElementById('cart-sidebar').classList.contains('active')) toggleCart();
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('book_cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    list.innerHTML = cart.length === 0 ? '<p>Carrinho vazio</p>' : cart.map(item => `
        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee">
            <div><h4>${item.title}</h4><button onclick="updateQty(${item.id}, -1)">-</button> ${item.qty} <button onclick="updateQty(${item.id}, 1)">+</button></div>
            <span>${(item.price * item.qty).toFixed(2)}€</span>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    totalEl.innerText = `${total.toFixed(2)}€`;
    countEl.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function switchTab(e, method) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    e.currentTarget.classList.add('active');
    document.getElementById(`payment-${method}-content`).classList.add('active');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function openPayment() {
    if (cart.length === 0) return alert("Carrinho vazio!");
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('pay-amount').innerText = `${total.toFixed(2)}€`;
    document.getElementById('payment-modal').classList.add('active');
}

function closePayment() { document.getElementById('payment-modal').classList.remove('active'); }

function processPayment(e, method) {
    e.preventDefault();
    const btn = e.submitter;
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processando...";
    btn.disabled = true;

    setTimeout(() => {
        if(method === 'Multibanco') alert("Entidade: 12345 | Ref: 987 654 321");
        alert(`🎉 Pagamento via ${method} concluído!`);
        cart = []; saveAndRefresh(); closePayment(); toggleCart();
        btn.innerHTML = "Confirmar"; btn.disabled = false;
    }, 2000);
}