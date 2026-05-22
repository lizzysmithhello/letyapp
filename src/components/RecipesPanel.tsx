/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Search, 
  Scale, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Heart, 
  Clock, 
  Utensils, 
  Zap, 
  HelpCircle, 
  Save, 
  Printer, 
  Copy, 
  Share2, 
  Droplet, 
  ArrowRight, 
  BookOpen,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

interface Ingredient {
  name: string;
  amount: number; // Base amount for 1 person
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  type: 'Desayuno' | 'Colación AM' | 'Comida' | 'Colación PM' | 'Cena';
  calories: number;
  preparationTime: number; // in minutes
  sodiumPercent?: 'Bajo' | 'Moderado' | 'Controlado';
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  isCustom?: boolean;
}

interface DayMealPlan {
  dayName: string;
  meals: {
    Desayuno: Recipe;
    'Colación AM': Recipe;
    Comida: Recipe;
    'Colación PM': Recipe;
    Cena: Recipe;
  };
}

// ----------------------------------------------------
// OFFICIAL PDF 1800 KCAL MEXICAN DIET DAILY PLANS
// ----------------------------------------------------
const OFFICIAL_DIET_PLAN: DayMealPlan[] = [
  {
    dayName: 'Lunes',
    meals: {
      Desayuno: {
        id: 'lun-des',
        name: 'Huevos revueltos con Nopales frescos',
        type: 'Desayuno',
        calories: 450,
        preparationTime: 12,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Claras de huevo', amount: 2, unit: 'pzas' },
          { name: 'Huevo entero', amount: 1, unit: 'pza' },
          { name: 'Nopales picados limpios', amount: 0.5, unit: 'taza' },
          { name: 'Tortillas de maíz nixtamalizado', amount: 2, unit: 'pzas' },
          { name: 'Frijoles negros caldosos de olla (sin refrito)', amount: 0.5, unit: 'taza' },
          { name: 'Aceite de oliva para asar', amount: 1, unit: 'cdita' },
          { name: 'Leche descremada o deslactosada light', amount: 1, unit: 'taza' }
        ],
        steps: [
          'Hervir los nopales picados con un trozo de cebolla y sal ligera de grano por 6 min. Escurrir bien.',
          'Picar jitomate y cebolla fina para darle sabor.',
          'Calentar la cucharadita de aceite en una sartén antiadherente. Saltear la cebolla, jitomate y nopales por 2 min.',
          'Agregar las claras y el huevo batido. Revolver hasta que cocinen de forma uniforme.',
          'Servir junto con la media taza de frijoles de olla y las dos tortillas calientes.'
        ],
        tips: 'Utilizar cebolla cruda picada para potenciar sabor sin necesidad de agregar sal extra.'
      },
      'Colación AM': {
        id: 'lun-col-am',
        name: 'Jícama y Pepino crujiente con chilito',
        type: 'Colación AM',
        calories: 150,
        preparationTime: 5,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Jícama fresca pelada', amount: 80, unit: 'g' },
          { name: 'Pepino mediano con cáscara sin semillas', amount: 1, unit: 'pza' },
          { name: 'Limón verde agrio', amount: 1, unit: 'pza' },
          { name: 'Chile piquín de polvo sin sal agregada', amount: 1, unit: 'cdita' },
          { name: 'Almendras enteras naturales', amount: 8, unit: 'pzas' }
        ],
        steps: [
          'Cortar la jícama y el pepino en porciones delgadas o bastones cómodos para morder.',
          'Exprimir el jugo de un limón entero sobre las frutas picadas.',
          'Espolvorear el polvo de chile piquín (sin sal acumulada).',
          'Comer despacio acompañando con las 8 almendras naturales para regular la saciedad.'
        ],
        tips: 'Excelente fuente de fibra y agua para abuela, ayudando a controlar la saciedad del mediodía.'
      },
      Comida: {
        id: 'lun-com',
        name: 'Pechuga de Pollo con Puré rústico de Zanahoria',
        type: 'Comida',
        calories: 550,
        preparationTime: 25,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pechuga de pollo fresca deshuesada', amount: 140, unit: 'g' },
          { name: 'Zanahoria fresca pelada y troceada', amount: 1.5, unit: 'pzas' },
          { name: 'Calabacita criolla rebanada', amount: 1, unit: 'pza' },
          { name: 'Arroz rojo cocinado al vapor', amount: 0.5, unit: 'taza' },
          { name: 'Aguacate Hass fresco', amount: 0.25, unit: 'pza' },
          { name: 'Cebolla picada al ajillo', amount: 2, unit: 'cdas' },
          { name: 'Pimienta negra recién molida', amount: 1, unit: 'pizca' }
        ],
        steps: [
          'Poner a cocer las zanahorias en agua hirviendo hasta que queden completamente blandas.',
          'Machacar la zanahoria cocida con tenedor junto con una pizca mínima de sal y pimienta hasta lograr un puré fino.',
          'Sazonar la pechuga de pollo únicamente con pimienta negra recién molida y cebolla al ajillo.',
          'Cocinar la pechuga en sartén antiadherente a fuego medio regulado por 6 minutos de cada lado.',
          'Saltear por separado las calabacitas rebanadas con unas gotitas de agua.',
          'Montar el plato con la pechuga asada, el puré de zanahorias, las calabacitas tiernas, la media taza de arroz al vapor, y acompañar con el aguacate fresco para aportar grasas buenas.'
        ],
        tips: 'La zanahoria cocida aporta carbohidratos de bajo índice glucémico y vitamina A.'
      },
      'Colación PM': {
        id: 'lun-col-pm',
        name: 'Manzana verde picada con nuez pecana',
        type: 'Colación PM',
        calories: 155,
        preparationTime: 4,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Manzana verde ácida madura', amount: 1, unit: 'pza' },
          { name: 'Nuez de castilla entera o mitad limpia', amount: 4, unit: 'pzas' },
          { name: 'Canela en polvo aromática', amount: 1, unit: 'pizca' }
        ],
        steps: [
          'Lavar detalladamente la manzana verde y cortarla en gajos o rebanadas comestibles con todo y cáscara.',
          'Espolvorear canela molida en polvo encima para mejorar digestión.',
          'Trocear las 4 nueces pecanas sobre la manzana para dar textura crujiente.'
        ],
        tips: 'La canela actúa como hipoglucemiante natural y frena los antojos por harinas durante el crepúsculo.'
      },
      Cena: {
        id: 'lun-cen',
        name: 'Quesadilla de Queso Panela y Champiñones',
        type: 'Cena',
        calories: 495,
        preparationTime: 10,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Tortillas de maíz nixtamalizado', amount: 2, unit: 'pzas' },
          { name: 'Queso panela fresco bajo en grasa criollo', amount: 70, unit: 'g' },
          { name: 'Champiñones frescos fileteados limpios', amount: 0.75, unit: 'taza' },
          { name: 'Epazote fresco deshojado', amount: 1, unit: 'ramita' },
          { name: 'Ensalada de lechuga orejona tierna', amount: 1.5, unit: 'tazas' },
          { name: 'Rábanos limpios rebanados en círculos', amount: 2, unit: 'pzas' }
        ],
        steps: [
          'En un sartén guisar los champiñones rebanados con la ramita de epazote hasta que liberen su agua y doren ligeramente sin grasa.',
          'Calentar las dos tortillas de maíz sobre un comal tibio.',
          'Agregar rebanadas del queso panela (35g por cada una) y rellenar con el salteado de champiñones húmedos.',
          'Dejar que se ablande el queso panela, doblando perfectamente como quesadilla tradicional.',
          'Servir bien calientes junto a una fresca y frondosa ensalada de lechugas y rábanos rebanados.'
        ],
        tips: 'Los champiñones aportan volumen y potasio protegiendo el sistema circulatorio e inmunológico.'
      }
    }
  },
  {
    dayName: 'Martes',
    meals: {
      Desayuno: {
        id: 'mar-des',
        name: 'Avena reconfortante con fresas frescas',
        type: 'Desayuno',
        calories: 440,
        preparationTime: 15,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Avena integral de grano entero', amount: 0.5, unit: 'taza' },
          { name: 'Leche descremada o de almendra sin azúcar', amount: 1, unit: 'taza' },
          { name: 'Canela mexicana entera en raja', amount: 1, unit: 'trozo' },
          { name: 'Fresas orgánicas lavadas y picadas', amount: 0.75, unit: 'taza' },
          { name: 'Espinaca baby fresca licuada (opcional verde)', amount: 1, unit: 'taza' },
          { name: 'Semillas de chía orgánica', amount: 1, unit: 'da' }
        ],
        steps: [
          'En una cacerola pequeña, hervir una taza de agua con la canela en raja.',
          'Agregar la avena integral y cocinar a fuego lento por 5 minutos, revolviendo constantemente.',
          'Añadir la leche descremada y las semillas de chía, cocinando por 3 minutos adicionales.',
          'Retirar del fuego y servir en un tazón hondo.',
          'Coronar con las fresas limpias fileteadas y unas chispas de almendras opcionales.'
        ],
        tips: 'La chía aporta ácidos grasos omega-3 que combaten la inflamación de articulaciones.'
      },
      'Colación AM': {
        id: 'mar-col-am',
        name: 'Tallos de Apio ligeros con Requesón rústico',
        type: 'Colación AM',
        calories: 145,
        preparationTime: 5,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Tallos de apio gruesos frescos y pelados', amount: 3, unit: 'pzas' },
          { name: 'Requesón natural sin sal de tejaván', amount: 4, unit: 'cdas' },
          { name: 'Chile quebrado picante ligero', amount: 0.5, unit: 'cdita' }
        ],
        steps: [
          'Lavar meticulosamente los tallos de apio para retirar impurezas fibrosas externas.',
          'Cortarlos en segmentos iguales.',
          'Rellenar el canal de los tallos de apio con el requesón magro y cremoso.',
          'Decorar con un espolvoreado de chile quebrado si se prefiere picante.'
        ],
        tips: 'El apio tiene efectos diuréticos naturales idóneos para personas sensibles a elevaciones de presión.'
      },
      Comida: {
        id: 'mar-com',
        name: 'Tacos de Pescado empapelado a las hierbas',
        type: 'Comida',
        calories: 560,
        preparationTime: 20,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Filete de pescado tilapia o blanco de roca', amount: 150, unit: 'g' },
          { name: 'Jitomate guaje picado picante', amount: 1, unit: 'pza' },
          { name: 'Chile serrano sin venas rebanado', amount: 0.5, unit: 'pza' },
          { name: 'Hojas frescas de cilantro picado', amount: 4, unit: 'cdas' },
          { name: 'Calabacita e hinojo rebanado', amount: 0.5, unit: 'taza' },
          { name: 'Tortillas de maíz nixtamalizado', amount: 3, unit: 'pzas' },
          { name: 'Aguacate maduro troceado', amount: 0.25, unit: 'pza' }
        ],
        steps: [
          'Cortar un trozo de papel aluminio grande y colocar el filete de pescado al centro.',
          'Cubrir el salmón o blanco con las verduras picadas (jitomate, cebolla, calabacitas, chile descorazonado, cilantro).',
          'Sellar herméticamente doblando los extremos del aluminio.',
          'Cocinar en un sartén caliente o comal a fuego medio por 12-15 minutos (volteando a la mitad).',
          'Servir el pescado desmenuzado en 3 tortillas de maíz calientes coronadas con aguacate fresco.'
        ],
        tips: 'El empapelado retiene todos los jugos naturales y nutrientes evaporados sin usar nada de grasa.'
      },
      'Colación PM': {
        id: 'mar-col-pm',
        name: 'Gelatina ligera sin azúcar con frambuesas',
        type: 'Colación PM',
        calories: 150,
        preparationTime: 3,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Gelatina comercial light sabor fresa', amount: 1, unit: 'taza' },
          { name: 'Frambuesas o fresas picadas frescas', amount: 0.5, unit: 'taza' },
          { name: 'Semillas de calabaza crudas deshojadas', amount: 1, unit: 'cda' }
        ],
        steps: [
          'Tener gelatina previamente preparada baja en calorías.',
          'Servir una taza de gelatina en un recipiente de cristal.',
          'Decorar encima con las frambuesas o frutillas ácidas maduras.',
          'Espolvorear una cucharada de pepitas de calabaza para grasas saludables.'
        ],
        tips: 'La gelatina light sacia de forma inmediata y provee hidratación con rico colágeno.'
      },
      Cena: {
        id: 'mar-cen',
        name: 'Sopa cremosa de Flor de Calabaza con Requesón',
        type: 'Cena',
        calories: 505,
        preparationTime: 18,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Flor de calabaza limpia sin pistilos', amount: 2, unit: 'manojos' },
          { name: 'Requesón criollo blando artesanal', amount: 60, unit: 'g' },
          { name: 'Caldo criollo de verduras casero sin sal', amount: 1.5, unit: 'tazas' },
          { name: 'Elote blanco tierno desgranado', amount: 0.5, unit: 'taza' },
          { name: 'Tostada horneada libre de sal comercial', amount: 2, unit: 'pzas' }
        ],
        steps: [
          'Lavar la flor de calabaza y retirar con delicadeza el centro.',
          'Liquidar la flor de calabaza con una taza de caldo de vegetales hirviendo, la cebolla cocida y el requesón blando.',
          'Verter en una pequeña cazuela e incorporar los granos de elote previamente hervidos.',
          'Cocinar por 8 min revolviendo lento para emulsionar la crema sin usar crema láctea grasosa.',
          'Servir en tazón hondo acompañada de dos tostadas horneadas crujientes.'
        ],
        tips: 'Rico en calcio, fósforo y sumamente reconfortante para una digestión silenciosa de noche.'
      }
    }
  },
  {
    dayName: 'Miércoles',
    meals: {
      Desayuno: {
        id: 'mie-des',
        name: 'Omelette de claras con espinaca y tlacoyo ligero',
        type: 'Desayuno',
        calories: 460,
        preparationTime: 12,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Claras de huevo frescas pastoriles', amount: 3, unit: 'pzas' },
          { name: 'Hojas de espinaca criolla lavadas', amount: 1.5, unit: 'tazas' },
          { name: 'Cebolla blanca fileteada', amount: 0.25, unit: 'pza' },
          { name: 'Salsa verde casera de tomatillo cocido', amount: 3, unit: 'cdas' },
          { name: 'Tlacoyo mediano de habas hecho en comal', amount: 1, unit: 'pza' },
          { name: 'Queso fresco cotija rallado seco', amount: 1, unit: 'cda' }
        ],
        steps: [
          'Saltear la cebolla y las espinacas en un sartén con una atomización mínima de aceite.',
          'Batir las 3 claras vigorosamente con tenedor, verter sobre el salteado de verduras.',
          'Girar con cuidado cuando cuaje para mantener la forma dorada.',
          'En el comal, asar el tlacoyo de habas o frijoles sin grasa.',
          'Servir el omelette bañado con tu salsa verde tatemada natural y el tlacoyo con un toque de queso encima.'
        ],
        tips: 'El tlacoyo aporta carbohidratos de asimilación lenta de maíz combinados con la proteína de la haba.'
      },
      'Colación AM': {
        id: 'mie-col-am',
        name: 'Yogur Griego purista con toque de chía',
        type: 'Colación AM',
        calories: 140,
        preparationTime: 3,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Yogur griego de cultivo natural sin endulzar', amount: 150, unit: 'g' },
          { name: 'Chía en semilla soluble', amount: 1, unit: 'cda' },
          { name: 'Canela molida picante fina', amount: 1, unit: 'pizca' }
        ],
        steps: [
          'Depositar el yogur griego puro en una taza limpia.',
          'Añadir las semillas de chía para espesar naturalmente.',
          'Aromantizar con canela molida para prescindir del azúcar comercial refinada.'
        ],
        tips: 'Aporta probióticos útiles que balancean la flora intestinal y mejoran los niveles inmunes.'
      },
      Comida: {
        id: 'mie-com',
        name: 'PepeTinga de pechuga de pollo ligera',
        type: 'Comida',
        calories: 540,
        preparationTime: 25,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Pollo deshebrado de pechuga cocida limpia', amount: 120, unit: 'g' },
          { name: 'Jitomate maduro hervido para recaudo', amount: 2, unit: 'pzas' },
          { name: 'Chile chipotle adobado en lata (recom. bajo sodio)', amount: 1, unit: 'pza' },
          { name: 'Cebolla blanca rebanada en tiras finas', amount: 1, unit: 'taza' },
          { name: 'Tostadas horneadas de maíz sin sal', amount: 3, unit: 'pzas' },
          { name: 'Crema ácida baja en grasa light', amount: 3, unit: 'cditas' },
          { name: 'Lechuga picada desinfectada', amount: 1, unit: 'taza' }
        ],
        steps: [
          'Licuar los jitomates bien hervidos con el diente de ajo, un trozo de cebolla y únicamente una tira de chipotle.',
          'Sudar la cebolla fileteada abundante con un poco de agua hasta transparentar.',
          'Incorporar el puré de jitomate chipotle y el pollo desmenuzado, guisando por 10 min a fuego lento.',
          'Hundir las tostadas untando una cucharadita de crema ligera cada una, montando la tinga y vistiendo con lechuga fresca encima.'
        ],
        tips: 'Utilizar el jitomate hervido genera una salsa espesa natural que no demanda adición de harinas o grasas.'
      },
      'Colación PM': {
        id: 'mie-col-pm',
        name: 'Aguacate con aceite de olivo y sal de grano',
        type: 'Colación PM',
        calories: 160,
        preparationTime: 3,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Aguacate Hass grande blando', amount: 0.5, unit: 'pza' },
          { name: 'Aceite de oliva extra virgen prensado', amount: 1, unit: 'cdita' },
          { name: 'Sal marina de grano integral gruesa', amount: 1, unit: 'pizca' }
        ],
        steps: [
          'Cortar el aguacate por la mitad y extraer un cuarto grande de una mitad.',
          'Hacer cortes cruzados ligeros dentro de la pulpa sin traspasar la cáscara.',
          'Bañar con la media cucharadita de aceite de oliva.',
          'Añadir una pequeña pizca gruesa de sal marina cruda y exprimir unas gotitas de limón.'
        ],
        tips: 'Grasas monoinsaturadas perfectas que sacian el apetito de las 6:30pm con salud cardiovascular.'
      },
      Cena: {
        id: 'mie-cen',
        name: 'Ensalada tibia de nopales tiernos y panela',
        type: 'Cena',
        calories: 490,
        preparationTime: 12,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Nopales cocidos rebanados en aspas', amount: 2, unit: 'tazas' },
          { name: 'Jitomate fresco en cubitos sin pulpa dulce', amount: 1, unit: 'pza' },
          { name: 'Queso panela tierno en cubos compactos', amount: 75, unit: 'g' },
          { name: 'Orégano seco molido a mano', amount: 1, unit: 'pizca' },
          { name: 'Aguacate troceado rústicamente', amount: 0.25, unit: 'pza' },
          { name: 'Galletas de maíz horneadas ligeras', amount: 4, unit: 'pzas' }
        ],
        steps: [
          'Mesclar los nopales cocidos ya fríos junto con el jitomate picado y la cebolla morada fina.',
          'Añadir los cubos de queso panela y el orégano seco molido frotando tus palmas.',
          'Incorporar el aguacate sobre la mezcla suavemente.',
          'Aderezar con vinagre de manzana natural e hilos finos de cilantro fresco picado.',
          'Degustar acompañado con las 4 galletas horneadas crujientes.'
        ],
        tips: 'Los nopales contienen gran cantidad de fibra soluble (mucílagos) ideales para retardar grasas y azúcares.'
      }
    }
  },
  {
    dayName: 'Jueves',
    meals: {
      Desayuno: {
        id: 'jue-des',
        name: 'Molletes integrales con pico de gallo alegre',
        type: 'Desayuno',
        calories: 450,
        preparationTime: 10,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pan bolillo integral de panadería sin migajón', amount: 1, unit: 'pza' },
          { name: 'Frijoles negros de olla machacados', amount: 0.5, unit: 'taza' },
          { name: 'Queso asadero o panela rallado fino de comal', amount: 50, unit: 'g' },
          { name: 'Jitomate picado fino firme', amount: 1, unit: 'pza' },
          { name: 'Cebolla morada tierna picada', amount: 2, unit: 'cdas' },
          { name: 'Cilantro fresco desinfectado', amount: 2, unit: 'cdas' }
        ],
        steps: [
          'Partir el bolillo integral por la mitad y retirar todo el migajón blanco interno para quedar con la costra.',
          'Untar la media taza de frijoles negros machacados sin aceite en ambas mitades de pan.',
          'Espolvorear con el queso panela o asadero bajo en sal rallado.',
          'Colocar en un comal o tostador por 5 minutos hasta fundir agradablemente.',
          'Añadir pico de gallo natural (jitomate, cebolla, cilantro, unas gotitas de limón).'
        ],
        tips: 'Retirar el migajón disminuye la carga de harina vacía del pan, garantizando un mollete crujiente y ligero.'
      },
      'Colación AM': {
        id: 'jue-col-am',
        name: 'Pepino fileteado con semillas de girasol',
        type: 'Colación AM',
        calories: 140,
        preparationTime: 4,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pepinos medianos con piel bien lavados', amount: 2, unit: 'pzas' },
          { name: 'Semillas de girasol crudas sin sal tostadas', amount: 1.5, unit: 'cdas' },
          { name: 'Jugo de limón agrio criollo', amount: 1, unit: 'pza' }
        ],
        steps: [
          'Lavar los pepinos. Se pueden rallar ligeramente creando franjas verdes alternadas.',
          'Cortar a la mitad longitudinalmente y retirar con cuchara las semillas.',
          'Cortar en rodajas compactas y colocar en un plato.',
          'Adornar con las semillas de girasol naturales y exprimir abundante limón encima.'
        ],
        tips: 'Minerales clave de zinc y selenio aportados por el girasol ideales para soporte celular.'
      },
      Comida: {
        id: 'jue-com',
        name: 'Albóndigas de res magra en caldo de chipotle criollo',
        type: 'Comida',
        calories: 555,
        preparationTime: 30,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Carne molida de res magra especial (95/5)', amount: 130, unit: 'g' },
          { name: 'Clara de huevo fresca para aglutinar', amount: 1, unit: 'pza' },
          { name: 'Arroz blanco cocido hidratado', amount: 3, unit: 'cdas' },
          { name: 'Calabacita criolla picada muy pequeña', amount: 0.5, unit: 'pza' },
          { name: 'Puré de jitomate natural asado casero', amount: 1.5, unit: 'tazas' },
          { name: 'Chile chipotle seco guisado', amount: 1, unit: 'pza' },
          { name: 'Tortillas de maíz nixtamalizado', amount: 2, unit: 'pzas' }
        ],
        steps: [
          'Mezclar en un tazón la carne molida de res limpia con el arroz cocido, la calabacita bien picada fina y la clara de huevo batida.',
          'Modelar pequeñas bolas (albóndigas) uniformes con las manos húmedas.',
          'Poner a hervir las tazas de puré de jitomate asado con cebolla, ajo y el chipotle con 1 taza de agua.',
          'Una vez que hierva el caldo de jitomate, soltar las albóndigas crudas con cuidado.',
          'Disminuir el fuego, tapar y dar cocimiento seguro por 20 minutos.',
          'Servir 3 albóndigas calientes acompañadas con el caldo sustancioso y 2 tortillas de comal.'
        ],
        tips: 'La calabacita mezclada en la carne duplica el volumen y suaviza la consistencia reduciendo grasa de origen vacuno.'
      },
      'Colación PM': {
        id: 'jue-col-pm',
        name: 'Nueces pacanas peladas con canela',
        type: 'Colación PM',
        calories: 160,
        preparationTime: 2,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Nuez pecanera de cáscara dorada', amount: 7, unit: 'pzas' },
          { name: 'Arándanos secos deshidratados sin azúcar', amount: 1.5, unit: 'cdas' }
        ],
        steps: [
          'Seleccionar 7 nueces en mitades limpias naturales.',
          'Mezclar en un tazón junto con los arándanos arrugados dulces.',
          'Servir en una taza ideal para comer una por una despacio.'
        ],
        tips: 'Soporte directo para la memoria y control de colesterol malo por los grasos saludables de la nuez.'
      },
      Cena: {
        id: 'jue-cen',
        name: 'Tostadas de Atún fresco a la mexicana',
        type: 'Cena',
        calories: 495,
        preparationTime: 10,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Atún en agua escurrido en lata (bajo sodio)', amount: 1, unit: 'lata' },
          { name: 'Jitomate picado en cubos pequeños', amount: 1, unit: 'pza' },
          { name: 'Cebolla fina picada', amount: 0.25, unit: 'pza' },
          { name: 'Aguacate maduro untado', amount: 0.25, unit: 'pza' },
          { name: 'Chile jalapeño en vinagre picado picante', amount: 1, unit: 'cdita' },
          { name: 'Tostadas horneadas de maíz', amount: 2, unit: 'pzas' }
        ],
        steps: [
          'Escurrir el exceso de agua del atún enlatado concienzudamente.',
          'Integrar el atún picado con el jitomate, cebolla blanca picada, chile jalapeño e hilos finos de cilantro picado.',
          'Untar una porción justa del aguacate cremoso como cama sobre las dos tostadas horneadas.',
          'Coronar con la ensalada de atún fresca generosamente.'
        ],
        tips: 'Proteína pura, ligera y fácil de digerir de forma ágil que no interrumpe el sueño de noche.'
      }
    }
  },
  {
    dayName: 'Viernes',
    meals: {
      Desayuno: {
        id: 'vie-des',
        name: 'Licuado de avena, plátano medio y almendras',
        type: 'Desayuno',
        calories: 440,
        preparationTime: 5,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Leche descremada o deslactosada light', amount: 1, unit: 'taza' },
          { name: 'Avena integral fina precocida', amount: 0.33, unit: 'taza' },
          { name: 'Plátano Tabasco maduro firme', amount: 0.5, unit: 'pza' },
          { name: 'Almendras enteras naturales con piel', amount: 10, unit: 'pzas' },
          { name: 'Esencia pura de vainilla sin azúcar', amount: 1, unit: 'cdita' },
          { name: 'Canela molida para espolvorear', amount: 1, unit: 'pizca' }
        ],
        steps: [
          'Colocar en la licuadora el plátano fileteado, la leche descremada y la avena integral.',
          'Añadir las almendras enteras dulces y la cucharadita de vainilla aromática.',
          'Licuar a máxima potencia por 2 minutos completos hasta disolver toda la semilla.',
          'Servir en vaso largo frío y espolvorear la canela molida para mejorar sabor.'
        ],
        tips: 'Un desayuno rápido, cremoso y lleno de potasio ideal para arrancar la mañana con energía constante.'
      },
      'Colación AM': {
        id: 'vie-col-am',
        name: 'Gajos de Manzana fresca con limón verde',
        type: 'Colación AM',
        calories: 140,
        preparationTime: 3,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Manzana Fuji o gala roja dulce', amount: 1, unit: 'pza' },
          { name: 'Jugo de limón agrio fresco', amount: 1, unit: 'pza' },
          { name: 'Semillas de chía espolvoreadas', amount: 1, unit: 'cdita' }
        ],
        steps: [
          'Cortar la manzana gala en cuartos removiendo la parte dura interior.',
          'Bañar los gajos inmediatamente con jugo de limón fresco para entorpecer la oxidación.',
          'Adornar con las diminutas semillas de chía crujientes.'
        ],
        tips: 'La pectina de la manzana con cáscara asiste al sistema digestivo y limpia las encías.'
      },
      Comida: {
        id: 'vie-com',
        name: 'Brochetas de Pollo marinadas con vegetales asados',
        type: 'Comida',
        calories: 550,
        preparationTime: 22,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pechuga de pollo en dados grandes firmes', amount: 140, unit: 'g' },
          { name: 'Pimiento morrón verde y rojo rebanado grueso', amount: 1, unit: 'pza' },
          { name: 'Cebolla picada en cascajos gruesos', amount: 0.5, unit: 'pza' },
          { name: 'Arroz integral al vapor sazonado natural', amount: 0.5, unit: 'taza' },
          { name: 'Aceite de oliva para barnizar', amount: 1, unit: 'cdita' },
          { name: 'Jugo de piña natural para marinado suave', amount: 2, unit: 'cdas' }
        ],
        steps: [
          'Colocar los cubos de pollo en un recipiente con el jugo de piña, un poco de ajo molido picado y orégano durante 10 min.',
          'Insertar los dados de pollo de forma intercalada con el pimiento de color y la cebolla gruesa en palillos para brocheta.',
          'Calentar una plancha o sartén grueso untado con la cucharita de aceite de oliva.',
          'Asar las brochetas volteando periódicamente por 15 minutos hasta sellar y cocer de manera uniforme.',
          'Servir las brochetas humeantes junto con la media taza de arroz integral.'
        ],
        tips: 'El marinado con jugo de piña rompe las fibras del pollo de forma enzimática aportando suavidad extrema al asar.'
      },
      'Colación PM': {
        id: 'vie-col-pm',
        name: 'Jícama fresca en cubos picada',
        type: 'Colación PM',
        calories: 145,
        preparationTime: 5,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Jícama jugosa fresca lavada', amount: 120, unit: 'g' },
          { name: 'Chile en polvo natural sin sal adicionada', amount: 1, unit: 'cdita' },
          { name: 'Limón criollo agrio exprimido', amount: 0.5, unit: 'pza' }
        ],
        steps: [
          'Cortar la jícama retirando la cáscara rugosa exterior.',
          'Hacer dados uniformes pequeños e introducirlos en un frasco o tazón cómodo.',
          'Bañar con medio limón y revolver con chile en polvo al gusto.'
        ],
        tips: 'Súper baja densidad calórica que permite el consumo seguro de noche de antojos sin remordimientos.'
      },
      Cena: {
        id: 'vie-cen',
        name: 'Sincronizada mexicana ligera con maíz',
        type: 'Cena',
        calories: 525,
        preparationTime: 8,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Tortillas de maíz nixtamalizado tradicionales', amount: 2, unit: 'pzas' },
          { name: 'Queso panela fresco artesanal rebanado fino', amount: 60, unit: 'g' },
          { name: 'Jamón de pechuga de pavo bajo en sodio', amount: 2, unit: 'rebanadas' },
          { name: 'Aguacate maduro en rebanadas medianas', amount: 0.25, unit: 'pza' },
          { name: 'Pico de gallo picante sin jalapeño extra', amount: 3, unit: 'cdas' }
        ],
        steps: [
          'Sobre un comal caliente extender las dos tortillas de maíz.',
          'Colocar en una tortilla el queso panela cortado en rebanadas y las dos lonjas de jamón de pavo.',
          'Cubrir con la otra tortilla nixtamalizada presionando con una espátula.',
          'Asar despacio por un minuto de cada lado hasta templar y calentar por completo.',
          'Abrir con cuidado para añadir el aguacate y bañar con el pico de gallo festivo.'
        ],
        tips: 'El maíz nixtamalizado aporta calcio útil, óptimo para la osificación y firmeza del cuerpo de la abuela.'
      }
    }
  },
  {
    dayName: 'Sábado',
    meals: {
      Desayuno: {
        id: 'sab-des',
        name: 'Enfrijoladas doradas con Queso Panela',
        type: 'Desayuno',
        calories: 460,
        preparationTime: 14,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Tortillas de maíz horneadas ligeras', amount: 3, unit: 'pzas' },
          { name: 'Frijoles negros caseros licuados con su caldo', amount: 0.75, unit: 'taza' },
          { name: 'Salsa chipotle natural molida', amount: 1, unit: 'cdita' },
          { name: 'Queso panela fresco bajo en sal desmenuzado', amount: 60, unit: 'g' },
          { name: 'Cebolla morada en aros delgados', amount: 4, unit: 'pzas' },
          { name: 'Cilantro deshojado para decorar', amount: 3, unit: 'cdas' }
        ],
        steps: [
          'Calentar la salsa de frijoles negros licuados con una cucharadita de chipotle para espesar ligeramente a fuego bajo.',
          'Envolver y suavizar las tortillas horneadas de maíz pasándolas de forma veloz por el caldo caliente de frijol sin freír.',
          'Rellenar cada una de las tortillas con el queso panela desmoronado (guardando un poco para el toque encima).',
          'Doblar en forma de quesadilla y colocarlas alineadas sobre el plato.',
          'Bañar las enfrijoladas con una cucharada extra de frijol negro caliente. Coronar con el queso panela, aros de cebolla morada y cilantro.'
        ],
        tips: 'No freír las tortillas ahorra más de 120 calorías y un 90% de grasas saturadas nocivas.'
      },
      'Colación AM': {
        id: 'sab-col-am',
        name: 'Palitos aromáticos de Apio con crema de cacahuate',
        type: 'Colación AM',
        calories: 140,
        preparationTime: 3,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Tallos de apio crujientes pelados', amount: 2.5, unit: 'pzas' },
          { name: 'Crema de cacahuate artesanal pura sin sal o azúcar', amount: 1, unit: 'cda' }
        ],
        steps: [
          'Lavar la verdura exhaustivamente retirando la fibra vegetal dura.',
          'Cortar los tallos de apio para hacer pequeños barquillos.',
          'Untar ordenadamente una cucharada de crema de cacahuate de un solo ingrediente en las concavidades.'
        ],
        tips: 'La grasa natural del cacahuate unida a la fibra densa del apio estabilizan las glucemias del mediodía.'
      },
      Comida: {
        id: 'sab-com',
        name: 'Bistec criollo salteado con ejotes tiernos',
        type: 'Comida',
        calories: 555,
        preparationTime: 20,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Bistec de filete de res tierno limpio sin gordura', amount: 120, unit: 'g' },
          { name: 'Ejotes verdes frescos cortados a la mitad', amount: 1.5, unit: 'tazas' },
          { name: 'Salsa de tomatillos con pimientos criolla', amount: 0.5, unit: 'taza' },
          { name: 'Cebolla cortada en julianas finas', amount: 0.25, unit: 'pza' },
          { name: 'Arroz rojo casero (elaborado sin manteca)', amount: 0.5, unit: 'taza' },
          { name: 'Aceite de canola o vegetal balanceado', amount: 1, unit: 'cdita' }
        ],
        steps: [
          'Sancochar los ejotes en agua con un puño de ramas de olor por 5 min para que queden tiernos con tono verde vivo.',
          'En un sartén guisar con el aceite de canola, cebolla y ajo picado por un par de minutos.',
          'Incorporar los ejotes bien escurridos y dar salteado.',
          'Añadir la carne picada sazonada con pimienta negra molida.',
          'Unir la salsa de tomate verde y guisar a fuego apagado de forma tapada por 8 minutos.',
          'Completar el servicio sirviendo junto con los frijoles machacados de olla o arroz rojo.'
        ],
        tips: 'Los ejotes son carbohidratos complejos de excelente fibra ideales para regular el aporte del bistec de res.'
      },
      'Colación PM': {
        id: 'sab-col-pm',
        name: 'Melón dulce picado con semillas enteras de calabaza',
        type: 'Colación PM',
        calories: 150,
        preparationTime: 4,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Melón de castilla o gota de miel picado', amount: 1.25, unit: 'tazas' },
          { name: 'Semillas de calabaza criollas peladas', amount: 1, unit: 'cda' }
        ],
        steps: [
          'Cortar pelando el melón para luego rebanarlo en cubitos.',
          'Servir en un tazón de postre fresco.',
          'Coronar con la cucharada de pepitas de calabaza sin sal adicionada para contraste crujiente.'
        ],
        tips: 'El melón provee alta dosis de vitamina C y agua que asiste con el control renal.'
      },
      Cena: {
        id: 'sab-cen',
        name: 'Sopa casera campesina con Pollo deshebrado',
        type: 'Cena',
        calories: 495,
        preparationTime: 25,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pechuga de pollo hervida limpia desmenuzada', amount: 100, unit: 'g' },
          { name: 'Calabacita criolla, zanahoria y papas tiernas picadas', amount: 1, unit: 'taza' },
          { name: 'Xoconostle o nopales picados hervidos', amount: 0.5, unit: 'taza' },
          { name: 'Caldo de pollo desgrasado colado criollo', amount: 2, unit: 'tazas' },
          { name: 'Aguacate picado fino criollo', amount: 0.25, unit: 'pza' },
          { name: 'Tortilla de maíz tostada al horno en trozos', amount: 1, unit: 'pza' }
        ],
        steps: [
          'Colar el caldo donde hirvió la verdura y la pechuga haciéndolo pasar por una coladera fina.',
          'Picar en dados menudos las calabacitas, zanahorias, apio y la media patata.',
          'Guisar las verduras en el caldo por 15 min hasta que se sientan ligeras.',
          'Incorporar el pollo previamente deshebrado y las tiras de nopal escurridas picadas.',
          'Servir bien caliente con dados de aguacate y esparcir los pedazos crujientes de la tortilla dorada encima.'
        ],
        tips: 'Cena ligera por excelencia. Hidratación absoluta, calor reconfortante, digestión exprés antes de dormir.'
      }
    }
  },
  {
    dayName: 'Domingo',
    meals: {
      Desayuno: {
        id: 'dom-des',
        name: 'Chilaquiles verdes ligeros con pollo asado',
        type: 'Desayuno',
        calories: 470,
        preparationTime: 16,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Tortillas de maíz nixtamalizado doradas en comal o freidora de aire', amount: 3, unit: 'pzas' },
          { name: 'Salsa de tomatillo asado, cebolla, ajo y cilantro', amount: 0.75, unit: 'taza' },
          { name: 'Pollo deshebrado de pechuga hervida magra', amount: 90, unit: 'g' },
          { name: 'Queso panela criollo bajo en sal rallado', amount: 35, unit: 'g' },
          { name: 'Crema de mesa light baja en grasa fresca', amount: 1, unit: 'cda' },
          { name: 'Cebolla morada en finos discos', amount: 3, unit: 'pzas' }
        ],
        steps: [
          'Cortar las tortillas de maíz en forma de triángulos regulares para simular los totopos tradicionales.',
          'Dorarlos al comal caliente o en freidora de aire por 8 min a 180°C sin grasa extra para endurecer.',
          'Licuar los tomatillos verdes hervidos con ajo, cebolla y abundante cilantro fresco. Calentar la salsa ligera en una olla paila.',
          'Verter los totopos caseros dorados en la olla con salsa e incorporar de inmediato sobre un plato.',
          'Decorar vistiendo con el pollo deshebrado magro, el queso panela rallado, el chorrito de crema y la cebolla morada cortada fina.'
        ],
        tips: 'Los chilaquiles típicos fritos acumulan hasta 750 kcal. Esta versión de horno entrega el mismo sabor criollo por la mitad de grasas.'
      },
      'Colación AM': {
        id: 'dom-col-am',
        name: 'Ensalada festiva de Pepino, rábano e cilantro',
        type: 'Colación AM',
        calories: 135,
        preparationTime: 5,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Pepino mediano rallado alterno en rebanadas', amount: 1.5, unit: 'pzas' },
          { name: 'Rábanos limpios bien picados', amount: 3, unit: 'pzas' },
          { name: 'Jugo de limón agrio criollo fresco', amount: 1, unit: 'pza' },
          { name: 'Cilantro fresco picado hojas de olor', amount: 2, unit: 'cdas' }
        ],
        steps: [
          'Cortar los pepinos lavados con todo y cáscara de manera transversal creando discos medianos.',
          'Filetear los rábanos finamente con el rallador.',
          'Reunirlos en un tazón limpio, salpicar el cilantro fino y aderezar exprimiendo el limón.'
        ],
        tips: 'Minerales depurativos y de hidratación fantástica con aporte mínimo de calorías.'
      },
      Comida: {
        id: 'dom-com',
        name: 'Filete de Pescado al Mojo de Ajo con Arroz',
        type: 'Comida',
        calories: 565,
        preparationTime: 18,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Filete de pescado lenguado o blanco dócil', amount: 140, unit: 'g' },
          { name: 'Ajo picado en laminillas microscópicas', amount: 4, unit: 'dientes' },
          { name: 'Aceite de oliva extra virgen fino', amount: 1, unit: 'cdita' },
          { name: 'Verduras mixtas picadas de vapor (brócoli, chayote)', amount: 1.5, unit: 'tazas' },
          { name: 'Arroz blanco cocinado al vapor', amount: 0.5, unit: 'taza' },
          { name: 'Cilantro picado fino aromático', amount: 1, unit: 'cda' }
        ],
        steps: [
          'En un sartén antiadherente colocar la cucharadita de aceite de oliva caliente. Saltear de inmediato el ajo laminado hasta dorarlo.',
          'Colocar el filete de pescado encima cuidando de impregnar con ajo por ambos lados de la carne.',
          'Dorar a fuego medio por 4 minutos de cada flanco cuidando que el ajo no se queme.',
          'Cocer al vapor el brócoli y chayote rebanado por 7 min.',
          'Alinear en plato el pescado perfumado al ajo, las verduras de vapor verdes y el arroz rojo templado.'
        ],
        tips: 'El ajo cocinado rústico asiste de forma directa regulando la salud circulatoria cardíaca natural.'
      },
      'Colación PM': {
        id: 'dom-col-pm',
        name: 'Fresas lavadas combinadas con Crema light',
        type: 'Colación PM',
        calories: 140,
        preparationTime: 4,
        sodiumPercent: 'Bajo',
        ingredients: [
          { name: 'Fresas del huerto limpias desinfectadas', amount: 1, unit: 'taza' },
          { name: 'Crema líquida baja en grasa o yogur light', amount: 3, unit: 'cdas' },
          { name: 'Sustituto de azúcar Stevia o similar refinador', amount: 0.5, unit: 'sobre' }
        ],
        steps: [
          'Cortar las fresas en rebanadas gruesas retirando el rabillo verde.',
          'Servir en copa ancha.',
          'Esparcir la crema baja en calorías de mesa y homogeneizar con la media porción de sustituto.'
        ],
        tips: 'Un postre dominical ligero clásico con alto aporte de antioxidantes y fibra soluble.'
      },
      Cena: {
        id: 'dom-cen',
        name: 'Sopes ligeros de Nopal con Chorizo de pavo',
        type: 'Cena',
        calories: 490,
        preparationTime: 14,
        sodiumPercent: 'Moderado',
        ingredients: [
          { name: 'Nopales gruesos limpios cortados en óvalos', amount: 2, unit: 'pzas' },
          { name: 'Frijoles negros de olla machacados secos', amount: 0.33, unit: 'taza' },
          { name: 'Chorizo de pavo asado reducido en grasa', amount: 35, unit: 'g' },
          { name: 'Queso fresco de rancho (panela desmoronado)', amount: 40, unit: 'g' },
          { name: 'Salsa roja asada de jitomate martajado', amount: 3, unit: 'cdas' },
          { name: 'Lechuga picada lavada tierna', amount: 0.5, unit: 'taza' }
        ],
        steps: [
          'Utilizar los dos nopales enteros como la base o "tortilla" de los sopes.',
          'Asar los nopales sobre un comal caliente por 3 min de lado para que pierdan consistencia babosa.',
          'Dorar el chorizo de pavo en sartén sin agregar grasa.',
          'Untar la capa de frijoles de olla secos machacados sobre el comal en la pulpa de los nopales.',
          'Coronar con el chorizo dorado, la lechuga picada, el queso fresco de rancho moronado y vestir con la salsa roja.'
        ],
        tips: 'Excelente sustituto de sopes tradicionales de masa fritos que disminuye en un 80% los carbohidratos simples cargando minerales sanos.'
      }
    }
  }
];

