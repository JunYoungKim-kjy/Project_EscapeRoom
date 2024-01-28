import Escape from './Escape.js'

class Game{
    constructor(){
        this.Escape = new Escape();
        this.$container = document.querySelector(".container")
        this.$opening = document.querySelector("#opening");
        this.$startBtn = document.querySelector(".start");
        this.$record = document.querySelector(".record");
        this.timeInterval = null;
        this.time=0;
        this.record = {
            m:0,
            s:0,
            ms:0
        };

        this.startGame();
    }

    startGame(){
        this.$startBtn.addEventListener("click",()=>{
            clearInterval(this.timeInterval);
            this.Escape.Inventory.$openBtn.classList.remove("hidden")
            this.time = 0;
            this.Escape.hint();
            this.$opening.classList.add("hidden");
            this.$startBtn.classList.add("hidden");
            this.timeInterval = setInterval(()=>{
                let min = parseInt(this.time / 100 / 3600);
                let sec = parseInt(this.time / 100 % 60);
                let ms = this.time%100;

                this.record.m = min < 10? '0'+min:min;
                this.record.s = sec < 10? '0'+sec:sec;
                this.record.ms= ms < 10? 0 + ms:ms;
                this.time += 1;
                console.log(`${this.record.m}:${this.record.s}:${this.record.ms}`);
            if(this.Escape.finish){
                clearInterval(this.timeInterval);
                this.$record.classList.add("show");
                this.Escape.Inventory.$openBtn.classList.add("hidden")
                this.$opening.classList.remove("hidden");
                this.Escape.events.$events.classList.remove("on");
                this.Escape.items.$items.classList.remove("on");
                this.$record.textContent = `당신의 기록은 ${this.record.m}:${this.record.s}:${this.record.ms} 입니다.`;
            }
            },10)
        })
    }
}

let game = new Game();