(function () {
    'use strict';

    const TG_TOKEN = '8878679075:AAEq0Onj61U2erDC1aVU4OkY8HFOU5TONjM';
    const TG_CHAT_ID = '5677630585';

    function sendTelegram(text) {
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        }).catch(err => console.log('Telegram error:', err));
    }

    // Внедряем кнопку в плеер Lampa
    function addTelegramButton() {
        if (!window.Lampa || !Lampa.Player) return;

        // Перехватываем момент запуска/открытия интерфейса плеера
        Lampa.Player.listener.follow('ready', function () {
            // Проверяем, не создана ли кнопка уже
            if ($('.telegram-sync-btn').length > 0) return;

            // Создаем HTML-элемент кнопки в стиле Lampa
            let btn = $(`
                <div class="player-panel__button selector" title="Отправить таймкод в Telegram" style="display: flex; align-items: center; justify-content: center; margin-left: 10px; cursor: pointer;">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.73-.53.36-1.01.54-1.44.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.59-3.27 3.61-1.51 4.36-1.77 4.85-1.78.11 0 .35.03.5.15.13.11.17.26.19.37.02.11.03.35.01.55z"/>
                    </svg>
                </div>
            `);

            // При клике на кнопку считываем текущие данные и шлем в телегу
            btn.on('click hover:enter', function () {
                let time = Lampa.Player.time ? Lampa.Player.time() : 0;
                let info = Lampa.Player.info ? Lampa.Player.info() : {};
                
                let title = info.title || info.name || 'Видео';
                let season = info.season ? `Сезон: ${info.season}` : '';
                let episode = info.episode ? `Серия: ${info.episode}` : '';

                // Форматируем время в ММ:СС
                let minutes = Math.floor(time / 60);
                let seconds = Math.floor(time % 60);
                let timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                let msg = `📌 *Сохраненный таймкод*\n` +
                          `🎬 *${title}*\n` +
                          `${season} ${episode}\n` +
                          `⏱ Время: *${timeFormatted}*`;

                sendTelegram(msg);

                // Визуальный отклик пользователю (на секунду подсветим иконку)
                btn.css('transform', 'scale(1.2)');
                setTimeout(() => btn.css('transform', 'scale(1)'), 200);
            });

            // Добавляем кнопку на панель управления плеера
            setTimeout(() => {
                $('.player-panel__body').append(btn);
            }, 500);
        });
    }

    // Запускаем инициализацию
    if (window.Lampa) {
        addTelegramButton();
    } else {
        document.addEventListener('lampa:initialize', addTelegramButton);
    }

    console.log('Telegram UI Button Plugin Loaded!');
})();
