/**
 * Created by riku_maehara on 2016/09/16.
 */
$( document ).ready(function() {

    var path = document.getElementById('box');
    var title = document.getElementById('title');

    var spring = .9;
    var friction = .8;
    var easing = .1;

    var sy = 200;
    var dy = 100;
    var vy = 0;
    var released = true;

    requestAnimationFrame(function update(){
        requestAnimationFrame(update);

        if (released) {
            vy += (dy - sy) * spring;
            sy += (vy *= friction);
        } else {
            sy += (dy - sy) * easing;
        }

        path.setAttribute('d', 'M0,0 H100 V100 Q50,' + sy + ' 0,100');
    });


    var clicking = false;

    document.addEventListener('mousedown', function(){
        released = false;
        dy = 200;
        $(".animation").animate({
            top: "40%"
        }, 200);

        title.classList.add('pressed');
    });

    document.addEventListener('mouseup', function(){

        $(".animation").animate({
            top: "10%"
        });
        $(".animation").addClass("animationBird");
        $(".cloud").show().addClass("animationCloud");

        setTimeout(releaseHeader, 600);

        title.classList.remove('pressed');
    });


    function releaseHeader() {
        released = true;
        dy = 100;

        setTimeout(removeClass, 4500);
    }

    function removeClass() {
        $(".animation").removeClass("animationBird");
        $(".cloud").removeClass("animationCloud");
    }
});