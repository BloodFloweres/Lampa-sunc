(function () {
    'use strict';

    // Твои данные Telegram
    const TG_TOKEN = '8878679075:AAEq0Onj61U2erDC1aVU4OkY8HFOU5TONjM'; // Вставь токен от BotFather в кавычки
    const TG_CHAT_ID = '5677630585'; // Вставь свой цифровой ID сюда

    function sendTelegramNotification(title, season, episode, time) {
        if (!TG_TOKEN || TG_TOKEN === 'ТВОЙ_ТОКЕН_БОТА') return;

        let text = `🎬 *Lampa: Продолжаем просмотр*\n\n` +
                   `📌 *${title}*\n` +
                   `📺 Сезон: ${season} | Серия: ${episode}\n` +
                   `⏱ Таймкод: ${time}`;

        // Формируем клавиатуру с кнопкой быстрого поиска
        let replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: "🔍 Найти в интернете",
                        url: `https://www.google.com/search?q=${encodeURIComponent(title + " смотреть онлайн")}`
                    }
                ]
            ]
        };

        let url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
                reply_markup: replyMarkup
            })
        }).catch(err => console.log('Telegram error:', err));
    }

    // Перехватываем закрытие плеера или сохранение таймкода в Lampa
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complated' || e.type === 'time') {
            let card = e.object.card;
            if (!card) return;

            let title = card.title || card.name || 'Неизвестно';
            let season = e.torrent ? (e.torrent.season || '-') : '-';
            let episode = e.torrent ? (e.torrent.voice_episode || e.torrent.episode || '-') : '-';
            
            // Превращаем секунды в формат ММ:СС
            let currentTime = e.time || 0;
            let minutes = Math.floor(currentTime / 60);
            let seconds = Math.floor(currentTime % 60);
            let timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // Отправляем уведомление (с защитой от слишком частых спам-запросов)
            sendTelegramNotification(title, season, episode, timeFormatted);
        }
    });

    console.log('Telegram Sync Plugin Loaded!');
})();

