import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Calendar({tasks}) {

    const events = tasks.map(task => ({
        title: task.titulo,
        date: task.data,
        color:
        task.prioridade === "alta"
        ? "red"
        : task.prioridade === "media"
        ? "orange"
        : "green"
    }));

    return (
        <div className='calendar'>

            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            />
        </div>
    );
}