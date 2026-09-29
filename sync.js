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

    function addTelegramButton(e) {
        if (!e || !e.object) return;
        
        let render = e.object.activity.render();
        if (render.find('.telegram-card-btn').length > 0) return;

        let card = e.object.card || {};
        let title = card.title || card.name || 'Неизвестно';

        // Создаем круглую кнопку Telegram в стиле Lampa
        let roundBtn = $(`
            <div class="full-start-new__button selector telegram-card-btn" title="Отправить в Telegram" style="background: rgba(0, 136, 204, 0.25); border-radius: 50%; width: 2.8em; height: 2.8em; display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; cursor: pointer;">
                <svg height="20" viewBox="0 0 24 24" width="20" fill="#0088cc">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.73-.53.36-1.01.54-1.44.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.59-3.27 3.61-1.51 4.36-1.77 4.85-1.78.11 0 .35.03.5.15.13.11.17.26.19.37.02.11.03.35.01.55z"/>
                </svg>
            </div>
        `);

        // Клик по кнопке
        roundBtn.on('click hover:enter', function () {
            let timeData = Lampa.Storage.get('time', {});
            let timeVal = timeData[card.id] || timeData[card.id + '_time'] || 0;
            
            let timeText = 'не зафиксирован';
            if (typeof timeVal === 'object' && timeVal.time) timeVal = timeVal.time;
            if (timeVal > 0) {
                let mins = Math.floor(timeVal / 60);
                let secs = Math.floor(timeVal % 60);
                timeText = `${mins} мин ${secs < 10 ? '0' : ''}${secs} сек`;
            }

            let msg = `📌 *Сохранение таймкода*\n` +
                      `🎬 *${title}*\n` +
                      `⏱ Позиция в Lampa: *${timeText}*`;

            sendTelegram(msg);

            // Подсветка при нажатии
            roundBtn.css('transform', 'scale(1.2)');
            setTimeout(() => roundBtn.css('transform', 'scale(1)'), 200);
        });

        // Вставляем кнопку в ряд круглых иконок
        let container = render.find('.full-start-new__buttons, .full--actions, .full-start__buttons').first();
        if (container.length) {
            container.append(roundBtn);
        }
    }

    if (window.Lampa) {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complated' || e.type === 'ready' || e.type === 'build') {
                setTimeout(() => addTelegramButton(e), 200);
            }
        });
    }

    console.log('Telegram Button v2 Loaded!');
})();
