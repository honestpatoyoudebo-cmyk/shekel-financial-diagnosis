const ACTIVE_KEY = "shekel_active_account";
const ACCOUNTS_KEY = "shekel_accounts";
const LEGACY = {
  user: "shekel_user",
  snapshot: "shekel_snapshot",
  expenses: "shekel_expenses",
  goals: "shekel_goals",
  debts: "shekel_debts",
  settings: "shekel_settings",
};

function readRaw(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function writeRaw(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("shekel-storage"));
}
function activeEmail() { return localStorage.getItem(ACTIVE_KEY); }
function accounts() { return readRaw(ACCOUNTS_KEY, {}); }
function writeAccounts(value) { writeRaw(ACCOUNTS_KEY, value); }
function accountData(email) {
  const all = accounts();
  return all[email] || null;
}
function ensureAccount(email, user = {}) {
  if (!email) return null;
  const all = accounts();
  const current = all[email] || {
    user: { id: user.id || null, name: user.name || "", email, avatar: null },
    snapshot: null,
    snapshotId: null,
    diagnosis: null,
    alerts: [],
    expenses: [],
    goals: [],
    debts: [],
    settings: { notifications: true, theme: "Warm Sand (Light)", biometrics: false, accountability: false },
  };
  current.user = { ...current.user, ...user, email };
  all[email] = current;
  writeAccounts(all);
  return current;
}

export function migrateLegacyAccount() {
  if (accounts() && Object.keys(accounts()).length) return;
  const legacyUser = readRaw(LEGACY.user, null);
  if (!legacyUser?.email) return;
  const all = {};
  all[legacyUser.email.toLowerCase()] = {
    user: { id: legacyUser.id || null, name: legacyUser.name || "", email: legacyUser.email, avatar: legacyUser.avatar || null },
    snapshot: readRaw(LEGACY.snapshot, null),
    snapshotId: localStorage.getItem("shekel_snapshot_id"),
    diagnosis: null,
    alerts: [],
    perception: localStorage.getItem("shekel_perception"),
    expenses: readRaw(LEGACY.expenses, []),
    goals: readRaw(LEGACY.goals, []),
    debts: readRaw(LEGACY.debts, []),
    settings: readRaw(LEGACY.settings, { notifications: true, theme: "Warm Sand (Light)", biometrics: false, accountability: false }),
  };
  writeAccounts(all);
  localStorage.setItem(ACTIVE_KEY, legacyUser.email.toLowerCase());
}

function current() {
  const email = activeEmail();
  return email ? accountData(email) : null;
}
function updateCurrent(patch) {
  const email = activeEmail();
  if (!email) return;
  const all = accounts();
  const existing = all[email] || {
    user: { id: null, name: "", email, avatar: null },
    snapshot: null, snapshotId: null, perception: null, diagnosis: null, alerts: [], expenses: [], goals: [], debts: [],
    settings: { notifications: true, theme: "Warm Sand (Light)", biometrics: false, accountability: false },
  };
  all[email] = { ...existing, ...patch };
  writeAccounts(all);
}

export function activateAccount(email, userPatch = {}) {
  const normalized = email.trim().toLowerCase();
  const account = ensureAccount(normalized, { ...userPatch, email: normalized });
  localStorage.setItem(ACTIVE_KEY, normalized);
  if (account?.token) localStorage.setItem("shekel_token", account.token);
  else localStorage.removeItem("shekel_token");
  window.dispatchEvent(new Event("shekel-storage"));
}
export function deactivateAccount() {
  localStorage.removeItem(ACTIVE_KEY);
  localStorage.removeItem("shekel_token");
  window.dispatchEvent(new Event("shekel-storage"));
}
export function getAccounts() {
  return Object.values(accounts()).map((a) => a.user).filter(Boolean);
}
export function removeLocalAccount(email) {
  const normalized = email.trim().toLowerCase();
  const all = accounts();
  delete all[normalized];
  writeAccounts(all);
  if (activeEmail() === normalized) deactivateAccount();
}
export function getToken() { return localStorage.getItem("shekel_token"); }
export function saveToken(token) {
  if (token) localStorage.setItem("shekel_token", token); else localStorage.removeItem("shekel_token");
  const email = activeEmail();
  if (email) updateCurrent({ token: token || null });
}

export function clearStarterDemoData() {
  const email = activeEmail();
  if (!email) return;
  const currentAccount = accountData(email);
  if (!currentAccount) return;
  const demoGoalNames = new Set(["Emergency Fund", "New Laptop", "Rent Deposit"]);
  const demoDebtNames = new Set(["Business Loan", "Personal Loan", "Buy Now Pay Later"]);
  const next = { ...currentAccount };
  if (Array.isArray(next.goals) && next.goals.some((g) => demoGoalNames.has(g?.name))) next.goals = [];
  if (Array.isArray(next.debts) && next.debts.some((d) => demoDebtNames.has(d?.name))) next.debts = [];
  updateCurrent(next);
}

export const store = {
  getUser: () => current()?.user || null,
  saveUser: (user) => {
    const email = user?.email || activeEmail();
    if (!email) return;
    ensureAccount(email, user);
  },
  getSnapshot: () => current()?.snapshot || null,
  saveSnapshot: (snapshot) => updateCurrent({ snapshot }),
  getSnapshotId: () => current()?.snapshotId || null,
  saveSnapshotId: (id) => updateCurrent({ snapshotId: id || null }),
  getPerception: () => current()?.perception || null,
  getDiagnosis: () => current()?.diagnosis || null,
  saveDiagnosis: (value) => updateCurrent({ diagnosis: value || null }),
  getAlerts: () => current()?.alerts || [],
  saveAlerts: (items) => updateCurrent({ alerts: Array.isArray(items) ? items : [] }),
  savePerception: (value) => updateCurrent({ perception: value || null }),
  getExpenses: () => current()?.expenses || [],
  saveExpenses: (items) => updateCurrent({ expenses: items }),
  getGoals: () => current()?.goals || [],
  saveGoals: (items) => updateCurrent({ goals: items }),
  getDebts: () => current()?.debts || [],
  saveDebts: (items) => updateCurrent({ debts: items }),
  getSettings: () => current()?.settings || { notifications: true, theme: "Warm Sand (Light)", biometrics: false, accountability: false },
  saveSettings: (settings) => updateCurrent({ settings }),
};

migrateLegacyAccount();
clearStarterDemoData();
