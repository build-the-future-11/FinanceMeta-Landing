export type ScenarioRow = { period: number; balance: number; contributed: number; interest: number };
function bounded(value:number,min:number,max:number,name:string){if(!Number.isFinite(value)||value<min||value>max)throw new Error(`${name} must be between ${min} and ${max}.`);return value;}
export function growth(principal:number,monthly:number,annualPercent:number,years:number):ScenarioRow[]{
 bounded(principal,0,1e9,'Principal');bounded(monthly,0,1e7,'Monthly contribution');bounded(annualPercent,-50,100,'Annual effective growth');bounded(years,1,100,'Years');
 if(!Number.isInteger(years))throw new Error('Years must be whole numbers.');
 const rate=Math.pow(1+annualPercent/100,1/12)-1;let balance=principal;const rows:ScenarioRow[]=[];
 for(let month=1;month<=years*12;month++){balance=balance*(1+rate)+monthly;if(month%12===0)rows.push({period:month/12,balance,contributed:principal+monthly*month,interest:balance-principal-monthly*month});}return rows;
}
export function amortize(principal:number,annualPercent:number,years:number,extra:number){
 bounded(principal,1,1e9,'Loan principal');bounded(annualPercent,0,100,'Annual nominal rate');bounded(years,1,50,'Term');bounded(extra,0,1e7,'Extra monthly payment');
 if(!Number.isInteger(years))throw new Error('Term must be whole years.');
 const rate=annualPercent/1200,n=years*12,payment=rate===0?principal/n:principal*rate/(1-Math.pow(1+rate,-n));
 let balance=principal,totalInterest=0;const rows:ScenarioRow[]=[];
 for(let month=1;month<=n&&balance>1e-7;month++){const interest=balance*rate,paid=Math.min(balance+interest,payment+extra);balance=Math.max(0,balance+interest-paid);totalInterest+=interest;rows.push({period:month,balance,contributed:principal-balance,interest:totalInterest});}
 return {payment,totalInterest,months:rows.length,rows};
}
export function purchasingPower(amount:number,inflation:number,years:number){bounded(amount,0,1e12,'Amount');bounded(inflation,-50,100,'Annual inflation');bounded(years,0,100,'Years');return amount/Math.pow(1+inflation/100,years);}
export function bond(face:number,couponPercent:number,yieldPercent:number,years:number){
 bounded(face,1,1e9,'Face value');bounded(couponPercent,0,100,'Coupon');bounded(yieldPercent,-50,100,'Yield');bounded(years,1,50,'Maturity');if(!Number.isInteger(years))throw new Error('Maturity must be whole years.');
 const y=yieldPercent/100,c=face*couponPercent/100;let price=0,weighted=0;
 for(let t=1;t<=years;t++){const present=(c+(t===years?face:0))/Math.pow(1+y,t);price+=present;weighted+=t*present;}return {price,duration:weighted/price,modifiedDuration:weighted/price/(1+y)};
}
export function portfolioRisk(weight:number,volA:number,volB:number,correlation:number){bounded(weight,0,1,'Weight');bounded(volA,0,200,'Volatility A');bounded(volB,0,200,'Volatility B');bounded(correlation,-1,1,'Correlation');return Math.sqrt(Math.max(0,weight**2*volA**2+(1-weight)**2*volB**2+2*weight*(1-weight)*volA*volB*correlation));}
export function valuation(cashFlow:number,growthPercent:number,discountPercent:number,years:number){
 bounded(cashFlow,0,1e12,'Annual cash flow');bounded(growthPercent,-50,100,'Cash-flow growth');bounded(discountPercent,0,100,'Discount rate');bounded(years,1,50,'Horizon');if(!Number.isInteger(years))throw new Error('Horizon must be whole years.');
 return Array.from({length:years},(_,i)=>cashFlow*Math.pow(1+growthPercent/100,i+1)/Math.pow(1+discountPercent/100,i+1)).reduce((a,b)=>a+b,0);
}
export function scenarioCsv(rows:ScenarioRow[]){return ['period,balance,principal_or_contributions,cumulative_interest_or_growth',...rows.map(r=>[r.period,r.balance,r.contributed,r.interest].join(','))].join('\n');}
