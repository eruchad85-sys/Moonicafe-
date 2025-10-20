// Data structures
let menuItems = JSON.parse(localStorage.getItem('moonicafe-menu')) || [];
let sales = JSON.parse(localStorage.getItem('moonicafe-sales')) || [];
let currentOrder = JSON.parse(localStorage.getItem('moonicafe-current-order')) || [];

// Current active category for filtering
let currentCategory = 'all';

// Default categories
const defaultCategories = [
    'Coffee', 'Tea', 'Soft Drink', 'Water', 'Nuts', 'Ice Cream', 'Short Eats'
];

// DOM elements
const posTab = document.getElementById('pos');
const menuManagementTab = document.getElementById('menu-management');
const salesReportTab = document.getElementById('sales-report');
const menuGrid = document.getElementById('menu-grid');
const categoriesContainer = document.getElementById('categories-container');
const orderItemsContainer = document.getElementById('order-items');
const orderTotalAmount = document.getElementById('order-total-amount');
const receiptItemsContainer = document.getElementById('receipt-items');
const receiptTotal = document.getElementById('receipt-total');
const receiptDate = document.getElementById('receipt-date');
const completeOrderBtn = document.getElementById('complete-order');
const clearOrderBtn = document.getElementById('clear-order');
const printReceiptBtn = document.getElementById('print-receipt');
const addItemBtn = document.getElementById('add-item-btn');
const exportMenuBtn = document.getElementById('export-menu');
const importMenuBtn = document.getElementById('import-menu');
const menuItemsTable = document.getElementById('menu-items-table');
const reportDate = document.getElementById('report-date');
const filterSalesBtn = document.getElementById('filter-sales');
const exportSalesBtn = document.getElementById('export-sales');
const menuSearch = document.getElementById('menu-search');
const itemModal = document.getElementById('item-modal');
const itemForm = document.getElementById('item-form');
const modalTitle = document.getElementById('modal-title');
const closeBtns = document.querySelectorAll('.close-btn');
const cancelItemBtn = document.getElementById('cancel-item');

// Daily sales report elements
const dailyReportTitle = document.getElementById('daily-report-title');
const dateDisplay = document.getElementById('date-display');
const dailySalesSummary = document.getElementById('daily-sales-summary');
const dailySalesTable = document.getElementById('daily-sales-table');

// Initialize the app
function init() {
    // Load default menu if empty
    if (menuItems.length === 0) {
        loadDefaultMenu();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial data
    renderCategories();
    renderMenuItems();
    renderOrder();
    renderMenuManagement();
    
    // Set today's date as default in the date filter
    const today = new Date().toISOString().split('T')[0];
    reportDate.value = today;
    
    // Update receipt date
    updateReceiptDate();
    
    // Load today's sales report by default
    renderDailySalesReport(today);
}

// Set up event listeners
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            
            // Update data if needed
            if (tab.dataset.tab === 'sales-report') {
                const selectedDate = reportDate.value;
                renderDailySalesReport(selectedDate);
            } else if (tab.dataset.tab === 'menu-management') {
                renderMenuManagement();
            }
        });
    });
    
    // Category buttons
    categoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderMenuItems(currentCategory);
        }
    });
    
    // Order actions
    completeOrderBtn.addEventListener('click', completeOrder);
    clearOrderBtn.addEventListener('click', clearOrder);
    printReceiptBtn.addEventListener('click', printReceipt);
    
    // Menu management
    addItemBtn.addEventListener('click', () => openItemModal());
    exportMenuBtn.addEventListener('click', exportMenu);
    importMenuBtn.addEventListener('click', importMenu);
    
    // Sales report
    filterSalesBtn.addEventListener('click', () => {
        const selectedDate = reportDate.value;
        renderDailySalesReport(selectedDate);
    });
    exportSalesBtn.addEventListener('click', exportSales);
    
    // Search
    menuSearch.addEventListener('input', searchMenuItems);
    
    // Modal controls
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            itemModal.classList.add('hidden');
        });
    });
    
    cancelItemBtn.addEventListener('click', () => itemModal.classList.add('hidden'));
    itemForm.addEventListener('submit', saveMenuItem);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            itemModal.classList.add('hidden');
        }
    });
}

