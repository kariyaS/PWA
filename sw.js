// �L���b�V���Ƀo�[�W������t���Ă����ƁA�Â��L���b�V�����������ɕ֗�
var CACHE_STATIC_VERSION = 'static-v1';

// �T�[�r�X���[�J�[�̃C���X�g�[��
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker...');

    // �L���b�V���ł���܂Ŏ��̏�����҂�
    event.waitUntil(
        caches.open(CACHE_STATIC_VERSION)
            .then(function (cache) {
                console.log('[Service Worker] Precaching App...');
                // ���ł��L���b�V���ł���Bcss�Ƃ��̒��ōX�Ƀ��N�G�X�g����������ꍇ�́A���I�ɃL���b�V������K�v������i��q�j
                cache.addAll([
                    '/'
                //    '/src/css/main.css',
                //    '/src/js/main.js',
                //    '/src/images/logo.jpg',
                ]);
            })
    );
});

var CACHE_DYNAMIC_VERSION = 'dynamic-v1';

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetching something ...');
    event.respondWith(
        // �L���b�V���̑��݃`�F�b�N
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                } else {
                    // �L���b�V�����Ȃ���΃��N�G�X�g�𓊂��āA���X�|���X���L���b�V���ɓ����
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_VERSION)
                                .then(function (cache) {
                                    // �Ō�� res ��Ԃ���悤�ɁA�����ł� clone() ����K�v������
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch(function () {
                            // �G���[���������Ă��������Ȃ�
                        });
                }
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_VERSION && key !== CACHE_DYNAMIC_VERSION) {
                        console.log('[Service Worker] Removing old cache...');
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});