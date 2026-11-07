export const ALLOWANCE = 600;
export const SURPRISE_COST = 80;
export const SHOP = [
  { id: "bus", name: "Bus rides", cost: 100, category: "need", icon: "🚌", note: "Get where you need to go." },
  { id: "notebook", name: "A new notebook", cost: 60, category: "need", icon: "📓", note: "Space for your next big idea." },
  { id: "lunch", name: "Lunch", cost: 80, category: "need", icon: "🥪", note: "Fuel for a busy day." },
  { id: "snack", name: "A little treat", cost: 40, category: "want", icon: "🍧", note: "Something just for fun." },
  { id: "stickers", name: "Sticker pack", cost: 30, category: "want", icon: "✨", note: "Make your things your own." },
  { id: "game", name: "Game credits", cost: 120, category: "want", icon: "🎮", note: "A fun extra to think about." }
];
export const GOALS = [
  { id: "art", name: "Art kit", cost: 600, icon: "🎨" },
  { id: "football", name: "Football", cost: 1200, icon: "⚽" },
  { id: "telescope", name: "Telescope", cost: 2000, icon: "🔭" }
];
export const REQUESTS = [
  { id: "game", name: "Game credits", cost: 120, icon: "🎮" },
  { id: "gift", name: "A birthday gift", cost: 75, icon: "🎁" },
  { id: "craft", name: "Craft supplies", cost: 180, icon: "🧵" }
];
export function initialState() {
  return { allowance: ALLOWANCE, entries: [], saved: 0, goalId: "art", weeklyPlan: 100,
    surpriseRevealed: false, surpriseApplied: false, nextId: 1,
    completed: { spend: false, save: false, discuss: false }, parentDecision: null };
}
export function totals(state) {
  const spent = state.entries.reduce((n, e) => n + e.cost, 0);
  const needs = state.entries.filter(e => e.category === "need").reduce((n,e) => n + e.cost,0);
  const wants = spent - needs;
  return { spent, needs, wants, saved: state.saved, available: state.allowance - spent - state.saved };
}
export function projection(state) {
  const goal = GOALS.find(g => g.id === state.goalId) || GOALS[0];
  const remaining = Math.max(0, goal.cost - state.saved);
  return { goal, remaining, percent: Math.min(100, Math.round(state.saved / goal.cost * 100)),
    weeks: remaining === 0 ? 0 : state.weeklyPlan > 0 ? Math.ceil(remaining / state.weeklyPlan) : null };
}
// Compare two possible uses of the same available money without making a choice.
export function comparePurchase(state, requestId) {
  const item = REQUESTS.find(request => request.id === requestId);
  if (!item) return null;
  const t = totals(state);
  const bought = state.entries.some(entry => entry.parentRequest && entry.requestId === requestId);
  if (bought || item.cost > t.available) return null;
  const buying = projection(state);
  const saving = projection({ ...state, saved: state.saved + item.cost });
  return {
    cost: item.cost,
    availableAfterEither: t.available - item.cost,
    savedIfBuying: state.saved,
    savedIfSaving: state.saved + item.cost,
    weeksIfBuying: buying.weeks,
    weeksIfSaving: saving.weeks,
    weeksEarlier: buying.weeks === null || saving.weeks === null ? null : buying.weeks - saving.weeks,
    goal: buying.goal
  };
}
function fail(state, message) { return { state, message, kind: "notice" }; }
function okay(state, message) { return { state, message, kind: "success" }; }
function money(value) { return Number.isSafeInteger(value) && value > 0; }
function spend(state, item, extra = {}) {
  if (!money(item.cost)) return fail(state, "Choose a whole-rupee amount greater than zero.");
  if (item.cost > totals(state).available) return fail(state, "That is more than your spending money. Try a smaller choice or change your plan.");
  const next = { ...state, entries: [...state.entries, { ...item, id: state.nextId, ...extra }], nextId: state.nextId + 1,
    completed: { ...state.completed, spend: true } };
  return okay(next, item.name + " added. Your money map is up to date.");
}
export function reduce(state, action) {
  switch(action.type) {
    case "BUY": {
      const item = SHOP.find(x => x.id === action.id);
      return item ? spend(state, item) : fail(state, "Choose one of the shop items.");
    }
    case "CUSTOM_SPEND": {
      if (!["need","want"].includes(action.category)) return fail(state,"Choose need or want.");
      return spend(state,{name:"Your pretend " + action.category,cost:Number(action.amount),category:action.category,icon:"🪙"});
    }
    case "REMOVE": {
      const entry = state.entries.find(e => e.id === Number(action.id));
      if (!entry) return fail(state,"That choice has already been removed.");
      return okay({...state, entries:state.entries.filter(e=>e.id!==entry.id),
        saved:entry.fundingSource==="savings" ? state.saved+entry.cost : state.saved,
        surpriseApplied:entry.surprise ? false : state.surpriseApplied,
        parentDecision:entry.parentRequest ? null : state.parentDecision},"Choice undone. You can try a different plan.");
    }
    case "SAVE": {
      const amount=Number(action.amount);
      if(!money(amount)) return fail(state,"Choose a whole-rupee amount to save.");
      if(amount>totals(state).available) return fail(state,"There is not enough spending money for that transfer.");
      return okay({...state,saved:state.saved+amount,completed:{...state.completed,save:true}},
        "Moved ₹"+amount+" to your goal. Saving is still your money.");
    }
    case "WITHDRAW": {
      const amount=Number(action.amount);
      if(!money(amount)||amount>state.saved) return fail(state,"You can only move back money already in savings.");
      return okay({...state,saved:state.saved-amount},"Moved ₹"+amount+" back to spending money.");
    }
    case "GOAL": {
      if(!GOALS.some(g=>g.id===action.id)) return fail(state,"Choose one of the goals.");
      return okay({...state,goalId:action.id},"New goal, same savings. Make a plan that suits it.");
    }
    case "WEEKLY": {
      const amount=Number(action.amount);
      if(!Number.isSafeInteger(amount)||amount<0||amount>600) return fail(state,"Choose a weekly saving plan from ₹0 to ₹600.");
      return okay({...state,weeklyPlan:amount},"Your estimate is updated.");
    }
    case "SHOW_SURPRISE":
      return okay({...state,surpriseRevealed:true},"A surprise expense! You can change your plan.");
    case "PAY_SURPRISE": {
      if(!state.surpriseRevealed) return fail(state,"Reveal the surprise first.");
      if(state.surpriseApplied) return fail(state,"You have already covered this surprise.");
      const fromSavings=action.source==="savings";
      if(fromSavings && state.saved<SURPRISE_COST) return fail(state,"Save at least ₹80 first, or use your spending money.");
      if(!fromSavings && totals(state).available<SURPRISE_COST) return fail(state,"There is not ₹80 left to spend. Undo a choice or move savings back.");
      const base=fromSavings?{...state,saved:state.saved-SURPRISE_COST}:state;
      const result=spend(base,{name:"Replace a lost bus pass",cost:SURPRISE_COST,category:"need",icon:"🎟️"},{surprise:true,fundingSource:fromSavings?"savings":"wallet"});
      if(result.kind!=="success") return result;
      return okay({...result.state,surpriseApplied:true},"Covered! A little room in a plan can help when life changes.");
    }
    case "PARENT_APPROVE": {
      const item=REQUESTS.find(x=>x.id===action.id);
      if(!item) return fail(state,"Choose a purchase to discuss.");
      if(state.entries.some(e=>e.parentRequest && e.requestId===item.id)) return fail(state,"That pretend purchase is already on your money map. Undo it there before trying it again.");
      const result=spend(state,{...item,category:"want"},{parentRequest:true,requestId:item.id});
      if(result.kind!=="success") return result;
      return okay({...result.state,parentDecision:{itemId:item.id,choice:"approved"},
        completed:{...result.state.completed,discuss:true}},"Pretend purchase agreed. Notice what changed in your plan.");
    }
    case "PARENT_WAIT": {
      if(!REQUESTS.some(x=>x.id===action.id)) return fail(state,"Choose a purchase to discuss.");
      if(state.entries.some(e=>e.parentRequest && e.requestId===action.id)) return fail(state,"That pretend purchase is already on your money map. Undo it there if you decide to wait instead.");
      return okay({...state,parentDecision:{itemId:action.id,choice:"wait"},completed:{...state.completed,discuss:true}},
        "You chose to wait. A pause can be a smart decision, too.");
    }
    case "RESET": return okay(initialState(),"A fresh ₹600. Try a different week!");
    default: return fail(state,"Try one of the choices on the screen.");
  }
}
