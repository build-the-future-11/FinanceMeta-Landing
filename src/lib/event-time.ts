// Validate the supplied calendar fields before Date.parse can normalize them.
export function isEventDate(value: string): boolean {
 const fields=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
 if(!fields)return false;
 const year=Number(fields[1]),month=Number(fields[2]),day=Number(fields[3]);
 if(year<1||month<1||month>12||day<1)return false;
 const leap=year%4===0&&(year%100!==0||year%400===0);
 const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
 return day<=days[month-1];
}

export function parseEventInstant(value: string): number | null {
 const fields=/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
 if(!fields||!isEventDate(fields[1])||Number(fields[2])>23||Number(fields[3])>59||Number(fields[4]||0)>59)return null;
 const instant=Date.parse(value);
 if(!Number.isFinite(instant))return null;
 // iCalendar exports use four-digit UTC years after applying the input offset.
 const utcYear=new Date(instant).getUTCFullYear();
 return utcYear>=1&&utcYear<=9999?instant:null;
}
