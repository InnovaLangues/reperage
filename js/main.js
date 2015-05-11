var wavesurferOptions = {
    container: '#waveform',
    waveColor: '#02f', //#172B32',
    progressColor: '#00A1E5',
    height: 128,
    scrollParent: true,
    normalize: true
};

var wavesurfer; // wavesurfer instance

var currentView = 'teacher';
var currentTRegion;
var currentSRegion;

$(document).ready(function () {
    wavesurfer = Object.create(WaveSurfer);
    // wavesurfer progress bar
    (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };
        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };
        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    }());

    wavesurfer.init(wavesurferOptions);
    wavesurfer.load('audio/At school I hated science.wav');

    wavesurfer.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)'
    });

    wavesurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });
    });

    wavesurfer.on('region-created', function (region) {
        removeRegions();
        switch (currentView) {
            case 'student':
                currentSRegion = region;
                break;
            case 'teacher':
                currentTRegion = region;
                break;
        }
    });

    wavesurfer.on('region-updated', function (region) {
        switch (currentView) {
            case 'student':
                currentSRegion = region;
                break;
            case 'teacher':
                currentTRegion = region;
                break;
        }
    });

    $('#submit-button').toggle();


});

// on radio button click
function changeView(elem) {
    if (elem.value !== currentView) {
        currentView = elem.value;
        $('#submit-button').toggle();
        // remove all regions from wavesurfer instance
        removeRegions();
        switch (elem.value) {
            case 'student':
                $('#question').attr('disabled', true);
                if (currentSRegion) {
                    wavesurfer.addRegion(currentSRegion);
                }
                break;
            case 'teacher':
                $('#question').attr('disabled', false);
                if (currentTRegion) {
                    wavesurfer.addRegion(currentTRegion);
                }
                break;
        }
    }
}

function playPause() {
    wavesurfer.playPause();
}

function submitAnswer() {
    //wavesurfer.pause();
    var tolerance = 0.5;
    console.log('start ' + currentTRegion.start);
    console.log('end ' + currentTRegion.end);
     console.log('current ' + wavesurfer.getCurrentTime());
    var success = currentTRegion.start - tolerance <= wavesurfer.getCurrentTime() && currentTRegion.end + tolerance >= wavesurfer.getCurrentTime();
    var message = success ? 'Congratulations ! You win!' : 'Ooops... sorry not the good answer!';
    //playPause();
    wavesurfer.pause();
    toastr.info(message);
}

function removeRegions() {
    for (var index in wavesurfer.regions.list) {
        wavesurfer.regions.list[index].remove();
    }
}
