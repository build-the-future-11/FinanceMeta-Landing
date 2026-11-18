import { initialState, reduce, totals, projection, comparePurchase, SHOP, GOALS, REQUESTS, SURPRISE_COST } from "./money-core.js";

let state = initialState();
let currentScreen = "spend";
let requestId = REQUESTS[0].id;
let reason = "use";
const money = value => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(value);
const q = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const put = (id,value) => { q(id).textContent=value; };

function renderWallet() {
  const t=totals(state);
  put("available",money(t.available)); put("spent",money(t.spent)); put("saved",money(t.saved)); put("ready",money(t.available));
  q("money-bar").innerHTML=[["spent",t.spent],["saved",t.saved],["available",t.available]]
    .map(([kind,amount])=>'<span class="'+kind+'" style="width:'+(amount/state.allowance*100)+'%"></span>').join("");
  q("money-bar").setAttribute("aria-label",money(t.spent)+" spent, "+money(t.saved)+" saved, "+money(t.available)+" available");
  q("missions").innerHTML=[["spend","Track a choice"],["save","Save for a goal"],["discuss","Talk it through"]]
    .map(([id,label],i)=>'<div class="mission '+(state.completed[id]?"done":"")+'"><span class="mission-circle" aria-hidden="true">'+(state.completed[id]?"✓":i+1)+'</span><span>'+label+(state.completed[id]?'<span class="sr-only">, complete</span>':"")+'</span></div>').join("");
  put("mission-note",Object.values(state.completed).every(Boolean)?"All three explored! Try another plan and see what changes.":"Try all three. There is room to explore.");
}
function renderShop() {
  const t=totals(state);
  q("shop").innerHTML=SHOP.map(item=>'<button class="shop-card" data-action="buy" data-id="'+item.id+'" '+(item.cost>t.available?"disabled":"")+' aria-label="Spend '+money(item.cost)+' on '+item.name+', a '+item.category+'"><span class="shop-card-head"><span class="item-icon" aria-hidden="true">'+item.icon+'</span><span class="tag '+item.category+'">'+item.category+'</span></span><span class="item-name">'+item.name+'</span><span class="item-note">'+item.note+'</span><span class="item-price">'+money(item.cost)+'<span class="item-add" aria-hidden="true">+</span></span></button>').join("");
  put("needs-total",money(t.needs)); put("wants-total",money(t.wants));
  put("receipt-count",state.entries.length+" "+(state.entries.length===1?"choice":"choices"));
  q("receipts").innerHTML=state.entries.length?state.entries.map(e=>'<div class="receipt-item"><span class="receipt-item-icon" aria-hidden="true">'+e.icon+'</span><span class="receipt-item-name">'+escapeHtml(e.name)+'</span><strong>'+money(e.cost)+'</strong><button class="undo-button" data-action="remove" data-id="'+e.id+'" aria-label="Undo '+escapeHtml(e.name)+'">↶</button></div>').join(""):'<p class="receipt-empty">Pick something above. Your choices will appear here.</p>';
  if(!state.surpriseRevealed) {
    q("surprise").innerHTML='<span class="surprise-icon" aria-hidden="true">✉️</span><div class="surprise-body"><h3>A tiny twist in your week</h3><p>Sometimes a plan needs a little wiggle room.</p></div><button class="button secondary" data-action="surprise">Open surprise</button>';
  } else if(state.surpriseApplied) {
    q("surprise").innerHTML='<span class="surprise-icon" aria-hidden="true">🌱</span><div class="surprise-body"><h3>You adjusted your plan.</h3><p>The pretend bus pass is replaced. Notice how your money map changed.</p></div>';
  } else {
    q("surprise").innerHTML='<span class="surprise-icon" aria-hidden="true">🎟️</span><div class="surprise-body"><h3>Oops, a lost bus pass.</h3><p>A replacement costs '+money(SURPRISE_COST)+'. How will you cover it? You can undo an earlier choice if you need to.</p><div class="surprise-actions"><button class="button secondary" data-action="pay-surprise" data-source="wallet" '+(t.available<SURPRISE_COST?"disabled":"")+'>Use spending money</button><button class="button secondary" data-action="pay-surprise" data-source="savings" '+(state.saved<SURPRISE_COST?"disabled":"")+'>Use some savings</button></div></div>';
  }
}
function renderSavings() {
  const p=projection(state), t=totals(state);
  q("goal-choices").innerHTML=GOALS.map(goal=>'<button class="goal-choice '+(goal.id===state.goalId?"selected":"")+'" data-action="goal" data-id="'+goal.id+'" aria-pressed="'+(goal.id===state.goalId)+'"><span class="goal-emoji" aria-hidden="true">'+goal.icon+'</span><strong>'+goal.name+'</strong><span class="goal-price">'+money(goal.cost)+'</span></button>').join("");
  put("goal-name",p.goal.name); put("goal-icon",p.goal.icon); put("goal-saved",money(state.saved)); put("goal-cost",money(p.goal.cost));
  q("goal-fill").style.width=p.percent+"%";
  q("goal-fill").parentElement.setAttribute("aria-label",p.percent+" percent of goal saved");
  put("goal-progress",p.remaining===0?"Goal reached in this practice world. You made a plan happen!":state.saved===0?"Your first little bit gets it started.":money(p.remaining)+" to go. Little steps add up.");
  document.querySelectorAll('#screen-save [data-action="save"]').forEach(button=>{button.disabled=Number(button.dataset.amount)>t.available;});
  q("withdraw-button").disabled=state.saved===0;
  q("weekly-plan").value=state.weeklyPlan; put("weekly-value",money(state.weeklyPlan));
  put("weeks-estimate",p.weeks===0?"You have enough saved for this goal!":p.weeks===null?"Choose a weekly amount to see your plan.":"About "+p.weeks+" more "+(p.weeks===1?"week":"weeks")+" at "+money(state.weeklyPlan)+" a week.");
}
function renderParent() {
  const item=REQUESTS.find(x=>x.id===requestId), t=totals(state), goal=projection(state).goal;
  const alreadyPurchased=state.entries.some(e=>e.parentRequest && e.requestId===item.id);
  const phrases={use:"I think I will use it often.",joy:"It would make me happy.",gift:"I want to do something kind."};
  put("request-speech","Can we talk about "+item.name.toLowerCase()+"? It costs "+money(item.cost)+". "+phrases[reason]+" Can we check how it fits my plan?");
  q("request-impact").innerHTML=alreadyPurchased?'This choice is included in your spending. You now have <strong>'+money(t.available)+'</strong> left to spend and <strong>'+money(state.saved)+'</strong> saved.':t.available>=item.cost?'After this choice, you would have <strong>'+money(t.available-item.cost)+'</strong> left to spend. Your <strong>'+money(state.saved)+'</strong> savings would stay put. Or you could save that '+money(item.cost)+' toward your '+goal.name.toLowerCase()+'.':'This costs <strong>'+money(item.cost-t.available)+'</strong> more than your spending money. Waiting or changing an earlier choice keeps the plan within your allowance.';
  const comparison=comparePurchase(state,requestId);
  q("choice-comparison").hidden=!comparison;
  if(comparison) {
    const estimate=weeks=>weeks===null?"Set a weekly plan":weeks===0?"Goal funded":weeks+" more "+(weeks===1?"week":"weeks");
    q("choice-comparison").innerHTML='<h3>Two possible plans</h3><p>What if you used this '+money(comparison.cost)+' for your '+goal.name.toLowerCase()+' instead?</p><table><caption class="sr-only">Compare buying the item with saving its cost</caption><thead><tr><th scope="col">Your plan</th><th scope="col">Buy it</th><th scope="col">Save instead</th></tr></thead><tbody><tr><th scope="row">In savings</th><td>'+money(comparison.savedIfBuying)+'</td><td>'+money(comparison.savedIfSaving)+'</td></tr><tr><th scope="row">Left to spend</th><td>'+money(comparison.availableAfterEither)+'</td><td>'+money(comparison.availableAfterEither)+'</td></tr><tr><th scope="row">Goal estimate</th><td>'+estimate(comparison.weeksIfBuying)+'</td><td>'+estimate(comparison.weeksIfSaving)+'</td></tr></tbody></table><p class="comparison-note">'+(comparison.weeksEarlier===null?'Choose a weekly saving amount in Save to compare time to your goal.':comparison.weeksEarlier>0?'Saving instead could reach this goal '+comparison.weeksEarlier+' '+(comparison.weeksEarlier===1?'week':'weeks')+' earlier with your current weekly plan.':'Both plans reach the goal in the same whole-week estimate; saving instead leaves more money in savings.')+' This is a comparison, not a transfer. Your choices and weekly plan can change.</p>';
  }
  const approveButton=document.querySelector('[data-action="approve"]');
  approveButton.disabled=alreadyPurchased || t.available<item.cost;
  approveButton.textContent=alreadyPurchased?"Pretend purchase added":"Agree to the pretend purchase";
  document.querySelector('[data-action="wait"]').disabled=alreadyPurchased;
  if(alreadyPurchased){
    q("parent-result").innerHTML='<p class="parent-result">This pretend purchase is already on your money map. You can undo it there if you change your mind.</p>';
  } else if(state.parentDecision && state.parentDecision.itemId===requestId){
    const previous=REQUESTS.find(x=>x.id===state.parentDecision.itemId);
    const name=previous?previous.name.toLowerCase():"the purchase";
    q("parent-result").innerHTML='<p class="parent-result">'+(state.parentDecision.choice==="wait"?"You practised choosing to wait on "+name+".":"You agreed to the pretend "+name+" purchase. It is on your money map.")+'</p>';
  } else q("parent-result").innerHTML="";
}
function restoreFocus(previous) {
  if(!previous || !previous.action) return;
  const buttons=[...document.querySelectorAll("button[data-action]")];
  const replacement=buttons.find(button=>button.dataset.action===previous.action && button.dataset.id===previous.id && button.dataset.amount===previous.amount && button.dataset.source===previous.source);
  if(replacement && !replacement.disabled) replacement.focus({preventScroll:true});
  else q("status").focus({preventScroll:true});
}
function render() {
  const active=document.activeElement;
  const previous=active?.dataset?.action?{action:active.dataset.action,id:active.dataset.id,amount:active.dataset.amount,source:active.dataset.source}:null;
  renderWallet(); renderShop(); renderSavings(); renderParent();
  restoreFocus(previous);
}
function showScreen(screen, move=false) {
  if(!["spend","save","discuss"].includes(screen)) return;
  currentScreen=screen;
  document.querySelectorAll(".screen").forEach(section=>{section.hidden=section.id!=="screen-"+screen;});
  document.querySelectorAll(".step").forEach(button=>{
    const selected=button.dataset.screen===screen;
    button.classList.toggle("active",selected);
    if(selected)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current");
  });
  if(move) {
    // A Next button becomes hidden with its panel. Keep keyboard users in the new activity.
    const heading=q(screen+"-title");
    heading.setAttribute("tabindex","-1");
    heading.focus({preventScroll:true});
    if(window.matchMedia("(max-width: 720px)").matches) document.querySelector(".steps").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
  }
}
function dispatch(action) {
  const result=reduce(state,action); state=result.state;
  render();
  q("status").className="status "+result.kind;
  put("status",result.message);
}
q("request-item").innerHTML=REQUESTS.map(item=>'<option value="'+item.id+'">'+item.icon+' '+item.name+' · '+money(item.cost)+'</option>').join("");
document.addEventListener("click",event=>{
  const button=event.target.closest("button");
  if(!button || button.disabled) return;
  if(button.dataset.screen){showScreen(button.dataset.screen,true);return;}
  const action=button.dataset.action;
  if(action==="buy")dispatch({type:"BUY",id:button.dataset.id});
  if(action==="remove")dispatch({type:"REMOVE",id:button.dataset.id});
  if(action==="save")dispatch({type:"SAVE",amount:Number(button.dataset.amount)});
  if(action==="withdraw")dispatch({type:"WITHDRAW",amount:state.saved});
  if(action==="goal")dispatch({type:"GOAL",id:button.dataset.id});
  if(action==="surprise")dispatch({type:"SHOW_SURPRISE"});
  if(action==="pay-surprise")dispatch({type:"PAY_SURPRISE",source:button.dataset.source});
  if(action==="approve")dispatch({type:"PARENT_APPROVE",id:requestId});
  if(action==="wait")dispatch({type:"PARENT_WAIT",id:requestId});
  if(action==="reset"){
    requestId=REQUESTS[0].id; reason="use";
    q("request-item").value=requestId; q("request-reason").value=reason;
    q("custom-amount").value="50"; q("custom-category").value="need";
    dispatch({type:"RESET"}); showScreen("spend",true);
  }
});
q("custom-form").addEventListener("submit",event=>{
  event.preventDefault();
  dispatch({type:"CUSTOM_SPEND",amount:Number(q("custom-amount").value),category:q("custom-category").value});
});
q("weekly-plan").addEventListener("input",event=>dispatch({type:"WEEKLY",amount:Number(event.target.value)}));
q("request-item").addEventListener("change",event=>{requestId=event.target.value;renderParent();});
q("request-reason").addEventListener("change",event=>{reason=event.target.value;renderParent();});
render(); showScreen(currentScreen);
