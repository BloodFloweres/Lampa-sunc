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

    // Добавляем кнопку в карточку фильма/сериала
    function addCardButton() {
        if (!window.Lampa) return;

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'ready') {
                let render = e.object.activity.render();
                
                // Проверяем, чтобы кнопка не дублировалась
                if (render.find('.telegram-card-btn').length > 0) return;

                // Создаем кнопку в стиле Lampa (например, рядом с кнопкой «Смотреть» или «Трейлер»)
                let btn = $(`
                    <div class="view--torrent selector telegram-card-btn" style="background: rgba(0, 136, 204, 0.2); display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px; padding: 12px; border-radius: 8px; cursor: pointer;">
                        <svg height="20" viewBox="0 0 24 24" width="20" fill="#0088cc">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.73-.53.36-1.01.54-1.44.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.59-3.27 3.61-1.51 4.36-1.77 4.85-1.78.11 0 .35.03.5.15.13.11.17.26.19.37.02.11.03.35.01.55z"/>
                        </svg>
                        <span style="color: #fff; font-weight: bold;">Сохранить таймкод в Telegram</span>
                    </div>
                `);

                btn.on('click hover:enter', function () {
                    let card = e.object.card;
                    let title = card.title || card.name || 'Видео';
                    
                    // Пытаемся забрать таймкод из истории Lampa для этой карточки
                    let history = Lampa.Storage.get('history', []);
                    let found = history.find(item => item.id === card.id);
                    let timeText = 'Не найден (внешний плеер)';

                    if (found && found.time) {
                        let minutes = Math.floor(found.time / 60);
                        let seconds = Math.floor(found.time % 60);
                        timeText = `${minutes} мин ${seconds} сек`;
                    }

                    let msg = `📌 *Ручной срез таймкода*\n` +
                              `🎬 *${title}*\n` +
                              `⏱ Последняя позиция: *${timeText}*`;

                    sendTelegram(msg);

                    // Анимация нажатия
                    btn.css('opacity', '0.5');
                    setTimeout(() => btn.css('opacity', '1'), 200);
                });

                // Вставляем кнопку в блок кнопок карточки
                setTimeout(() => {
                    render.find('.full--actions').append(btn);
                }, 300);
            }
        });
    }

    if (window.Lampa) {
        addCardButton();
    } else {
        document.addEventListener('lampa:initialize', addCardButton);
    }

    console.log('Telegram Card Button Plugin Loaded!');
})();
                        
