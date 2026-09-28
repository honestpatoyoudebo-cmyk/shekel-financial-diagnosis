import React from "react";
import {
  Wallet, Home, ShoppingBag, AlertTriangle, CreditCard, Users,
  Bell, LayoutDashboard, PieChart, PiggyBank, Landmark, UserCircle,
  Plus, ArrowUpRight, ArrowDownRight, ChevronRight, Check, Eye, EyeOff,
  Receipt, Car, Zap, Heart, Utensils, Target, ShieldCheck, Settings,
  LogOut, Menu, X, Sparkles
} from "lucide-react";

const map = {
  wallet: Wallet, home: Home, shopping: ShoppingBag, alert: AlertTriangle,
  credit: CreditCard, users: Users, bell: Bell, dashboard: LayoutDashboard,
  budget: PieChart, savings: PiggyBank, debt: Landmark, profile: UserCircle,
  plus: Plus, up: ArrowUpRight, down: ArrowDownRight, next: ChevronRight,
  check: Check, eye: Eye, eyeOff: EyeOff, receipt: Receipt, car: Car, bolt: Zap,
  heart: Heart, food: Utensils, target: Target, shield: ShieldCheck,
  settings: Settings, logout: LogOut, menu: Menu, close: X, sparkles: Sparkles
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, ...props }) {
  const C = map[name] || Sparkles;
  return <C size={size} strokeWidth={strokeWidth} {...props} />;
}
