/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  DollarSign, 
  Receipt, 
  ShoppingBag, 
  Activity, 
  PiggyBank, 
  Users, 
  Home, 
  AlertTriangle, 
  Clock, 
  Cake, 
  CheckCircle,
  Menu,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  User,
  LogOut,
  ChefHat,
  Calendar,
  Archive
} from 'lucide-react';

import { 
  ServicePayment, 
  WeeklyContributor, 
  ShoppingItem, 
  StoreRecommendation, 
  Medicine, 
  BloodPressureReading, 
  SavingsProgress, 
  FamilyBirthday, 
  FamilyContact,
  IsssteAppointment,
  WeeklySurplus,
  MonthlyArchive
} from './types';

import { 
  INITIAL_SERVICES, 
  INITIAL_CONTRIBUTORS, 
  INITIAL_SHOPPING, 
  INITIAL_STORES, 
  INITIAL_MEDICINES, 
  INITIAL_READINGS, 
  INITIAL_BIRTHDAYS, 
  INITIAL_CONTACTS,
  MOM_ADVICES,
  INITIAL_APPOINTMENTS
} from './defaultData';

import TributeHeader from './components/TributeHeader';
import HouseholdSettingsPanel from './components/HouseholdSettingsPanel';
import ContributionsPanel from './components/ContributionsPanel';
import ServicesPanel from './components/ServicesPanel';
import RentPanel from './components/RentPanel';
import ShoppingPanel from './components/ShoppingPanel';
import HealthPanel from './components/HealthPanel';
import SavingsPanel from './components/SavingsPanel';
import FamilySection from './components/FamilySection';
import LoginScreen from './components/LoginScreen';
import UserProfileAndSettings from './components/UserProfileAndSettings';
import RecipesPanel from './components/RecipesPanel';

type TabID = 'panorama' | 'finances' | 'shopping' | 'health' | 'recipes' | 'savings' | 'family' | 'profile';

