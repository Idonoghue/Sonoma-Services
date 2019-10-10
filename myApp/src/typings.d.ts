
interface Date {
    addDays(days : number) : Date;
    getAbbrMonth() : string;
    getTimeStandard() : string;
    getWeekDay() : string;
}

interface Array<T> {
    sortBy( param : any ) : any;
}