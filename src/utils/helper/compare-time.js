function compareTime(time1,time2)
{
    const departureTime=new Date(time1);
    const arrivalTime=new Date(time2);
    return arrivalTime > departureTime;
}
module.exports=compareTime;