export default function RecipesPanel({ currentUser }: { currentUser: any }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [peopleMultiplier, setPeopleMultiplier] = useState<1 | 2 | 4 | 6>(1);
  const [selectedMealType, setSelectedMealType] = useState<'Desayuno' | 'Colación AM' | 'Comida' | 'Colación PM' | 'Cena'>('Desayuno');
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    const local = localStorage.getItem('lety_custom_recipes');
    return local ? JSON.parse(local) : [];
  });
  
  // Custom design states
  const [showAddModal, setShowAddModal] = useState(false);
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'dietario' | 'creadas' | 'calculadora'>('dietario');
  
  // Timer States
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [timerMaxSeconds, setTimerMaxSeconds] = useState(0);
  const [timerDescription, setTimerDescription] = useState('');

  // Custom Recipe Inputs
  const [newRecName, setNewRecName] = useState('');
  const [newRecType, setNewRecType] = useState<'Desayuno' | 'Colación AM' | 'Comida' | 'Colación PM' | 'Cena'>('Desayuno');
  const [newRecCals, setNewRecCals] = useState('400');
  const [newRecTime, setNewRecTime] = useState('15');
  const [newRecSodium, setNewRecSodium] = useState<'Bajo' | 'Moderado' | 'Controlado'>('Bajo');
  const [newRecIngText, setNewRecIngText] = useState(''); // comma sep or line sep
  const [newRecStepsText, setNewRecStepsText] = useState(''); // line sep
  const [newRecTips, setNewRecTips] = useState('');

  // Permission level check (Erika/Administrador)
  const canEditAndSave = currentUser?.name?.toLowerCase().trim().includes('ericka') || currentUser?.name?.toLowerCase().trim().includes('erika');

  useEffect(() => {
    localStorage.setItem('lety_custom_recipes', JSON.stringify(customRecipes));
  }, [customRecipes]);

  // Handle count-down kitchen timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play brief notification simulation
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.log('Audio Context blocked or not supported');
      }
      alert(`⏰ ¡El temporizador de cocina para "${timerDescription}" ha concluido de forma exitosa!`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, timerDescription]);

  const startKitchenTimer = (minutes: number, desc: string) => {
    setTimerMaxSeconds(minutes * 60);
    setTimerSecondsLeft(minutes * 60);
    setTimerDescription(desc);
    setIsTimerRunning(true);
  };

  const handleAddCustomRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName.trim()) return;

    // Parse ingredients
    const ingsList: Ingredient[] = newRecIngText
      .split('\n')
      .map(line => {
        const cleaned = line.trim();
        if (!cleaned) return null;
        // Simple heuristic: "Amount unit Name" or similar. Let's make it more resilient
        const match = cleaned.match(/^([\d.]+)\s*(\w+)\s+(.+)$/);
        if (match) {
          return {
            amount: parseFloat(match[1]),
            unit: match[2],
            name: match[3].trim()
          };
        }
        return { name: cleaned, amount: 1, unit: 'pz' };
      })
      .filter(Boolean) as Ingredient[];

    // Parse steps
    const stepsList = newRecStepsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 2);

    const newRecipe: Recipe = {
      id: 'custom-' + Date.now(),
      name: newRecName.trim(),
      type: newRecType,
      calories: parseFloat(newRecCals) || 300,
      preparationTime: parseFloat(newRecTime) || 15,
      sodiumPercent: newRecSodium,
      ingredients: ingsList.length ? ingsList : [{ name: newRecIngText.trim(), amount: 1, unit: 'pza' }],
      steps: stepsList.length ? stepsList : ['Guisar ingredientes y servir caliente.'],
      tips: newRecTips.trim() || undefined,
      isCustom: true
    };

    setCustomRecipes([newRecipe, ...customRecipes]);
    setNewRecName('');
    setNewRecIngText('');
    setNewRecStepsText('');
    setNewRecTips('');
    setShowAddModal(false);
  };

  const handleDeleteCustomRecipe = (id: string, name: string) => {
    if (window.confirm(`¿Quieres eliminar permanentemente la receta "${name}"?`)) {
      setCustomRecipes(customRecipes.filter(r => r.id !== id));
    }
  };

  // Helper values
  const currentPlan = OFFICIAL_DIET_PLAN[selectedDayIndex];
  const activeRecipe = currentPlan.meals[selectedMealType];

  const formatTimerTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 ¡Plan alimentario copiado al portapapeles con éxito! Listo para enviar por WhatsApp.');
  };

  const exportDayMenuToWhatsApp = () => {
    const day = OFFICIAL_DIET_PLAN[selectedDayIndex];
    let txt = `*🍎 PLAN ALIMENTARIO DE 1800 KCAL (Día: ${day.dayName})* \n_Lety App v3 - Nutrición Inteligente_\n\n`;
    
    Object.entries(day.meals).forEach(([type, meal]) => {
      txt += `*🔸 ${type}* (${meal.calories} kcal):\n`;
      txt += `   👉 ${meal.name}\n`;
      txt += `   ⏱️ Aprox: ${meal.preparationTime} mins • Sodio: ${meal.sodiumPercent || 'Bajo'}\n\n`;
    });
    
    const currentHydration = localStorage.getItem('lety_abuela_water_today') || '0';
    txt += `*💧 Registro de Hidratación Abuela:* ${currentHydration}/8 vasos de agua.\n`;
    txt += `_Mantén informada a la familia. ¡Compartido con Amor! 🕊_`;
    
    copyToClipboard(txt);
  };

  // Search through all official and custom recipes
  const allOfficialRecipes: Recipe[] = OFFICIAL_DIET_PLAN.flatMap(day => Object.values(day.meals));
  const combinedRecipesList = [...customRecipes, ...allOfficialRecipes];

  const filteredRecipes = combinedRecipesList.filter(rec => {
    return rec.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) || 
           rec.ingredients.some(ing => ing.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER FOR DIET (1800 KCAL INTRO) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Abstract subtle graphics */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 text-white text-[10px] font-black uppercase tracking-wider">
              <ChefHat className="w-3.5 h-3.5" />
              <span>DIETA DE 1800 CALORÍAS - RECOMENDACIONES DEL PDF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight">
              🥦 Dietario Familiar Plan 1800
            </h1>
            <p className="text-teal-50 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Planificación nutricional balanceada de siete días integrada directamente para 6 personas, ideal para el cuidado integral y control de presión arterial de la abuela.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex gap-2">
            <button
              onClick={() => setActiveTabSub('dietario')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
                activeTabSub === 'dietario' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🗓️ Menú Semanal
            </button>
            <button
              onClick={() => setActiveTabSub('creadas')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
                activeTabSub === 'creadas' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🍳 Mis Recetas ({customRecipes.length})
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE SUBPANEL CONTENT: DIETARIO PLAN */}
      {activeTabSub === 'dietario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CHROME PANEL: CALENDAR DAYS & MEAL CHANGER (col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Days list (Lunes a Domingo picker) */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 flex justify-between items-center">
                <span>Días del Menú (1800 Kcal/día)</span>
                <span className="text-[10px] lowercase text-emerald-600 font-sans font-bold">100% Mexicano</span>
              </h3>
              
              <div className="grid grid-cols-7 lg:grid-cols-1 gap-1.5">
                {OFFICIAL_DIET_PLAN.map((plan, idx) => (
                  <button
                    key={plan.dayName}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      // Keep selected meal ID safe
                    }}
                    className={`px-2.5 py-2.5 rounded-xl text-xs font-bold transition flex flex-col lg:flex-row justify-between items-center gap-1 cursor-pointer ${
                      selectedDayIndex === idx 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100/70 border border-stone-200/40'
                    }`}
                  >
                    <span className="font-serif block text-center lg:text-left">{plan.dayName}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${selectedDayIndex === idx ? 'bg-white/20 text-white' : 'bg-stone-200/50 text-stone-500'}`}>
                      1800 kcal
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick stats panel for the day - macros simulation */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">Macros del Día ({currentPlan.dayName})</span>
                <span className="p-1 px-2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono leading-none">Balanced</span>
              </div>

              <div className="space-y-3">
                {/* Calories Progress gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500 font-medium font-sans">Meta Diaria Calorías:</span>
                    <strong className="text-stone-900 font-mono">1800 / 1800 kcal</strong>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Macrominerals */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1.5">
                  <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="block text-stone-400 font-medium">Carbohidratos</span>
                    <strong className="text-blue-900 font-mono mt-0.5 block">180g (40%)</strong>
                  </div>
                  <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="block text-stone-400 font-medium">Proteínas</span>
                    <strong className="text-emerald-900 font-mono mt-0.5 block">135g (30%)</strong>
                  </div>
                  <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100">
                    <span className="block text-stone-400 font-medium">Grasas Sanas</span>
                    <strong className="text-amber-900 font-mono mt-0.5 block">60g (30%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe layout left sidebar ends here */}

          </div>

          {/* RIGHT DETAILED RECIPE DISPLAY: STEP BY STEP (col-span-8) */}
          <div className="lg:col-span-8 bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md space-y-6 relative overflow-hidden">
            
            {/* Meal selector tab switcher (Desayuno, Colación, etc.) */}
            <div className="flex border-b border-stone-100 pb-1.5 overflow-x-auto gap-1">
              {(['Desayuno', 'Colación AM', 'Comida', 'Colación PM', 'Cena'] as const).map((mealType) => {
                const meal = currentPlan.meals[mealType];
                return (
                  <button
                    key={mealType}
                    onClick={() => setSelectedMealType(mealType)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
                      selectedMealType === mealType 
                        ? 'bg-stone-900 text-white' 
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>{mealType}</span>
                    <span className="block text-[9px] font-normal text-stone-400 font-mono mt-0.5">{meal.calories} kcal</span>
                  </button>
                );
              })}
            </div>

            {/* Recipe main card */}
            <div className="space-y-6">
              
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Plan alimentario {currentPlan.dayName} 📅</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                    {activeRecipe.name}
                  </h2>
                  <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      🥗 {activeRecipe.calories} Calorías
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-500" />
                      {activeRecipe.preparationTime} mins
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center gap-1" title="Control cardiovascular bajo sodio">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-100" />
                      Sodio: {activeRecipe.sodiumPercent || 'Bajo'}
                    </span>
                  </div>
                </div>

                {/* Share action button with WhatsApp formatting */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={exportDayMenuToWhatsApp}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Compartir Menú Día</span>
                  </button>
                </div>
              </div>

              {/* INTEGRATED PORTION SCALER (MULTIPLICADOR DE SECCIÓN DIRECTO) */}
              <div className="p-4 bg-gradient-to-r from-orange-50/50 via-white to-orange-50/20 border border-orange-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-orange-600" />
                    Báscula de Raciones (Sincronizador familiar)
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">Incrementa las medidas de forma matemática para toda la casa o solo para abuela</p>
                </div>

                <div className="flex bg-stone-100 border border-stone-200/50 rounded-xl p-1 shrink-0 gap-1 overflow-hidden select-none">
                  {([1, 2, 4, 6] as const).map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setPeopleMultiplier(mult)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                        peopleMultiplier === mult 
                          ? 'bg-orange-600 text-white shadow-2sx' 
                          : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50'
                      }`}
                    >
                      {mult === 1 ? '👤 1p (Abuela)' : `${mult}p (${mult === 6 ? 'Familia ' : ''})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients & Steps split */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Ingredients side (col-span-2) */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest border-b border-indigo-50 pb-1.5 flex justify-between">
                    <span>Ingredientes</span>
                    <span className="text-orange-700 font-mono font-bold tracking-normal italic text-[10px] lowercase italic">({peopleMultiplier} porciones)</span>
                  </h3>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {activeRecipe.ingredients.map((ing, idx) => {
                      const scaledAmt = ing.amount * peopleMultiplier;
                      return (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center py-2 border-b border-stone-50 text-[11px] font-sans hover:bg-stone-50/50 px-1 transition-all rounded"
                        >
                          <span className="text-stone-600 font-medium">{ing.name}</span>
                          <strong className="text-stone-850 font-mono select-none">
                            {Number.isInteger(scaledAmt) ? scaledAmt : scaledAmt.toFixed(1)} {ing.unit}
                          </strong>
                        </div>
                      );
                    })}
                  </div>

                  {activeRecipe.tips && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10.5px] leading-relaxed text-indigo-900 font-medium font-serif italic">
                      💡 <strong>Consejo:</strong> {activeRecipe.tips}
                    </div>
                  )}
                </div>

                {/* Steps side (col-span-3) */}
                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest border-b border-indigo-50 pb-1.5">
                    Preparación Paso a Paso
                  </h3>

                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {activeRecipe.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start group">
                        <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        
                        <div className="space-y-2 flex-1">
                          <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-sans font-medium">
                            {step}
                          </p>
                          
                          {/* Smart Timer Trigger embedded within steps */}
                          {step.toLowerCase().includes('min') && (
                            <button
                              onClick={() => {
                                const match = step.match(/(\d+)\s*min/);
                                if (match) {
                                  startKitchenTimer(parseInt(match[1]), `Paso ${idx + 1}: ${activeRecipe.name}`);
                                }
                              }}
                              className="px-2 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[10px] rounded-lg font-bold inline-flex items-center gap-1 border border-violet-150 transition cursor-pointer"
                            >
                              ⏱️ Programar Temporizador Cocina
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* COOKING TIMER COMPONENT WIDGET */}
            {timerSecondsLeft > 0 && (
              <div className="p-4 bg-violet-600 text-white rounded-2xl flex items-center justify-between gap-4 shadow-md animate-feed-in">
                <div className="space-y-1 flex-1">
                  <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider block w-max">
                    🕰️ Temporizador de cocina en curso...
                  </span>
                  <p className="text-xs font-black text-violet-100 truncate max-w-sm">
                    {timerDescription}
                  </p>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="font-mono text-2xl font-black block tracking-widest bg-black/15 p-1 px-2.5 rounded-xl border border-white/10">
                    {formatTimerTime(timerSecondsLeft)}
                  </span>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft(0);
                    }}
                    className="p-1 text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs"
                    title="Detener"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* CALORIC CHART CLARIFICATION ABOUT THE PROGRAM */}
            <div className="p-3 bg-stone-100 rounded-xl text-[10px] text-stone-500 border border-stone-200/50 block leading-relaxed flex gap-2">
              <span className="text-indigo-650 shrink-0 select-none text-[12px]">ℹ️</span>
              <span>
                <strong>Nota nutricional familiar:</strong> Todas las porciones, gramos y recomendaciones culinarias descritas en este dietario fueron preparadas apegadas al plan médico de 1,800 calorías de 6 personas. Sabor de hogar controlado para evitar excesos de grasa y sales.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ACTIVE SUBPANEL CONTENT: MIS RECETAS PANEL */}
      {activeTabSub === 'creadas' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center flex-wrap gap-3 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-1.5">
                <span>👩‍🍳</span> Mis Recetas y Preparaciones de Casa
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">Agrega las variaciones de comidas saludables de 1800 calorías</p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Receta Propia</span>
            </button>
          </div>

          <div className="bg-stone-50 p-4 border border-stone-150 rounded-2xl flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar en el recetario de la familia... (ej. Pollo, avena, calabacín, frijol)"
              value={recipeSearchQuery}
              onChange={(e) => setRecipeSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent border-none focus:outline-none placeholder-stone-400 font-semibold text-stone-850"
            />
          </div>

          {/* Render List of recipes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white border border-dashed border-stone-250 rounded-2xl text-stone-400 italic text-xs font-semibold">
                No se encontraron recetas bajo este término. ¡Prueba otra palabra o añade una arriba!
              </div>
            ) : (
              filteredRecipes.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white border border-stone-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[9px] font-black uppercase tracking-wider rounded">
                        {rec.type}
                      </span>
                      {rec.isCustom && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded">
                          Personalizada
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-stone-850 leading-tight block">{rec.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-mono font-bold">{rec.calories} kcal • {rec.preparationTime} mins</p>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-stone-100">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Ingredientes principales:</span>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {rec.ingredients.map(i => i.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-3 border-t border-stone-100">
                    <button
                      onClick={() => {
                        // Quick preview setup by locking into state inside parent if requested
                        // Or just render a brief description helper
                        alert(`📖 Resumen de Preparación de "${rec.name}":\n\n${rec.steps.map((s,i) => `${i+1}. ${s}`).join('\n')}`);
                      }}
                      className="text-stone-700 hover:text-stone-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver preparación</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {rec.isCustom && (
                      <button
                        onClick={() => handleDeleteCustomRecipe(rec.id, rec.name)}
                        className="p-1 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Eliminar receta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* FULL CUSTOM ADD RECIPE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border-2 border-stone-200 rounded-3xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-1.5">
                <span>🍳</span> Añadir Receta de 1800 Calorías
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer text-xs"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleAddCustomRecipe} className="space-y-4 text-xs font-sans font-medium text-stone-800">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Nombre de la Receta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Brochetas de queso asado ligeras"
                    value={newRecName}
                    onChange={(e) => setNewRecName(e.target.value)}
                    className="w-full text-xs font-semibold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Momento Recomendado</label>
                  <select
                    value={newRecType}
                    onChange={(e: any) => setNewRecType(e.target.value)}
                    className="w-full text-xs font-semibold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Desayuno">🍳 Desayuno</option>
                    <option value="Colación AM">🥛 Colación AM</option>
                    <option value="Comida">🥩 Comida</option>
                    <option value="Colación PM">🍎 Colación PM</option>
                    <option value="Cena">🥣 Cena</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Calorías totales (kcal)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1800"
                    placeholder="Ej. 420"
                    value={newRecCals}
                    onChange={(e) => setNewRecCals(e.target.value)}
                    className="w-full text-xs font-mono font-bold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Tiempo preparado (Mins)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ej. 15"
                    value={newRecTime}
                    onChange={(e) => setNewRecTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Nivel de Sodio</label>
                  <select
                    value={newRecSodium}
                    onChange={(e: any) => setNewRecSodium(e.target.value)}
                    className="w-full text-xs font-semibold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Bajo">🟢 Bajo Sodio (Idóneo para Abuela)</option>
                    <option value="Moderado">🟡 Moderado</option>
                    <option value="Controlado">🔴 Controlado / Especial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Ingredientes (Uno por cada renglón)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe el formato: 'Cantidad Unidad Nombre'&#10;Ejemplos:&#10;150 g Filete pechuga pollo&#10;2 pzas Tortillas maíz&#10;0.5 taza Frijoles negros"
                  value={newRecIngText}
                  onChange={(e) => setNewRecIngText(e.target.value)}
                  className="w-full text-xs font-medium border-2 border-stone-200/90 rounded-xl p-2.5 bg-white shadow-2xs placeholder-stone-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Paso a paso preparación (Un paso por renglón)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ejemplo:&#10;Lavar las verduras asadas y picarlas finamente.&#10;Calentar sartén ligero y sancochar por 5 mins.&#10;Servir en platos tibios y comer despacio."
                  value={newRecStepsText}
                  onChange={(e) => setNewRecStepsText(e.target.value)}
                  className="w-full text-xs font-medium border-2 border-stone-200/90 rounded-xl p-2.5 bg-white shadow-2xs placeholder-stone-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Consejos especiales de sabor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Reemplazar la sal con orégano molido para evitar ráfagas arteriales."
                  value={newRecTips}
                  onChange={(e) => setNewRecTips(e.target.value)}
                  className="w-full text-xs font-semibold border-2 border-stone-200/90 rounded-xl px-2.5 py-1.5 bg-white shadow-2xs focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar en Recetario Familiar</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