export default function App() {
  // ---------------------------------------------------------------------------
  // STATE DEFINITIONS WITH LOCALSTORAGE LOADERS
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabID>('panorama');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeProfileSubTab, setActiveProfileSubTab] = useState<'perfil' | 'frases' | 'cumpleanos'>('perfil');

  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; avatarUrl: string; provider: 'email' | 'google' } | null>(() => {
    const saved = localStorage.getItem('lety_current_user_v3');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('lety_current_user_v3');
    setCurrentUser(null);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lety_current_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lety_current_user_v3');
    }
  }, [currentUser]);

  const isAdmin = currentUser?.email?.toLowerCase().trim() === 'inglizvera@gmail.com' || 
                  currentUser?.name?.toLowerCase().trim().includes('ericka') || 
                  currentUser?.name?.toLowerCase().trim().includes('erika');

  // --- HOME PARAMETER STATES (EDITABLE) ---
  const [grandmaName, setGrandmaName] = useState(() => {
    return localStorage.getItem('lety_grandma_name') || 'Esperanza';
  });

  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('lety_monthly_income');
    return saved ? parseFloat(saved) : 19800;
  });

  const [foodBudget, setFoodBudget] = useState(() => {
    const saved = localStorage.getItem('lety_food_budget');
    return saved ? parseFloat(saved) : 6200;
  });

  const [basicsBudget, setBasicsBudget] = useState(() => {
    const saved = localStorage.getItem('lety_basics_budget');
    return saved ? parseFloat(saved) : 1200;
  });

  const [savingsAlloc, setSavingsAlloc] = useState(() => {
    const saved = localStorage.getItem('lety_savings_alloc');
    return saved ? parseFloat(saved) : 1500;
  });

  const [transportBudget, setTransportBudget] = useState(() => {
    const saved = localStorage.getItem('lety_transport_budget');
    return saved ? parseFloat(saved) : 1000;
  });

  // Housing service averages
  const [rentAverage, setRentAverage] = useState(() => {
    const saved = localStorage.getItem('lety_rent_avg');
    return saved ? parseFloat(saved) : 7500;
  });
  const [izziAverage, setIzziAverage] = useState(() => {
    const saved = localStorage.getItem('lety_izzi_avg');
    return saved ? parseFloat(saved) : 345;
  });
  const [luzAverage, setLuzAverage] = useState(() => {
    const saved = localStorage.getItem('lety_luz_avg');
    return saved ? parseFloat(saved) : 1500;
  });
  const [aguaAverage, setAguaAverage] = useState(() => {
    const saved = localStorage.getItem('lety_agua_avg');
    return saved ? parseFloat(saved) : 400;
  });
  const [gasAverage, setGasAverage] = useState(() => {
    const saved = localStorage.getItem('lety_gas_avg');
    return saved ? parseFloat(saved) : 333;
  });
  const [veladorDia, setVeladorDia] = useState(() => {
    const saved = localStorage.getItem('lety_velador_dia');
    return saved ? parseFloat(saved) : 120;
  });
  const [veladorNoche, setVeladorNoche] = useState(() => {
    const saved = localStorage.getItem('lety_velador_noche');
    return saved ? parseFloat(saved) : 120;
  });
  const [limpieza, setLimpieza] = useState(() => {
    const saved = localStorage.getItem('lety_limpieza');
    return saved ? parseFloat(saved) : 1200;
  });

  // --- CORE SERVICES & CHECKLIST STATES ---
  const [services, setServices] = useState<ServicePayment[]>(() => {
    const saved = localStorage.getItem('lety_services_v2'); // upgraded key to avoid old cached services conflict
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [contributors, setContributors] = useState<WeeklyContributor[]>(() => {
    const saved = localStorage.getItem('lety_contributors_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTORS;
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('lety_shopping_v3');
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING;
  });

  const [momAdvices, setMomAdvices] = useState<string[]>(() => {
    const saved = localStorage.getItem('lety_mom_advices_v3');
    return saved ? JSON.parse(saved) : MOM_ADVICES;
  });

  const [storeRecommendations, setStoreRecommendations] = useState<StoreRecommendation[]>(() => {
    const saved = localStorage.getItem('lety_stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('lety_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [bloodPressureReadings, setBloodPressureReadings] = useState<BloodPressureReading[]>(() => {
    const saved = localStorage.getItem('lety_readings');
    return saved ? JSON.parse(saved) : INITIAL_READINGS;
  });

  const [savings, setSavings] = useState<SavingsProgress>(() => {
    const saved = localStorage.getItem('lety_savings_v3');
    return saved ? JSON.parse(saved) : { 
      currentSavings: 0, 
      goalAmount: 15000, 
      goalName: 'Guardadito de imperfectos y reparaciones del hogar' 
    };
  });

  const [birthdays, setBirthdays] = useState<FamilyBirthday[]>(() => {
    const saved = localStorage.getItem('lety_birthdays');
    return saved ? JSON.parse(saved) : INITIAL_BIRTHDAYS;
  });

  const [contacts, setContacts] = useState<FamilyContact[]>(() => {
    const saved = localStorage.getItem('lety_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [isssteAppointments, setIsssteAppointments] = useState<IsssteAppointment[]>(() => {
    const saved = localStorage.getItem('lety_issste_appointments_v1');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [glassCount, setGlassCount] = useState<number>(() => {
    const saved = localStorage.getItem('lety_abuela_water_today');
    return saved ? parseInt(saved) : 0;
  });

  const [rentStates, setRentStates] = useState(() => {
    const saved = localStorage.getItem('lety_rent_states_v2');
    return saved ? JSON.parse(saved) : { israel: false, ericka: false, grandma: false };
  });

  // --- NEW ARCHIVE & CLOSING STATES ---
  const [weeklySurpluses, setWeeklySurpluses] = useState<WeeklySurplus[]>(() => {
    const saved = localStorage.getItem('lety_weekly_surpluses_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyArchives, setMonthlyArchives] = useState<MonthlyArchive[]>(() => {
    const saved = localStorage.getItem('lety_monthly_archives_v1');
    return saved ? JSON.parse(saved) : [];
  });

  interface RolloverAlert {
    show: boolean;
    detectedNewMonth: string;
    previousMonthLabel: string;
  }

  const [rolloverAlert, setRolloverAlert] = useState<RolloverAlert>({
    show: false,
    detectedNewMonth: '',
    previousMonthLabel: ''
  });

  // ---------------------------------------------------------------------------
  // SYNCHRONIZATION WITH LOCALSTORAGE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('lety_rent_states_v2', JSON.stringify(rentStates));
  }, [rentStates]);

  useEffect(() => {
    localStorage.setItem('lety_weekly_surpluses_v2', JSON.stringify(weeklySurpluses));
  }, [weeklySurpluses]);

  useEffect(() => {
    localStorage.setItem('lety_monthly_archives_v1', JSON.stringify(monthlyArchives));
  }, [monthlyArchives]);

  useEffect(() => {
    localStorage.setItem('lety_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('lety_contributors_v3', JSON.stringify(contributors));
  }, [contributors]);

  useEffect(() => {
    localStorage.setItem('lety_shopping_v3', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem('lety_mom_advices_v3', JSON.stringify(momAdvices));
  }, [momAdvices]);

  useEffect(() => {
    localStorage.setItem('lety_stores', JSON.stringify(storeRecommendations));
  }, [storeRecommendations]);

  useEffect(() => {
    localStorage.setItem('lety_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('lety_readings', JSON.stringify(bloodPressureReadings));
  }, [bloodPressureReadings]);

  useEffect(() => {
    localStorage.setItem('lety_savings_v3', JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('lety_birthdays', JSON.stringify(birthdays));
  }, [birthdays]);

  useEffect(() => {
    localStorage.setItem('lety_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('lety_issste_appointments_v1', JSON.stringify(isssteAppointments));
  }, [isssteAppointments]);

  useEffect(() => {
    localStorage.setItem('lety_abuela_water_today', glassCount.toString());
  }, [glassCount]);

  // Sync parameter settings with localStorage
  useEffect(() => {
    localStorage.setItem('lety_grandma_name', grandmaName);
  }, [grandmaName]);

  useEffect(() => {
    localStorage.setItem('lety_monthly_income', monthlyIncome.toString());
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('lety_food_budget', foodBudget.toString());
  }, [foodBudget]);

  useEffect(() => {
    localStorage.setItem('lety_basics_budget', basicsBudget.toString());
  }, [basicsBudget]);

  useEffect(() => {
    localStorage.setItem('lety_savings_alloc', savingsAlloc.toString());
  }, [savingsAlloc]);

  useEffect(() => {
    localStorage.setItem('lety_transport_budget', transportBudget.toString());
  }, [transportBudget]);

  useEffect(() => {
    localStorage.setItem('lety_rent_avg', rentAverage.toString());
  }, [rentAverage]);

  useEffect(() => {
    localStorage.setItem('lety_izzi_avg', izziAverage.toString());
  }, [izziAverage]);

  useEffect(() => {
    localStorage.setItem('lety_luz_avg', luzAverage.toString());
  }, [luzAverage]);

  useEffect(() => {
    localStorage.setItem('lety_agua_avg', aguaAverage.toString());
  }, [aguaAverage]);

  useEffect(() => {
    localStorage.setItem('lety_gas_avg', gasAverage.toString());
  }, [gasAverage]);

  useEffect(() => {
    localStorage.setItem('lety_velador_dia', veladorDia.toString());
  }, [veladorDia]);

  useEffect(() => {
    localStorage.setItem('lety_velador_noche', veladorNoche.toString());
  }, [veladorNoche]);

  useEffect(() => {
    localStorage.setItem('lety_limpieza', limpieza.toString());
  }, [limpieza]);

  useEffect(() => {
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // e.g. "2026-05"
    const savedLastMonth = localStorage.getItem('lety_last_checked_month_year');

    const getMonthNameLabelFromStr = (ymStr: string) => {
      try {
        const [year, month] = ymStr.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const monthsNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${monthsNames[monthIndex]} ${year}`;
      } catch {
        return 'Mes Anterior';
      }
    };

    if (!savedLastMonth) {
      // First time setting current active month
      localStorage.setItem('lety_last_checked_month_year', currentMonthStr);
    } else if (savedLastMonth !== currentMonthStr) {
      // Calendar month has rolled over!
      setRolloverAlert({
        show: true,
        detectedNewMonth: currentMonthStr,
        previousMonthLabel: getMonthNameLabelFromStr(savedLastMonth)
      });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // TRANSACTION / MUTATION ACTIONS
  // ---------------------------------------------------------------------------
  
  // BUDGET & TRANSACTIONS
  const handleResetDefaults = () => {
    setGrandmaName('Esperanza');
    setMonthlyIncome(19800);
    setFoodBudget(6200);
    setBasicsBudget(1200);
    setSavingsAlloc(1500);
    setTransportBudget(1000);
    setRentAverage(7500);
    setIzziAverage(345);
    setLuzAverage(1500);
    setAguaAverage(400);
    setGasAverage(333);
    setVeladorDia(120);
    setVeladorNoche(120);
    setLimpieza(1200);

    // Also reset items lists to show default parameters
    setServices(INITIAL_SERVICES);
    setContributors(INITIAL_CONTRIBUTORS);
    setShoppingItems(INITIAL_SHOPPING);
    setMomAdvices(MOM_ADVICES);
    setSavings({
      currentSavings: 1500,
      goalAmount: 18000,
      goalName: 'Guardadito de imperfectos y reparaciones del hogar 🏡🛠️'
    });
  };

  const handleAddContributor = (name: string, weeklyAmount: number) => {
    const newContributor: WeeklyContributor = {
      id: 'wc_' + Math.random().toString(36).substr(2, 9),
      name,
      weeklyAmount,
      w1: false,
      w2: false,
      w3: false,
      w4: false
    };
    setContributors(prev => [...prev, newContributor]);
  };

  const handleUpdateContributor = (id: string, updated: Partial<WeeklyContributor>) => {
    setContributors(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const handleDeleteContributor = (id: string) => {
    setContributors(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleRent = (person: 'israel' | 'ericka' | 'grandma') => {
    setRentStates(prev => ({
      ...prev,
      [person]: !prev[person]
    }));
  };

  // SERVICES
  const handleAddService = (name: string, amount: number, dueDate: string) => {
    const newService: ServicePayment = {
      id: 's_' + Math.random().toString(36).substr(2, 9),
      name,
      amount,
      dueDate,
      isPaid: false
    };
    setServices(prev => [newService, ...prev]);
  };

  const handleToggleServicePaid = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextPaid = !s.isPaid;
        const normName = s.name ? s.name.toLowerCase() : '';
        const isWeekly = normName.includes('velador') || normName.includes('limpieza');
        
        const updated = {
          ...s,
          isPaid: nextPaid,
          paymentDate: nextPaid ? todayStr : undefined
        };

        if (isWeekly) {
          updated.w1 = nextPaid;
          updated.w2 = nextPaid;
          updated.w3 = nextPaid;
          updated.w4 = nextPaid;
        }

        return updated;
      }
      return s;
    }));
  };

  const handleToggleServiceWeek = (id: string, week: 1 | 2 | 3 | 4) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const key = `w${week}` as 'w1' | 'w2' | 'w3' | 'w4';
        const updated = {
          ...s,
          [key]: !s[key]
        };
        
        // Check if all 4 weeks are now checked
        const allChecked = !!(updated.w1 && updated.w2 && updated.w3 && updated.w4);
        updated.isPaid = allChecked;
        updated.paymentDate = allChecked ? todayStr : undefined;
        
        return updated;
      }
      return s;
    }));
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateService = (id: string, name: string, amount: number, dueDate: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, name, amount, dueDate };
      }
      return s;
    }));
  };

  // GROCERIES & SHOPPING
  const handleAddItem = (name: string, qty: string, price: number, category: 'comida' | 'hogar') => {
    const newItem: ShoppingItem = {
      id: 'sh_' + Math.random().toString(36).substr(2, 9),
      name,
      qty,
      price,
      category,
      isBought: false
    };
    setShoppingItems(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (id: string, updated: Partial<ShoppingItem>) => {
    setShoppingItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const handleToggleItemBought = (id: string) => {
    setShoppingItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isBought: !item.isBought };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddStoreRecommendation = (storeName: string, bestFor: string, avoidFor: string, notes: string) => {
    const newStore: StoreRecommendation = {
      id: 'st_' + Math.random().toString(36).substr(2, 9),
      storeName,
      bestFor,
      avoidFor,
      notes
    };
    setStoreRecommendations(prev => [newStore, ...prev]);
  };

  // HEALTH TRACKER
  const handleAddMedicine = (name: string, dose: string, frequency: string, timeOfDay: 'Mañana' | 'Tarde' | 'Noche' | 'Personalizado', notes: string) => {
    const newMed: Medicine = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      name,
      dose,
      frequency,
      timeOfDay,
      notes
    };
    setMedicines(prev => [newMed, ...prev]);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleAddReading = (period: 'AM' | 'PM', systolic: number, diastolic: number, pulse: number, notes: string) => {
    const newReading: BloodPressureReading = {
      id: 'r_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      period,
      systolic,
      diastolic,
      pulse,
      notes
    };
    setBloodPressureReadings(prev => [...prev, newReading]);
  };

  const handleDeleteReading = (id: string) => {
    setBloodPressureReadings(prev => prev.filter(r => r.id !== id));
  };

  const handleAddAppointment = (date: string, time: string, specialty: string, doctor: string, notes?: string) => {
    const newAppt: IsssteAppointment = {
      id: 'a_' + Math.random().toString(36).substr(2, 9),
      date,
      time,
      specialty,
      doctor,
      notes,
      isCompleted: false
    };
    setIsssteAppointments(prev => [newAppt, ...prev].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const handleToggleAppointment = (id: string) => {
    setIsssteAppointments(prev => prev.map(a => a.id === id ? { ...a, isCompleted: !a.isCompleted } : a));
  };

  const handleDeleteAppointment = (id: string) => {
    setIsssteAppointments(prev => prev.filter(a => a.id !== id));
  };

  // SAVINGS PROGRESS & MONTHLY ARCHIVES
  const handleUpdateSavings = (amount: number) => {
    setSavings(prev => {
      const nextVal = Math.max(0, prev.currentSavings + amount);
      return { ...prev, currentSavings: nextVal };
    });
  };

  const handleUpdateGoal = (goalName: string, goalAmount: number) => {
    setSavings(prev => ({
      ...prev,
      goalName,
      goalAmount
    }));
  };

  const handleAddSurplus = (weekLabel: string, amount: number) => {
    const newSurplus: WeeklySurplus = {
      id: 'ws_' + Math.random().toString(36).substr(2, 9),
      weekLabel,
      amount,
      date: new Date().toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setWeeklySurpluses(prev => [newSurplus, ...prev]);
    handleUpdateSavings(amount);
  };

  const handleDeleteSurplus = (id: string, amount: number) => {
    setWeeklySurpluses(prev => prev.filter(item => item.id !== id));
    handleUpdateSavings(-amount);
  };

  const handleArchiveCurrentMonth = (customMonthLabel: string) => {
    // 1. Calculate stats of the current active parameters
    const totalContributed = contributors.reduce((sum, c) => {
      let count = 0;
      if (c.w1) count += c.weeklyAmount;
      if (c.w2) count += c.weeklyAmount;
      if (c.w3) count += c.weeklyAmount;
      if (c.w4) count += c.weeklyAmount;
      return sum + count;
    }, 0);

    const totalServicesPaid = services.filter(s => s.isPaid).reduce((sum, s) => sum + s.amount, 0);

    let rentPaidCount = 0;
    if (rentStates.israel) rentPaidCount++;
    if (rentStates.ericka) rentPaidCount++;
    if (rentStates.grandma) rentPaidCount++;
    const rentCollected = rentPaidCount * 2500;

    const weeklySurplusesTotal = weeklySurpluses.reduce((sum, item) => sum + item.amount, 0);

    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 2. Put together the snapshot object
    const archiveObj: MonthlyArchive = {
      id: 'arch_' + Math.random().toString(36).substr(2, 9),
      monthYear,
      monthLabel: customMonthLabel,
      archivedAt: new Date().toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      monthlyIncome,
      totalContributorsPaid: totalContributed,
      totalServicesPaid,
      rentCollected,
      grandmaWaterGlasses: glassCount,
      weeklySurplusesTotal,
      contributorsSnap: JSON.parse(JSON.stringify(contributors)),
      servicesSnap: JSON.parse(JSON.stringify(services)),
      rentStatesSnap: { ...rentStates },
      savingsSnapshot: savings.currentSavings
    };

    // 3. Save into array
    setMonthlyArchives(prev => [archiveObj, ...prev]);

    // 4. RESET active trackers for a new fresh month
    setContributors(prev => 
      prev.map(c => ({
        ...c,
        w1: false,
        w2: false,
        w3: false,
        w4: false
      }))
    );

    setServices(prev => 
      prev.map(s => ({
        ...s,
        isPaid: false,
        paymentDate: undefined
      }))
    );

    setRentStates({
      israel: false,
      ericka: false,
      grandma: false
    });

    setGlassCount(0);
    setWeeklySurpluses([]); // Leftovers are cleared for a new month!

    // Save checked month to prevent double trigger
    localStorage.setItem('lety_last_checked_month_year', monthYear);
  };

  const handleDeleteArchive = (id: string) => {
    setMonthlyArchives(prev => prev.filter(item => item.id !== id));
  };

  // FAMILY MEMBERS AND CONTACTS
  const handleAddBirthday = (name: string, date: string, relationship: string) => {
    const newBday: FamilyBirthday = {
      id: 'b_' + Math.random().toString(36).substr(2, 9),
      name,
      date,
      relationship
    };
    setBirthdays(prev => [newBday, ...prev]);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  const handleAddContact = (name: string, phone: string, relationship: string) => {
    const newContact: FamilyContact = {
      id: 'co_' + Math.random().toString(36).substr(2, 9),
      name,
      phone,
      relationship
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // ---------------------------------------------------------------------------
  // GLOBAL STATISTICS CALCULATOR
  // ---------------------------------------------------------------------------
  const getContributorMonthTotal = (c: WeeklyContributor) => {
    let weeksCount = 0;
    if (c.w1) weeksCount++;
    if (c.w2) weeksCount++;
    if (c.w3) weeksCount++;
    if (c.w4) weeksCount++;
    return c.weeklyAmount * weeksCount;
  };

  const isWeeklyService = (name: string) => {
    const norm = name?.toLowerCase() || '';
    return norm.includes('velador') || norm.includes('limpieza');
  };

  const totalContributed = contributors.reduce((sum, c) => sum + getContributorMonthTotal(c), 0);
  
  // Regular paid services (IsPaid and not Velador/Limpieza)
  const regularPaidServicesSum = services
    .filter(s => !isWeeklyService(s.name) && s.isPaid)
    .reduce((sum, s) => sum + s.amount, 0);

  // Weekly paid services (Velador/Limpieza, calculated by weeks checked)
  const paidWeeklyServicesSum = services
    .filter(s => isWeeklyService(s.name))
    .reduce((sum, s) => {
      let weeksChecked = 0;
      if (s.w1) weeksChecked++;
      if (s.w2) weeksChecked++;
      if (s.w3) weeksChecked++;
      if (s.w4) weeksChecked++;
      return sum + (s.amount / 4) * weeksChecked;
    }, 0);

  // Despensa/Compras hechas con check
  const paidShoppingSum = shoppingItems
    .filter(item => item.isBought)
    .reduce((sum, item) => sum + item.price, 0);

  // Total amount paid for physical services list on dashboard
  const paidServicesSum = regularPaidServicesSum + paidWeeklyServicesSum;
  
  const unpaidServicesSum = services.filter(s => !s.isPaid).reduce((sum, s) => sum + s.amount, 0);

  // Updated formula subtracting regular paid services, weekly paid services, and bought grocery items
  const familyCashBalance = totalContributed - regularPaidServicesSum - paidWeeklyServicesSum - paidShoppingSum;

  // Compile active alerts to show in the "Panorama" tab
  interface SystemAlert {
    id: string;
    type: 'critical' | 'alert' | 'health_alert' | 'anniversary';
    message: string;
    sub: string;
    badge: string;
  }

  const REFERENCE_TODAY_STR = '2026-05-21';
  const systemToday = new Date(REFERENCE_TODAY_STR + 'T00:00:00');

  const getSystemAlerts = (): SystemAlert[] => {
    const list: SystemAlert[] = [];

    // 1. Service bill due date checks
    services.forEach(s => {
      if (s.isPaid) return;
      const due = new Date(s.dueDate + 'T00:00:00');
      const timeDiff = due.getTime() - systemToday.getTime();
      const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

      if (diffDays < 0) {
        list.push({
          id: `alert-serv-${s.id}`,
          type: 'critical',
          message: `¡Servicio Atrasado! El recibo de "${s.name}" expiró hace ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}.`,
          sub: 'Recomiendo liquidar de inmediato antes de que suspendan el servicio.',
          badge: '🚨 Atrasado'
        });
      } else if (diffDays === 0) {
        list.push({
          id: `alert-serv-${s.id}`,
          type: 'critical',
          message: `¡HOY vence el pago de "${s.name}" por $${s.amount}!`,
          sub: 'Vence en el transcurso del día. Por favor realiza el pago o marca el check.',
          badge: '⏰ Toca pagar Hoy'
        });
      } else if (diffDays === 1) {
        list.push({
          id: `alert-serv-${s.id}`,
          type: 'alert',
          message: `Mañana vence el recibo de "${s.name}" ($${s.amount}).`,
          sub: '¿Ya coordinaron quién hace el pago mañana temprano?',
          badge: '🔔 Recordatorio'
        });
      }
    });

    // 2. Health warning (Grandma's blood pressure high warnings)
    if (bloodPressureReadings.length > 0) {
      const lastReading = bloodPressureReadings[bloodPressureReadings.length - 1];
      if (lastReading.systolic >= 140 || lastReading.diastolic >= 90) {
        list.push({
          id: `alert-bp-high`,
          type: 'health_alert',
          message: `Lectura de presión alta detectada en la abuelita: ${lastReading.systolic}/${lastReading.diastolic} mmHg.`,
          sub: `Tomada el ${new Date(lastReading.date + 'T00:00:00').toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})} (${lastReading.period === 'AM' ? 'Mañana' : 'Tarde'}). Favor de guardar reposo y vigilar síntomas.`,
          badge: '🩺 Cuidado Médico'
        });
      }
    }

    // 3. Upcoming birthdays (in less than 7 days)
    birthdays.forEach(b => {
      const birthDate = new Date(b.date + 'T00:00:00');
      let nextBday = new Date(systemToday.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBday < systemToday) {
        nextBday.setFullYear(systemToday.getFullYear() + 1);
      }
      const diffTime = nextBday.getTime() - systemToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        list.push({
          id: `alert-bday-${b.id}`,
          type: 'anniversary',
          message: `¡HOY es el cumpleaños de ${b.name}! 🥳`,
          sub: `¡Felicítale y mándale un abrazo especial de la familia!`,
          badge: '🎉 Fiesta'
        });
      } else if (diffDays <= 7) {
        list.push({
          id: `alert-bday-${b.id}`,
          type: 'anniversary',
          message: `El cumpleaños de ${b.name} es en ${diffDays} días.`,
          sub: `${b.relationship} cumple años el ${birthDate.toLocaleDateString('es-MX', {day: 'numeric', month: 'long'})}.`,
          badge: '🎂 Pastel'
        });
      }
    });

    return list;
  };

  const sysAlerts = getSystemAlerts();

  // Get latest blood pressure reading for quick status on dashboard
  const latestBP = bloodPressureReadings.length > 0 ? bloodPressureReadings[bloodPressureReadings.length - 1] : null;

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* ---------------------------------------------------------------------------
       * APP SHELL TOP BAR NAVIGATION
       * --------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Tribute Flag */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('panorama')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/20">
              👩‍👧‍👦
            </div>
            <div>
              <h1 className="text-base font-serif font-bold tracking-tight text-white flex items-center gap-1.5">
                Lety App
                <span className="text-[10px] sm:text-xs text-stone-400 bg-stone-800 border border-stone-700 font-sans font-medium px-2 py-0.5 rounded-full inline-block">
                  Leticia Rodríguez E. 🕊️
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Tab Selector */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
            <button
              id="tab-btn-panorama"
              onClick={() => setActiveTab('panorama')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'panorama' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Panorama Global</span>
            </button>
            <button
              id="tab-btn-finances"
              onClick={() => setActiveTab('finances')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'finances' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Presupuesto y Servicios</span>
            </button>
            <button
              id="tab-btn-shopping"
              onClick={() => setActiveTab('shopping')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'shopping' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Despensa del Hogar</span>
            </button>
            <button
              id="tab-btn-health"
              onClick={() => setActiveTab('health')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'health' 
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Cuidado de Abuela</span>
            </button>
            <button
              id="tab-btn-recipes"
              onClick={() => setActiveTab('recipes')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'recipes' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-extrabold' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Recetas 1800 Kcal</span>
            </button>
            <button
              id="tab-btn-savings"
              onClick={() => setActiveTab('savings')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'savings' 
                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-md shadow-pink-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>Ahorro</span>
            </button>
            <button
              id="tab-btn-family"
              onClick={() => setActiveTab('family')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'family' 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/20' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Familia</span>
            </button>
            <button
              id="tab-btn-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white shadow-md shadow-fuchsia-500/20 font-extrabold' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Perfil & Ajustes</span>
            </button>
          </nav>

          {/* Quick family info details */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-stone-300 bg-stone-800/80 px-2.5 py-1.5 rounded-lg border border-stone-700/50">
              Caja: <strong className="text-emerald-400 font-extrabold">${familyCashBalance.toLocaleString()} MXN</strong>
            </span>
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-stone-800/80 rounded-xl p-1 px-2 transition duration-150 border border-transparent hover:border-stone-750 cursor-pointer text-left"
                  title="Configuración de Perfil"
                >
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full border border-pink-500/50 object-cover bg-stone-850 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-black text-rose-100 hidden md:inline truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-stone-400 select-none">▼</span>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200/95 rounded-2xl shadow-xl z-50 p-2 space-y-1 text-left animate-feed-in">
                    <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
                      <p className="text-[9px] font-black uppercase text-stone-400 font-mono">Lety App v3</p>
                      <p className="text-xs font-serif font-black text-stone-800 truncate">{currentUser.name}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setActiveProfileSubTab('perfil');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-stone-700 hover:text-black hover:bg-stone-100/80 rounded-xl text-xs font-bold font-sans flex items-center gap-2 cursor-pointer transition"
                    >
                      <span>👤</span>
                      <span>Perfil de Cuenta</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setActiveProfileSubTab('frases');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-stone-700 hover:text-black hover:bg-rose-50 rounded-xl text-xs font-bold font-sans flex items-center gap-2 cursor-pointer transition"
                    >
                      <span>💬</span>
                      <span>Frases de Lety</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setActiveProfileSubTab('cumpleanos');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-stone-700 hover:text-black hover:bg-indigo-50 rounded-xl text-xs font-bold font-sans flex items-center gap-2 cursor-pointer transition"
                    >
                      <span>📅</span>
                      <span>Ajustes de Cumpleaños</span>
                    </button>

                    <div className="border-t border-stone-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-red-650 hover:text-red-700 hover:bg-rose-50/50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition"
                      >
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu Button toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-850 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------------------
       * MOBILE NAVIGATION SIDEBAR MENU
       * --------------------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex justify-end">
          <div className="w-4/5 max-w-sm bg-stone-900 border-l border-stone-800 text-stone-100 h-full p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                <span className="font-serif font-bold text-white">Menú Lety App</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {currentUser && (
                <div 
                  onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                  className="bg-stone-850 hover:bg-stone-800 cursor-pointer border border-stone-800 rounded-2xl p-3 flex items-center gap-3 transition-colors"
                >
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border border-pink-400 shrink-0" referrerPolicy="no-referrer" />
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs block text-white truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-stone-400 block truncate">{currentUser.email}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {(
                  [
                    { id: 'panorama', label: 'Panorama Global', icon: <Home className="w-5 h-5" /> },
                    { id: 'finances', label: 'Presupuesto y Servicios', icon: <Receipt className="w-5 h-5" /> },
                    { id: 'shopping', label: 'Despensa del Hogar', icon: <ShoppingBag className="w-5 h-5" /> },
                    { id: 'health', label: 'Cuidado de Abuela', icon: <Activity className="w-5 h-5" /> },
                    { id: 'recipes', label: 'Recetas 1800 Kcal', icon: <ChefHat className="w-5 h-5" /> },
                    { id: 'savings', label: 'Ahorro Familiar', icon: <PiggyBank className="w-5 h-5" /> },
                    { id: 'family', label: 'Directorio y Cumpleaños', icon: <Users className="w-5 h-5" /> },
                    { id: 'profile', label: 'Perfil & Ajustes', icon: <User className="w-5 h-5" /> },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-sm font-black' 
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-800 pt-4 text-center">
              <span className="text-xs text-stone-500 block">Lety App • Hecho con Amor</span>
              <span className="text-[10px] text-stone-600 block mt-0.5">En memoria de Leticia Rodríguez E. 🕊️</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------
       * MAIN CONTENT AREA
       * --------------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Core Tribute Section Banner */}
        <TributeHeader momAdvices={momAdvices} />

        {/* MONTHLY ROLLOVER BANNER */}
        {rolloverAlert.show && (
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-stone-900 to-indigo-950 border-2 border-indigo-500/30 text-white shadow-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Calendar className="w-32 h-32 text-indigo-200" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <span className="inline-block text-[10px] font-black tracking-widest uppercase bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/20">
                  🗓️ ¡Nuevo Mes Detectado!
                </span>
                <h3 className="text-base font-serif font-black text-white flex items-center gap-2">
                  Ha comenzado un nuevo ciclo mensual
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed max-w-2xl font-sans">
                  Para mantener las cuentas familiares claras y organizadas del mes anterior (<strong>{rolloverAlert.previousMonthLabel}</strong>), puedes archivar su reporte histórico de servicios, rentas y abonos en nuestra base de datos local y reiniciar los marcadores semanales.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 font-bold text-xs shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleArchiveCurrentMonth(rolloverAlert.previousMonthLabel);
                    setRolloverAlert(prev => ({ ...prev, show: false }));
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition cursor-pointer text-center"
                >
                  📥 Archivar y Reiniciar Mes
                </button>
                <button
                  onClick={() => setRolloverAlert(prev => ({ ...prev, show: false }))}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-xl transition cursor-pointer text-center"
                >
                  Omitir por ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 1: PANORAMA GLOBAL (TABLERO PANORAMICO CON ALARMAS)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'panorama' && (
          <div className="space-y-6">
            {/* PANORAMIC GRID STATUS METERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Financial Box Card */}
              <div 
                onClick={() => setActiveTab('finances')}
                className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-250 transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Caja Disponible</span>
                      <span className="block text-xl font-mono font-bold text-emerald-800 mt-1">${familyCashBalance.toLocaleString()} MXN</span>
                    </div>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Detailed breakdown list requested by user */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-[10px] font-sans text-stone-550">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">➕ Facturado / Abonos:</span>
                      <span className="font-mono font-bold text-stone-700">+${totalContributed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">🛒 Despensa con check:</span>
                      <span className="font-mono font-semibold text-rose-600">-${paidShoppingSum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">💡 Servicios fijos con check:</span>
                      <span className="font-mono font-semibold text-rose-700">-${regularPaidServicesSum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">🛡️ Apoyo y Seguridad con check:</span>
                      <span className="font-mono font-semibold text-rose-700">-${paidWeeklyServicesSum.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-stone-600 font-semibold group-hover:text-amber-800 transition-colors pt-2 border-t border-stone-50">
                  <span>Ver abonos y cobros</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Shopping List Progress Card */}
              <div 
                onClick={() => setActiveTab('shopping')}
                className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-250 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Despensa Hecha</span>
                    <span className="block text-xl font-bold text-stone-800 mt-1">
                      {shoppingItems.filter(item => item.isBought).length} de {shoppingItems.length} compras
                    </span>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                {/* Visual bar progress */}
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${shoppingItems.length > 0 ? (shoppingItems.filter(i => i.isBought).length / shoppingItems.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-xs text-stone-600 font-semibold group-hover:text-amber-800 transition-colors">
                  <span>Revisar lista y ofertas</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Grandma health state Card */}
              <div 
                onClick={() => setActiveTab('health')}
                className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-250 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Última Presión Abuela</span>
                    <span className="block text-xl font-mono font-bold text-stone-800 mt-1">
                      {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : 'Sin tomas'} 
                      {latestBP && <span className="text-xs font-normal text-stone-500 ml-1">mmHg</span>}
                    </span>
                  </div>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-stone-600 font-semibold group-hover:text-amber-800 transition-colors">
                  <span>Ver tomas e historial</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Family savings metrics Card */}
              <div 
                onClick={() => setActiveTab('savings')}
                className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-250 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Alcancía Familiar</span>
                    <span className="block text-xl font-mono font-bold text-rose-600 mt-1">
                      ${savings.currentSavings.toLocaleString()} <span className="text-xs font-normal text-stone-500">de ${savings.goalAmount.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-stone-600 font-semibold group-hover:text-amber-800 transition-colors">
                  <span>Ver alcancía</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* ALARMS & ALERTS CENTER PANEL */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-lg font-serif font-bold text-stone-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Centro de Alarmas y Recordatorios del Hogar
              </h2>

              {sysAlerts.length === 0 ? (
                <div className="text-center py-10 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-emerald-800 p-4">
                  <span className="text-3xl block mb-2">🌸</span>
                  <p className="font-serif font-bold text-base">¡Todo al corriente en Lety App!</p>
                  <p className="text-xs text-emerald-700/80 mt-1">No hay recibos vencidos ni tomas de presión anómalas. ¡Mamá está orgullosa!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sysAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                        alert.type === 'critical' 
                          ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-xs' 
                          : alert.type === 'health_alert'
                            ? 'bg-orange-50/80 border-orange-200 text-stone-900'
                            : alert.type === 'alert'
                              ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                              : 'bg-stone-50 border-stone-150 text-stone-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {alert.type === 'critical' && <span className="text-rose-600 text-lg">⚠️</span>}
                          {alert.type === 'health_alert' && <span className="text-red-600 text-lg">🩺</span>}
                          {alert.type === 'alert' && <span className="text-amber-500 text-lg">🔔</span>}
                          {alert.type === 'anniversary' && <span className="text-pink-600 text-lg">🎂</span>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm tracking-tight leading-tight">{alert.message}</h4>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono ${
                              alert.type === 'critical' ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-700'
                            }`}>
                              {alert.badge}
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-stone-600 font-serif leading-relaxed italic">{alert.sub}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (alert.id.startsWith('alert-serv-')) setActiveTab('finances');
                          if (alert.id.startsWith('alert-bp-')) setActiveTab('health');
                          if (alert.id.startsWith('alert-bday-')) setActiveTab('family');
                        }}
                        className="text-xs font-semibold underline hover:text-stone-900 text-stone-500 cursor-pointer whitespace-nowrap"
                      >
                        Atender ya
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK LINK PANELS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Pills Schedule at a glance */}
              <div className="bg-gradient-to-br from-stone-50 to-orange-50/20 border border-stone-200/50 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-serif font-bold text-stone-800 flex items-center gap-1.5">
                    <span>🌅</span> Horarios de Pastillas (Abuela {grandmaName})
                  </h3>
                  <button 
                    onClick={() => setActiveTab('health')}
                    className="text-xs font-semibold text-rose-700/80 hover:text-rose-800 hover:underline cursor-pointer"
                  >
                    Ver detalles
                  </button>
                </div>
                
                <div className="space-y-2.5">
                  {medicines.map(med => (
                    <div key={med.id} className="bg-white border border-stone-150 p-2.5 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">{med.name}</span>
                        <span className="text-[10px] text-stone-500 italic block">{med.dose} – {med.frequency}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-850 font-bold rounded-lg uppercase">
                        {med.timeOfDay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family contacts fast whatsapp dials */}
              <div className="bg-gradient-to-br from-stone-50 to-emerald-50/20 border border-stone-200/50 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-serif font-bold text-stone-800 flex items-center gap-1.5">
                    <span>📱</span> Contactos de Emergencia Familiar
                  </h3>
                  <button 
                    onClick={() => setActiveTab('family')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                  >
                    Ver directorio
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {contacts.slice(0, 4).map(contact => (
                    <div 
                      key={contact.id} 
                      onClick={() => {
                        let phoneClean = contact.phone;
                        if (phoneClean.length === 10) phoneClean = `52${phoneClean}`;
                        window.open(`https://wa.me/${phoneClean}?text=Hola%20${contact.name}%21%20Te%20escribo%20de%20Lety%20App%20❤️`, '_blank');
                      }}
                      className="bg-white hover:bg-emerald-50/30 hover:border-emerald-300 cursor-pointer border border-stone-150 p-2.5 rounded-xl flex items-center gap-2 transition"
                    >
                      <div className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1 pt-0.5 rounded">
                        WA
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-bold text-xs text-stone-850 block truncate">{contact.name}</span>
                        <span className="text-[9px] text-stone-400 block truncate">{contact.relationship}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet 1800 Kcal quick link card */}
              <div className="bg-gradient-to-br from-stone-50 to-emerald-50/20 border border-stone-200/50 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-serif font-bold text-stone-800 flex items-center gap-1.5">
                      <span>🥦</span> Menú de Dieta 1800 Kcal
                    </h3>
                    <span className="p-1 px-2 rounded-lg bg-emerald-100/70 text-emerald-800 text-[9px] font-black uppercase tracking-wider font-sans">
                      Nutrición
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans font-medium">
                    Plan alimenticio bajo en sodio para controlar la presión de abuela {grandmaName}, con raciones escalables para todos en casa.
                  </p>
                </div>
                
                <button 
                  onClick={() => setActiveTab('recipes')}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Ver Menús y Escalar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 2: BUDGET & SERVICE CONTROL (FINANZAS)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'finances' && (
          <div className="space-y-6 animate-fade-in">
            {/* HOUSEHOLD SETTINGS & CONFIGURATOR PANEL */}
            <HouseholdSettingsPanel
              grandmaName={grandmaName}
              setGrandmaName={setGrandmaName}
              monthlyIncome={monthlyIncome}
              setMonthlyIncome={setMonthlyIncome}
              foodBudget={foodBudget}
              setFoodBudget={setFoodBudget}
              basicsBudget={basicsBudget}
              setBasicsBudget={setBasicsBudget}
              transportBudget={transportBudget}
              setTransportBudget={setTransportBudget}
              rentAverage={rentAverage}
              setRentAverage={setRentAverage}
              izziAverage={izziAverage}
              setIzziAverage={setIzziAverage}
              luzAverage={luzAverage}
              setLuzAverage={setLuzAverage}
              aguaAverage={aguaAverage}
              setAguaAverage={setAguaAverage}
              gasAverage={gasAverage}
              setGasAverage={setGasAverage}
              veladorDia={veladorDia}
              setVeladorDia={setVeladorDia}
              veladorNoche={veladorNoche}
              setVeladorNoche={setVeladorNoche}
              limpieza={limpieza}
              setLimpieza={setLimpieza}
              onResetDefaults={handleResetDefaults}
              currentUser={currentUser}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-12">
                <div className="border border-stone-150 rounded-2xl p-4 bg-rose-50/20 text-rose-950 font-serif text-xs italic">
                  📸 <strong>Lista de Tareas Pendientes del Mes:</strong> Abajo puedes registrar los abonos que realmente ingresan o marcar el pago verificado de los recibos de servicios del mes activo.
                </div>
              </div>

              <div className="lg:col-span-5 h-full">
                <ContributionsPanel 
                  contributors={contributors}
                  onAddContributor={handleAddContributor}
                  onUpdateContributor={handleUpdateContributor}
                  onDeleteContributor={handleDeleteContributor}
                  totalPaidServices={paidServicesSum}
                  monthlyBudgetGoal={monthlyIncome}
                  isAdmin={isAdmin}
                />
              </div>

              <div className="lg:col-span-3 h-full">
                <RentPanel 
                  rentStates={rentStates}
                  onToggleRent={handleToggleRent}
                  monthlyBudgetGoal={monthlyIncome}
                  isAdmin={isAdmin}
                />
              </div>
              
              <div className="lg:col-span-4 h-full">
                <ServicesPanel 
                  services={services.filter(s => s.name?.toLowerCase() !== 'renta mensual' && s.name?.toLowerCase() !== 'renta')}
                  onAddService={handleAddService}
                  onToggleServicePaid={handleToggleServicePaid}
                  onToggleServiceWeek={handleToggleServiceWeek}
                  onDeleteService={handleDeleteService}
                  isAdmin={isAdmin}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 3: WEEKLY SHOPPING & OFFERS NOTES (DESPENSA)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'shopping' && (
          <ShoppingPanel 
            shoppingItems={shoppingItems}
            storeRecommendations={storeRecommendations}
            onToggleItemBought={handleToggleItemBought}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
            onAddStoreRecommendation={handleAddStoreRecommendation}
            foodBudgetLimit={foodBudget}
            basicsBudgetLimit={basicsBudget}
            isAdmin={isAdmin}
          />
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 4: ABULA ESPERANZA CARE TRACKER (SALUD)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'health' && (
          <HealthPanel 
            medicines={medicines}
            bloodPressureReadings={bloodPressureReadings}
            onAddMedicine={handleAddMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            onAddReading={handleAddReading}
            onDeleteReading={handleDeleteReading}
            grandmaName={grandmaName}
            glassCount={glassCount}
            onSetGlassCount={setGlassCount}
            appointments={isssteAppointments}
            onAddAppointment={handleAddAppointment}
            onToggleAppointment={handleToggleAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            isAdmin={isAdmin}
          />
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 4B: ABUELA 1800 CALORIAS DIET CHART (RECETAS)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'recipes' && (
          <RecipesPanel currentUser={currentUser} />
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 5: SAVINGS Metas
         * --------------------------------------------------------------------------- */}
        {activeTab === 'savings' && (
          <SavingsPanel 
            savings={savings}
            onUpdateSavings={handleUpdateSavings}
            onUpdateGoal={handleUpdateGoal}
            weeklySurpluses={weeklySurpluses}
            onAddSurplus={handleAddSurplus}
            onDeleteSurplus={handleDeleteSurplus}
            monthlyArchives={monthlyArchives}
            onArchiveCurrentMonth={handleArchiveCurrentMonth}
            onDeleteArchive={handleDeleteArchive}
            isAdmin={isAdmin}
          />
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 6: FAMILY SYSTEM CONTACTS & BIRTHDAYS (FAMILIA)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'family' && (
          <FamilySection 
            birthdays={birthdays}
            contacts={contacts}
            onAddBirthday={handleAddBirthday}
            onDeleteBirthday={handleDeleteBirthday}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
            grandmaName={grandmaName}
          />
        )}

        {/* ---------------------------------------------------------------------------
         * TAB 7: USER PROFILE & HOUSEHOLD CONFIGURATOR (PERFIL & AJUSTES)
         * --------------------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <UserProfileAndSettings
            currentUser={currentUser}
            onLogout={handleLogout}
            momAdvices={momAdvices}
            setMomAdvices={setMomAdvices}
            birthdays={birthdays}
            onAddBirthday={handleAddBirthday}
            onDeleteBirthday={handleDeleteBirthday}
            initialSection={activeProfileSubTab}
            monthlyIncome={monthlyIncome}
            foodBudget={foodBudget}
            basicsBudget={basicsBudget}
            transportBudget={transportBudget}
            rentAverage={rentAverage}
            izziAverage={izziAverage}
            luzAverage={luzAverage}
            aguaAverage={aguaAverage}
            gasAverage={gasAverage}
            veladorDia={veladorDia}
            veladorNoche={veladorNoche}
            limpieza={limpieza}
            shoppingItems={shoppingItems}
            savingsAlloc={savingsAlloc}
            setSavingsAlloc={setSavingsAlloc}
          />
        )}
      </main>

      {/* ---------------------------------------------------------------------------
       * APP SHELL FOOTER TRIBUTE
       * --------------------------------------------------------------------------- */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-8 mt-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-serif font-bold text-white">Lety App</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">La administradora del hogar inspirada en el gran amor de mamá.</p>
          </div>

          <div className="text-center italic font-serif text-[11px] text-stone-500">
            🕊️ "En amorosa memoria de Leticia Rodríguez Escalante (1964 – 2026)". Gracias por enseñarnos que el hogar se administra con ternura.
          </div>

          <div className="text-stone-500 text-[10px] font-mono text-center md:text-right">
            &copy; 2026 Familia Rodríguez Escalante.
          </div>
        </div>
      </footer>
    </div>
  );
}
