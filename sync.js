(function () {
    'use strict';

    // ВСТАВЬ СВОИ ДАННЫЕ В КАВЫЧКИ НИЖЕ:
    const GITHUB_TOKEN = 'ТВОЙ_GITHUB_TOKEN';
    const GIST_ID = 'ТВОЙ_GIST_ID';

    async function getSavedProgress() {
        try {
            let response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            let data = await response.json();
            if (!data.files || !data.files['sync.json']) return {};
            return JSON.parse(data.files['sync.json'].content || '{}');
        } catch (e) {
            console.error('Lampa Sync Error:', e);
            return {};
        }
    }

    async function saveProgress(movieKey, timecode) {
        try {
            let currentData = await getSavedProgress();
            currentData[movieKey] = {
                time: timecode,
                updated: Date.now()
            };

            await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'sync.json': {
                            content: JSON.stringify(currentData, null, 2)
                        }
                    }
                })
            });
        } catch (e) {
            console.error('Lampa Save Error:', e);
        }
    }

    Lampa.Player.listener.follow('ready', async function () {
        let movie = Lampa.Player.data();
        if (!movie) return;

        let key = (movie.movie.id || movie.movie.title) + '_s' + (movie.season || 0) + '_e' + (movie.episode || 0);

        let progress = await getSavedProgress();
        if (progress[key] && progress[key].time > 10) {
            Lampa.Player.to(progress[key].time);
            if (window.Lampa && Lampa.Noty) {
                Lampa.Noty.show('Облачный таймкод: ' + Math.round(progress[key].time) + ' сек.');
            }
        }
    });

    Lampa.Player.listener.follow('destroy', function () {
        let movie = Lampa.Player.data();
        let currentTime = Lampa.Player.time();

        if (movie && currentTime > 10) {
            let key = (movie.movie.id || movie.movie.title) + '_s' + (movie.season || 0) + '_e' + (movie.episode || 0);
            saveProgress(key, currentTime);
        }
    });

})();
