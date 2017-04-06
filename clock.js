jQuery(document).ready(function ($) {

    var joining;
    var people;
    var clock;
    var numbers;
    var amount;
    var currentAmount;
    var radius;
    var locked;
    var mobile;
    var tl;
    var tlAddPerson;
    var tlRotation;
    var tlClock;
    var highlightRandomIntervall;

    //resize timeout vars
    var rtime;
    var timeout;
    var delta;

    function init() {
        $.get("COC.html", function (data) {
            $('#worldAnimationContainer').html(data);
        }).complete(createAnimation);
    }

    function createAnimation() {

        joining = $('#person_1');
        people = $('.person').not('#person_1');
        clock = $('#clock');
        numbers = $('#clock .number');
        amount = 35;
        currentAmount = amount;
        radius = null;
        locked = false;
        mobile = null;
        tl = new TimelineMax({paused: true});
        tlRotation = new TimelineMax({paused: true, repeat: -1});
        tlClock = new TimelineMax({paused: true});
        tlAddPerson = new TimelineMax({paused: true});
        //resize timeout vars

        rtime;
        timeout = false;
        delta = 200;

        addEnquieres();
        addEvents();
    }

    function addEnquieres() {
        enquire.register("screen and (min-width:630px)", {
//Three rows
            match: function () {
//                TweenMax.killTweensOf($('#worldAnimationContainer'));
//                TweenMax.killTweensOf($('#world'));
//                TweenMax.killTweensOf($('.person'));
                tl.progress(0);
                tlRotation.progress(0);
                tlClock.progress(0);

                mobile = false;
                radius = 210;
                createInitTL();
                createClockTL();
                createRotationTL();
                createAddPersonTL();
                locked = true;
                setTimeout(function () {
                    locked = false;
                    tlClock.play();
                }, 3000)

                tl.play('start');
                tlRotation.play();

            },
        });
        enquire.register("screen and (max-width:630px)", {
            //Three rows
            match: function () {
//                TweenMax.killTweensOf($('#worldAnimationContainer'));
//                TweenMax.killTweensOf($('#world'));
//                TweenMax.killTweensOf($('.person'));

                tl.progress(0);
                tlRotation.progress(0);
//                tlClock.progress(0);

                mobile = true;
                radius = 146;
                createInitTL();
                createClockTL();
                createRotationTL();
                createAddPersonTL();
                locked = true;
                setTimeout(function () {
                    locked = false;
                    tlClock.play();
                }, 3000)

                tl.play('start');
                tlRotation.play();
            },
        });
    }

    function addEvents() {
        var timer;
//        $('.person').click(highlightPerson);


        $('body').on('click', '.controls .play', function () {
            playAnimation();
        });
        $('body').on('click', '.controls .pause', function () {
            pauseAnimation();
        });
        $('body').on('click', '.controls .addPerson', function () {
            addPerson();
        });
        $('body').on('click', '.controls .removePerson', function () {
            removePerson();
        });
        $('body').on('click', '.controls .rotateTop', function () {
            rotatePause();
            rotateTop();
        });
        $('body').on('click', '.controls .rotateStart', function () {
            rotateStart();
        });
        $('body').on('click', '.controls .rotateStop', function () {
            rotatePause();
        });
        $('body').on('click', '.controls .reverse', function () {

            reverseAnimation();
        });

        $('body').on('click', '.controls .highlightRandom', function () {
            highlightPerson();
        });

    }


    function createRotationTL() {
        tlRotation.to($('#worldAnimationContainer'), 120, {rotation: 360, ease: Power0.easeNone});
    }
    function rotateTop() {
        TweenMax.to($('#worldAnimationContainer'), 1, {rotation: 360, ease: Power0.easeNone, onComplete: function () {
                tlRotation.progress(0);
            }
        });
    }
    function removePerson() {
        tlAddPerson.reverse();
    }
    function addPerson() {
        if (!$('body').hasClass('state-animating'))
            tlAddPerson.play();
    }
    function playAnimation() {
        tl.play();
    }
    function pauseAnimation() {
        tl.pause();
    }
    function reverseAnimation() {


        if ($('body').hasClass('cocPersonAdded')) {
            console.log('removing');
            removePerson();

            setTimeout(function () {
                console.log('reversing');
                tl.reverse();
            }, tlAddPerson.duration()* 1000);
        } else {
            tl.reverse();
        }

    }
    function rotateStart() {
        tlRotation.play();
    }
    function rotatePause() {
        tlRotation.pause();
    }


    function createInitTL() {
        tl = null;
        tl = new TimelineMax({paused: true});
        tl.add('start');
        tl.add(function () {
            $('body').scrollTop(0);
            tlRotation.progress(0);
        });
        tl.add('startWorld = start+0');
        tl.set($('#world'), {opacity: 1, x: '-50%', y: '-50%'}, 'start+=0');
        tl.set($('#person_1'), {x: 0, y: 0, opacity: 0}, 'start+=0');
        tl.set($('body'), {className: '+=state-animating'}, 'start+=0');

        tl.set($(people), {opacity: 0}, 'start+=0');
        tl.fromTo($('#world'), 1, {scale: 0}, {scale: 1, ease: Power2.easeOut}, 'start+=0.05');
        //INIT Timeline

        tl.add('startPeople=start+0');
        var cnt = 0;
        people.each(function () {
            var rot = 360 / amount * cnt - 80;

            if (mobile) {
                x = Math.cos(toRadians(rot)) * radius - 25;
                y = Math.sin(toRadians(rot)) * radius - 25;
            } else {
                x = Math.cos(toRadians(rot)) * radius - 38;
                y = Math.sin(toRadians(rot)) * radius - 38;
            }


            tl.set($(this), {opacity: 1, rotation: 90 + rot}, 'startPeople+=' + 0.05 * cnt);
            tl.fromTo($(this), 1, {x: 0, y: 0}, {x: x, y: y, ease: Power1.easeOut}, 'startPeople+=' + 0.08 * cnt);

//            tl.set($(this), {zIndex: cnt}, 'startPeople+=' + (0.08 * cnt + 1));
            $(this).data('index', cnt);
            $(this).data('PersonX', x);
            $(this).data('PersonY', y);
            cnt++;
        });
        tl.set($('body'), {className: '-=state-animating'});
    }


    function createClockTL() {
        tlClock.add('start');
        var cnt = 0;
        $(numbers.get().reverse()).each(function () {
            tlClock.to($(this), 1, {opacity: 1}, 'start+=' + cnt * 0.2);
            cnt++;
        });
    }

    //AddPerson Timeline
    function createAddPersonTL() {
        var joiningX, joiningY, rot;

        locked = true;
        setTimeout(function () {
            locked = false;
        }, 1000)
        tlAddPerson = new TimelineMax({paused: true});

        $(this).css('cursor', 'auto');
        var peopleBefore = $('.person').not('#person_1');
        var peopleAfter = $('.person');
        var amountAfter = 36;
        var cnt = 0;
        tlAddPerson.add('startAdding');
        currentAmount = amount;
        tlAddPerson.set($('body'), {className: '-=cocPersonAdded'});
        peopleBefore.each(function () {

            rot = 360 / amountAfter * cnt - 80;
            if (mobile) {
                x = Math.cos(toRadians(rot)) * radius - 25;
                y = Math.sin(toRadians(rot)) * radius - 25;
                joiningX = Math.cos(toRadians(-90)) * radius - 25;
                joiningY = Math.sin(toRadians(-90)) * radius - 25;
            } else {
                x = Math.cos(toRadians(rot)) * radius - 38;
                y = Math.sin(toRadians(rot)) * radius - 38;
                joiningX = Math.cos(toRadians(-90)) * radius - 38;
                joiningY = Math.sin(toRadians(-90)) * radius - 38;
            }

            tlAddPerson.to($(this), 1, {x: x, y: y, rotation: 90 + rot}, 'startAdding+=' + 0);
            $(this).data('index', cnt);
            $(this).data('PersonX', x);
            $(this).data('PersonY', y);
            cnt++;
        });
        rot = 360 / amountAfter * cnt - 80;
        if (mobile) {

            joiningX = Math.cos(toRadians(-90)) * radius - 25;
            joiningY = Math.sin(toRadians(-90)) * radius - 25;
        } else {

            joiningX = Math.cos(toRadians(-90)) * radius - 38;
            joiningY = Math.sin(toRadians(-90)) * radius - 38;
        }
        tlAddPerson.set(joining, {rotation: 0}, 'startAdding+=' + 0);
        tlAddPerson.to(joining, 1, {x: joiningX, y: joiningY, opacity: 1}, 'startAdding+=' + 1);

        joining.data('index', 0);
        joining.data('x', joiningX);
        joining.data('y', joiningY);

        tlAddPerson.add(function () {

            currentAmount = amount + 1;
        });
        tlAddPerson.set($('body'), {className: '+=cocPersonAdded'});

    }

    function highlightPerson() {
        if ($(this).hasClass('person')) {

            var el = $(this);
        } else {
            var el = $('.person').not('#person1').random();
        }
        console.log(el);
        var index = el.data('index');
        console.log(index);
        var xOld;
        var yOld;

        var xNew, yNew;

        var rot = 360 / currentAmount * index - 80;

//        if ($(this).attr('id') !== 'person_1')
        if (mobile) {
            var newRadius = radius + 10;
            xNew = Math.floor(Math.cos(toRadians(rot)) * newRadius - 25);
            yNew = Math.floor(Math.sin(toRadians(rot)) * newRadius - 25);
            xOld = Math.floor(Math.cos(toRadians(rot)) * radius - 25);
            yOld = Math.floor(Math.sin(toRadians(rot)) * radius - 25);
            TweenMax.to(el, 1, {x: xNew, y: yNew, scale: 1.4});
            TweenMax.to(el, 1, {x: xOld, y: yOld, scale: 1, delay: 2});
        } else {
            var newRadius = radius + 20;
            xNew = Math.cos(toRadians(rot)) * newRadius - 38;
            yNew = Math.sin(toRadians(rot)) * newRadius - 38;
            xOld = Math.cos(toRadians(rot)) * radius - 38;
            yOld = Math.sin(toRadians(rot)) * radius - 38;
            console.log(xOld, xNew);
            TweenMax.to(el, 1, {x: xNew, y: yNew, scale: 1.5});
            TweenMax.to(el, 1, {x: xOld, y: yOld, scale: 1, delay: 2});
        }

    }


    // add class if dom loaded

    $('#clock').addClass('coc-ready');

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    init();
});

$.fn.random = function () {
    return this.eq(Math.floor(Math.random() * this.length));
}   