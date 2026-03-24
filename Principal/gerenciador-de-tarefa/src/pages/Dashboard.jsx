import Calendar from "../components/Calendar";

export default function Dashboard() {

    const tasksPessoal = JSON.parse(localStorage.getItem("tasks_pessoal")) || [];
    const tasksEmpresarial = JSON.parse(localStorage.getItem("tasks_empresarial")) || [];

    const todas = [...tasksPessoal, ...tasksEmpresarial];

    return (
        <>
        <h2>Visão Geral</h2>

        <Calendar tasks={todas} />

        <ul>
            {todas.map(task => (
                <li key={task.id}>
                    {task.titulo} = {task.prioridade}
                </li>
            ))}
        </ul>
        </>
    );
}