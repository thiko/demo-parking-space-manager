import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangeFilterProps {
    onFilter: (startDate: string, endDate: string) => void;
}

interface DateRangeFormData {
    startDate: Date;
    endDate: Date;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onFilter }) => {
    const defaultStartDate = startOfDay(new Date());
    const defaultEndDate = endOfDay(addDays(new Date(), 7));

    const { control, handleSubmit } = useForm<DateRangeFormData>({
        defaultValues: {
            startDate: defaultStartDate,
            endDate: defaultEndDate,
        },
    });

    const onSubmit = (data: DateRangeFormData) => {
        const formattedStartDate = format(data.startDate, "yyyy-MM-dd'T'00:00:00'Z'");
        const formattedEndDate = format(data.endDate, "yyyy-MM-dd'T'23:59:59'Z'");
        onFilter(formattedStartDate, formattedEndDate);
    };

    return (
        <form onSubmit= { handleSubmit(onSubmit) } className = "bg-white p-4 rounded-lg shadow-sm mb-6" >
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4" >
                <div className="flex-1" >
                    <label className="label" > Startdatum </label>
                        < Controller
    control = { control }
    name = "startDate"
    render = {({ field }) => (
        <DatePicker
                selected= { field.value }
onChange = {(date) => field.onChange(date)}
selectsStart
startDate = { field.value }
dateFormat = "dd.MM.yyyy"
className = "input"
locale = { de }
    />
            )}
          />
    </div>

    < div className = "flex-1" >
        <label className="label" > Enddatum </label>
            < Controller
control = { control }
name = "endDate"
render = {({ field }) => (
    <DatePicker
                selected= { field.value }
onChange = {(date) => field.onChange(date)}
selectsEnd
startDate = { defaultStartDate }
endDate = { field.value }
minDate = { defaultStartDate }
dateFormat = "dd.MM.yyyy"
className = "input"
locale = { de }
    />
            )}
          />
    </div>

    < div >
    <button type="submit" className = "btn btn-primary w-full md:w-auto" >
        Filtern
        </button>
        </div>
        </div>
        </form>
  );
};

export default DateRangeFilter; 