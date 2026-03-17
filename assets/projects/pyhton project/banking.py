import csv
import os
import requests

ACCOUNTS_FILE = "accounts.csv"
API_URL = "https://api.exchangerate-api.com/v4/latest/USD"   # free currency API


# ----------------------------------------------------------
#  Load all accounts from CSV
# ----------------------------------------------------------
def load_accounts():
    accounts = {}

    if not os.path.exists(ACCOUNTS_FILE):
        with open(ACCOUNTS_FILE, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["account_number", "name", "password", "balance", "history"])
        return accounts

    with open(ACCOUNTS_FILE, "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            acc = row["account_number"]
            accounts[acc] = {
                "name": row["name"],
                "password": row["password"],
                "balance": float(row["balance"]),
                "history": row["history"].split("|") if row["history"] else []
            }

    return accounts


# ----------------------------------------------------------
#  Save accounts to CSV
# ----------------------------------------------------------
def save_accounts(accounts):
    with open(ACCOUNTS_FILE, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["account_number", "name", "password", "balance", "history"])

        for acc, data in accounts.items():
            history = "|".join(data["history"])
            writer.writerow([acc, data["name"], data["password"], data["balance"], history])


# ----------------------------------------------------------
#  Create new account
# ----------------------------------------------------------
def create_account(accounts):
    name = input("Enter your name: ")
    password = input("Create password: ")

    new_number = str(1000 + len(accounts) + 1)

    accounts[new_number] = {
        "name": name,
        "password": password,
        "balance": 0.0,
        "history": []
    }

    save_accounts(accounts)

    print("\nAccount created!")
    print("Your account number:", new_number)


# ----------------------------------------------------------
#  Login system
# ----------------------------------------------------------
def login(accounts):
    acc = input("Account number: ")
    pwd = input("Password: ")

    if acc in accounts and accounts[acc]["password"] == pwd:
        print("\nLogin successful!\n")
        return acc

    print("Incorrect account or password.")
    return None


# ----------------------------------------------------------
#  Delete Account
# ----------------------------------------------------------
def delete_account(accounts, acc_num):
    confirm = input("Are you sure you want to delete your account? (yes/no): ")

    if confirm.lower() == "yes":
        accounts.pop(acc_num)
        save_accounts(accounts)
        print("Account deleted successfully!")
        return True

    print("Account deletion cancelled.")
    return False


# ----------------------------------------------------------
#  Banking functions
# ----------------------------------------------------------
def deposit(account):
    amount = float(input("Deposit amount: "))
    account["balance"] += amount
    account["history"].append(f"Deposited ${amount}")
    print("Deposit successful!")


def withdraw(account):
    amount = float(input("Withdraw amount: "))

    if amount > account["balance"]:
        print("Insufficient balance!")
        return

    account["balance"] -= amount
    account["history"].append(f"Withdrew ${amount}")
    print("Withdrawal successful!")


def show_balance(account):
    print("Your balance:", account["balance"])


def show_history(account):
    if not account["history"]:
        print("No transactions yet.")
        return

    for item in account["history"]:
        print("-", item)


# ----------------------------------------------------------
#  Real-Time Currency Conversion (API)
# ----------------------------------------------------------
def convert_balance(account):
    print("\nFetching live currency rates...")
    try:
        response = requests.get(API_URL)
        data = response.json()
    except:
        print("Error fetching online rates. Check your internet.")
        return

    usd_balance = account["balance"]
    eur = data["rates"]["EUR"]
    lbp = data["rates"]["LBP"]

    print("\nConvert balance to:")
    print("1. Euro (EUR)")
    print("2. Lebanese Lira (LBP)")

    choice = input("Choice: ")

    if choice == "1":
        print(f"1 USD = {eur} EUR")
        print("Balance in EUR:", usd_balance * eur)

    elif choice == "2":
        print(f"1 USD = {lbp} LBP")
        print("Balance in LBP:", usd_balance * lbp)

    else:
        print("Invalid option.")


# ----------------------------------------------------------
#  Main Menu
# ----------------------------------------------------------
def main():
    accounts = load_accounts()

    while True:
        print("\n=== PYBANK SYSTEM ===")
        print("1. Create Account")
        print("2. Login")
        print("3. Exit")

        choice = input("Choice: ")

        if choice == "1":
            create_account(accounts)

        elif choice == "2":
            acc_num = login(accounts)

            if acc_num:
                while True:
                    print("\n--- ACCOUNT MENU ---")
                    print("1. Show Balance")
                    print("2. Deposit")
                    print("3. Withdraw")
                    print("4. Transaction History")
                    print("5. Convert Balance (Real API)")
                    print("6. Delete Account")
                    print("7. Logout")

                    option = input("Choice: ")

                    if option == "1":
                        show_balance(accounts[acc_num])

                    elif option == "2":
                        deposit(accounts[acc_num])
                        save_accounts(accounts)

                    elif option == "3":
                        withdraw(accounts[acc_num])
                        save_accounts(accounts)

                    elif option == "4":
                        show_history(accounts[acc_num])

                    elif option == "5":
                        convert_balance(accounts[acc_num])

                    elif option == "6":
                        if delete_account(accounts, acc_num):
                            break

                    elif option == "7":
                        print("Logged out.")
                        break

                    else:
                        print("Invalid choice.")

        elif choice == "3":
            print("Goodbye!")
            break

        else:
            print("Invalid choice.")
            

main()