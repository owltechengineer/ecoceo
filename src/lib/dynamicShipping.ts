// Sistema di calcolo dinamico delle spese di spedizione
// Basato su peso, destinazione e tipo di spedizione

export interface ShippingZone {
  countries: string[];
  name: string;
  baseRate: number; // Tariffa base in centesimi
  weightMultiplier: number; // Moltiplicatore per kg
  expressMultiplier: number; // Moltiplicatore per spedizione express
}

export interface ShippingCalculation {
  standard: {
    cost: number; // in centesimi
    days: { min: number; max: number };
    name: string;
  };
  express: {
    cost: number; // in centesimi
    days: { min: number; max: number };
    name: string;
  };
  freeShippingThreshold: number; // in centesimi
}

// Zone di spedizione con tariffe differenziate
const shippingZones: ShippingZone[] = [
  {
    countries: ['IT'],
    name: 'Italia',
    baseRate: 500, // €5.00
    weightMultiplier: 50, // €0.50 per kg
    expressMultiplier: 2.0
  },
  {
    countries: ['FR', 'DE', 'ES', 'AT', 'CH', 'BE', 'NL', 'LU'],
    name: 'Europa Occidentale',
    baseRate: 800, // €8.00
    weightMultiplier: 80, // €0.80 per kg
    expressMultiplier: 2.2
  },
  {
    countries: ['GB', 'IE'],
    name: 'Regno Unito e Irlanda',
    baseRate: 1200, // €12.00
    weightMultiplier: 120, // €1.20 per kg
    expressMultiplier: 2.5
  },
  {
    countries: ['US', 'CA'],
    name: 'Nord America',
    baseRate: 2000, // €20.00
    weightMultiplier: 200, // €2.00 per kg
    expressMultiplier: 2.8
  },
  {
    countries: ['AU', 'NZ', 'JP', 'KR', 'SG', 'HK'],
    name: 'Asia-Pacifico',
    baseRate: 2500, // €25.00
    weightMultiplier: 250, // €2.50 per kg
    expressMultiplier: 3.0
  },
  {
    countries: ['BR', 'AR', 'CL', 'MX'],
    name: 'America Latina',
    baseRate: 2200, // €22.00
    weightMultiplier: 220, // €2.20 per kg
    expressMultiplier: 2.8
  }
];

// Zone di spedizione per il resto del mondo
const defaultZone: ShippingZone = {
  countries: ['*'], // Tutti gli altri paesi
  name: 'Resto del Mondo',
  baseRate: 3000, // €30.00
  weightMultiplier: 300, // €3.00 per kg
  expressMultiplier: 3.2
};

/**
 * Trova la zona di spedizione per un paese
 */
export const findShippingZone = (country: string): ShippingZone => {
  const zone = shippingZones.find(zone => 
    zone.countries.includes(country.toUpperCase())
  );
  
  return zone || defaultZone;
};

/**
 * Calcola le spese di spedizione dinamiche
 */
export const calculateDynamicShipping = (
  weight: number, // in kg
  country: string,
  orderTotal: number = 0 // in centesimi per soglia spedizione gratuita
): ShippingCalculation => {
  const zone = findShippingZone(country);
  
  // Calcolo costo base
  const baseCost = zone.baseRate + (weight * zone.weightMultiplier);
  
  // Calcolo costo express
  const expressCost = Math.round(baseCost * zone.expressMultiplier);
  
  // Soglia spedizione gratuita (€100 per Italia, €150 per Europa, €200 per resto del mondo)
  const freeShippingThreshold = zone.countries.includes('IT') ? 10000 : 
                               zone.countries.includes('FR') || zone.countries.includes('DE') ? 15000 : 
                               20000;
  
  // Se l'ordine supera la soglia, spedizione gratuita
  if (orderTotal >= freeShippingThreshold) {
    return {
      standard: {
        cost: 0,
        days: { min: 2, max: 5 },
        name: `Spedizione Gratuita - ${zone.name}`
      },
      express: {
        cost: 0,
        days: { min: 1, max: 3 },
        name: `Spedizione Express Gratuita - ${zone.name}`
      },
      freeShippingThreshold
    };
  }
  
  // Calcolo giorni di consegna basati sulla zona
  const getDeliveryDays = (zone: ShippingZone, isExpress: boolean) => {
    if (zone.countries.includes('IT')) {
      return isExpress ? { min: 1, max: 2 } : { min: 2, max: 4 };
    } else if (zone.countries.includes('FR') || zone.countries.includes('DE')) {
      return isExpress ? { min: 2, max: 3 } : { min: 3, max: 6 };
    } else if (zone.countries.includes('US') || zone.countries.includes('CA')) {
      return isExpress ? { min: 3, max: 5 } : { min: 7, max: 14 };
    } else {
      return isExpress ? { min: 5, max: 8 } : { min: 10, max: 21 };
    }
  };
  
  return {
    standard: {
      cost: Math.round(baseCost),
      days: getDeliveryDays(zone, false),
      name: `Standard - ${zone.name}`
    },
    express: {
      cost: Math.round(expressCost),
      days: getDeliveryDays(zone, true),
      name: `Express - ${zone.name}`
    },
    freeShippingThreshold
  };
};

/**
 * Calcola il peso totale di un ordine
 * Il peso in Sanity è memorizzato in grammi, lo convertiamo in kg
 */
