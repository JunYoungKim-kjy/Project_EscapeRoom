import Escape from './Escape.js'

class Game{
    constructor(){
        // this.canvas = document.querySelector("#openingCanvas");
        // this.ctx = this.canvas.getContext("2d");
        // this.startBtn = document.querySelector(".start");
        this.Escape = new Escape();

        // this.ctx.beginPath();
        // this.ctx.rect(300,200,250,250)
        // this.ctx.fillStyle = 'black';
        // this.ctx.fill();

        // this.startBtn.addEventListener("click",()=>{
        //     this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //     this.startBtn.classList.add("hide");
        //     this.canvas.classList.add("hide");
        // })

    }
}

let game = new Game();