// Load default menu items
function loadDefaultMenu() {
    menuItems = [
        { id: 1, name: 'Espresso', category: 'Coffee', price: 25.00 },
        { id: 2, name: 'Cappuccino', category: 'Coffee', price: 30.00 },
        { id: 3, name: 'Latte', category: 'Coffee', price: 35.00 },
        { id: 4, name: 'Black Tea', category: 'Tea', price: 15.00 },
        { id: 5, name: 'Green Tea', category: 'Tea', price: 20.00 },
        { id: 6, name: 'Iced Tea', category: 'Tea', price: 25.00 },
        { id: 7, name: 'Cola', category: 'Soft Drink', price: 20.00 },
        { id: 8, name: 'Orange Juice', category: 'Soft Drink', price: 25.00 },
        { id: 9, name: 'Mineral Water', category: 'Water', price: 10.00 },
        { id: 10, name: 'Sparkling Water', category: 'Water', price: 15.00 },
        { id: 11, name: 'Almonds', category: 'Nuts', price: 40.00 },
        { id: 12, name: 'Cashews', category: 'Nuts', price: 45.00 },
        { id: 13, name: 'Vanilla Ice Cream', category: 'Ice Cream', price: 35.00 },
        { id: 14, name: 'Chocolate Ice Cream', category: 'Ice Cream', price: 40.00 },
        { id: 15, name: 'Sandwich', category: 'Short Eats', price: 50.00 },
        { id: 16, name: 'Pastry', category: 'Short Eats', price: 30.00 }
    ];
    saveMenuToStorage();
}

// Save menu to localStorage
function saveMenuToStorage() {
    localStorage.setItem('moonicafe-menu', JSON.stringify(menuItems));
}

// Save sales to localStorage
function saveSalesToStorage() {
    localStorage.setItem('moonicafe-sales', JSON.stringify(sales));
}

// Save current order to localStorage
function saveOrderToStorage() {
    localStorage.setItem('moonicafe-current-order', JSON.stringify(currentOrder));
}

// Render categories
function renderCategories() {
    const categories = [...new Set(menuItems.map(item => item.category))];
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.innerHTML = `<i class="fas fa-tag"></i> ${category}`;
        button.dataset.category = category;
        categoriesContainer.appendChild(button);
    });
}

// Render menu items
function renderMenuItems(category = 'all') {
    menuGrid.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-utensils"></i>
                <h3>No menu items found</h3>
                <p>Add some items to your menu to get started</p>
            </div>
        `;
        return;
    }
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.id = item.id;
        
        menuItem.innerHTML = `
            <div class="item-image-container">
                <div class="logo-placeholder"><i class="fas fa-utensils"></i></div>
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price.toFixed(2)} MVR</div>
            </div>
        `;
        
        // Add click event for adding to order
        menuItem.addEventListener('click', () => {
            addToOrder(item.id);
        });
        
        menuGrid.appendChild(menuItem);
    });
}

// Add item to order
function addToOrder(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = currentOrder.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentOrder.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveOrderToStorage();
    renderOrder();
    showStatusMessage(`${item.name} added to order`, 'success');
}

// Remove item from order
function removeFromOrder(itemId) {
    const itemIndex = currentOrder.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const itemName = currentOrder[itemIndex].name;
        currentOrder.splice(itemIndex, 1);
        saveOrderToStorage();
        renderOrder();
        showStatusMessage(`${itemName} removed from order`, 'success');
    }
}

// Update item quantity in order
function updateQuantity(itemId, change) {
    const item = currentOrder.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromOrder(itemId);
        } else {
            saveOrderToStorage();
            renderOrder();
        }
    }
}

// Render current order
function renderOrder() {
    orderItemsContainer.innerHTML = '';
    
    if (currentOrder.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>No items in order</h3>
                <p>Click on menu items to add them to your order</p>
            </div>
        `;
        orderTotalAmount.textContent = '0.00 MVR';
        receiptTotal.textContent = '0.00 MVR';
        receiptItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>Receipt will appear here</p>
            </div>
        `;
        document.querySelector('.order-count').textContent = '0 items';
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    
    currentOrder.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price.toFixed(2)} MVR</div>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <button class="quantity-btn remove" data-id="${item.id}">×</button>
            </div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    orderTotalAmount.textContent = `${total.toFixed(2)} MVR`;
    document.querySelector('.order-count').textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
    
    // Update receipt preview
    renderReceiptPreview(total, currentOrder);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(parseInt(btn.dataset.id), -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(parseInt(btn.dataset.id), 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromOrder(parseInt(btn.dataset.id));
        });
    });
}

// Render receipt preview
function renderReceiptPreview(total, items) {
    receiptItemsContainer.innerHTML = '';
    
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const receiptItem = document.createElement('div');
        receiptItem.className = 'receipt-item';
        receiptItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>${itemTotal.toFixed(2)} MVR</span>
        `;
        
        receiptItemsContainer.appendChild(receiptItem);
    });
    
    receiptTotal.textContent = `${total.toFixed(2)} MVR`;
}