export const calculateOrderWeight = (items: any[]): number => {
  return items.reduce((totalWeight, item) => {
    // Gestisce sia prodotti Sanity che Stripe
    let itemWeightInGrams = 500; // Default 500g (0.5kg) per item
    
    if (item.product?.weight) {
      // Prodotto Sanity: peso già in grammi
      itemWeightInGrams = item.product.weight;
    } else if (item.product?.metadata?.weight) {
      // Prodotto Stripe: peso nei metadati in grammi
      itemWeightInGrams = parseFloat(item.product.metadata.weight) || 500;
    }
    
    const itemWeightInKg = itemWeightInGrams / 1000; // Converti grammi in kg
    return totalWeight + (itemWeightInKg * item.quantity);
  }, 0);
};

/**
 * Calcola le dimensioni totali di un ordine
 * Le dimensioni in Sanity sono in cm
 */
export const calculateOrderDimensions = (items: any[]): { length: number; width: number; height: number; volume: number } => {
  let totalLength = 0;
  let totalWidth = 0;
  let totalHeight = 0;
  let totalVolume = 0;

  items.forEach(item => {
    let dimensions = item.product?.dimensions;
    
    // Gestisce sia prodotti Sanity che Stripe
    if (!dimensions && item.product?.metadata?.dimensions) {
      // Prodotto Stripe: dimensioni nei metadati come JSON string
      try {
        dimensions = JSON.parse(item.product.metadata.dimensions);
      } catch (e) {
        console.warn('Errore nel parsing delle dimensioni:', e);
        dimensions = null;
      }
    }
    
    if (dimensions) {
      // Per ogni item, aggiungiamo le dimensioni
      totalLength += (dimensions.length || 0) * item.quantity;
      totalWidth += (dimensions.width || 0) * item.quantity;
      totalHeight += (dimensions.height || 0) * item.quantity;
      
      // Calcoliamo il volume per item
      const itemVolume = (dimensions.length || 0) * (dimensions.width || 0) * (dimensions.height || 0);
      totalVolume += itemVolume * item.quantity;
    } else {
      // Dimensioni default se non specificate
      const defaultLength = 20; // 20cm
      const defaultWidth = 15;  // 15cm
      const defaultHeight = 10; // 10cm
      
      totalLength += defaultLength * item.quantity;
      totalWidth += defaultWidth * item.quantity;
      totalHeight += defaultHeight * item.quantity;
      
      const defaultVolume = defaultLength * defaultWidth * defaultHeight;
      totalVolume += defaultVolume * item.quantity;
    }
  });

  return {
    length: totalLength,
    width: totalWidth,
    height: totalHeight,
    volume: totalVolume
  };
};

/**
 * Crea le opzioni di spedizione per Stripe
 */
export const createDynamicShippingOptions = (
  items: any[],
  country: string,
  orderTotal: number = 0
) => {
  const totalWeight = calculateOrderWeight(items);
  const shipping = calculateDynamicShipping(totalWeight, country, orderTotal);
  
  const options = [];
  
  // Opzione standard
  if (shipping.standard.cost > 0) {
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: {
          amount: shipping.standard.cost,
          currency: 'eur',
        },
        display_name: shipping.standard.name,
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: shipping.standard.days.min },
          maximum: { unit: 'business_day' as const, value: shipping.standard.days.max }
        },
        metadata: {
          shipping_type: 'standard',
          weight: totalWeight.toString(),
          zone: findShippingZone(country).name
        }
      },
    });
  } else {
    // Spedizione gratuita
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: {
          amount: 0,
          currency: 'eur',
        },
        display_name: shipping.standard.name,
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: shipping.standard.days.min },
          maximum: { unit: 'business_day' as const, value: shipping.standard.days.max }
        },
        metadata: {
          shipping_type: 'free',
          weight: totalWeight.toString(),
          zone: findShippingZone(country).name
        }
      },
    });
  }
  
  // Opzione express (solo se non è gratuita)
  if (shipping.express.cost > 0) {
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: {
          amount: shipping.express.cost,
          currency: 'eur',
        },
        display_name: shipping.express.name,
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: shipping.express.days.min },
          maximum: { unit: 'business_day' as const, value: shipping.express.days.max }
        },
        metadata: {
          shipping_type: 'express',
          weight: totalWeight.toString(),
          zone: findShippingZone(country).name
        }
      },
    });
  }
  
  return options;
};

/**
 * Formatta il prezzo per la visualizzazione
 */
export const formatShippingPrice = (priceInCents: number): string => {
  if (priceInCents === 0) return 'Gratuita';
  return `€${(priceInCents / 100).toFixed(2)}`;
};

/**
 * Ottieni informazioni dettagliate sulla spedizione
 */
export const getShippingInfo = (country: string, weight: number, orderTotal: number = 0, items: any[] = []) => {
  const zone = findShippingZone(country);
  const shipping = calculateDynamicShipping(weight, country, orderTotal);
  const dimensions = calculateOrderDimensions(items);
  
  return {
    zone: zone.name,
    weight: `${weight.toFixed(2)}kg`,
    dimensions: {
      length: `${dimensions.length.toFixed(1)}cm`,
      width: `${dimensions.width.toFixed(1)}cm`,
      height: `${dimensions.height.toFixed(1)}cm`,
      volume: `${(dimensions.volume / 1000000).toFixed(2)}m³` // Converti cm³ in m³
    },
    standard: {
      cost: formatShippingPrice(shipping.standard.cost),
      days: `${shipping.standard.days.min}-${shipping.standard.days.max} giorni`,
      name: shipping.standard.name
    },
    express: {
      cost: formatShippingPrice(shipping.express.cost),
      days: `${shipping.express.days.min}-${shipping.express.days.max} giorni`,
      name: shipping.express.name
    },
    freeShippingThreshold: `€${(shipping.freeShippingThreshold / 100).toFixed(2)}`,
    isFreeShipping: orderTotal >= shipping.freeShippingThreshold
  };
};
