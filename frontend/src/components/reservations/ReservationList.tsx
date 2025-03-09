import React from 'react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Reservation } from '../../types';

interface ReservationListProps {
    reservations: Reservation[];
    onEdit: (reservation: Reservation) => void;
    onDelete: (reservation: Reservation) => void;
    currentUserId: string | undefined;
}

const ReservationList: React.FC<ReservationListProps> = ({
    reservations,
    onEdit,
    onDelete,
    currentUserId,
}) => {
    if (reservations.length === 0) {
        return (
            <div className= "text-center py-8 text-gray-500" >
            Keine Reservierungen gefunden.
      </div>
    );
  }

const formatDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'dd. MMMM yyyy, HH:mm', { locale: de });
};

return (
    <div className= "overflow-x-auto" >
    <table className="min-w-full divide-y divide-gray-200" >
        <thead className="bg-gray-50" >
            <tr>
            <th scope="col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Startzeit
                </th>
                < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                    Endzeit
                    </th>
                    < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                        Beschreibung
                        </th>
                        < th scope = "col" className = "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" >
                            Aktionen
                            </th>
                            </tr>
                            </thead>
                            < tbody className = "bg-white divide-y divide-gray-200" >
                            {
                                reservations.map((reservation) => (
                                    <tr key= { reservation.id } >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" >
                                { formatDateTime(reservation.start_time)
                            }
                                </td>
                                < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-900" >
                                    { formatDateTime(reservation.end_time) }
                                    </td>
                                    < td className = "px-6 py-4 text-sm text-gray-900" >
                                        { reservation.description || '-' }
                                        </td>
                                        < td className = "px-6 py-4 whitespace-nowrap text-right text-sm font-medium" >
                                            { currentUserId === reservation.user_id ? (
                                                <div className= "flex justify-end space-x-2" >
                                        <button
                      onClick={ () => onEdit(reservation) }
className = "text-primary-600 hover:text-primary-900"
    >
    Bearbeiten
    </button>
    < button
onClick = {() => onDelete(reservation)}
className = "text-red-600 hover:text-red-900"
    >
    Löschen
    </button>
    </div>
                ) : (
    <span className= "text-gray-400" > Keine Berechtigung </span>
                )}
</td>
    </tr>
          ))}
</tbody>
    </table>
    </div>
  );
};

export default ReservationList; 