// Update receipt date
function updateReceiptDate() {
    const now = new Date();
    receiptDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
}

// Complete order
function completeOrder() {
    if (currentOrder.length === 0) {
        showStatusMessage('No items in order!', 'error');
        return;
    }
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date();
    
    const sale = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString(),
        items: [...currentOrder],
        total: total
    };
    
    sales.push(sale);
    saveSalesToStorage();
    
    // Update receipt date
    updateReceiptDate();
    
    // Show success message
    showStatusMessage('Order completed successfully!', 'success');
    
    // Clear current order
    clearOrder();
    
    // Update sales report if it's visible
    if (salesReportTab.classList.contains('active')) {
        const selectedDate = reportDate.value;
        renderDailySalesReport(selectedDate);
    }
}

// Clear order
function clearOrder() {
    currentOrder = [];
    saveOrderToStorage();
    renderOrder();
}

// Print receipt
function printReceipt() {
    if (currentOrder.length === 0) {
        showStatusMessage('No items in order to print!', 'error');
        return;
    }
    
    window.print();
}

// Render daily sales report
function renderDailySalesReport(date) {
    // Filter sales for the selected date
    const dailySales = sales.filter(sale => sale.date === date);
    
    // Update title and date display
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    dailyReportTitle.textContent = 'Daily Sales Report';
    dateDisplay.textContent = formattedDate;
    
    // Render summary cards
    renderDailySalesSummary(dailySales);
    
    // Render sales table
    renderDailySalesTable(dailySales);
}

