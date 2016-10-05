/**
 * Created by riku_maehara on 2016/09/19.
 */

window.onload = function (argument) {

    //Queue
    function Queue() {
        this.__a = new Array();
    }

    Queue.prototype.size = function () {
        return this.__a.length;
    };

    Queue.prototype.get = function (i) {
        return this.__a[i];
    };

    Queue.prototype.dequeue = function () {
        if (this.__a.length > 0) {
            return this.__a.shift();
        }
        return null;
    };

    Queue.prototype.enqueue = function (o) {
        if (this.size() > 200) {
            while (!this.get(0).text) {
                this.dequeue();
            }
            if (this.size()>400){
                this.dequeue();
            }
        }
        this.__a.push(o);

    };

    // constructor
    Word = function (key) {
        this.text = key;
        this.wordsLength = this.text.length;
        // this.font = -(this.wordsLength)/4+50  + 'px arial';
        this.fontSize = (1000 / (this.wordsLength -5 ));
        this.font = this.fontSize + 'px arial';
        c.font=this.font;
        this.width = c.measureText(this.text).width;
        this.x = -this.width * 2;
        this.y = Math.random() * h;
        // this.font = words[key] * 10 + 'px arial';
        // this.speed = 5;
        this.speed = (this.fontSize)/5;
        // this.speed = (this.fontSize)*this.fontSize/1000+4;
        // this.speed = (words[key]);
        console.log(this.font);
    };

    //var lyric = "i couldn't take it couldn't stand another minute couldn't bear another day without you in it";
    var lyric = "i couldn't take it couldn't stand another minute couldn't bear another day without you in it all of the joy that I had known for my life was stripped away from me the minute that you died to have you in my life was all i ever wanted but now without you I'm a soul forever haunted can't help but feel that i had taken you for granted no way in hell that i can ever comprehend this i wasn't dreaming when they told me you were gone i was wide awake and feeling that they had to be wrong how could you leave me when you swore that you would stay now i'm trapped inside a nightmare every single fucking day it's like a movie but there's not a happy ending every scene fades black and there's no pretending this little fairy tale doesn't seem to end well theres no knight in shining armor who will wake me from the spell i know you didn't plan this you tried to do what's right but in the middle of this madness i'm the one you left to win this fight red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you i know you're broken down by anger and by sadness you feel I left you in a world that's full of madness wish i could talk to you if only for a minute make you understand the reasons why i did it i wanna tell you that you're all that ever mattered want you to know that for eternity i'm shattered i tried so hard just to protect you but i failed to and in a prison of abandonment i've jailed you i never planned that i would leave you there alone i was sure that i would see you when i made it back home and all the times I swore that it would be okay now i'm nothing but a liar and you're thrown into the fray this bedtime story ends with misery ever after the pages are torn and there's no final chapter i didn't have a choice I did what I had to do i made a sacrifice but forced a bigger sacrifice on you i know you've lived a nightmare i caused you so much pain but baby please don't do what i did i don't want you to waste your life in vain red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you you're not the only one who needed me i thought you understood you were the one i needed and you left me as I always feared you would would I change it if i could? it doesn't matter how the petals scatter now every nightmare just discloses it's your blood that's red like roses and no matter what I do nothing ever takes the place of you red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you";
    var tweetQueue = new Queue();

    var words = {};
    var words_attr = [];
    string_handle(lyric);

    var canvas = document.getElementById('c');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 4 * 3;

    // canvas.width = window.innerWidth/2;
    // canvas.height = window.innerHeight/2;

    if (canvas.getContext) {
        c = canvas.getContext('2d');
            w = canvas.width;
            h = canvas.height;

        c.strokeStyle = 'red';
        c.fillStyle = 'white';
        c.lineWidth = 5;

        function animation() {
            for (var i = 0; i < tweetQueue.size(); i++) {
                c.font = tweetQueue.get(i).font;
                c.fillText(tweetQueue.get(i).text, tweetQueue.get(i).x, tweetQueue.get(i).y);
                c.stroke();
            }
            move();
        }


        function move() {
            for (var i = 0; i < tweetQueue.size(); i++) {
                if (tweetQueue.get(i).x > w) {
                    tweetQueue.get(i).text = "";
                    // tweetQueue.get(i).font = Math.random() * 30 + 1 + 'px arial';
                    // tweetQueue.get(i).width = c.measureText(tweetQueue.get(i).text).width;
                    // tweetQueue.get(i).x = -tweetQueue.get(i).width;
                    // tweetQueue.get(i).y = Math.random() * h;
                    // tweetQueue.get(i).speed = Math.random() * 2+3;

                } else {
                    tweetQueue.get(i).x += tweetQueue.get(i).speed;
                }
            }
        }

        setInterval(function () {
            c.clearRect(0, 0, w, h);
            animation();
        }, 24);

    }
    // tweetQueue.enqueue(new Word('aaaaaaaaa'));

    function string_handle(str) {
        var deleteUrl = str.replace(/http(s)?:([\/\w-.\/?%&=]*)?/g, "");
        var deleteNewLine = deleteUrl.replace(/\n/g, " ");
        return deleteNewLine;
        // var split_str = str.split(" ");
        // var word_array = [];
        // var word_count = [];
        // for (var i = 0; i < split_str.length; i++) {
        //     check = true;
        //     for (var j = 0; j <= word_array.length; j++) {
        //         if (split_str[i] == word_array[j]) {
        //             word_count[j]++;
        //             check = false;
        //             break;
        //         }
        //     }
        //     if (check) {
        //         word_array.push(split_str[i]);
        //         word_count.push(1);
        //     }
        // }
        // for (var i = 0; i < word_array.length; i++) {
        //     words[word_array[i]] = word_count[i];
        // }
        // return words;

    }

    $(function () {
        var socket = io.connect();
        $('form').submit(function () {
            socket.emit('msg', $('input').val());
            $('input').val('');
            return false;
        });

        socket.on('msg', function (data) {
            var resizeTweet = string_handle(data);
            console.log(resizeTweet);
            tweetQueue.enqueue(new Word(resizeTweet));
        });
    });


    var queue = null, // キューをストック
        wait = 300; // 0.3秒後に実行の場合
    window.addEventListener('resize', function () {
// イベント発生の都度、キューをキャンセル
        clearTimeout(queue);
// waitで指定したミリ秒後に所定の処理を実行
// 経過前に再度イベントが発生した場合
// キューをキャンセルして再カウント
        queue = setTimeout(function () {
// リサイズ時に行う処理
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight / 4 * 3;
            w = canvas.width,
                h = canvas.height;

            c.strokeStyle = 'red';
            c.fillStyle = 'white';
            c.lineWidth = 5;
        }, wait);
    }, false);
};