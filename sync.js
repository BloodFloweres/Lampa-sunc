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

    // Сообщаем при старте, что плагин обновился
    sendTelegram('🔄 *Плагин Lampa обновился и слушает плеер*');

    if (window.Lampa && Lampa.Player) {
        Lampa.Player.listener.follow('destroy', function () {
            try {
                // Пытаемся вытащить данные разными путями
                let time = Lampa.Player.time ? Lampa.Player.time() : 'нет функции time';
                let info = Lampa.Player.info ? Lampa.Player.info() : {};
                let data = Lampa.Player.data ? Lampa.Player.data() : {};
                
                let debugText = `🛠 *Дебаг закрытия плеера*\n` +
                                `⏱ Time: \`${JSON.stringify(time)}\`\n` +
                                `📦 Info: \`${JSON.stringify(info)}\`\n` +
                                `🗂 Data: \`${JSON.stringify(data)}\``;

                sendTelegram(debugText);
            } catch (e) {
                sendTelegram(`❌ Ошибка дебага: ${e.message}`);
            }
        });
    }
})();
