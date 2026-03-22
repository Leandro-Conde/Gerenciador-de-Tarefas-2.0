* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

:root {
    --fundo-principal: #f5f5f5;
    --letra-um: #000000;
    --fundo-card: #c42149;
    --letra-dois: #fff;
    --botao: #721347;

    --bg: #f5f5f5;
    --text: #000;
    --card: #ffffff;
    --main: #ffffff;
}

/* DARK MODE */
.dark {
    --bg: #000000de;
    --text: #ffffff;
    --card: #1e1e1e;
    --main: #5f0f27;
    --fundo-card: #5e0101;
}

/* BASE */
body {
    font-family: Arial, Helvetica, sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: 0.3s;
}

/* HEADER */
.head {
    padding: 1.5rem;
    background: var(--fundo-card);
    color: var(--letra-dois);
    text-align: center;
}

/* LAYOUT */
.container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* FORM */
form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

input, select, button {
    padding: 0.75rem;
    font-size: 1rem;
}

button {
    background: var(--botao);
    color: white;
    border: none;
    cursor: pointer;
}

/* LISTA */
ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

li {
    padding: 1rem;
    border-radius: 6px;
    background-color: var(--card);
}

/* ESTADOS */
.feito {
    text-decoration: line-through;
    opacity: 0.6;
}

.dragging {
    opacity: 0.5;
}

/* PRIORIDADE */
.prioridade-alta {
    background-color: rgba(255, 18, 18, 0.644);
}

.prioridade-media {
    background-color: rgba(253, 190, 1, 0.753);
}

.prioridade-baixa {
    background-color: rgba(0, 255, 60, 0.521);
}

/* FOOTER */
footer {
    text-align: center;
    padding-top: 10px;
}

/* RESPONSIVO */
@media (min-width: 768px) {
    .container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        max-width: 1000px;
        margin: 0 auto;
    }

    .card {
        background: var(--card);
        padding: 1.5rem;
        border-radius: 8px;
    }

    main {
        background: var(--main);
        border-radius: 20px;
        box-shadow: 2px 2px rgba(0, 0, 0, 0.3);
    }
}