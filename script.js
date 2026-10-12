"use strict";

// 👑 GPKING: настройки Supabase
const SUPABASE_URL = "https://dgnjdlawdaxotxlrpltl.supabase.co/";
const SUPABASE_KEY = "sb_publishable_nhq794cQmZGShJ7og_7fBQ_0A4x6y2p";

const startButton = document.getElementById("startButton");

if (!window.supabase) {
    alert("Не удалось загрузить Supabase. Проверь интернет-соединение.");
} else {
    const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    startButton.addEventListener("click", async function () {
        const action = prompt(
            "👑 GPKING\n\n" +
            "1 — Регистрация\n" +
            "2 — Вход"
        );

        if (action !== "1" && action !== "2") return;

        const email = prompt("Введи электронную почту:");
        if (!email || !email.includes("@")) {
            alert("Введи корректную электронную почту.");
            return;
        }

        const password = prompt("Введи пароль (минимум 6 символов):");
        if (!password || password.length < 6) {
            alert("Пароль должен содержать минимум 6 символов.");
            return;
        }

        try {
            if (action === "1") {
                const { data, error } = await client.auth.signUp({
                    email: email.trim(),
                    password
                });

                if (error) throw error;

                if (data.session) {
                    alert("Регистрация успешна! Добро пожаловать в GPKING 👑");
                } else {
                    alert(
                        "Регистрация отправлена! Проверь почту и подтверди адрес, " +
                        "если Supabase запросит подтверждение."
                    );
                }
            } else {
                const { error } = await client.auth.signInWithPassword({
                    email: email.trim(),
                    password
                });

                if (error) throw error;

                alert("Ты успешно вошёл в GPKING! 👑🔥");
            }
        } catch (error) {
            console.error("GPKING:", error);
            alert("Не удалось выполнить действие: " + error.message);
        }
    });
    }
