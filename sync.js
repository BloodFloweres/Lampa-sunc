(function () {
    'use strict';

    const TG_TOKEN = '8878679075:AAEq0Onj61U2erDC1aVU4OkY8HFOU5TONjM';
    const TG_CHAT_ID = '5677630585';

    function sendTelegramNotification(title, timeFormatted) {
        let text = `🎬 *Lampa: Просмотр прерван*\n\n` +
                   `📌 *${title}*\n` +
                   `⏱ Таймкод: ${timeFormatted}`;

        let url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        }).catch(err => console.log('Telegram sync error:', err));
    }

    // Слушаем закрытие плеера Lampa
    if (window.Lampa && Lampa.Player) {
        Lampa.Player.listener.follow('destroy', function () {
            let movie = Lampa.Player.data();
            let currentTime = Lampa.Player.time();

            if (movie && currentTime > 10) {
                let title = movie.movie.title || movie.movie.name || 'Видео';
                
                // Переводим секунды в минуты и секунды
                let minutes = Math.floor(currentTime / 60);
                let seconds = Math.floor(currentTime % 60);
                let timeFormatted = `${minutes} мин ${seconds} сек`;

                sendTelegramNotification(title, timeFormatted);
            }
        });
    }

    console.log('Telegram Player Sync Loaded!');
})();
