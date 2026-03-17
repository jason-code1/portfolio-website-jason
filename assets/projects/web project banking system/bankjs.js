class BankSystem {
    constructor() {
        this.accounts = this.loadAccounts();
        this.currentAccount = null;
        this.API_URL = 'https://api.frankfurter.app/latest?from=USD';
    }

    loadAccounts() {
        const storedAccounts = localStorage.getItem('pybank_accounts');
        if (storedAccounts) {
            return JSON.parse(storedAccounts);
        } else {
            return {};
        }
    }

    saveAccounts() {
        localStorage.setItem('pybank_accounts', JSON.stringify(this.accounts));
    }

    generateAccountNumber() {
        const nextNum = Object.keys(this.accounts).length + 1001;
        return nextNum.toString();
    }

    createAccount(name, password) {
        const newNumber = this.generateAccountNumber();
        this.accounts[newNumber] = {
            name: name,
            password: password,
            balance: 0.0,
            history: []
        };
        this.saveAccounts();
        return newNumber;
    }

    login(accountNumber, password) {
        if (this.accounts[accountNumber] && this.accounts[accountNumber].password === password) {
            this.currentAccount = accountNumber;
            return true;
        }
        return false;
    }

    deleteAccount() {
        if (this.currentAccount && this.accounts[this.currentAccount]) {
            delete this.accounts[this.currentAccount];
            this.saveAccounts();
            this.currentAccount = null;
            return true;
        }
        return false;
    }

    deposit(amount) {
        if (this.currentAccount && amount > 0) {
            this.accounts[this.currentAccount].balance += amount;
            this.accounts[this.currentAccount].history.push(`Deposited $${amount.toFixed(2)}`);
            this.saveAccounts();
            return true;
        }
        return false;
    }

    withdraw(amount) {
        if (this.currentAccount && amount > 0) {
            if (amount <= this.accounts[this.currentAccount].balance) {
                this.accounts[this.currentAccount].balance -= amount;
                this.accounts[this.currentAccount].history.push(`Withdrew $${amount.toFixed(2)}`);
                this.saveAccounts();
                return true;
            }
        }
        return false;
    }

    getBalance() {
        return this.currentAccount ? this.accounts[this.currentAccount].balance : 0;
    }

    getHistory() {
        return this.currentAccount ? this.accounts[this.currentAccount].history : [];
    }

    async convertBalance(currency) {
        try {
            const response = await fetch(this.API_URL);
            const data = await response.json();
            const balance = this.getBalance();
            let result = '';
            
            if (currency === 'EUR') {
                const eurRate = data.rates.EUR || 0.93;
                result = `Balance in EUR: €${(balance * eurRate).toFixed(2)}`;
            } else if (currency === 'LBP') {
                const lbpRate = 89500;
                result = `Balance in LBP: ${(balance * lbpRate).toLocaleString()} LBP`;
            }
            return result;
        } catch (error) {
            return 'Could not fetch live rates.';
        }
    }
}

class UIController {
    constructor(bankSystem) {
        this.bank = bankSystem;
        this.init();
    }

    init() {
        // Main Navigation
        document.getElementById('create-account-btn').onclick = () => this.showCreateAccount();
        document.getElementById('login-btn').onclick = () => this.showLogin();
        document.getElementById('exit-btn').onclick = () => alert('Goodbye!');

        document.getElementById('back-to-main').onclick = () => this.showMainMenu();
        document.getElementById('back-to-main-2').onclick = () => this.showMainMenu();
        document.getElementById('logout-btn').onclick = () => this.logout();

        // Forms
        document.getElementById('submit-create-account').onclick = () => this.handleCreateAccount();
        document.getElementById('submit-login').onclick = () => this.handleLogin();

        // Dashboard
        document.getElementById('show-balance-btn').onclick = () => this.showBalance();
        document.getElementById('deposit-btn').onclick = () => this.showModal('deposit');
        document.getElementById('withdraw-btn').onclick = () => this.showModal('withdraw');
        document.getElementById('history-btn').onclick = () => this.showHistory();
        document.getElementById('convert-btn').onclick = () => this.showConversion();
        document.getElementById('delete-account-btn').onclick = () => this.showDeleteModal();

        // Modal actions
        document.getElementById('confirm-transaction').onclick = () => this.handleTransaction();
        document.getElementById('cancel-transaction').onclick = () => this.hideModals();
        document.getElementById('confirm-delete').onclick = () => this.handleDelete();
        document.getElementById('cancel-delete').onclick = () => this.hideModals();
    }

