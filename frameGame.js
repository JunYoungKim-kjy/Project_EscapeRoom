export default class FrameGame{
  constructor(canvas,ctx){
      this.canvas = canvas;
      this.ctx = ctx;
      this.quiz = [];
      this.floorImg = new Image();
      this.floorImg.src = './img/backFloor.png'
      this.finishImg = new Image();
      this.finishImg.src = './img/finishFloor.png'
      this.startImg = new Image();
      this.startImg.src = './img/startFloor.png'
      this.floorImg.addEventListener("load",()=>{
        this.backReady = true;
      })
      // 배경이미지 작동 로드
      this.backReady = false;
      
      this.pImage = new Image();
      this.pImage.src = "./img/player.png";
      this.pImage.addEventListener("load",()=>{
        this.ready=true;
      })
      //캐릭터 이미지 로드
      this.ready = false;
      //게임 작동
      this.frameGameRun = false;
      //플레이어가 움직일 때 트루 멈추면 펄스
      this.playerMove = false;
      //플레이어 left,right,center;
      this.curPos= null;
      this.playerCur = "center";
      // Y값 true면 위로 false 아래로
      this.yControl = true;
      // 성공시 클러어 트루
      this.clear = false;
      // 횟수 증가 10회시 성공
      this.count = 0;
      this.clearCount=10;
      // 실패시 트루
      this.isFail = false;
      
      this.pX = canvas.width / 2 - 50;
      this.pY = canvas.height - 100;
      
      this.dir = {
        ArrowLeft : false,
        ArrowRight : false
      }
      
      //배경 좌표
      this.backY = -130;
      this.init();
      
      this.renderInterval = null;
      this.moveInterval = null;
      this.moveTimeout = null;
    }
    reStart(){
      if(this.clear)return;
      this.pX = this.canvas.width / 2 - 50;
      this.pY = this.canvas.height - 100;
      this.backY = -70;

      //플레이어가 움직일 때 트루 멈추면 펄스
      this.playerMove = false;
      //플레이어 left,right,center;
      // this.curPos= null;
      this.playerCur = "center";
      // Y값 true면 위로 false 아래로
      this.yControl = true;
      // 횟수 증가 10회시 성공
      this.count = 0;
      // 실패시 트루
      this.isFail = false;

    }
    
    init(){
      //배경그리기
      this.bgc()
      
      //플레이어그리기
      this.drawPlayer();
      //문제 랜덤으로 만들기
      this.setQuiz();
      
      
    }
          
      // 배경그리기
      bgc(){
        if(!this.backReady)return;
        //시작 바닥 그리기
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(this.count<3){
          this.ctx.beginPath();
          this.ctx.drawImage(this.startImg,0,this.backY+this.canvas.height,this.canvas.width,this.canvas.height);
          this.ctx.closePath();
        }
        if(this.playerMove)this.backY+=1;
        this.ctx.beginPath();
        this.ctx.drawImage(this.floorImg,0,this.backY,this.canvas.width,this.canvas.height);
        this.ctx.closePath();
        
        this.ctx.clearRect(0,this.backY - this.canvas.height,this.canvas.width,this.canvas.height);
        if(this.count >= 6){
          this.ctx.drawImage(this.finishImg,0,this.backY - this.canvas.height,this.canvas.width,this.canvas.height);
        }else{
          this.ctx.drawImage(this.floorImg,0,this.backY - this.canvas.height,this.canvas.width,this.canvas.height);
        }
        this.ctx.closePath();
        if(this.backY===this.canvas.height)this.backY=0;
      }
      // 방향으로 가기
      move(e,dir){
        this.playerMove = true;
        this.dir[e.code] = true;
        this.moveTimeout = setTimeout(()=>{
          this.playerCur = dir;
          this.dir[e.code] = false;
          this.playerMove = false;
          this.yControl=true;
          this.checkQiuz();
          this.isSuccess();
        },1000)
      }
      // 문제만들기
      setQuiz(){
        for(let i =0; i<10; i+=1){
          const rNum = Math.floor(Math.random()*2);
          const quiz = rNum === 0 ? 'right':'left';
          this.quiz.push(quiz);
        }
        console.log(this.quiz);
      }
      //실패 성공
      isSuccess(){
        if(this.isFail){
          return false;
        }
        if(this.clear){
          return "clear";
        }
      }
      
      //정답 체크하기
      checkQiuz(){
        // console.log("카운트= "+this.count);
        // console.log("문제 = "+ this.quiz[this.count]);
        // console.log("방향 = "+ this.playerCur);
        // console.log(this.playerCur === this.quiz[this.count]);
        if(this.playerCur===this.quiz[this.count] || this.count===10){
          this.count += 1;
        }else{
          this.count=0;
          this.isFail=true;
          clearInterval(this.renderInterval);
          this.frameGameRun=false;
        }
        
        if(this.count === this.clearCount){
          setTimeout(()=>{
            clearInterval(this.renderInterval);
            this.clear = true;
            this.frameGameRun=false;
          },1000)
        }
      }
      
      // 플레이어 그리기
      drawPlayer(){
      this.ctx.beginPath();
      this.ctx.drawImage(this.pImage,this.pX,this.pY,100,100);
      this.ctx.closePath();
    }
    moveDir(){
      if(!this.ready)return;
      // 방향키 왼쪽 입력 시
      if(this.count==10){
        this.pX = this.pX < 190 ? this.pX+=1 : this.pX===190? 190: this.pX -= 1;
        if(this.pX ===190)this.pX = 190;
        this.pY = this.pY - 1;
        if(this.pY < 300)this.pY = 300;
      }else if(this.dir['ArrowLeft']){
        // 마지막 점프
        if(this.playerCur==="center"){
          //가운데서 왼쪽 점프
          if(this.pX > 100)this.pX = this.pX - 1;
          //왼쪽에서 왼쪽 점프
        }else if(this.playerCur==="right"){
          if(this.pX > 100)this.pX = this.pX - 2;
        }
        if(this.pY == 350)this.yControl = false;
        this.pY = this.yControl ? this.pY - 1 : this.pY + 1;
        if(this.pY > 400){
          this.pY = 400;
        }
        //오른쪽 입력시
      }else if(this.dir['ArrowRight']){
        if(this.playerCur==="center"){
          if(this.pX < 310)this.pX = this.pX + 1;
        }else if(this.playerCur==="left"){
          if(this.pX < 310)this.pX = this.pX + 2;
        }

        if(this.pY == 350)this.yControl = false;
        this.pY = this.yControl ? this.pY - 1 : this.pY + 1;
        if(this.pY > 400){
            this.pY = 400;
        }
      }
    }
    //사각형 바닥 그리기
    drawFloor(x,y,w,h,color){
      this.ctx.beginPath();
      this.ctx.rect(x,y,w,h);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.closePath();
    }
    render(){
      if(!this.ready)return
      this.renderInterval = setInterval(()=>{
        this.bgc();
        this.drawPlayer();
        this.moveDir();
      },10)
    }

      
  }