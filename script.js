"use strict";

// 👑 GPKING: настройки Supabase
const SUPABASE_URL = ""https://dgnjdlawdaxotxlrpltl.supabase.co";
const SUPABASE_KEY = "sb_publishable_nhq794cQmZGShJ7og_7fBQ_0A4x6y2p";

const SITE_URL = "https://robloxking13478-arch.github.io/gpking/";

const startButton = document.getElementById("startButton");

if (!window.supabase) {
    alert("Не удалось загрузить Supabase. Проверь интернет-соединение.");
} else {
    const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const params = new URLSearchParams(window.location.hash.substring(1));
    const isRecovery = params.get("type") === "recovery";
    const isSignup = params.get("type") === "signup";

    // Проверяем, открыта ли ссылка восстановления пароля
    if (isRecovery) {
        showNewPasswordForm();
    } else if (isSignup) {
        alert("Если почта подтверждена, теперь можно войти в GPKING! 👑");
        window.history.replaceState(null, "", window.location.pathname);
    }

    if (startButton) {
        startButton.addEventListener("click", async function () {
            const action = prompt(
                "👑 GPKING\n\n" +
                "1 — Регистрация\n" +
                "2 — Вход\n" +
                "3 — Забыл пароль"
            );

            if (action === "1") {
                await register();
            } else if (action === "2") {
                await login();
            } else if (action === "3") {
                await resetPassword();
            }
        });
    }

    async function register() {
        const email = prompt("Введи свою электронную почту:");
        if (!email) return;

        const password = prompt("Придумай пароль (минимум 6 символов):");
        if (!password || password.length < 6) {
            alert("Пароль должен содержать минимум 6 символов.");
            return;
        }

        try {
            const { data, error } = await client.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: SITE_URL
                }
            });

            if (error) throw error;

            if (data.session) {
                alert("Регистрация успешна! Добро пожаловать в GPKING! 👑");
            } else {
                alert("Регистрация создана! Проверь почту и подтверди адрес.");
            }
        } catch (error) {
            showError(error);
        }
    }

    async function login() {
        const email = prompt("Введи свою электронную почту:");
        if (!email) return;

        const password = prompt("Введи пароль:");
        if (!password) return;

        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: email.trim(),
                password
            });

            if (error) throw error;

            alert("Ты вошёл в GPKING! 👑🔥");
            console.log("GPKING: пользователь вошёл", data.user?.id);
        } catch (error) {
            showError(error);
        }
    }

    async function resetPassword() {
        const email = prompt("Введи почту, на которую зарегистрирован аккаунт:");
        if (!email) return;

        try {
            const { error } = await client.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: SITE_URL
                }
            );

            if (error) throw error;

            alert(
                "Если для этой почты существует аккаунт, письмо для сброса пароля отправлено.\n\n" +
                "Проверь входящие письма и папку «Спам»."
            );
        } catch (error) {
            showError(error);
        }
    }

    async function showNewPasswordForm() {
        const { data, error } = await client.auth.getSession();

        if (error || !data.session) {
            alert(
                "Ссылка восстановления недействительна или истекла. " +
                "Запроси новое письмо для сброса пароля."
            );
            return;
        }

        const newPassword = prompt(
            "👑 GPKING\n\nВведи новый пароль (минимум 6 символов):"
        );

        if (!newPassword || newPassword.length < 6) {
            alert("Пароль должен содержать минимум 6 символов.");
            return;
        }

        try {
            const { error: updateError } = await client.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            alert("Пароль успешно изменён! Теперь можешь войти в GPKING. 👑");

            await client.auth.signOut();
            window.history.replaceState(null, "", window.location.pathname);
        } catch (error) {
            showError(error);
        }
    }

    function showError(error) {
        console.error("GPKING error:", error);
        alert("Ошибка: " + (error.message || "Неизвестная ошибка"));
    }
    }