    showMainMenu() {
        this.hideAll();
        document.getElementById('main-menu').classList.remove('hidden');
    }

    showCreateAccount() {
        this.hideAll();
        document.getElementById('create-account-form').classList.remove('hidden');
        document.getElementById('account-created').classList.add('hidden');
    }

    showLogin() {
        this.hideAll();
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('login-error').classList.add('hidden');
    }

    showAccountDashboard() {
        this.hideAll();
        const acc = this.bank.accounts[this.bank.currentAccount];
        document.getElementById('user-name').innerText = acc.name;
        document.getElementById('account-number-display').innerText = this.bank.currentAccount;
        this.updateBalance();
        document.getElementById('account-dashboard').classList.remove('hidden');
    }

    hideAll() {
        document.querySelectorAll('.menu').forEach(m => m.classList.add('hidden'));
        document.getElementById('message-area').innerText = '';
        this.hideModals();
    }

    updateBalance() {
        document.getElementById('current-balance').innerText = this.bank.getBalance().toFixed(2);
    }

    logout() {
        this.bank.currentAccount = null;
        this.showMainMenu();
    }

    handleCreateAccount() {
        const name = document.getElementById('name').value;
        const pass = document.getElementById('password').value;
        if (!name || !pass) return alert('Fill fields!');
        
        const num = this.bank.createAccount(name, pass);
        document.getElementById('new-account-number').innerText = num;
        document.getElementById('account-created').classList.remove('hidden');
    }

    handleLogin() {
        const num = document.getElementById('login-acc').value;
        const pass = document.getElementById('login-pwd').value;
        if (this.bank.login(num, pass)) {
            this.showAccountDashboard();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    }

    showBalance() {
        document.getElementById('message-area').innerText = `Your balance info has been updated above.`;
        this.updateBalance();
    }

    showModal(type) {
        document.getElementById('transaction-modal').classList.remove('hidden');
        document.getElementById('modal-title').innerText = type.toUpperCase();
        document.getElementById('confirm-transaction').dataset.type = type;
        document.getElementById('amount').value = '';
    }

    hideModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    }

    handleTransaction() {
        const type = document.getElementById('confirm-transaction').dataset.type;
        const val = parseFloat(document.getElementById('amount').value);
        if (isNaN(val) || val <= 0) return alert('Invalid amount');

        if (type === 'deposit') this.bank.deposit(val);
        else this.bank.withdraw(val);
        
        this.updateBalance();
        this.hideModals();
        document.getElementById('message-area').innerText = 'Transaction Successful!';
    }

    showHistory() {
        const list = document.getElementById('history-list');
        const history = this.bank.getHistory();
        list.innerHTML = history.length ? history.map(h => `<div class="history-item">${h}</div>`).join('') : 'No history.';
        document.getElementById('history-container').classList.toggle('hidden');
    }

    async showConversion() {
        const res = document.getElementById('conversion-result');
        res.innerText = 'Calculating...';
        document.getElementById('conversion-container').classList.remove('hidden');
        const eur = await this.bank.convertBalance('EUR');
        const lbp = await this.bank.convertBalance('LBP');
        res.innerHTML = `${eur}<br>${lbp}`;
    }

    showDeleteModal() {
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    handleDelete() {
        if (document.getElementById('delete-confirm').value === 'DELETE') {
            this.bank.deleteAccount();
            this.logout();
        } else {
            alert('Type DELETE to confirm');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UIController(new BankSystem());
});
