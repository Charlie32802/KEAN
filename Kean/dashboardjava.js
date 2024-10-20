document.addEventListener('DOMContentLoaded', function () {
    const setIncomeBtn = document.getElementById('set-income-btn');
    const editIncomeBtn = document.getElementById('edit-income-btn');
    const inputSection = document.getElementById('input-section');
    const balanceSection = document.getElementById('balance-section');
    const balanceDisplay = document.getElementById('balance');
    const salaryDisplay = document.getElementById('salary');
    const inputBalance = document.getElementById('input-balance');
    const inputSalary = document.getElementById('input-salary');
    const body = document.querySelector('body'); // Select body for blur effect

    let balance = 0;
    let salary = 0;

    setIncomeBtn.addEventListener('click', function () {
        // Retrieve input values and parse them as floats
        balance = parseFloat(inputBalance.value) || 0; // Convert to a number, default to 0 if invalid
        salary = parseFloat(inputSalary.value) || 0; // Convert to a number, default to 0 if invalid
        
        if (balance || salary) { // Check if either balance or salary has a valid amount
            balanceDisplay.textContent = `₱${balance.toFixed(2)}`; // Set balance with Philippine Peso symbol
            salaryDisplay.textContent = `₱${salary.toFixed(2)}`; // Set salary with Philippine Peso symbol
            inputSection.style.display = 'none';
            balanceSection.style.display = 'block';
        }
    });
      
    editIncomeBtn.addEventListener('click', function () {
        inputBalance.value = balance.toFixed(2); // Ensure the input is formatted correctly
        inputSalary.value = salary.toFixed(2); // Ensure the input is formatted correctly
        inputSection.style.display = 'block';
        balanceSection.style.display = 'none';
    });

    // Expense logic
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');

    addExpenseBtn.addEventListener('click', function () {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value); // Parse the expense amount to a float

        if (description && !isNaN(amount)) { // Check if description is not empty and amount is valid
            addExpense(description, amount);
            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    function addExpense(description, amount) {
        const row = document.createElement('tr');
    
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = description;
    
        const amountCell = document.createElement('td');
        amountCell.textContent = `₱${amount.toFixed(2)}`; // Changed to Philippine Peso, formatted to 2 decimal places
    
        const actionsCell = document.createElement('td');
    
        // Create Edit Button
        const editBtn = document.createElement('button');
        const editIcon = document.createElement('img');
        editIcon.src = 'edit.png'; // Set the source to your icon
        editIcon.classList.add('icon'); // Add the class for size
        editBtn.appendChild(editIcon);
        editBtn.appendChild(document.createTextNode(' Edit')); // Add text
    
        // Create Delete Button
        const deleteBtn = document.createElement('button');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'delete.png';
        deleteIcon.classList.add('icon');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.appendChild(document.createTextNode(' Delete'));
    
        // Create Paid Button
        const paidBtn = document.createElement('button');
        const paidIcon = document.createElement('img');
        paidIcon.src = 'paid.png';
        paidIcon.classList.add('icon');
        paidBtn.appendChild(paidIcon);
        paidBtn.appendChild(document.createTextNode(' Paid'));
    
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        actionsCell.appendChild(paidBtn);
    
        row.appendChild(descriptionCell);
        row.appendChild(amountCell);
        row.appendChild(actionsCell);
    
        expenseList.appendChild(row);
    
        // Add event listeners for the action buttons
        editBtn.addEventListener('click', function () {
            const saveBtn = document.createElement('button');
            saveBtn.classList.add('save-btn');
    
            const saveIcon = document.createElement('img');
            saveIcon.src = 'save.png'; // Icon for Save button
            saveIcon.classList.add('icon');
            saveBtn.appendChild(saveIcon);
            saveBtn.appendChild(document.createTextNode(' Save'));
    
            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add('cancel-btn');
    
            const cancelIcon = document.createElement('img');
            cancelIcon.src = 'cancel.png'; // Icon for Cancel button
            cancelIcon.classList.add('icon');
            cancelBtn.appendChild(cancelIcon);
            cancelBtn.appendChild(document.createTextNode(' Cancel'));
    
            actionsCell.replaceChild(saveBtn, editBtn);
            actionsCell.appendChild(cancelBtn);
    
            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.value = descriptionCell.textContent;
            descriptionCell.textContent = '';
            descriptionCell.appendChild(descriptionInput);
    
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.value = amountCell.textContent.slice(1); // Get value without the currency symbol
            amountCell.textContent = '';
            amountCell.appendChild(amountInput);
    
            saveBtn.addEventListener('click', function () {
                descriptionCell.textContent = descriptionInput.value;
                amountCell.textContent = `₱${parseFloat(amountInput.value).toFixed(2)}`; // Changed to Philippine Peso
                actionsCell.replaceChild(editBtn, saveBtn);
                actionsCell.removeChild(cancelBtn);
            });
    
            cancelBtn.addEventListener('click', function () {
                descriptionCell.textContent = description;
                amountCell.textContent = `₱${amount.toFixed(2)}`; // Changed to Philippine Peso
                actionsCell.replaceChild(editBtn, saveBtn);
                actionsCell.removeChild(cancelBtn);
            });
        });
    
        deleteBtn.addEventListener('click', function () {
            showNotification(`Are you sure you want to delete "${description}"?`, function () {
                expenseList.removeChild(row);
            });
        });

        paidBtn.addEventListener('click', function () {
            showNotification(`Have you successfully paid "${description}"?`, function () {
                expenseList.removeChild(row);
                // Add to history later
            });
        });
    }

    function showNotification(message, onConfirm) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');

        // Show notification and blur background
        notificationMessage.textContent = message;
        notification.style.display = 'flex';
        body.classList.add('blur-active'); // Apply blur to the body

        yesBtn.onclick = function () {
            onConfirm();
            notification.style.display = 'none';
            body.classList.remove('blur-active'); // Remove blur from the body
        };

        noBtn.onclick = function () {
            notification.style.display = 'none';
            body.classList.remove('blur-active'); // Remove blur from the body
        };
    }

    // Function to open the notification modal
    function openNotification(message) {
        const notification = document.getElementById('notification');
        const blurBody = document.getElementById('blur-body');
        const notificationContent = document.querySelector('.notification-content p');

        notificationContent.textContent = message;
        notification.style.display = 'flex'; // Show notification
        body.classList.add('blur-active'); // Apply blur to the body
    }

    // Function to close the notification modal
    function closeNotification() {
        const notification = document.getElementById('notification');
        body.classList.remove('blur-active'); // Remove blur from the body
        notification.style.display = 'none'; // Hide notification
    }

    // Function to simulate deleting an expense
    function deleteExpense() {
        openNotification('Are you sure you want to delete this expense?');
    }

    // Event listeners for Yes and No buttons in the notification
    document.getElementById('yes-btn').addEventListener('click', function () {
        // Logic to delete the expense goes here
        closeNotification(); // Close notification after action
    });

    document.getElementById('no-btn').addEventListener('click', function () {
        closeNotification(); // Close notification on No button click
    });

    // Example of expense deletion trigger
    document.getElementById('delete-expense-btn').addEventListener('click', deleteExpense);
});
