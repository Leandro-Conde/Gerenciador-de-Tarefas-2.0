import Calendar from "../components/Calendar";

export default function CalendarioGeral({ tasksPessoal, tasksEmpresa}) {

    const todas = [...tasksPessoal, ...tasksEmpresa];

    return (
        <>
        <h2>Calendário geral</h2>
        <Calendar tasks={todas} />
        </>
    );

}