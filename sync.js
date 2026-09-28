(function () {
    'use strict';

    const TG_TOKEN = '8878679075:AAEq0Onj61U2erDC1aVU4OkY8HFOU5TONjM';
    const TG_CHAT_ID = '5677630585';

    // Тестовое сообщение сразу при старте Lampa
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: '🟢 *Lampa успешно подключена к боту!*',
            parse_mode: 'Markdown'
        })
    }).catch(err => console.log('Init test error:', err));

    // Слушаем закрытие плеера
    if (window.Lampa && Lampa.Player) {
        Lampa.Player.listener.follow('destroy', function () {
            let movie = Lampa.Player.data();
            let currentTime = Lampa.Player.time();

            if (movie && currentTime > 10) {
                let title = movie.movie.title || movie.movie.name || 'Видео';
                let minutes = Math.floor(currentTime / 60);
                let seconds = Math.floor(currentTime % 60);

                fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TG_CHAT_ID,
                        text: `🎬 *Просмотр прерван*\n📌 *${title}*\n⏱ Таймкод: ${minutes} мин ${seconds} сек`,
                        parse_mode: 'Markdown'
                    })
                });
            }
        });
    }
    console.log('Telegram Sync Loaded with Test!');
})();