// Render daily sales summary
function renderDailySalesSummary(dailySales) {
    // Calculate summary values
    const totalOrders = dailySales.length;
    const totalRevenue = dailySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = dailySales.reduce((sum, sale) => 
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    
    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    dailySalesSummary.innerHTML = `
        <div class="summary-card">
            <h3>Total Orders</h3>
            <div class="value">${totalOrders}</div>
        </div>
        <div class="summary-card">
            <h3>Total Revenue</h3>
            <div class="value total">${totalRevenue.toFixed(2)} MVR</div>
        </div>
        <div class="summary-card">
            <h3>Items Sold</h3>
            <div class="value">${totalItems}</div>
        </div>
        <div class="summary-card">
            <h3>Average Order</h3>
            <div class="value">${averageOrderValue.toFixed(2)} MVR</div>
        </div>
    `;
}

// Render daily sales table
function renderDailySalesTable(dailySales) {
    if (dailySales.length === 0) {
        dailySalesTable.innerHTML = `
            <div class="no-sales-message">
                <i class="fas fa-chart-bar" style="font-size: 48px; margin-bottom: 15px; color: #cbd5e0;"></i>
                <h3>No sales for this date</h3>
                <p>Complete some orders to see sales data</p>
            </div>
        `;
        return;
    }
    
    // Create a table with sales data
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total (MVR)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    dailySales.forEach(sale => {
        tableHTML += `
            <tr>
                <td>${sale.time}</td>
                <td>#${sale.id}</td>
                <td>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${sale.items.map(item => 
                            `<li>${item.name} x ${item.quantity}</li>`
                        ).join('')}
                    </ul>
                </td>
                <td>${sale.total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    dailySalesTable.innerHTML = tableHTML;
}

// Open item modal for adding or editing
function openItemModal(item = null) {
    modalTitle.textContent = item ? 'Edit Item' : 'Add New Item';
    
    // If editing, populate form with item data
    if (item) {
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-price').value = item.price;
        
        // Store the item ID for updating
        itemForm.dataset.editingId = item.id;
    } else {
        // Reset form for new item
        itemForm.reset();
        delete itemForm.dataset.editingId;
    }
    
    itemModal.classList.remove('hidden');
}

// Save menu item
function saveMenuItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const price = parseFloat(document.getElementById('item-price').value);
    
    if (!name || !category || isNaN(price)) {
        showStatusMessage('Please fill all required fields!', 'error');
        return;
    }
    
    // Check if we're editing or adding
    const editingId = itemForm.dataset.editingId;
    
    if (editingId) {
        // Update existing item
        const itemIndex = menuItems.findIndex(item => item.id === parseInt(editingId));
        if (itemIndex !== -1) {
            menuItems[itemIndex].name = name;
            menuItems[itemIndex].category = category;
            menuItems[itemIndex].price = price;
            
            saveMenuToStorage();
            renderMenuItems();
            renderMenuManagement();
            itemModal.classList.add('hidden');
            showStatusMessage('Item updated successfully!', 'success');
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now(),
            name,
            category,
            price
        };
        
        menuItems.push(newItem);
        saveMenuToStorage();
        renderMenuItems();
        renderMenuManagement();
        itemModal.classList.add('hidden');
        showStatusMessage('Item added successfully!', 'success');
    }
}

// Edit menu item
function editMenuItem(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        openItemModal(item);
    }
}

// Delete menu item
function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(item => item.id !== itemId);
        saveMenuToStorage();
        renderMenuItems();
        renderMenuManagement();
        showStatusMessage('Item deleted successfully!', 'success');
    }
}

// Search menu items
function searchMenuItems() {
    const searchTerm = menuSearch.value.toLowerCase();
    const tableRows = document.querySelectorAll('#menu-items-table tr');
    
    tableRows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export menu
function exportMenu() {
    const dataStr = JSON.stringify(menuItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'moonicafe-menu.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showStatusMessage('Menu exported successfully!', 'success');
}

// Import menu
function importMenu() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedMenu = JSON.parse(e.target.result);
                
                if (Array.isArray(importedMenu)) {
                    menuItems = importedMenu;
                    saveMenuToStorage();
                    renderMenuItems();
                    renderMenuManagement();
                    showStatusMessage('Menu imported successfully!', 'success');
                } else {
                    showStatusMessage('Invalid menu file format!', 'error');
                }
            } catch (error) {
                showStatusMessage('Error reading menu file!', 'error');
            }
        };
        reader.readAsText(file);
    });
    
    fileInput.click();
}

// Export sales
function exportSales() {
    const selectedDate = reportDate.value;
    const dailySales = sales.filter(sale => sale.date === selectedDate);
    
    const dataStr = JSON.stringify(dailySales, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `moonicafe-sales-${selectedDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showStatusMessage('Sales data exported successfully!', 'success');
}

// Render menu management
function renderMenuManagement() {
    // Render menu items table
    menuItemsTable.innerHTML = '';
    
    if (menuItems.length === 0) {
        menuItemsTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <i class="fas fa-utensils"></i>
                        <h3>No menu items</h3>
                        <p>Add some items to your menu</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    menuItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price.toFixed(2)} MVR</td>
            <td>
                <button class="edit-btn" data-id="${item.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        menuItemsTable.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editMenuItem(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteMenuItem(parseInt(btn.dataset.id)));
    });
}

// Show status message
function showStatusMessage(message, type) {
    // Remove any existing status message
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new status message
    const statusMessage = document.createElement('div');
    statusMessage.className = `status-message ${type}`;
    statusMessage.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Insert at the top of the container
    document.querySelector('.container').insertBefore(statusMessage, document.querySelector('.nav-tabs'));
    
    // Remove after 3 seconds
    setTimeout(() => {
        statusMessage.remove();
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);