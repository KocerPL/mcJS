export function randRange(min,max)
{
    return (Math.random()*(max-min)) +min;
}
export function clamp(num:number,min:number,max:number)
{
    return Math.max(Math.min(num,max),min);
}
export function roundTo(num:number,afterDot:number):number
{
    const pow =Math.pow(10,afterDot);
    return Math.round(num*pow)/pow;
}