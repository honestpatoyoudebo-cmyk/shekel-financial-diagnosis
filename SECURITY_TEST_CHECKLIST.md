# Shekɛl Stage 2C — Security & Account Testing

## Goal
Verify that multiple people can use Shekɛl on the same browser/device without seeing another account's locally stored financial data.

## Test A — Account A
1. Open Shekɛl in a fresh browser/incognito window or clear the app's local storage first.
2. Register or log in as Account A.
3. Enter Account A financial information.
4. Complete perception and diagnosis.
5. Confirm Account A dashboard shows Account A's entered values and diagnosis.
6. Add one expense, one savings goal, and one debt so account-specific Stage 2B data is also present.
7. Open Profile and click **Log out**.
8. Confirm the app returns to Login.

## Test B — Account B
1. Log in as Account B on the same device/browser.
2. Confirm the dashboard does NOT show Account A's snapshot, diagnosis, expenses, savings goals, or debts.
3. Enter Account B financial information and complete diagnosis.
4. Add a different expense, savings goal, and debt.
5. Confirm Account B dashboard/Budget/Savings/Debt pages show only Account B's records.

## Switch back to Account A
1. Profile → **Log out** (or use **Switch account**).
2. Log in as Account A again.
3. Confirm Account A's original snapshot, diagnosis, expense, savings goal, and debt are still present.
4. Confirm Account B's records are not shown.

## Private-route test
While logged out, manually open:
- `/dashboard`
- `/budget`
- `/expense`
- `/savings`
- `/debts`
- `/notifications`
- `/profile`
- `/perception`
- `/snapshot`
- `/diagnosis`

Each private route should redirect to `/login` because the session token has been cleared.

## Expired/invalid-session test
If the backend returns HTTP 401 for an authenticated request:
- the current token is cleared;
- the current private session should redirect to Login;
- the locally stored account record remains available for that account, but its token is no longer active.

## Important implementation note
The backend collection currently provides authentication and financial-snapshot/diagnosis/alerts endpoints, but it does not provide delete-account, logout, expenses, savings-goal, or debt CRUD endpoints. Therefore Stage 2B expenses/goals/debts are stored per account in this browser/device. Server-side account deletion is not claimed by this frontend.
