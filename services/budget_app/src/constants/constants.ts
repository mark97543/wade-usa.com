// constants.ts

export const CATEGORY_COLORS = [
  { id: 0, label: 'Color: None',   value: 'transparent', contrast: 'var(--primary-color)' }, 
  { id: 1, label: 'Recomend: Income',  value: '#22c55e', contrast: '#ffffff' }, // Income/Growth
  { id: 2, label: 'Recomend: Debt',    value: '#dc2626', contrast: '#ffffff' }, // Debt/Urgent
  { id: 3, label: 'Recomend: Savings',   value: '#0ea5e9', contrast: '#ffffff' }, // Savings/Safety
  { id: 4, label: 'Recomend: Utilities', value: '#eab308', contrast: '#000000' }, // Utilities/Bills
  { id: 5, label: 'Recomend: Investments', value: '#8b5cf6', contrast: '#ffffff' }, // Investments
  { id: 6, label: 'Recomend: Taxes', value: '#ea580c', contrast: '#ffffff' }, // Taxes/Fees
  { id: 7, label: 'Recomend: Household',   value: '#ec4899', contrast: '#ffffff' }, // Lifestyle/Food
  { id: 8, label: 'Recomend: Transport',   value: '#06b6d4', contrast: '#ffffff' }, // Transport
  { id: 9, label: 'Recomend: Entertainment',  value: '#94a3b8', contrast: '#ffffff' }, // Misc/General
  { id: 10, label: 'Recomend: Other',value:'#7c3aed', contrast: '#ffffff' }
];

export const BUCKETS = [
    {id:0, label:'None'},
    {id:1, label:'Income'},
    {id:2, label:'Essentials'},
    {id:3, label:'Debt'},
    {id:4, label:'Savings'},
    {id:5, label:'Discretionary'}
]

export const FREQUENCY = [
    {id:0, label:'Select Frequency'},
    {id:1, label:'Weekly'},
    {id:2, label:'Bi-Weekly'},
    {id:1, label:'Monthly'},
    {id:2, label:'Quarterly'},
    {id:3, label:'Yearly'}
]