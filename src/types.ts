/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServicePayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string;
  w1?: boolean;
  w2?: boolean;
  w3?: boolean;
  w4?: boolean;
}

export interface WeeklyContributor {
  id: string;
  name: string;
  weeklyAmount: number;
  w1: boolean;
  w2: boolean;
  w3: boolean;
  w4: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  price: number;
  category: 'comida' | 'hogar';
  isBought: boolean;
}

export interface StoreRecommendation {
  id: string;
  storeName: string;
  bestFor: string;
  avoidFor?: string;
  notes: string;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  timeOfDay: 'Mañana' | 'Tarde' | 'Noche' | 'Personalizado'; // Specific pill timers
  notes?: string;
}

export interface BloodPressureReading {
  id: string;
  date: string;
  period: 'AM' | 'PM';
  systolic: number; // Max
  diastolic: number; // Min
  pulse: number; // Heart rate
  notes?: string;
}

export interface SavingsProgress {
  currentSavings: number;
  goalAmount: number;
  goalName: string;
}

export interface FamilyBirthday {
  id: string;
  name: string;
  date: string;
  relationship: string;
}

export interface FamilyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface IsssteAppointment {
  id: string;
  date: string;
  time: string;
  specialty: string;
  doctor: string;
  notes?: string;
  isCompleted: boolean;
}

export interface WeeklySurplus {
  id: string;
  weekLabel: string;
  amount: number;
  date: string;
}

export interface MonthlyArchive {
  id: string;
  monthYear: string; // e.g. "2026-05"
  monthLabel: string; // e.g. "Mayo 2026"
  archivedAt: string;
  monthlyIncome: number;
  totalContributorsPaid: number;
  totalServicesPaid: number;
  rentCollected: number;
  grandmaWaterGlasses: number;
  weeklySurplusesTotal: number;
  contributorsSnap: WeeklyContributor[];
  servicesSnap: ServicePayment[];
  rentStatesSnap: { israel: boolean; ericka: boolean; grandma: boolean };
  savingsSnapshot: number;
}


